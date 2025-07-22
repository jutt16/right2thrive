"use client";

import { useState, useEffect } from "react";
import { Calendar, Clock, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface Availability {
  date: string;
  slots: { start_time: string; end_time: string }[];
}

export default function NewBookingPage() {
  const [therapists, setTherapists] = useState([]);
  const [selectedTherapist, setSelectedTherapist] = useState("");
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [slotsForSelectedDate, setSlotsForSelectedDate] = useState<
    { start_time: string; end_time: string }[]
  >([]);
  const [selectedSlot, setSelectedSlot] = useState<{
    start: string;
    end: string;
  } | null>(null);
  const [customStartTime, setCustomStartTime] = useState("");
  const [customEndTime, setCustomEndTime] = useState("");

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/therapists`)
      .then((res) => res.json())
      .then((data) => setTherapists(data.data.therapists || []));
  }, []);

  const fetchAvailability = async (id: string) => {
    const token = localStorage.getItem("token");
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/therapist/${id}/availability`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await res.json();
    if (data.success) setAvailability(data.data);
  };

  const handleTherapistChange = (id: string) => {
    setSelectedTherapist(id);
    setAvailability([]);
    setSelectedDate("");
    setSelectedSlot(null);
    setSlotsForSelectedDate([]);
    setCustomStartTime("");
    setCustomEndTime("");
    fetchAvailability(id);
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSelectedSlot(null);
    setCustomStartTime("");
    setCustomEndTime("");
    const found = availability.find((a) => a.date === date);
    setSlotsForSelectedDate(found?.slots || []);
  };

  const isCustomTimeValid = (): boolean => {
    if (!customStartTime || !customEndTime) return false;
    const startMinutes =
      parseInt(customStartTime.split(":")[0]) * 60 +
      parseInt(customStartTime.split(":")[1]);
    const endMinutes =
      parseInt(customEndTime.split(":")[0]) * 60 +
      parseInt(customEndTime.split(":")[1]);
    if (startMinutes >= endMinutes) return false;

    return slotsForSelectedDate.some((slot) => {
      const slotStart =
        parseInt(slot.start_time.split(":")[0]) * 60 +
        parseInt(slot.start_time.split(":")[1]);
      const slotEnd =
        parseInt(slot.end_time.split(":")[0]) * 60 +
        parseInt(slot.end_time.split(":")[1]);
      return startMinutes >= slotStart && endMinutes <= slotEnd;
    });
  };

  const handleBooking = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You need to login first.");
      return;
    }

    const start_time = selectedSlot
      ? selectedSlot.start.slice(0, 5) // Ensure H:i format
      : customStartTime.slice(0, 5);

    const end_time = selectedSlot
      ? selectedSlot.end.slice(0, 5)
      : customEndTime.slice(0, 5);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/bookings`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            therapist_id: selectedTherapist,
            date: selectedDate,
            start_time,
            end_time,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to create booking.");
      }

      alert("Booking created successfully!");
      setSelectedDate("");
      setSelectedSlot(null);
      setCustomStartTime("");
      setCustomEndTime("");
    } catch (error: any) {
      alert(error.message || "Booking failed.");
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Create New Booking</h1>

      <div className="mb-4">
        <label className="block font-medium mb-1">Select Therapist</label>
        <select
          className="w-full border px-4 py-2 rounded"
          value={selectedTherapist}
          onChange={(e) => handleTherapistChange(e.target.value)}
        >
          <option value="">-- Select --</option>
          {therapists.map((t: any) => (
            <option key={t.id} value={t.id}>
              {t.name} - {t.cultural_background}
            </option>
          ))}
        </select>
      </div>

      {availability.length > 0 && (
        <>
          <h2 className="text-lg font-semibold mt-6 mb-2">Available Dates</h2>
          <div className="flex flex-wrap gap-3">
            {availability.map((a) => (
              <Button
                key={a.date}
                variant={selectedDate === a.date ? "default" : "outline"}
                onClick={() => handleDateSelect(a.date)}
              >
                <Calendar className="h-4 w-4 mr-2 text-green-500" />
                {a.date}
              </Button>
            ))}
          </div>
        </>
      )}

      {selectedDate && (
        <>
          <h3 className="text-md font-medium mt-8 mb-2">
            Available Slots on {selectedDate}
          </h3>
          <div className="flex flex-wrap gap-3 mb-4">
            {slotsForSelectedDate.map((s, idx) => (
              <Button
                key={idx}
                variant={
                  selectedSlot?.start === s.start_time ? "default" : "outline"
                }
                onClick={() => {
                  setSelectedSlot({ start: s.start_time, end: s.end_time });
                  setCustomStartTime("");
                  setCustomEndTime("");
                }}
              >
                <Clock className="mr-2 h-4 w-4" />
                {s.start_time} - {s.end_time}
              </Button>
            ))}
          </div>

          <h3 className="text-md font-medium mb-2">
            Or specify your own time:
          </h3>
          <div className="flex items-center gap-4 mb-4">
            <Input
              type="time"
              value={customStartTime}
              onChange={(e) => {
                setCustomStartTime(e.target.value);
                setSelectedSlot(null);
              }}
              className="w-40"
              placeholder="Start Time"
            />
            <span className="font-medium">to</span>
            <Input
              type="time"
              value={customEndTime}
              onChange={(e) => {
                setCustomEndTime(e.target.value);
                setSelectedSlot(null);
              }}
              className="w-40"
              placeholder="End Time"
            />
          </div>

          {customStartTime && customEndTime && (
            <Card
              className={`border ${
                isCustomTimeValid() ? "border-green-500" : "border-red-500"
              }`}
            >
              <CardHeader>
                <CardTitle>Custom Time</CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                {customStartTime} - {customEndTime}
                {!isCustomTimeValid() && (
                  <p className="text-red-500 text-xs mt-1">
                    Custom time must be within an available slot.
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          <Button
            className="mt-6 flex items-center gap-2 bg-green-600 hover:bg-green-700"
            onClick={handleBooking}
            disabled={
              !selectedTherapist ||
              !selectedDate ||
              (!selectedSlot &&
                (!customStartTime || !customEndTime || !isCustomTimeValid()))
            }
          >
            <PlusCircle className="h-4 w-4" /> Confirm Booking
          </Button>
        </>
      )}
    </div>
  );
}
