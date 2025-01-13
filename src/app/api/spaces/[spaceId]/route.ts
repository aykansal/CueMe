import { prismaClient } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { spaceId: string } }) {
    const session = await getServerSession();
    const { spaceId } = params;
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
    console.log(spaceId);

    const getSpace = await prismaClient.space.findUnique({
        where: {
            id: spaceId
        }
    });

    return NextResponse.json(getSpace || []);
}