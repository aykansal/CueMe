// API Route (app/api/streams/vote/route.ts)
import { prismaClient } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const UpvoteSchema = z.object({
    streamId: z.string()
});

export async function POST(req: NextRequest) {
    const session = await getServerSession();
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
        });
    }

    try {
        const data = UpvoteSchema.parse(await req.json());

        // Start a transaction to ensure vote count stays in sync
        return await prismaClient.$transaction(async (tx) => {
            const stream = await tx.stream.findUnique({
                where: { id: data.streamId },
                include: { upvotes: true }
            });

            if (!stream) {
                throw new Error('Stream not found');
            }

            const existingUpvote = await tx.upvote.findUnique({
                where: {
                    streamId_userId: {
                        userId: user.id,
                        streamId: data.streamId
                    }
                }
            });

            if (existingUpvote) {
                // Remove upvote
                await tx.upvote.delete({
                    where: {
                        streamId_userId: {
                            userId: user.id,
                            streamId: data.streamId
                        }
                    }
                });

                // Update stream vote count
                const updatedStream = await tx.stream.update({
                    where: { id: data.streamId },
                    data: {
                        voteCount: { decrement: 1 },
                        hasUpvoted: false
                    }
                });

                return NextResponse.json({
                    message: 'Successfully Downvoted!',
                    voteCount: updatedStream.voteCount,
                    hasUpvoted: false
                });
            } else {
                // Add upvote
                await tx.upvote.create({
                    data: {
                        userId: user.id,
                        streamId: data.streamId
                    }
                });

                // Update stream vote count
                const updatedStream = await tx.stream.update({
                    where: { id: data.streamId },
                    data: {
                        voteCount: { increment: 1 },
                        hasUpvoted: true
                    }
                });

                return NextResponse.json({
                    message: 'Successfully Upvoted!',
                    voteCount: updatedStream.voteCount,
                    hasUpvoted: true
                });
            }
        });

    } catch (error) {
        console.error('Vote processing error:', error);
        return NextResponse.json({
            error,
            message: 'Error processing your vote'
        }, {
            status: 500
        });
    }
}
