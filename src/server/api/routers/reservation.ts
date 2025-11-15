import { and, eq } from "drizzle-orm";
import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { reservations } from "~/server/db/schema";
// Import the shared time slots
import { timeSlots } from "~/lib/constants";
import moment from "moment";

export const reservationRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => ({
      greeting: `Hello ${input.text}`,
    })),

  getReserved: protectedProcedure
    .input(
      z.object({
        time: z.string(),
        date: z.date(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Find the time slot based on the input value.
      const slot = timeSlots.find((s) => s.value === input.time);
      if (!slot) {
        throw new Error("Invalid time slot");
      }

      const reservationsFound = await ctx.db.query.reservations.findMany({
        where: (reservation) =>
          and(
            eq(reservation.start, slot.start),
            eq(reservation.end, slot.end),
            eq(reservation.date, input.date),
          ),
      });

      return reservationsFound;
    }),

  create: protectedProcedure
    .input(
      z.object({
        phoneNumber: z.string(),
        licensePlate: z.string(),
        date: z.date(),
        time: z.string(),
        spotId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      console.log("backend date", input.date);
      // Look up the time slot
      const slot = timeSlots.find((s) => s.value === input.time);
      if (!slot) {
        throw new Error("Invalid time slot");
      }

      return await ctx.db
        .insert(reservations)
        .values({
          userId: ctx.session.user.id,
          phone: input.phoneNumber,
          licensePlate: input.licensePlate,
          spotId: input.spotId,
          date: input.date,
          start: slot.start,
          end: slot.end,
        })
        .returning();
    }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
