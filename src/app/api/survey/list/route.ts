import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const creatorAddress = searchParams.get("creatorAddress");

        if (!creatorAddress) {
            return NextResponse.json({ success: false, error: "Creator address is required" }, { status: 400 });
        }

        const surveys = await prisma.survey.findMany({
            where: {
                creatorAddress: creatorAddress,
            },
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                _count: {
                    select: { responses: true },
                },
            },
        });

        return NextResponse.json({ success: true, surveys });
    } catch (error) {
        console.error("Error fetching surveys:", error);
        return NextResponse.json({ success: false, error: "Failed to fetch surveys" }, { status: 500 });
    }
}
