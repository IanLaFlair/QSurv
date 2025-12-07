import { NextResponse } from "next/server";
import { qubicSimulation } from "@/lib/qubic-simulation";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get("address");

    if (!address) {
        return NextResponse.json({ error: "Address is required" }, { status: 400 });
    }

    try {
        const user = await qubicSimulation.getUserStaking(address);
        // In a real app, we'd also fetch the main balance. For simulation, we might need a helper or just mock it if not tracked.
        // Let's assume the main balance is tracked in the simulation or we just return the staking info for now.

        return NextResponse.json({
            success: true,
            user: {
                ...user,
                earnings: await qubicSimulation.getUserEarnings(address)
            }
        });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch staking info" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const { address, amount, action } = await request.json();

        if (!address || !amount || !action) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        if (action === "STAKE") {
            const result = await qubicSimulation.stakeFunds(address, Number(amount));
            return NextResponse.json({ ...result });
        }

        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    } catch (error) {
        console.error("Staking error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
