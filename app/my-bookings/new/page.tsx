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

interface TherapistProfile {
  gender?: string | null;
  cultural_background?: string | null;
  telephone?: string | null;
  mobile?: string | null;
  address?: string | null;
  country?: string | null;
  qualifications?: string | null;
  experience?: string | null;
}

interface TherapistDetails {
  id: number;
  first_name?: string | null;
  last_name?: string | null;
  email?: string | null;
  profile?: TherapistProfile | null;
}

export default function NewBookingPage() {
  // therapist from localStorage (read-only)
  const [therapistId, setTherapistId] = useState<string>("");
  const [therapistDetails, setTherapistDetails] =
    useState<TherapistDetails | null>(null);
  const [loadingTherapist, setLoadingTherapist] = useState<boolean>(true);
  const [therapistError, setTherapistError] = useState<string>("");

  // availability + booking state
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

  // Read therapist from localStorage (therapist or auth.therapist)
  useEffect(() => {
    if (typeof window === "undefined") return;

    let stored: any = null;

    const tRaw = localStorage.getItem("therapist");
    if (tRaw) {
      try {
        stored = JSON.parse(tRaw);
      } catch {}
    }

    if (!stored) {
      const authRaw = localStorage.getItem("auth");
      if (authRaw) {
        try {
          const parsed = JSON.parse(authRaw);
          if (parsed?.therapist) stored = parsed.therapist;
        } catch {}
      }
    }

    if (stored?.id) {
      const idStr = String(stored.id);
      setTherapistId(idStr);
      fetchTherapistDetails(idStr);
      fetchAvailability(idStr);
    } else {
      setLoadingTherapist(false);
      setTherapistError(
        "No therapist found in your account. Please contact support."
      );
    }
  }, []);

  // fetch therapist details
  const fetchTherapistDetails = async (id: string) => {
    setLoadingTherapist(true);
    setTherapistError("");
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/therapists/${id}`
      );
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Failed to fetch therapist details.");
      }
      setTherapistDetails(json.data?.therapist ?? null);
    } catch (e) {
      setTherapistDetails(null);
      setTherapistError(
        e instanceof Error ? e.message : "Failed to load therapist details."
      );
    } finally {
      setLoadingTherapist(false);
    }
  };

  // fetch availability for therapist
  const fetchAvailability = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/therapist/${id}/availability`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      if (data?.success) {
        setAvailability(data.data || []);
      } else {
        setAvailability([]);
      }
      // reset selection when therapist changes/loads
      setSelectedDate("");
      setSelectedSlot(null);
      setSlotsForSelectedDate([]);
      setCustomStartTime("");
      setCustomEndTime("");
    } catch {
      setAvailability([]);
    }
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
    if (!therapistId) {
      alert("Therapist not set.");
      return;
    }

    const start_time = selectedSlot
      ? selectedSlot.start.slice(0, 5)
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
            therapist_id: therapistId,
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

  const therapistFullName =
    `${therapistDetails?.first_name ?? ""} ${
      therapistDetails?.last_name ?? ""
    }`.trim() || "—";

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Create New Booking</h1>

      {/* your wellbeing coach (read-only) */}
      <div className="mb-6">
        <label className="block font-medium mb-1">Your Wellbeing Coach</label>
        <Card>
          <CardHeader>
            <CardTitle>
              {loadingTherapist ? "Loading..." : therapistFullName}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            {therapistError && (
              <p className="text-red-600 mb-2">{therapistError}</p>
            )}
            {!loadingTherapist && therapistId && (
              <>
                <p>
                  <strong>Email:</strong> {therapistDetails?.email ?? "N/A"}
                </p>
                <p>
                  <strong>Gender:</strong>{" "}
                  {therapistDetails?.profile?.gender ?? "N/A"}
                </p>
                <p>
                  <strong>Cultural Background:</strong>{" "}
                  {therapistDetails?.profile?.cultural_background ?? "N/A"}
                </p>
                {therapistDetails?.profile?.telephone && (
                  <p>
                    <strong>Telephone:</strong>{" "}
                    {therapistDetails.profile.telephone}
                  </p>
                )}
                {therapistDetails?.profile?.mobile && (
                  <p>
                    <strong>Mobile:</strong> {therapistDetails.profile.mobile}
                  </p>
                )}
                {therapistDetails?.profile?.address && (
                  <p>
                    <strong>Address:</strong> {therapistDetails.profile.address}
                  </p>
                )}
                {therapistDetails?.profile?.country && (
                  <p>
                    <strong>Country:</strong> {therapistDetails.profile.country}
                  </p>
                )}
                {therapistDetails?.profile?.qualifications && (
                  <p>
                    <strong>Qualifications:</strong>{" "}
                    {therapistDetails.profile.qualifications}
                  </p>
                )}
                {therapistDetails?.profile?.experience && (
                  <p>
                    <strong>Experience:</strong>{" "}
                    {therapistDetails.profile.experience}
                  </p>
                )}
              </>
            )}
            {!loadingTherapist && !therapistId && (
              <p className="text-gray-700">
                No therapist is linked to your account. Booking is disabled.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Availability */}
      {therapistId && availability.length > 0 && (
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

      {/* Slots + custom time */}
      {therapistId && selectedDate && (
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
              !therapistId ||
              !selectedDate ||
              (!selectedSlot &&
                (!customStartTime || !customEndTime || !isCustomTimeValid()))
            }
          >
            <PlusCircle className="h-4 w-4" /> Confirm Booking
          </Button>
        </>
      )}

      {/* No availability */}
      {therapistId && availability.length === 0 && !loadingTherapist && (
        <p className="mt-4 text-sm text-gray-600">
          No availability found for your wellbeing coach.
        </p>
      )}
    </div>
  );
}
