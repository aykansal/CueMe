// import { z } from "zod";
// import axios from "axios";
// import { getServerSession } from "next-auth";
// import { NextRequest, NextResponse } from "next/server";

// import { prismaClient } from "@/lib/db";

// const CreatorSchema = z.object({
//     spaceId: z.string(),
//     url: z.string()
// })

// const YT_REGEX = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;

// const getYoutubeVideoId = (url: string) => {
//     const regex =
//         /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
//     const match = url.match(regex);
//     return match ? match[1] : null;
// };

// export async function POST(req: NextRequest) {
//     try {
//         const session = await getServerSession();
//         const user = await prismaClient.user.findFirst({
//             where: {
//                 email: session?.user?.email ?? ""
//             }
//         });
//         if (!user) {
//             return NextResponse.json({
//                 message: 'unauthenticated'
//             }, {
//                 status: 403
//             })
//         }
//         const data = CreatorSchema.parse(await req.json());
//         const isYt = YT_REGEX.test(data.url);

//         if (!isYt) {
//             return NextResponse.json({
//                 message: "Invalid YouTube URL format",
//             }, {
//                 status: 400
//             });
//         }
//         const extractedId = getYoutubeVideoId(data.url);
//         if (!extractedId) {
//             return NextResponse.json({
//                 message: "Could not extract YouTube video ID",
//             }, {
//                 status: 404
//             });
//         }

//         const response = await axios.get(
//             `https://noembed.com/embed?url=https://www.youtube.com/watch?v=${extractedId}`
//         );
//         const videoDetails = await response.data;
//         const existingStream = await prismaClient.stream.findFirst({
//             where: {
//                 extractedId,
//                 type: 'YOUTUBE',
//             }
//         });
//         if (existingStream) {
//             return NextResponse.json({
//                 message: { title: "Stream already in queue", description: "Vibe Matched !!" },
//             })
//         }

//         const existingActiveStream = await prismaClient.stream.count({
//             where: {
//                 spaceId: data.spaceId
//             }
//         })
//         if (existingActiveStream > 20) {
//             return NextResponse.json({
//                 message: { title: "Queue Limit Reached !!", description: "You can vote from exisitng list !!" },
//             }, {
//                 status: 411
//             })
//         }
//         const stream = await prismaClient.stream.create({
//             data: {
//                 userId: user.id,
//                 spaceId: data.spaceId,
//                 url: data.url,
//                 extractedId,
//                 type: 'YOUTUBE',
//                 title: videoDetails.title ?? "Can't Find",
//                 // smlImg: thumbnails.length > 1 ? thumbnails[thumbnails.length - 2].url : thumbnails[thumbnails.length - 1].url ?? "https://img.freepik.com/free-photo/cute-cat-spending-time-indoors_23-2150649172.jpg?t=st=1734280662~exp=1734284262~hmac=6fea58159e5df9f17cd4393c7aade9bf0abd63fdc9e1f263e2c69be607ef433e&w=1060",
//                 // bigImg: thumbnails[thumbnails.length - 1].url ?? "https://img.freepik.com/free-photo/cute-cat-spending-time-indoors_23-2150649172.jpg?t=st=1734280662~exp=1734284262~hmac=6fea58159e5df9f17cd4393c7aade9bf0abd63fdc9e1f263e2c69be607ef433e&w=1060"
//                 smlImg: videoDetails.thumbnail_url,
//                 bigImg: videoDetails.thumbnail_url,
//             }
//         });

//         return NextResponse.json({
//             message: { title: "Stream added successfully", description: "Enjoy your songs !!" },
//             id: stream.id
//         }, {
//             status: 201
//         });
//     } catch (error) {
//         return NextResponse.json({
//             message: "Error while adding stream",
//             error: error instanceof Error ? error.message : "Unknown error"
//         }, {
//             status: 500
//         });
//     }
// }

// export async function GET(req: NextRequest) {
//     const spaceId = req.nextUrl.searchParams.get("spaceId");
//     const session = await getServerSession();
//     const user = await prismaClient.user.findFirst({
//         where: {
//             email: session?.user?.email ?? ""
//         }
//     })

