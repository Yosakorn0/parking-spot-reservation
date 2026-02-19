import { NextResponse } from "next/server";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import { reservations } from "~/server/db/schema";
import { eq, and } from "drizzle-orm";
import { timeSlots } from "~/lib/constants";

/**
 * GET /api/reservations
 * Get all reservations for the authenticated user
 */
export async function GET(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date");
    const spotId = searchParams.get("spotId");

    // let query = db
    //   .select()
    //   .from(reservations)
    //   .where(eq(reservations.userId, session.user.id));

    let query = db
      .select()
      .from(reservations)
      .where(eq(reservations.userId, session.user.id));

    // Filter by date if provided
    if (date) {
      query = query.where(
        and(
          eq(reservations.userId, session.user.id),
          eq(reservations.date, new Date(date)),
        ),
      );
    }

    // Filter by spotId if provided
    if (spotId) {
      query = query.where(
        and(
          eq(reservations.userId, session.user.id),
          eq(reservations.spotId, spotId),
        ),
      );
    }

    const userReservations = await query;

    return NextResponse.json({
      success: true,
      data: userReservations,
      count: userReservations.length,
    });
  } catch (error) {
    console.error("Error fetching reservations:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

/**
 * POST /api/reservations
 * Create a new reservation
 */
export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { phoneNumber, licensePlate, date, time, spotId } = body;

    // Validation
    if (!phoneNumber || !licensePlate || !date || !time || !spotId) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: phoneNumber, licensePlate, date, time, spotId",
        },
        { status: 400 },
      );
    }

    // Find the time slot
    const slot = timeSlots.find((s) => s.value === time);
    if (!slot) {
      return NextResponse.json({ error: "Invalid time slot" }, { status: 400 });
    }

    // Create reservation
    const newReservation = await db
      .insert(reservations)
      .values({
        userId: session.user.id,
        phone: phoneNumber,
        licensePlate: licensePlate,
        spotId: spotId,
        date: new Date(date),
        start: slot.start,
        end: slot.end,
      })
      .returning();

    return NextResponse.json(
      {
        success: true,
        message: "Reservation created successfully",
        data: newReservation[0],
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating reservation:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
