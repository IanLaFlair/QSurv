import { NextResponse } from "next/server";

// Mock AI Verification Logic
async function verifyAnswerWithAI(question: string, answer: string) {
    // In a real app, this would call OpenAI/Gemini API
    console.log(`[AI] Verifying: "${answer}" for Question: "${question}"`);

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock Logic: If answer is longer than 10 chars, it's "valid"
    const isValid = answer.length > 10;
    const score = isValid ? Math.floor(Math.random() * 3) + 8 : Math.floor(Math.random() * 5); // 8-10 if valid, 0-5 if not

    return {
        isValid,
        score,
        reason: isValid ? "Answer provides sufficient detail and relevance." : "Answer is too short or irrelevant."
    };
}

// Mock Smart Contract Interaction
async function triggerSmartContractPayout(walletAddress: string, amount: number) {
    console.log(`[SC] Initiating Payout of ${amount} QUs to ${walletAddress}`);
    await new Promise(resolve => setTimeout(resolve, 1000));
    return "tx_hash_" + Math.random().toString(36).substring(7);
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { surveyId, walletAddress, answers } = body;

        // 1. Verify Answers with AI
        const aiResults = await Promise.all(
            answers.map(async (a: any) => verifyAnswerWithAI(a.question, a.answer))
        );

        // Check if all answers are valid (or use an average score threshold)
        const allValid = aiResults.every(r => r.isValid);
        const averageScore = aiResults.reduce((acc, r) => acc + r.score, 0) / aiResults.length;

        if (allValid) {
            // 2. Trigger Payout via Smart Contract
            const txHash = await triggerSmartContractPayout(walletAddress, 1000); // Mock amount

            return NextResponse.json({
                success: true,
                status: "APPROVED",
                score: averageScore,
                payoutTx: txHash,
                message: "Answers verified! Payout initiated."
            });
        } else {
            return NextResponse.json({
                success: false,
                status: "REJECTED",
                score: averageScore,
                message: "Answers did not meet quality standards."
            });
        }

    } catch (error) {
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}
