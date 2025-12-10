import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import { Trip } from '@/models/Trip'
import { auth } from '@/lib/auth'

const ITINERARY_SERVICE_URL =
  process.env.ITINERARY_SERVICE_URL || 'http://127.0.0.1:5001/generate-itinerary'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()

    // 1️⃣ Get the trip for this user
    const trip = await Trip.findOne({
      _id: params.id,
      userId: session.user.id,
    })

    if (!trip) {
      return NextResponse.json({ error: 'Trip not found' }, { status: 404 })
    }

    // 2️⃣ Call the Flask itinerary generation service
    const flaskResponse = await fetch(ITINERARY_SERVICE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        destination: trip.destination,
        currentLocation: trip.currentLocation,
        // Date ko ISO string ke form me bhejna safest hai
        startDate:
          trip.startDate instanceof Date
            ? trip.startDate.toISOString()
            : String(trip.startDate),
        endDate:
          trip.endDate instanceof Date
            ? trip.endDate.toISOString()
            : String(trip.endDate),
        travelers: trip.travelers,
        dailyBudget: trip.dailyBudget,
        budgetRange: trip.budgetRange,
        interests: trip.interests || [],
        additionalNotes: trip.additionalNotes || '',
      }),
    })

    if (!flaskResponse.ok) {
      let errorPayload: any = null
      try {
        errorPayload = await flaskResponse.json()
      } catch {
        const text = await flaskResponse.text()
        errorPayload = { error: text }
      }

      console.error('Flask itinerary error:', errorPayload)
      return NextResponse.json(
        { error: errorPayload.error || 'Failed to generate itinerary' },
        { status: flaskResponse.status }
      )
    }

    const itineraryData = await flaskResponse.json()
    console.log('Flask itinerary response in Next.js:', itineraryData)

    // ✅ Flask returns:
    // {
    //   success: true,
    //   itinerary: {
    //     itinerary: [ { day, date, activities: [...] }, ... ],
    //     totalEstimatedCost: "...",
    //     transportation: { ... }
    //   }
    // }
    if (!itineraryData.success || !itineraryData.itinerary) {
      return NextResponse.json(
        {
          error: 'Invalid itinerary response from AI service',
          raw: itineraryData,
        },
        { status: 500 }
      )
    }

    const wrappedItinerary = itineraryData.itinerary // 👈 yahi trip.itinerary banega

    // 3️⃣ Extract activities for trip.activities
    const activities: Array<{
      name: string
      date: Date
      location: string
      description: string
    }> = []

    if (
      wrappedItinerary.itinerary &&
      Array.isArray(wrappedItinerary.itinerary)
    ) {
      wrappedItinerary.itinerary.forEach((day: any) => {
        if (day.activities && Array.isArray(day.activities)) {
          day.activities.forEach((activity: any) => {
            const activityType = (activity.type || '').toLowerCase()

            // transportation-type activities ko skip karo
            if (
              activityType === 'transportation' ||
              activityType === 'train' ||
              activityType === 'bus' ||
              activityType === 'flight'
            ) {
              return
            }

            // Date decide karo: day.date hai to use, nahi to startDate + offset
            let activityDate: Date
            if (day.date) {
              activityDate = new Date(day.date)
            } else {
              const startDate = new Date(trip.startDate)
              activityDate = new Date(startDate)
              activityDate.setDate(startDate.getDate() + (day.day - 1))
            }

            let description = activity.description || ''
            if (activity.time) {
              description = `${activity.time} - ${description || activity.title}`
            }
            if (activity.estimatedCost) {
              description += ` (${activity.estimatedCost})`
            }

            activities.push({
              name: activity.title || activity.name || 'Activity',
              date: activityDate,
              location: activity.location || trip.destination,
              description:
                description ||
                `${activity.title || 'Activity'} at ${
                  activity.location || trip.destination
                }`,
            })
          })
        }
      })
    }

    console.log(
      'Saving trip with itinerary days:',
      wrappedItinerary.itinerary?.length || 0
    )

    // 4️⃣ Update trip with generated itinerary + activities + status
    trip.itinerary = wrappedItinerary // 👈 ItineraryTimeline isi ko padhta hai
    trip.activities = activities
    trip.status = 'planning'
    await trip.save()

    return NextResponse.json({
      success: true,
      itinerary: wrappedItinerary,
      activities,
      // return plain object instead of mongoose doc
      trip: JSON.parse(JSON.stringify(trip)),
    })
  } catch (error: any) {
    console.error('Error generating itinerary:', error)
    return NextResponse.json(
      { error: 'Failed to generate itinerary', details: error.message },
      { status: 500 }
    )
  }
}
