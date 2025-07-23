"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarCheck, PlusCircle } from "lucide-react";
import Link from "next/link";

interface Therapist {
  first_name: string;
  last_name: string;
}

interface Booking {
  id: number;
  date: string;
  start_time: string;
  end_time: string;
  therapist: Therapist;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  meeting_link?: string | null;
}

function formatTime(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return [
    hrs > 0 ? `${hrs}h` : null,
    mins > 0 ? `${mins}m` : null,
    `${secs}s`,
  ]
    .filter(Boolean)
    .join(" ");
}

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [joiningBooking, setJoiningBooking] = useState<Booking | null>(null);
  const [joinError, setJoinError] = useState<string>("");
  const [remainingTime, setRemainingTime] = useState<number | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bookings`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setBookings(data.data);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (remainingTime !== null && remainingTime > 0) {
      timer = setInterval(() => {
        setRemainingTime((prev) => (prev !== null ? prev - 1 : null));
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [remainingTime]);

  const handleJoinClick = (booking: Booking) => {
    setJoinError("");
    setRemainingTime(null);
    setJoiningBooking(booking);
  };

  const confirmAttendance = async () => {
    if (!joiningBooking?.meeting_link) return;

    const token = localStorage.getItem("token");

    try {
      // Check if user can join
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/bookings/${joiningBooking.id}/can-join`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const result = await res.json();

      if (!result.success || !result.can_join) {
        setJoinError("Meeting has not started yet.");
        setRemainingTime(result.remaining_seconds || null);
        return;
      }

      // Mark attendance
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/bookings/${joiningBooking.id}/mark-attendance`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      window.open(joiningBooking.meeting_link, "_blank");
      setJoiningBooking(null);
      setRemainingTime(null);
    } catch (err) {
      console.error("Join failed");
      setJoinError("An error occurred while trying to join.");
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">My Bookings</h1>
        <Link href="/my-bookings/new">
          <Button className="flex items-center space-x-2">
            <PlusCircle className="h-4 w-4" />
            <span>Create New Booking</span>
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bookings.map((booking) => (
          <Card key={booking.id} className="hover:shadow-md transition">
            <CardHeader className="flex items-center justify-between">
              <CardTitle className="text-lg">
                <CalendarCheck className="inline mr-2 text-green-500" />
                {booking.date}
              </CardTitle>
              <span
                className={`text-xs font-semibold ${
                  booking.status === "confirmed"
                    ? "text-blue-500"
                    : booking.status === "completed"
                    ? "text-green-500"
                    : booking.status === "cancelled"
                    ? "text-red-500"
                    : "text-yellow-500"
                }`}
              >
                {booking.status.charAt(0).toUpperCase() +
                  booking.status.slice(1)}
              </span>
            </CardHeader>

            <CardContent className="text-sm space-y-1">
              <p>
                <strong>Time:</strong> {booking.start_time} - {booking.end_time}
              </p>
              <p>
                <strong>Therapist:</strong>{" "}
                {booking.therapist?.first_name} {booking.therapist?.last_name}
              </p>

              {booking.status === "confirmed" ? (
                booking.meeting_link ? (
                  <Button
                    className="mt-2"
                    variant="outline"
                    onClick={() => handleJoinClick(booking)}
                  >
                    Join Meeting
                  </Button>
                ) : (
                  <p className="mt-2 text-gray-500">
                    Meeting link not added yet.
                  </p>
                )
              ) : (
                <p className="mt-2 text-gray-400">
                  Booking not confirmed yet.
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {bookings.length === 0 && (
        <p className="mt-10 text-center text-gray-500">No bookings found.</p>
      )}

      {joiningBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm">
            <h2 className="text-xl font-semibold mb-4">Confirm Attendance</h2>
            {joinError ? (
              <>
                <p className="text-red-500 text-sm mb-2">{joinError}</p>
                {remainingTime !== null && (
                  <p className="text-sm text-gray-700 mb-4">
                    You can join in {formatTime(remainingTime)}.
                  </p>
                )}
              </>
            ) : (
              <p className="mb-4">
                Please confirm your attendance before joining the session.
              </p>
            )}

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setJoiningBooking(null);
                  setJoinError("");
                  setRemainingTime(null);
                }}
              >
                Cancel
              </Button>
              <Button onClick={confirmAttendance}>Yes, Join Now</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
