import { prismaClient } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ spaceId: string }> }) {
    const session = await getServerSession();
    const { spaceId } = await params;
    const user = await prismaClient.user.findFirst({
        where: {
            email: session?.user?.email ?? ""
        }
    });
    if (!user) {
        return NextResponse.json({
            message: 'unauthenticated'
        }, {
            status: 403
        })
    }
    const getSpace = await prismaClient.space.findUnique({
        where: {
            id: spaceId
        }
    });
    return NextResponse.json(getSpace || []);
}