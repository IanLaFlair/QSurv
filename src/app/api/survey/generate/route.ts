import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const { prompt } = await request.json();

        // Simulate AI processing delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Mock AI Logic: Return different questions based on keywords, or generic ones
        let questions = [];

        if (prompt.toLowerCase().includes("crypto") || prompt.toLowerCase().includes("token")) {
            questions = [
                { text: "Which crypto exchange do you use most frequently?", type: "text" },
                { text: "What is your biggest pain point with current wallets?", type: "text" },
                { text: "How likely are you to recommend Qubic to a friend?", type: "rating" }
            ];
        } else if (prompt.toLowerCase().includes("product") || prompt.toLowerCase().includes("feedback")) {
            questions = [
                { text: "What feature do you value most in our product?", type: "text" },
                { text: "How would you rate the ease of use?", type: "rating" },
                { text: "What improvements would you suggest for the next version?", type: "text" }
            ];
        } else {
            // Generic fallback
            questions = [
                { text: `What are your thoughts on ${prompt}?`, type: "text" },
                { text: "How does this impact your daily routine?", type: "text" },
                { text: "Would you pay for a solution like this?", type: "text" }
            ];
        }

        return NextResponse.json({ success: true, questions });

    } catch (error) {
        return NextResponse.json({ success: false, error: "Failed to generate questions" }, { status: 500 });
    }
}
