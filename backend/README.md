# Flask AI Backend

This directory contains Flask backend servers for AI functionality using Groq API.

## Services

1. **AI Chat** (`Ai_chat/model.py`) - Chat assistant for trip planning questions
2. **Itinerary Generator** (`iternary_ai.py`) - Generates detailed day-by-day, time-by-time itineraries

## Setup Instructions

1. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Get your Groq API key:**
   - Sign up at https://console.groq.com/
   - Create an API key from the API Keys section
   - Copy your API key

3. **Set up environment variable:**
   - Create a `.env` file in the `backend` directory (or set it in your system)
   - Add your Groq API key:
     ```bash
     GROQ_API_KEY=your_groq_api_key_here
     ```
   
   Or export it in your terminal:
   ```bash
   export GROQ_API_KEY=your_groq_api_key_here
   ```
   
   On Windows (PowerShell):
   ```powershell
   $env:GROQ_API_KEY="your_groq_api_key_here"
   ```

4. **Run the Flask servers:**

   **AI Chat Server (Port 5000):**
   ```bash
   cd Ai_chat
   python model.py
   ```
   The server will start on http://127.0.0.1:5000

   **Itinerary Generator Server (Port 5001):**
   ```bash
   python iternary_ai.py
   ```
   The server will start on http://127.0.0.1:5001

   **Note:** Both servers need to be running for full functionality.

## API Endpoints

### AI Chat (`/chat`)
- **POST** `http://127.0.0.1:5000/chat`
  - Request body: `{ "message": "your message here" }`
  - Response: `{ "reply": "AI response here" }`

### Itinerary Generator (`/generate-itinerary`)
- **POST** `http://127.0.0.1:5001/generate-itinerary`
  - Request body: 
    ```json
    {
      "destination": "Goa",
      "currentLocation": "Mumbai",
      "startDate": "2024-01-15T00:00:00Z",
      "endDate": "2024-01-18T00:00:00Z",
      "travelers": 2,
      "dailyBudget": 3500,
      "budgetRange": "midrange",
      "interests": ["Beach", "Food"],
      "additionalNotes": "First time visit"
    }
    ```
  - Response: Detailed day-by-day itinerary with times, activities, meals, and transportation

## Configuration

You can change the Groq model by modifying the `GROQ_MODEL` variable in `model.py`. 
Available models include:
- `llama-3.1-70b-versatile` (default)
- `llama-3.1-8b-instant`
- `mixtral-8x7b-32768`
- `gemma-7b-it`

## Dependencies

- Flask 3.0.0
- flask-cors 4.0.0
- requests 2.31.0

