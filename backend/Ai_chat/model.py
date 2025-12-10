from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os
from collections import deque
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Groq API configuration
GROQ_API_KEY = os.getenv('GROQ_API_KEY')
GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"
GROQ_MODEL = "llama-3.1-8b-instant"  # You can change this to other Groq models

# ✅ NEW: Next.js API ka base URL (trip fetch ke liye)
TRIP_API_BASE = os.getenv("TRIP_API_BASE", "http://127.0.0.1:3000/api/trips")

# Keep a deque to store the last 20 interactions (user + ai pairs)
chat_history = deque(maxlen=20)

if GROQ_API_KEY:
    print("✓ Groq API key loaded successfully")
    print(f"✓ Using model: {GROQ_MODEL}")
else:
    print("✗ WARNING: GROQ_API_KEY not found in environment variables")


def format_date(date_str: str) -> str:
    """
    Helper: ISO ya Date string ko human readable date me convert kare.
    """
    try:
        # ISO format handle
        dt = datetime.fromisoformat(str(date_str).replace("Z", "+00:00"))
        return dt.strftime("%Y-%m-%d")
    except Exception:
        return str(date_str)


def build_trip_context(trip: dict | None, activities: list | None) -> str:
    """
    Trip + activities ko ek context string me convert karo
    jo system prompt me jayega.
    """
    lines: list[str] = []

    if trip:
        lines.append("Current trip details:")
        lines.append(f"- From: {trip.get('currentLocation', 'Unknown')}")
        lines.append(f"- To: {trip.get('destination', 'Unknown')}")
        if trip.get("startDate") and trip.get("endDate"):
            lines.append(
                f"- Dates: {format_date(trip['startDate'])} to {format_date(trip['endDate'])}"
            )
        if trip.get("travelers"):
            lines.append(f"- Travelers: {trip['travelers']}")
        if trip.get("budgetRange"):
            lines.append(f"- Budget range: {trip['budgetRange']}")
        if trip.get("dailyBudget"):
            lines.append(f"- Approx daily budget: ₹{trip['dailyBudget']}")
        lines.append("")  # blank line

    if activities:
        # Sort by date if available
        try:
            sorted_acts = sorted(
                activities,
                key=lambda a: a.get("date") or "",
            )
        except Exception:
            sorted_acts = activities

        lines.append("Planned activities for this trip:")
        current_date = None
        day_counter = 1

        for act in sorted_acts:
            date_raw = act.get("date")
            date_text = format_date(date_raw) if date_raw else "Unknown date"

            if date_text != current_date:
                lines.append(f"\nDay {day_counter} ({date_text}):")
                current_date = date_text
                day_counter += 1

            name = act.get("name") or act.get("title") or "Activity"
            location = act.get("location", "")
            description = act.get("description", "")

            # ek line me compress
            line = f"- {name}"
            if location:
                line += f" at {location}"
            if description:
                line += f" | {description}"

            lines.append(line)

    if not lines:
        return "No saved trip or activities were provided."

    return "\n".join(lines)


# ✅ NEW: Next.js API se trip fetch karne ka helper
def fetch_trip_from_next(trip_id: str) -> dict | None:
    """
    Next.js ki /api/trips/:id se trip + activities leke aata hai.
    """
    try:
        url = f"{TRIP_API_BASE}/{trip_id}"
        print("Fetching trip for chat from:", url)
        resp = requests.get(url, timeout=5)
        resp.raise_for_status()
        return resp.json()
    except Exception as e:
        print("Error fetching trip from Next.js for chat:", e)
        return None


