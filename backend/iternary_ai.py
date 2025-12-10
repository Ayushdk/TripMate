from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os
from datetime import datetime, timedelta
import json

app = Flask(__name__)
CORS(app)

# Groq API configuration
GROQ_API_KEY = os.getenv(
    "GROQ_API_KEY",

)
GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"
GROQ_MODEL = os.getenv("GROQ_MODEL", "llama-3.1-8b-instant")


@app.route("/generate-itinerary", methods=["POST"])
def generate_itinerary():
    try:
        if not GROQ_API_KEY:
            return jsonify({"error": "GROQ_API_KEY is not set"}), 500

        print("=== Itinerary AI API called ===")
        data = request.get_json()
        print("Request payload from Next.js:", data)

        # Extract trip information (coming from your Next.js API)
        destination = data.get("destination", "")
        current_location = data.get("currentLocation", "")
        start_date = data.get("startDate", "")
        end_date = data.get("endDate", "")
        travelers = data.get("travelers", 1)
        daily_budget = data.get("dailyBudget", 0)
        budget_range = data.get("budgetRange", "midrange")
        interests = data.get("interests", [])
        additional_notes = data.get("additionalNotes", "")

        if not destination or not start_date or not end_date:
            return jsonify({
                "error": "Missing required fields: destination, startDate, endDate"
            }), 400

        # Parse dates & compute number of days (supports ISO and YYYY-MM-DD)
        try:
            if "T" in str(start_date):
                start = datetime.fromisoformat(str(start_date).replace("Z", "+00:00"))
            else:
                start = datetime.strptime(str(start_date)[:10], "%Y-%m-%d")

            if "T" in str(end_date):
                end = datetime.fromisoformat(str(end_date).replace("Z", "+00:00"))
            else:
                end = datetime.strptime(str(end_date)[:10], "%Y-%m-%d")

            num_days = (end - start).days + 1
        except Exception as e:
            print(f"Date parsing error: {e}")
            return jsonify({"error": f"Invalid date format: {str(e)}"}), 400

        # ========== STRICT JSON PROMPT (reduces JSONDecodeError) ==========

        system_prompt = """
You are an expert travel itinerary planner and a STRICT JSON generator.

Always respond with a single valid JSON object.
Do NOT include markdown, comments, or any text outside the JSON.
Do NOT include a top-level "trip" field.
Use only these top-level keys:
- "itinerary" (array of days)
- "totalEstimatedCost" (string)
- "transportation" (object)

All string values MUST be on a single line (no raw newlines inside strings).
Use double quotes for all keys and string values.
Do NOT add trailing commas.
"""

#         user_prompt = f"""
# Create a detailed {num_days}-day travel itinerary for a trip from "{current_location}" to "{destination}".

# Trip Details:
# - Destination: {destination}
# - Starting Location: {current_location}
# - Start Date: {start_date}
# - End Date: {end_date}
# - Number of Days: {num_days}
# - Number of Travelers: {travelers}
# - Daily Budget: ₹{daily_budget} per person
# - Budget Range: {budget_range}
# - Interests: {", ".join(interests) if interests else "General travel"}
# - Additional Notes: {additional_notes if additional_notes else "None"}

# Itinerary requirements:

# 1. Day 1 (Arrival Day):
#    - Include transportation from {current_location} to {destination} (train/bus/flight) depending on budget.
#    - Specify departure and arrival times.
#    - Include hotel check-in (type = "accommodation").
#    - Plan afternoon/evening activities with specific times.
#    - Include dinner time and location (type = "meal").

# 2. Middle Days (if any):
#    - Morning activity with specific time.
#    - Breakfast time and location (type = "meal").
#    - Afternoon activity with time.
#    - Lunch time and location (type = "meal").
#    - Evening activity with time.
#    - Dinner time and location (type = "meal").
#    - Activities should be realistic, specific to {destination}, and match the interests and budget.

# 3. Last Day (Departure Day):
#    - Morning activity if time permits.
#    - Check-out from accommodation (type = "accommodation").
#    - Transportation back to {current_location} with departure and arrival times.

# Return JSON in EXACTLY this structure (keys and types):

# {
#   "itinerary": [
#     {
#       "day": 1,
#       "date": "YYYY-MM-DD",
#       "activities": [
#         {
#           "time": "HH:MM AM/PM",
#           "type": "transportation" | "activity" | "meal" | "accommodation",
#           "title": "Short title on one line",
#           "location": "Specific location on one line",
#           "description": "Short description on one line, no line breaks",
#           "estimatedCost": "₹XXX per person",
#           "duration": "X hours"
#         }
#       ]
#     }
#   ],
#   "totalEstimatedCost": "₹XXXX",
#   "transportation": {
#     "toDestination": {
#       "type": "train" | "bus" | "flight",
#       "departureTime": "HH:MM AM/PM",
#       "arrivalTime": "HH:MM AM/PM",
#       "estimatedCost": "₹XXX per person"
#     },
#     "fromDestination": {
#       "type": "train" | "bus" | "flight",
#       "departureTime": "HH:MM AM/PM",
#       "arrivalTime": "HH:MM AM/PM",
#       "estimatedCost": "₹XXX per person"
#     }
#   }
# }

