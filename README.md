# 🎙️ Autonomous AI Sales Voice Agent — HelpingHand AI

> **Executive Evaluation Report:** For technical judges and evaluators (Fortivex AI Track `OC.44671.2027.65164`), read the official 1-page architecture, scalability, and economics paper: [**`PROJECT_REPORT.md`**](file:///c:/Users/Asus/Desktop/Voice%20Agent/PROJECT_REPORT.md).

---

## 🌟 What is This Project? (In Plain English)

Imagine you run an enterprise software company. Every day, potential customers visit your website, ask about pricing, compare your product to competitors like HubSpot or Salesforce, and want to book a live demo.

Normally, companies hire human **Sales Development Representatives (SDRs)** to do this. But humans:
- ❌ Cost \$60,000 to \$85,000 per year per representative.
- ❌ Take hours or days to call leads back (by which time the buyer went to a competitor).
- ❌ Cannot answer phone calls at 2:00 AM on Sunday.
- ❌ Forget to log notes, lead scores, and customer objections into the CRM.

**HelpingHand AI** is an **Autonomous AI Voice Sales Agent**. Think of it as a top-performing, charismatic human sales director who:
- ⚡ **Answers instantly (under 400ms)** 24 hours a day, 7 days a week, 365 days a year.
- 🗣️ **Speaks naturally in both English and Hindi** (and conversational Hinglish).
- 🧠 **Answers ANY question on the fly** using Google Gemini AI and domain facts (never reciting robotic canned scripts).
- 🎯 **Automatically scores leads and qualifies BANT** (Budget, Authority, Need, Timeline).
- 📅 **Books live demo meetings directly into your CRM** while on the call.
- 📝 **Writes an executive post-call summary** with customer pain points and next steps as soon as you hang up.

---

## 🏗️ How Does It Work? (The Magic Step-by-Step)

Here is what happens during a live voice call from the moment you speak to the moment the AI replies:

```
+-----------------------------------------------------------------------------------+
|                                  USER BROWSER                                     |
|                                                                                   |
|  1. You Speak into Mic  ──>  [Browser Speech-to-Text]  ──>  Transcript Generated   |
+------------------------------------------┬----------------------------------------+
                                           │ HTTP POST /api/chat
                                           ▼
+-----------------------------------------------------------------------------------+
|                            NODE.JS BACKEND (PORT 5000)                            |
|                                                                                   |
|  2. Domain RAG Search: Searches knowledgeBase.json for pricing, security & facts  |
|  3. Gemini 3.5 Flash: Reads facts + conversation history & crafts smart reply     |
|  4. Real-time Analysis: Extracts BANT (Budget/Need), Lead Score, & Meeting Bookings|
+------------------------------------------┬----------------------------------------+
                                           │ JSON Response
                                           ▼
+-----------------------------------------------------------------------------------+
|                                  USER BROWSER                                     |
|                                                                                   |
|  5. 3D Glowing Voice Orb pulses with vibrant audio waves                          |
|  6. Browser Speech-to-Text reads the response aloud naturally (TTS)                |
|  7. Auto-Listen: Browser mic turns back on automatically when AI finishes talking  |
+-----------------------------------------------------------------------------------+
```

---

## ✨ Key Features Explained

### 1. 🎙️ Hands-Free Voice Calling (Like a Real Phone Call)
- When you click **"Start Call"**, the agent greets you aloud.
- When the agent stops talking, your browser microphone automatically turns on and listens.
- When you stop talking, the AI thinks, animates its glowing orb, and replies aloud.
- You never have to press "push-to-talk" buttons over and over—it flows like a real phone conversation.

### 2. ⚡ Barge-In (Instant Interruption)
- In real conversations, people interrupt each other.
- If the AI is talking and you have a new question, simply click the mic or start speaking. The AI immediately halts speech synthesis and listens to you.

### 3. 🌐 Seamless Bilingual Support (English & Hindi)
- Toggle easily between **English** and **हिंदी (Hindi)** in the top navigation bar.
- The AI dynamically speaks, listens, and understands both English and Hindi/Hinglish with natural conversational accent and tone.

### 4. 🧠 True Dynamic Intelligence (No Canned Answers!)
- The agent is powered by Google Gemini (`@google/genai`) with an automated multi-model waterfall (`gemini-3.5-flash-lite`, `gemini-3.6-flash`, `gemini-3.7-flash`, `gemini-3.5-flash`).
- It does **not** rely on rigid, hardcoded question-and-answer pairs.
- You can ask about:
  - **Company features:** *"How much is the Growth Tier?"*
  - **Competitors:** *"Why are you better than HubSpot or Salesforce?"*
  - **Compliance:** *"Are you SOC 2 Type II and HIPAA certified?"*
  - **General Knowledge:** *"Who founded SpaceX?"* or *"Explain quantum computing."*
  - It answers directly and accurately in the first sentence, then smoothly pivots back to helping you.

### 5. 🎯 Real-Time BANT Qualification & Lead Scoring (0–100)
- As you chat, the AI detects:
  - 💰 **Budget:** Does the prospect have budget approved?
  - 👑 **Authority:** Are they the decision maker?
  - 📌 **Need:** Do they have pain points (e.g. manual data entry, slow SDR follow-up)?
  - ⏳ **Timeline:** When are they planning to buy?
- The live **Lead Score** recalculates on every turn, visible in the **CRM & Insights** drawer.

### 6. 📅 Automated Meeting Booking & CRM Sync
- If the prospect says: *"I'd like a demo tomorrow at 3 PM,"* the AI automatically logs a confirmed booking with customer name, meeting link, and timestamp into the backend CRM registry.

### 7. 📋 Executive Post-Call Summary
- When the call ends, Gemini generates an instant post-call brief including:
  - Executive summary of the conversation.
  - Prospect pain points identified.
  - Objections raised and resolved.
  - Deal conversion likelihood (High / Medium / Low).
  - Concrete next steps.

### 8. 🎨 Ultra-Clean, Sleek Hero UI
- Inspired by Apple Siri and ChatGPT Voice Mode.
- Minimalist dark aesthetic with an animated **3D Glassmorphic Voice Orb** in the center:
  - **Idle:** Soft indigo glow.
  - **Listening:** Emerald green wave ripple.
  - **Thinking:** Amber pulse.
  - **Speaking:** Vibrant cyan and violet audio waves.
- Includes a clean **Live Caption Card** and a slide-over **CRM & Insights Drawer** that stays hidden until you want to see technical analytics.

---

## 📂 Project Structure & Files Explained

```
Voice Agent/
├── PROJECT_REPORT.md            # Official 1-page evaluation report (Fortivex AI Track)
├── README.md                    # This full explanation guide
├── .gitignore                   # Keeps node_modules/ and .env safe and private
│
├── backend/                     # Node.js + Express API server
│   ├── .env                     # Your private GEMINI_API_KEY and PORT configuration
│   ├── .env.example             # Clean template showing required environment variables
│   ├── package.json             # Backend dependencies (@google/genai, express, cors, dotenv)
│   ├── server.js                # Express REST API routes (/api/chat, /api/crm, /api/health)
│   ├── agent.js                 # Gemini prompt engineering, BANT scoring & session memory
│   ├── rag.js                   # Fast keyword + semantic scoring retriever
│   └── knowledgeBase.json       # HelpingHand AI knowledge base (pricing, specs, security, SLAs)
│
└── frontend/                    # Modern React 18 + Vite user interface
    ├── index.html               # Main HTML entry with Google typography (Plus Jakarta Sans, Inter)
    ├── package.json             # Frontend dependencies (React, Vite, Tailwind CSS, Lucide icons)
    ├── vite.config.js           # Vite server configuration with /api reverse proxy to port 5000
    ├── tailwind.config.js       # Complete theme tokens (custom colors, fonts, transitions)
    ├── postcss.config.js        # PostCSS build configuration
    └── src/
        ├── main.jsx             # React application bootstrapper
        ├── index.css            # Global CSS, 3D orb animations, and custom scrollbars
        ├── App.jsx              # Main voice application (voice loop, STT/TTS, UI layout)
        └── data/
            └── mockCallData.js  # Initial transcript seeds, BANT defaults, and sample data
```

---

## 🚀 Step-by-Step Setup & Running Guide

### Step 0: Prerequisites
- Install **Node.js** (version 18, 20, or 22+ recommended). Download from [nodejs.org](https://nodejs.org).
- An active **Gemini API Key** from [Google AI Studio](https://aistudio.google.com).

---

### Step 1: Configure the Backend

1. Open your terminal and navigate to the `backend` folder:
   ```bash
   cd "backend"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create or check your `.env` file inside `backend/.env`:
   ```env
   PORT=5000
   GEMINI_API_KEY=your_actual_gemini_api_key_here
   ```

4. Start the backend server:
   ```bash
   npm start
   # or for live code reloading:
   npm run dev
   ```

You will see:
```
========================================================
🚀 HelpingHand AI Backend listening on http://localhost:5000
🧠 AI Engine: gemini-3.5-flash-lite (@google/genai)
🔑 Gemini Key Status: Configured
📚 Knowledge Base: HelpingHand AI (Enterprise RAG active)
========================================================
```

---

### Step 2: Configure & Start the Frontend

1. Open a second terminal window and navigate to the `frontend` folder:
   ```bash
   cd "frontend"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```

You will see:
```
  VITE v6.4.6  ready in 289 ms

  ➜  Local:   http://localhost:3000/
```

4. Open your web browser (Google Chrome or Microsoft Edge recommended for best Web Speech API support) and go to:
   **[http://localhost:3000](http://localhost:3000)**

---

## 🧪 How to Test & Demo the Agent

Once the website is open at `http://localhost:3000`:

### Test 1: Start a Voice Call
1. Click the large purple **"Start Call"** button.
2. Grant microphone permissions if your browser asks.
3. Listen as the AI welcomes you aloud! The 3D orb will pulse in cyan/violet as it speaks:
   > *"Welcome to HelpingHand AI! How can I help you today?"*

### Test 2: Ask About Pricing (RAG & Fact Test)
- **Speak or type:** *"How much does your Growth tier cost and what is included?"*
- **What happens:** The backend searches `knowledgeBase.json`, and Gemini responds:
  > *"Our Growth tier is ninety-nine dollars per seat per month. It includes our autonomous voice agent, automated BANT qualification, and 1-click HubSpot migration."*
- Click **"CRM & Insights"** in the top right to watch your **Budget BANT indicator** turn green!

### Test 3: Test Enterprise Security & Compliance
- **Speak or type:** *"Are you SOC2 compliant and how do you protect health data?"*
- **What happens:** The agent answers directly with Schellman SOC 2 Type II audit facts, HIPAA BAAs, AES-256 encryption, and zero model retention.

### Test 4: Book a Live Meeting
- **Speak or type:** *"Can we schedule an architecture review for tomorrow at 3 PM?"*
- **What happens:** The AI confirms the date and time, and automatically records the appointment into the CRM. Open the **CRM & Insights** drawer to see your booked meeting!

### Test 5: Hindi Language Test
- Click the **हिंदी** toggle pill in the top navbar.
- **Speak or type:** *"क्या आप हबस्पॉट से सारा डेटा माइग्रेट कर सकते हैं?"*
- **What happens:** The agent replies in fluent, polite conversational Hindi explaining the 1-click 45-minute HubSpot migration bridge with zero downtime!

### Test 6: Off-Topic / General Knowledge Test
- **Speak or type:** *"Who founded SpaceX and what is their mission?"*
- **What happens:** Unlike a rigid robot that says *"I only know about CRM,"* HelpingHand AI dynamically answers the SpaceX question with accuracy, demonstrating genuine autonomous intelligence!

### Test 7: End Call & Executive Summary
- Click **"End Call"**.
- Open the **CRM & Insights** drawer to view the generated **Executive Post-Call Summary**, customer pain points, deal likelihood, and scheduled follow-ups.

---

## 📡 API Endpoints Reference

The backend exposes a clean REST API on port `5000`:

| Method | Endpoint | Purpose | Request Body / Query | Example Response |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Check service & Gemini status | None | `{"status":"ok","model":"gemini-3.5-flash-lite","geminiSdkConfigured":true}` |
| `POST` | `/api/chat` | Main conversational turn handler | `{ "message": "...", "language": "en" }` | `{"success":true,"reply":"...","leadScore":85,"bant":{...}}` |
| `POST` | `/api/end-call` | Generates executive post-call notes | `{ "sessionId": "..." }` | `{"summary":{"executiveSummary":"...","dealLikelihood":"High"}}` |
| `GET` | `/api/crm` | Lists all booked meetings | None | `{"count":1,"bookings":[{"customerName":"Alex Chen",...}]}` |
| `GET` | `/api/rag/retrieve` | Fast domain knowledge retrieval | `?q=pricing&limit=2` | `{"count":2,"snippets":[{"title":"Starter & Growth",...}]}` |

---

## ❓ Troubleshooting & FAQs

### Q: The browser says "Microphone not working" or doesn't recognize speech.
- Ensure you have granted microphone permissions in your browser address bar (click the lock/tune icon next to `http://localhost:3000`).
- The **Web Speech API** is natively built into **Google Chrome**, **Microsoft Edge**, and **Safari**. Ensure you are using one of these browsers.
- If you don't have a mic, you can test everything using the bottom dock text box!

### Q: I am getting a `PSSecurityException` error running npm on Windows PowerShell.
- Windows PowerShell sometimes blocks `.ps1` script execution.
- Simply run `npm.cmd run dev` or run PowerShell as Administrator and execute:
  ```powershell
  Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy Bypass
  ```

### Q: How do I change the Gemini API Key?
- Open `backend/.env`.
- Replace the value for `GEMINI_API_KEY`:
  ```env
  GEMINI_API_KEY=YOUR_NEW_API_KEY
  ```
- Restart the backend terminal (`Ctrl + C` then `npm start`).

---

## 🏆 Evaluation & Accreditation

This project was built for the **Fortivex AI Private Limited** technical evaluation:
- **Track Code:** `OC.44671.2027.65164`
- **Project 1:** Autonomous AI Sales Voice Agent (Enterprise Revenue Intelligence & CRM)
- **Official 1-Page Architecture Paper:** [**`PROJECT_REPORT.md`**](file:///c:/Users/Asus/Desktop/Voice%20Agent/PROJECT_REPORT.md)

---

## 📄 License

MIT License. Free to use, adapt, and build upon. Built with ❤️ for enterprise sales acceleration.
