require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = process.env.PORT || 5001;

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'AIzaSy_FAKE_KEY');

app.use(cors());
app.use(express.json());

// System prompt for the cybersecurity assistant
const SYSTEM_PROMPT = `
You are "Cyber Assistant", a friendly AI mentor for a cybersecurity educational game. 
Your goal is to explain cyber crimes and provide safety tips to teenagers.

TOPICS TO COVER:
- Phishing, Malware, Ransomware, Identity theft, Social engineering, Password safety, 2FA, Privacy protection.

GUIDELINES:
- Use teen-friendly, encouraging English.
- Keep answers concise (3-6 lines).
- Provide real-life examples where possible.
- If a user asks about hacking or illegal activities, refuse politely, explain the legal risks, and focus on teaching prevention instead.
- You must NOT provide any scripts, tools, or instructions for performing attacks.
`;

// Simple in-memory session memory (optional enhancement: use a proper session store)
const sessionMemory = {};

app.post('/api/chat', async (req, res) => {
    try {
        const { message, sessionId } = req.body;

        if (!message) {
            return res.status(400).json({ success: false, error: 'Message is required' });
        }

        // Educational safety check: simple keyword block before AI (optional)
        const blockList = ['how to hack', 'hack a bank', 'steal password', 'crack wifi'];
        if (blockList.some(keyword => message.toLowerCase().includes(keyword))) {
            return res.json({
                success: true,
                response: "I can't help with that. My goal is to help you stay safe online! Let's focus on how to prevent such attacks instead. For example, did you know that using 2FA can stop 99% of automated attacks?"
            });
        }

        // Call Gemini API
        let text;
        const apiKey = process.env.GEMINI_API_KEY || '';
        const isMock = !apiKey || apiKey.includes('FAKE_KEY') || apiKey.includes('YOUR_GEMINI_API_KEY') || apiKey === '';

        if (isMock) {
            // Dynamic Mock responses based on keywords
            const lowerMsg = message.toLowerCase();
            if (lowerMsg.includes('phishing')) {
                text = "Phishing is a type of cyber attack where someone pretends to be a trusted person or company to steal your info. Always check the sender's email address and never click suspicious links!";
            } else if (lowerMsg.includes('password')) {
                text = "A strong password should be like a secret sentence—long, complex, and unique to every account. Try using a mix of letters, numbers, and symbols!";
            } else if (lowerMsg.includes('2fa') || lowerMsg.includes('factor')) {
                text = "Two-Factor Authentication (2FA) adds an extra layer of security. Even if a hacker steals your password, they can't get in without the second code from your phone!";
            } else if (lowerMsg.includes('malware') || lowerMsg.includes('virus')) {
                text = "Malware is 'malicious software' designed to harm or hack your computer. Stay safe by only downloading apps from official stores and keeping your system updated!";
            } else if (lowerMsg.includes('social media') || lowerMsg.includes('privacy')) {
                text = "Privacy on social media is super important! Check your settings to make sure only friends can see your posts, and never share your location or phone number publicly.";
            } else if (lowerMsg.includes('ransomware')) {
                text = "Ransomware is a nasty type of malware that locks your files and demands money to get them back. The best defense is to always back up your important files to the cloud or an external drive!";
            } else if (lowerMsg.includes('identity theft')) {
                text = "Identity theft happens when someone steals your personal info (like your name or SSN) to commit fraud. Never share your private details with anyone you don't know online!";
            } else if (lowerMsg.includes('social engineering')) {
                text = "Social engineering is the art of manipulating people into giving up confidential info. It's more about 'human hacking' than technical hacking. Always trust your gut if something feels off!";
            } else if (lowerMsg.includes('cyberbullying')) {
                text = "Cyberbullying is using digital tech to harass or shame others. If it happens to you, remember: don't respond, block the person, and tell a trusted adult immediately.";
            } else if (lowerMsg.includes('wifi') || lowerMsg.includes('public')) {
                text = "Public Wi-Fi can be risky because hackers can 'sniff' the data you're sending. Avoid logging into bank accounts or shopping while on free public networks!";
            } else {
                text = `"${message}" is a great topic! In cybersecurity, the most important rule is to stay curious but cautious. Is there a specific cyber crime you want to learn about, like Phishing, Ransomware, or 2FA?`;
            }
        } else {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

            // Construct the prompt with system context
            const prompt = `${SYSTEM_PROMPT}\n\nUser Question: ${message}\nAssistant:`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            text = response.text();
        }

        res.json({
            success: true,
            response: text
        });

    } catch (error) {
        console.error('Chatbot Error:', error);
        res.status(500).json({
            success: false,
            message: 'Cyber Assistant is currently unavailable'
        });
    }
});

app.get('/api/health', (req, res) => {
    res.json({ success: true, status: 'Chatbot service is online' });
});

app.listen(PORT, () => {
    console.log(`Chatbot service running on http://localhost:${PORT}`);
});
