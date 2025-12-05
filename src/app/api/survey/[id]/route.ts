import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        if (!id) {
            return NextResponse.json({ success: false, error: "Survey ID is required" }, { status: 400 });
        }

        const survey = await prisma.survey.findUnique({
            where: { id },
            include: {
                questions: true,
                _count: {
                    select: { responses: true },
                },
            },
        });

        if (!survey) {
            return NextResponse.json({ success: false, error: "Survey not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, survey });
    } catch (error) {
        console.error("Error fetching survey:", error);
        return NextResponse.json({ success: false, error: "Failed to fetch survey" }, { status: 500 });
    }
}