@app.route("/chat", methods=["POST"])
def chat():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"reply": "Invalid request. No data received."}), 400

        user_message = data.get("message", "").strip()
        if not user_message:
            return jsonify({"reply": "Please send a valid message."}), 400

        # 🔹 Pehle try karo tripId se DB/Next se fetch karna
        trip_id = data.get("tripId")
        trip_info = {}
        activities = []

        if trip_id:
            trip_data = fetch_trip_from_next(trip_id)
            if trip_data:
                # Trip ka summary
                trip_info = {
                    "destination": trip_data.get("destination"),
                    "currentLocation": trip_data.get("currentLocation"),
                    "startDate": trip_data.get("startDate"),
                    "endDate": trip_data.get("endDate"),
                    "travelers": trip_data.get("travelers"),
                    "budgetRange": trip_data.get("budgetRange"),
                    "dailyBudget": trip_data.get("dailyBudget"),
                }
                # Activities direct DB se
                activities = trip_data.get("activities", [])
        else:
            # ⚠️ Fallback: agar koi purana client trip/activities body me bhej raha ho to
            trip_info = data.get("trip") or {}
            activities = data.get("activities") or []

        # trip context build karo
        trip_context = build_trip_context(trip_info, activities)

        if not GROQ_API_KEY:
            print("ERROR: GROQ_API_KEY is not set")
            return (
                jsonify(
                    {
                        "reply": "Groq API key is not configured. Please set GROQ_API_KEY environment variable."
                    }
                ),
                500,
            )

        # history me user ka message daal do
        chat_history.append({"role": "user", "content": user_message})

        # 🔹 Base prompt
        base_system_prompt = """You are a helpful assistant specialized in trip planning.
Your job is to answer travel-related questions only and do not answer any other questions.
Use the user's trip details and planned activities to give personalized answers.

Guidelines:
- If you are unsure, say: "I'm not sure about that. Please try again."
- Keep responses short, simple, and clear.
- Avoid long paragraphs or unnecessary details.
- Prefer concise bullet-point or one-line answers when suggesting itineraries.
- Example:
    Instead of: "Based on your trip details, I recommend spending 7-10 days in Kerala..."
    You should reply like:
    - Day 1-2: Cochin
    - Day 3-4: Munnar
    - Day 5-6: Thekkady
    - Day 7-8: Alleppey
    - Day 9-10: Trivandrum
- Respond in a single, straightforward sentence when possible.
"""

        # 🔹 Trip context attach kar diya
        system_prompt = (
            base_system_prompt
            + "\n\nHere is the user's current trip and activities:\n"
            + trip_context
        )

        # messages banate hain
        messages = [{"role": "system", "content": system_prompt}]

        # history add karo
        for msg in chat_history:
            role = "assistant" if msg["role"] == "ai" else msg["role"]
            messages.append({"role": role, "content": msg["content"]})

        # Groq call
        response = requests.post(
            GROQ_API_URL,
            headers={
                "Authorization": f"Bearer {GROQ_API_KEY}",
                "Content-Type": "application/json",
            },
            json={
                "model": GROQ_MODEL,
                "messages": messages,
                "max_tokens": 150,
                "temperature": 0.7,
                "stream": False,
            },
            timeout=60,
        )

        response.raise_for_status()
        ai_data = response.json()

        if "choices" in ai_data and len(ai_data["choices"]) > 0:
            ai_reply = ai_data["choices"][0]["message"]["content"].strip()
        else:
            ai_reply = "Sorry, no response from the AI service."

        # history me AI ka reply daal do
        chat_history.append({"role": "ai", "content": ai_reply})

    except requests.exceptions.RequestException as e:
        if hasattr(e, "response") and e.response is not None:
            try:
                error_data = e.response.json()
                error_msg = error_data.get("error", {}).get("message", str(e))
                ai_reply = f"API Error: {error_msg}"
            except Exception:
                ai_reply = (
                    f"API Error (Status {e.response.status_code}): "
                    f"{e.response.text[:200]}"
                )
        else:
            ai_reply = f"Connection error: {str(e)}"
    except Exception as e:
        import traceback

        traceback.print_exc()
        ai_reply = f"An unexpected error occurred: {str(e)}"

    return jsonify({"reply": ai_reply})


if __name__ == "__main__":
    app.run(debug=True, host="127.0.0.1", port=5000)
