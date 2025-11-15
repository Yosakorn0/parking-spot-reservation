"use client";

import React from "react";
import moment from "moment";
import Image from "next/image";
import { format } from "date-fns";
import {
  CalendarCheck,
  CalendarIcon,
  Check,
  Clock,
  IdCard,
  ParkingCircle,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { toast } from "sonner";

import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";

// Import our constants
import { timeSlots, parkingSpots } from "~/lib/constants";

export default function Home() {
  const session = useSession();

  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [licensePlate, setLicensePlate] = React.useState("");
  const [date, setDate] = React.useState<Date>();
  const [time, setTime] = React.useState<string>("");
  const [spotId, setSpotId] = React.useState<string>("");
  const [open, setOpen] = React.useState(false);
  const [reservedSpots, setReservedSpots] = React.useState<string[]>([]);

  const reservation = api.reservation.create.useMutation({
    onSuccess() {
      setOpen(true);
    },
  });

  const getReserved = api.reservation.getReserved.useMutation({
    onSuccess: (data) => {
      const ids = data.map((reservation) => reservation.spotId);
      setReservedSpots(ids);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!time || !spotId || !date) return toast.error("Please fill all fields");
    console.log("frontend", date);

    reservation.mutate({
      phoneNumber,
      licensePlate,
      date,
      time,
      spotId,
    });
  };

  return (
    <div className="flex h-[100vh] w-full items-center justify-center">
      <Card className="mx-auto w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            Parking Reservation
          </CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="0987654321"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="license">License Plate</Label>
              <Input
                id="license"
                placeholder="ABC1234"
                value={licensePlate}
                onChange={(e) => setLicensePlate(e.target.value.toUpperCase())}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    fromDate={new Date()}
                    onSelect={(e) => {
                      setDate(e);
                      if (!e || !time) return;
                      getReserved.mutate({
                        date: e,
                        time: time,
                      });
                      setSpotId("");
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <Select
                value={time}
                onValueChange={(selectedTime) => {
                  setTime(selectedTime);
                  if (!date || !selectedTime) return;
                  getReserved.mutate({
                    date,
                    time: selectedTime,
                  });
                  setSpotId("");
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Available</SelectLabel>
                    {timeSlots.map((slot) => (
                      <SelectItem key={slot.value} value={slot.value}>
                        {slot.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="spot">Parking Spot</Label>
              <Select value={spotId} onValueChange={setSpotId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Parking Spot" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Available</SelectLabel>
                    {parkingSpots.map((spot) => (
                      <SelectItem
                        key={spot}
                        value={spot}
                        disabled={reservedSpots.includes(spot)}
                      >
                        Spot {spot}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </CardContent>

          <CardFooter className="mt-6">
            <div className="flex w-full flex-col gap-2">
              <Button type="submit" className="w-full">
                Submit
              </Button>
              <Button
                onClick={async () => {
                  await signOut();
                }}
                className="w-full"
                variant={"destructive"}
              >
                Logout
              </Button>
            </div>
          </CardFooter>
        </form>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            <DialogTitle className="text-center text-xl">
              Reservation Confirmed!
            </DialogTitle>
            <DialogDescription className="text-center">
              Your reservation has been successfully booked.
            </DialogDescription>
          </DialogHeader>

          <Card className="border-muted/60">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  {session.data?.user?.image && (
                    <div className="relative size-16 overflow-hidden rounded-full">
                      <Image
                        src={session.data.user.image}
                        alt={session.data.user.email ?? ""}
                        fill
                      />
                    </div>
                  )}
                  <div>
                    <p className="text-lg font-medium">
                      {session.data?.user?.name ?? "User"}
                    </p>
                    <p className="text-muted-foreground text-base">
                      {phoneNumber}
                    </p>
                  </div>
                </div>

                <div className="border-muted/60 flex items-center justify-between border-t py-3">
                  <div className="text-muted-foreground flex items-center gap-2">
                    <CalendarCheck className="h-4 w-4" />
                    <span>Date</span>
                  </div>
                  <div className="font-medium">{date?.toDateString()}</div>
                </div>
                <div className="border-muted/60 flex items-center justify-between border-t py-3">
                  <div className="text-muted-foreground flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>Time</span>
                  </div>
                  <div className="font-medium">
                    {timeSlots.find((slot) => slot.value === time)?.label}
                  </div>
                </div>

                <div className="border-muted/60 flex items-center justify-between border-t py-3">
                  <div className="text-muted-foreground flex items-center gap-2">
                    <ParkingCircle className="h-4 w-4" />
                    <span>Parking Spot</span>
                  </div>
                  <div className="font-medium">Spot {spotId}</div>
                </div>

                <div className="border-muted/60 flex items-center justify-between border-t py-3">
                  <div className="text-muted-foreground flex items-center gap-2">
                    <IdCard className="h-4 w-4" />
                    <span>License Plate</span>
                  </div>
                  <div className="font-medium">{licensePlate}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:space-x-0">
            <Button
              className="sm:flex-1"
              onClick={() => {
                setOpen(false);
                setPhoneNumber("");
                setLicensePlate("");
                setDate(undefined);
                setTime("");
                setSpotId("");
                setReservedSpots([]);
              }}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
