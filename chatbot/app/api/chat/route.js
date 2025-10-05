import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const API_KEY = process.env.GOOGLE_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_API_KEY || "";
const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

const transformMessagesForGemini = (messages) => {
    return messages
        .filter(message => message.role === 'user' || message.role === 'assistant')
        .map(message => ({
            role: message.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: message.content }],
        }));
};

export async function POST(req) {
    try {
        const { messages } = await req.json();

        if (!messages || messages.length === 0) {
            return NextResponse.json({ error: 'Messages are required' }, { status: 400 });
        }

        if (!API_KEY || !genAI) {
            // Demo fallback so the UI remains functional without a key
            const latestUserMessage = messages[messages.length - 1];
            const prompt = latestUserMessage?.content || "";
            const reply = `Hi! I\'m the AI Club Fair Guide. It looks like the server is missing GOOGLE_API_KEY, so I\'m running in demo mode.\n\nHere\'s a sample response to your prompt:\n\n> ${prompt || 'Tell me about your AI club.'}\n\nOur AI Club explores practical AI projects, workshops, and collaboration. Ask about upcoming events, how to join, or demos on display today!`;
            return NextResponse.json({ reply });
        }

        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash-exp",
            systemInstruction: `You are the AI Club Fair Guide. Your goals:\n- Welcome prospective members warmly.\n- Market the AI Club\'s value: hands-on projects, workshops, mentorship, community.\n- Be concise, friendly, energetic, and helpful.\n- Offer to direct people to the Image Generator demo and other displays.\n- Provide clear calls-to-action: sign-up, meeting times, how to get involved.\n- Use light formatting (bold, lists) when it improves scanability.`,
        });

        const latestUserMessage = messages[messages.length - 1];
        const prompt = latestUserMessage.content;
        
        // Transform all messages except the last one into history
        let history = transformMessagesForGemini(messages.slice(0, -1));

        // ✅ THE FIX IS HERE:
        // If the history array exists and its first message is from the model, remove it.
        // This handles the initial assistant greeting on the first turn.
        if (history.length > 0 && history[0].role === 'model') {
            history.shift(); // Removes the first element from the array
        }

        const chat = model.startChat({
            history: history,
            generationConfig: {
                maxOutputTokens: 800,
                temperature: 0.7,
            },
        });

        const result = await chat.sendMessage(prompt);
        const response = result.response;
        const text = response.text();

        return NextResponse.json({ reply: text });

    } catch (error) {
        console.error('[GEMINI_API_ERROR]', error);
        const message = error?.message || 'Failed to fetch response from AI';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}