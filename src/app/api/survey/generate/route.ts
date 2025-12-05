import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
    try {
        const { prompt } = await req.json();

        if (!prompt) {
            return NextResponse.json({ success: false, error: "Prompt is required" }, { status: 400 });
        }

        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return NextResponse.json({ success: false, error: "Gemini API Key not configured" }, { status: 500 });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const systemPrompt = `
      You are an expert survey creator. 
      Generate a survey based on the user's topic: "${prompt}".
      
      Return ONLY a valid JSON object with this exact structure:
      {
        "title": "Catchy Survey Title",
        "description": "A short, engaging description of the survey.",
        "questions": [
          { "text": "Question 1?", "type": "text" },
          { "text": "Question 2?", "type": "text" },
          { "text": "Question 3?", "type": "text" }
        ]
      }
      Generate 3-5 high-quality questions.
    `;

        const result = await model.generateContent(systemPrompt);
        const response = await result.response;
        const text = response.text();

        // Clean up markdown code blocks if present
        const jsonStr = text.replace(/```json/g, "").replace(/```/g, "").trim();
        const data = JSON.parse(jsonStr);

        return NextResponse.json({
            success: true,
            title: data.title,
            description: data.description,
            questions: data.questions
        });

    } catch (error) {
        console.error("AI Generation Error:", error);
        return NextResponse.json({ success: false, error: "Failed to generate survey" }, { status: 500 });
    }
}
