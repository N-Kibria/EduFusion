import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";


export async function POST(
    req: Request,
    { params }: { params: { courseId: string } }
) {
    try {
        
        const { userId } = auth();
        const { rating } = await req.json();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (rating < 1 || rating > 5) {
            return new NextResponse("Invalid rating value", { status: 400 });
        }

       

        const course = await db.course.findUnique({
            where: {
                id: params.courseId,
            },
        });

        if (!course) {
            return new NextResponse("Course not found", { status: 404 });
        }

        const updatedRatings = [...course.ratings, rating];
        const averageRating =
            updatedRatings.reduce((acc, cur) => acc + cur, 0) / updatedRatings.length;

        const updatedCourse = await db.course.update({
            where: {
                id: params.courseId,
            },
            data: {
                ratings: updatedRatings,
                averageRating,
            },
        });

        return NextResponse.json(updatedCourse);
    } catch (error) {
        console.error("[COURSE_RATING]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
