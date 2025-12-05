import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { qubicSimulation } from "@/lib/qubic-simulation";

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

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { surveyId, walletAddress, answers } = body;

        if (!surveyId || !walletAddress || !answers || !Array.isArray(answers)) {
            return NextResponse.json({ success: false, error: "Invalid request body" }, { status: 400 });
        }

        // 0. Check for Duplicate Submission
        const existingResponse = await prisma.response.findFirst({
            where: {
                surveyId: surveyId,
                respondentAddress: walletAddress
            }
        });

        if (existingResponse) {
            return NextResponse.json({
                success: false,
                error: "You have already submitted a response to this survey."
            }, { status: 400 });
        }

        // 1. Verify Answers with AI
        const aiResults = await Promise.all(
            answers.map(async (a: any) => verifyAnswerWithAI(a.question, a.answer))
        );

        // Check if all answers are valid (or use an average score threshold)
        const allValid = aiResults.every(r => r.isValid);
        const averageScore = aiResults.reduce((acc, r) => acc + r.score, 0) / aiResults.length;

        // Generate a consolidated feedback message
        const feedback = allValid
            ? "Your answers were relevant and detailed. Great job!"
            : "Some answers were too short or not relevant to the questions.";

        if (allValid) {
            // 2. Fetch Survey to get Reward Amount
            const survey = await prisma.survey.findUnique({ where: { id: surveyId } });
            const rewardAmount = survey?.rewardPerRespondent || 0;

            // 3. Trigger Payout via Smart Contract Simulation
            let txHash = "FAILED_TX";
            try {
                txHash = await qubicSimulation.payout(surveyId, rewardAmount, walletAddress);
                console.log(`[Simulation] Payout of ${rewardAmount} QUs to ${walletAddress} successful. Tx: ${txHash}`);
            } catch (simError) {
                console.error("[Simulation] Payout failed:", simError);
                // In a real app, we might want to flag this for manual review
            }

            // 4. Save Response to Database
            const response = await prisma.response.create({
                data: {
                    surveyId,
                    respondentAddress: walletAddress,
                    answers: JSON.stringify(answers),
                    aiScore: averageScore,
                    aiFeedback: feedback,
                    isApproved: true,
                    payoutTxHash: txHash
                }
            });

            return NextResponse.json({
                success: true,
                status: "APPROVED",
                score: averageScore,
                feedback: feedback,
                payoutTx: txHash,
                message: "Answers verified! Payout initiated."
            });
        } else {
            // Save rejected response too
            await prisma.response.create({
                data: {
                    surveyId,
                    respondentAddress: walletAddress,
                    answers: JSON.stringify(answers),
                    aiScore: averageScore,
                    aiFeedback: feedback,
                    isApproved: false,
                    payoutTxHash: null
                }
            });

            return NextResponse.json({
                success: false,
                status: "REJECTED",
                score: averageScore,
                feedback: feedback,
                message: "Answers did not meet quality standards."
            });
        }

    } catch (error) {
        console.error("Submit Error:", error);
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}
