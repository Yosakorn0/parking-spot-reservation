import { NextResponse } from "next/server";
import { db } from "~/server/db";
import { reservations } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import moment from "moment";

// ✅ Enable body parsing
export const config = {
  api: {
    bodyParser: true,
  },
};

export async function POST(req: Request) {
  try {
    // Step 1: Read JSON from the request
    const data = (await req.json()) as {
      detected_text: string;
      detection_date: string;
      detection_time: string;
    };

    // ✅ Extract license plate, date, and time
    const licensePlate = data?.detected_text;
    const detectionDate = data?.detection_date; // expected format: 'YYYY-MM-DD'
    const detectionTime = data?.detection_time; // expected format: 'HH:mm'

    console.log(`🔍 Received License Plate: ${licensePlate}`);
    console.log(
      `📆 Detection Date: ${detectionDate}, 🕒 Time: ${detectionTime}`,
    );

    if (!licensePlate || !detectionDate || !detectionTime) {
      console.error("❌ Missing required fields in request");
      return NextResponse.json(
        {
          success: false,
          message: "Missing license plate, detection date, or time",
        },
        { status: 400 },
      );
    }

    // Step 2: Query DB for matching license plate
    const results = await db
      .select()
      .from(reservations)
      .where(eq(reservations.licensePlate, licensePlate));

    if (results.length === 0) {
      return NextResponse.json({
        success: false,
        message: "Car not found in database",
      });
    }

    // Step 3: Match reservation date and time using moment
    const detectionMoment = moment(
      `${detectionDate} ${detectionTime}`,
      "YYYY-MM-DD HH:mm",
    );

    const validReservation = results.find((res) => {
      // Convert the reservation date to the same string format for accurate comparison
      const resDateFormatted = moment(res.date).format("YYYY-MM-DD");
      if (resDateFormatted !== detectionDate) return false;

      // Create moment objects for the start and end times
      const startMoment = moment(
        `${resDateFormatted} ${res.start}`,
        "YYYY-MM-DD HH:mm",
      );
      const endMoment = moment(
        `${resDateFormatted} ${res.end}`,
        "YYYY-MM-DD HH:mm",
      );

      // Check if detectionMoment is between start (inclusive) and end (exclusive)
      return detectionMoment.isBetween(startMoment, endMoment, null, "[)");
    });

    if (validReservation) {
      const spotId = validReservation.spotId;
      console.log(`✅ Match found! Opening gate for spot ${spotId}`);

      return NextResponse.json({
        success: true,
        message: "Car found in database and reservation is active",
        spotId,
      });
    }

    // No valid reservation in time range
    return NextResponse.json({
      success: false,
      message: "Car found, but reservation is not currently active",
    });
  } catch (error) {
    console.error("❗ Error processing request:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Invalid request",
      },
      { status: 400 },
    );
  }
}