# Additional rules:
# - All times must be in 12-hour format with AM/PM.
# - Strings must NOT contain newline characters; keep each value on a single line.
# - Do NOT include any extra top-level fields.
# - Return ONLY this JSON object, nothing else.
# """


        user_prompt = f"""
Create a detailed {num_days}-day travel itinerary for a trip from "{current_location}" to "{destination}".

Trip Details:
- Destination: {destination}
- Starting Location: {current_location}
- Start Date: {start_date}
- End Date: {end_date}
- Number of Days: {num_days}
- Number of Travelers: {travelers}
- Daily Budget: ₹{daily_budget} per person
- Budget Range: {budget_range}
- Interests: {", ".join(interests) if interests else "General travel"}
- Additional Notes: {additional_notes if additional_notes else "None"}

Itinerary requirements:

1. Day 1 (Arrival Day):
   - Include transportation from {current_location} to {destination} (train/bus/flight) depending on budget.
   - Specify departure and arrival times.
   - Include hotel check-in (type = "accommodation").
   - Plan afternoon/evening activities with specific times.
   - Include dinner time and location (type = "meal").

2. Middle Days (if any):
   - Morning activity with specific time.
   - Breakfast time and location (type = "meal").
   - Afternoon activity with time.
   - Lunch time and location (type = "meal").
   - Evening activity with time.
   - Dinner time and location (type = "meal").
   - Activities should be realistic, specific to {destination}, and match the interests and budget.

3. Last Day (Departure Day):
   - Morning activity if time permits.
   - Check-out from accommodation (type = "accommodation").
   - Transportation back to {current_location} with departure and arrival times.

You MUST return a single JSON object with exactly these top-level keys:
- "itinerary": an array of day objects
- "totalEstimatedCost": string like "₹5800"
- "transportation": an object with "toDestination" and "fromDestination"

Each item in "itinerary" must be an object with:
- "day": integer (1, 2, 3, ...)
- "date": string in "YYYY-MM-DD" format
- "activities": array of activity objects

Each activity object must have:
- "time": "HH:MM AM/PM"
- "type": one of "transportation", "activity", "meal", "accommodation"
- "title": short title on one line
- "location": specific location on one line
- "description": short description on one line (no line breaks)
- "estimatedCost": string like "₹XXX per person"
- "duration": string like "X hours"

Additional rules:
- All times must be in 12-hour format with AM/PM.
- Strings must NOT contain newline characters; keep each value on a single line.
- Do NOT include any extra top-level fields.
- Return ONLY this JSON object, nothing else.
"""

        # ================== CALL GROQ API ==================

        try:
            response = requests.post(
                GROQ_API_URL,
                headers={
                    "Authorization": f"Bearer {GROQ_API_KEY}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": GROQ_MODEL,
                    "messages": [
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt},
                    ],
                    "max_tokens": 4000,
                    "temperature": 0.7,
                    "stream": False,
                },
                timeout=120,
            )
            response.raise_for_status()
        except requests.exceptions.RequestException as e:
            print(f"Error calling Groq API: {e}")
            return jsonify({"error": f"Error calling Groq API: {str(e)}"}), 500

        ai_data = response.json()
        print("Raw Groq response:", json.dumps(ai_data, indent=2))

        if "choices" not in ai_data or not ai_data["choices"]:
            return jsonify({"error": "No choices in AI response"}), 500

        ai_response = ai_data["choices"][0]["message"]["content"].strip()

        # Strip ```json / ``` if the model decides to wrap it anyway
        if ai_response.startswith("```json"):
            ai_response = ai_response[7:]
        if ai_response.startswith("```"):
            ai_response = ai_response[3:]
        if ai_response.endswith("```"):
            ai_response = ai_response[:-3]
        ai_response = ai_response.strip()

        # ================== PARSE JSON ==================

        try:
            itinerary_data = json.loads(ai_response)
        except json.JSONDecodeError as e:
            print("=== RAW AI RESPONSE START ===")
            print(ai_response)
            print("=== RAW AI RESPONSE END ===")
            print(f"JSON Parse Error: {e}")
            return jsonify({
                "error": "Failed to parse itinerary response from AI",
                "raw_response": ai_response[:500],
            }), 500

        # ================== NORMALIZE FOR FRONTEND ==================

        days = itinerary_data.get("itinerary", [])
        normalized_days = []

        for index, day in enumerate(days, start=1):
            # compute date based on start date, regardless of what the model sent
            day_date = start + timedelta(days=index - 1)
            pretty_date = day_date.strftime("%A, %B %d, %Y")

            normalized_activities = []
            for act in day.get("activities", []):
                normalized_activities.append({
                    "time": act.get("time", "9:00 AM"),
                    "type": act.get("type", "activity"),
                    "title": act.get("title", "Activity"),
                    "location": act.get("location", destination),
                    "description": act.get("description", ""),
                    "estimatedCost": act.get("estimatedCost", ""),
                    "duration": act.get("duration", "1 hour"),
                })

            normalized_days.append({
                "day": day.get("day", index),
                "date": pretty_date,
                "activities": normalized_activities,
            })

        # ✅ This is the shape your Next.js route & frontend expect
        wrapped = {
            "itinerary": normalized_days,                         # array of days
            "totalEstimatedCost": itinerary_data.get("totalEstimatedCost"),
            "transportation": itinerary_data.get("transportation"),
        }

        print("=== Final wrapped itinerary to Next.js ===")
        print(json.dumps(wrapped, indent=2))

        # 🔴 EXACT FORMAT Next.js EXPECTS:
        # { success: true, itinerary: { itinerary: [...], totalEstimatedCost, transportation } }
        return jsonify({
            "success": True,
            "itinerary": wrapped,
        })

    except Exception as e:
        print(f"Unexpected error in /generate-itinerary: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500


if __name__ == "__main__":
    # Run on 5001 to match your Next.js fetch URL
    app.run(debug=True, host="127.0.0.1", port=5001)
