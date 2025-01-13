import { prismaClient } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const createSpaceSchema = z.object({
    name: z.string(),
})

export async function POST(req: NextRequest) {
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
    // const user= {id:"8a074f1a-8a7c-4582-b6b3-18267b31c757"}
    try {
        const data = createSpaceSchema.parse(await req.json());
        const space = await prismaClient.space.create({
            data: {
                name: data.name,
                owner: {
                    connect: { id: user.id }
                }
            }
        })
        return NextResponse.json({
            message: 'Space Created',
            space
        },{
            status: 201
        })
    } catch (error) {
        return NextResponse.json({
            error,
            message: 'Error Creating Space'
        }, {
            status: 403
        })
    }

}