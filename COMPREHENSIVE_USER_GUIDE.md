# Saudi Vision 2030 Enterprise AI Platform - User Manual

## 🚀 1. Quick Start Guide
To run your "blasting" application, you need two terminals open (Command Prompt or PowerShell):

### Terminal 1: Backend (AI Brain)
```bash
cd backend
python main.py
```
*   **What it does:** Runs the FastAPI server on Port 8000.
*   **Success:** You will see "Application startup complete".

### Terminal 2: Frontend (User Interface)
```bash
cd frontend
npm run dev
```
*   **What it does:** Runs the Next.js website on Port 3000.
*   **Success:** You will see "Ready in X.Xs" and "Local: http://localhost:3000".

---

## 🎤 2. Testing the "Blasting" Features

### Feature A: Voice Command Center (Hero Section)
1.  Open [http://localhost:3000](http://localhost:3000).
2.  Find the **Search Bar** in the center of the screen.
3.  Click the **Microphone Icon 🎤**.
4.  **Speak clearly:** "Tell me about NEOM" or "What is Vision 2030?".
5.  **Watch:** The text will magically appear in the search box!

### Feature B: Interactive AI Chat
1.  Click **"Explore"** or **"AI Assistant"**.
2.  If asked to sign in, click "Sign In" (uses Google Auth).
3.  **Type** a question: "What are the main pillars?".
4.  **Listen:** After the AI replies, click the **Speaker Icon 🔊** next to the message. The browser will read the answer aloud to you!
5.  **Verify:** Look for the **Green Source Badges (📎)** below the answer to see exactly which document the AI used.

### Feature C: Live Data Store
1.  Scroll down to the **"Transformation in Numbers"** section.
2.  **Watch:** The numbers (65%, 500B, etc.) will animate and count up as you look at them.

### Feature D: Credit System (Monetization)
1.  **Check your Balance:** Look at the top right of the Chat screen. You have **30.00 Free Credits**.
2.  **Understand the Cost:**
    *   **1 Credit = 500 Tokens** (approx 350 words).
    *   **Cost:** Only usage is deducted. A short "Hello" costs almost nothing (~0.05 credits).
    *   **Limit:** If you hit 0.00, the AI stops.
3.  **Upgrade:** Click the **Buy** button to see the Pricing Page (Meveruockup).

---

## 💼 3. How to Showcase This for a Job

When showing this to a recruiter or client, follow this **Demo Flow**:

1.  **The "Hook"**: Start at the top. Show the beautiful animation and dark mode design.
2.  **The "Tech Flex"**: Use the **Voice Search** immediately. Say "Show me the future". Recruiters love voice features.
3.  **The "Enterprise" Detail**: Navigate to the **/resources** page. Show them the "Search" and "Filters". This proves you can build complex business apps.
4.  **The "Magic"**: Go to the **Chat**. Ask a complex question about Saudi Arabia. Let the AI answer, then click **Speak**.
5.  **The "Polish"**: Scroll to the footer. Click "Contact Us". Show the working form and professional layout.

---

## 🛠️ Troubleshooting

*   **Error:** "Port 3000 is in use"
    *   **Fix:** Open a terminal and run: `taskkill /F /IM node.exe`
    *   Then run `npm run dev` again.
*   **Error:** "JWEDecryptionFailed" (Auth Error)
    *   **Fix:** Ensure you are on `http://localhost:3000` (NOT 3001) and your backend is running.

---

**Built with ❤️ for Saudi Vision 2030**
