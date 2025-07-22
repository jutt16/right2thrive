"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarCheck, PlusCircle } from "lucide-react";
import Link from "next/link";

interface Booking {
  id: number;
  date: string;
  time: string;
  therapist: string;
  status: "Upcoming" | "Completed" | "Cancelled" | "Pending";
}

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);

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
                  booking.status === "Upcoming"
                    ? "text-blue-500"
                    : booking.status === "Completed"
                    ? "text-green-500"
                    : booking.status === "Cancelled"
                    ? "text-red-500"
                    : "text-yellow-500"
                }`}
              >
                {booking.status}
              </span>
            </CardHeader>
            <CardContent className="text-sm space-y-1">
              <p>
                <strong>Time:</strong> {booking.time}
              </p>
              <p>
                <strong>Therapist:</strong> {booking.therapist}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {bookings.length === 0 && (
        <p className="mt-10 text-center text-gray-500">No bookings found.</p>
      )}
    </div>
  );
}