//     if (!user) {
//         return NextResponse.json({
//             message: { title: "Unauthenticated", description: "Sign In to interact with the content" }
//         }, {
//             status: 403
//         })
//     }

//     if (!spaceId) {
//         return NextResponse.json({
//             message: { title: "No spaceId found" }
//         }, {
//             status: 411
//         })
//     }
//     const streams = await prismaClient.stream.findMany({
//         where: {
//             spaceId
//         }
//     })
//     return NextResponse.json({
//         streams,
//     });
// }

import { z } from "zod";
import axios from "axios";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

import { prismaClient } from "@/lib/db";

const CreatorSchema = z.object({
    spaceId: z.string(),
    url: z.string()
});

const YT_REGEX = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;

const getYoutubeVideoId = (url: string) => {
    const regex =
        /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
};

export async function POST(req: NextRequest) {
    try {
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
        const data = CreatorSchema.parse(await req.json());
        const isYt = YT_REGEX.test(data.url);

        if (!isYt) {
            return NextResponse.json({
                message: "Invalid YouTube URL format",
            }, {
                status: 400
            });
        }
        const extractedId = getYoutubeVideoId(data.url);
        if (!extractedId) {
            return NextResponse.json({
                message: "Could not extract YouTube video ID",
            }, {
                status: 404
            });
        }

        const response = await axios.get(
            `https://noembed.com/embed?url=https://www.youtube.com/watch?v=${extractedId}`
        );
        const videoDetails = await response.data;
        const existingStream = await prismaClient.stream.findFirst({
            where: {
                extractedId,
                type: 'YOUTUBE',
                spaceId: data.spaceId // Add spaceId to check within the same space
            }
        });
        if (existingStream) {
            return NextResponse.json({
                message: { title: "Stream already in queue", description: "Vibe Matched !!" },
            });
        }

        const existingActiveStream = await prismaClient.stream.count({
            where: {
                spaceId: data.spaceId
            }
        });
        if (existingActiveStream > 20) {
            return NextResponse.json({
                message: { title: "Queue Limit Reached !!", description: "You can vote from existing list !!" },
            }, {
                status: 411
            });
        }
        const stream = await prismaClient.stream.create({
            data: {
                userId: user.id,
                spaceId: data.spaceId,
                url: data.url,
                extractedId,
                type: 'YOUTUBE',
                title: videoDetails.title ?? "Can't Find",
                smlImg: videoDetails.thumbnail_url,
                bigImg: videoDetails.thumbnail_url,
                voteCount: 0, // Initialize vote count
                hasUpvoted: false
            }
        });

        return NextResponse.json({
            message: { title: "Stream added successfully", description: "Enjoy your songs !!" },
            id: stream.id
        }, {
            status: 201
        });
    } catch (error) {
        return NextResponse.json({
            message: "Error while adding stream",
            error: error instanceof Error ? error.message : "Unknown error"
        }, {
            status: 500
        });
    }
}

export async function GET(req: NextRequest) {
    const spaceId = req.nextUrl.searchParams.get("spaceId");
    const session = await getServerSession();
    const user = await prismaClient.user.findFirst({
        where: {
            email: session?.user?.email ?? ""
        }
    });

    if (!user) {
        return NextResponse.json({
            message: { title: "Unauthenticated", description: "Sign In to interact with the content" }
        }, {
            status: 403
        });
    }

    if (!spaceId) {
        return NextResponse.json({
            message: { title: "No spaceId found" }
        }, {
            status: 411
        });
    }

    // Get streams with upvote information for the current user
    const streams = await prismaClient.stream.findMany({
        where: {
            spaceId
        },
        include: {
            upvotes: {
                where: {
                    userId: user.id
                }
            }
        },
        orderBy: [
            { voteCount: 'desc' },
            { createdTimestamp: 'asc' }
        ]
    });

    // Transform the streams to include hasUpvoted status
    const transformedStreams = streams.map(stream => ({
        ...stream,
        hasUpvoted: stream.upvotes.length > 0,
        upvotes: undefined // Remove the upvotes array from the response
    }));

    return NextResponse.json({
        streams: transformedStreams,
    });
}