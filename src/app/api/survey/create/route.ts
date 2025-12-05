import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { uploadToPinata } from "@/lib/pinata";
import { qubicSimulation } from "@/lib/qubic-simulation";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, description, questions, rewardPool, maxRespondents, creatorAddress } = body;

    if (!title || !questions || !creatorAddress) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const rewardPerRespondent = maxRespondents > 0 ? rewardPool / maxRespondents : 0;

    // 1. Upload Survey Data to IPFS (Pinata)
    const surveyData = {
      title,
      description,
      questions,
      creatorAddress,
      createdAt: new Date().toISOString(),
      platform: "QSurv"
    };

    let ipfsHash = null;
    try {
      ipfsHash = await uploadToPinata(surveyData);
      console.log("Uploaded to Pinata IPFS:", ipfsHash);
    } catch (pinataError) {
      console.error("Pinata Upload Failed:", pinataError);
      // We continue even if IPFS fails, but ideally we should warn the user
    }

    // 2. Create Survey in Database (with IPFS Hash)
    const survey = await prisma.survey.create({
      data: {
        title,
        description,
        creatorAddress,
        ipfsHash, // Store the CID
        rewardPool: Number(rewardPool),
        maxRespondents: Number(maxRespondents),
        rewardPerRespondent,
        questions: {
          create: questions.map((q: any) => ({
            text: q.text,
            type: q.type || "text",
          })),
        },
      },
      include: {
        questions: true,
      },
    });

    // 3. Simulate Smart Contract Fund Locking
    try {
      await qubicSimulation.lockFunds(survey.id, Number(rewardPool), creatorAddress);
      console.log(`[Simulation] Funds locked for survey ${survey.id}`);
    } catch (simError) {
      console.error("[Simulation] Failed to lock funds:", simError);
    }

    return NextResponse.json({ success: true, survey, ipfsHash });
  } catch (error) {
    console.error("Error creating survey:", error);
    return NextResponse.json({ success: false, error: "Failed to create survey" }, { status: 500 });
  }
}
