import { NextResponse } from "next/server";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import { reservations } from "~/server/db/schema";
import { eq, and } from "drizzle-orm";
import { timeSlots } from "~/lib/constants";

/**
 * GET /api/reservations/[id]
 * Get a specific reservation by ID
 */
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

    const reservation = await db
      .select()
      .from(reservations)
      .where(
        and(
          eq(reservations.id, id),
          eq(reservations.userId, session.user.id)
        )
      )
      .limit(1);

    if (reservation.length === 0) {
      return NextResponse.json(
        { error: "Reservation not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: reservation[0],
    });
  } catch (error) {
    console.error("Error fetching reservation:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/reservations/[id]
 * Update a specific reservation
 */
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await req.json();
    const { phoneNumber, licensePlate, date, time, spotId } = body;

    // Check if reservation exists and belongs to user
    const existing = await db
      .select()
      .from(reservations)
      .where(
        and(
          eq(reservations.id, id),
          eq(reservations.userId, session.user.id)
        )
      )
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json(
        { error: "Reservation not found" },
        { status: 404 }
      );
    }

    // Build update object
    const updateData: {
      phone?: string;
      licensePlate?: string;
      date?: Date;
      start?: string;
      end?: string;
      spotId?: string;
    } = {};

    if (phoneNumber) updateData.phone = phoneNumber;
    if (licensePlate) updateData.licensePlate = licensePlate;
    if (date) updateData.date = new Date(date);
    if (spotId) updateData.spotId = spotId;

    // Update time slot if time is provided
    if (time) {
      const slot = timeSlots.find((s) => s.value === time);
      if (!slot) {
        return NextResponse.json(
          { error: "Invalid time slot" },
          { status: 400 }
        );
      }
      updateData.start = slot.start;
      updateData.end = slot.end;
    }

    const updated = await db
      .update(reservations)
      .set(updateData)
      .where(eq(reservations.id, id))
      .returning();

    return NextResponse.json({
      success: true,
      message: "Reservation updated successfully",
      data: updated[0],
    });
  } catch (error) {
    console.error("Error updating reservation:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/reservations/[id]
 * Delete a specific reservation
 */
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Check if reservation exists and belongs to user
    const existing = await db
      .select()
      .from(reservations)
      .where(
        and(
          eq(reservations.id, id),
          eq(reservations.userId, session.user.id)
        )
      )
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json(
        { error: "Reservation not found" },
        { status: 404 }
      );
    }

    await db
      .delete(reservations)
      .where(eq(reservations.id, id));

    return NextResponse.json({
      success: true,
      message: "Reservation deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting reservation:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

