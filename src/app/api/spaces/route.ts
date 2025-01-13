import { prismaClient } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
    const session = await getServerSession();
    // TODO: replace with id here
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
    const existingSpaces = await prismaClient.space.findMany();
    
    return NextResponse.json(existingSpaces || []);
}
