// ~/lib/constants.ts

export interface TimeSlot {
  value: string;
  label: string;
  start: string;
  end: string;
}

// Define available time slots. You can easily add more by pushing additional objects.
export const timeSlots: TimeSlot[] = [
  { value: "morning", label: "9:00 - 12:00", start: "9:00", end: "12:00" },
  { value: "afternoon", label: "13:00 - 17:00", start: "13:00", end: "17:00" },
  { value: "evening", label: "18:00 - 23:59", start: "18:00", end: "23:59" },
  
  // add more time slots here as needed
];

// Define available parking spots. This can also be expanded later.
export const parkingSpots: string[] = ["1", "2", "3"];
