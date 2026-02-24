"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarCheck, PlusCircle, Star, MessageSquare } from "lucide-react";
import Link from "next/link";
import { getApiUrl } from "@/lib/api-client";

// Interfaces
interface Therapist {
  first_name: string;
  last_name: string;
}

interface Feedback {
  overall_experience: string;
  listened: string;
  helped: string;
  helpful_activities?: string;
  improvements?: string;
  safe_comfort: string;
  recommend: string;
  other_comments?: string;
}

interface Booking {
  id: number;
  date: string;
  start_time: string;
  end_time: string;
  therapist: Therapist;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  meeting_link?: string | null;
  feedback?: Feedback | null;
}

// Utility
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
  const [loading, setLoading] = useState(true);
  const [joiningBooking, setJoiningBooking] = useState<Booking | null>(null);
  const [feedbackBooking, setFeedbackBooking] = useState<Booking | null>(null);
  const [remainingTime, setRemainingTime] = useState<number | null>(null);
  const [joinError, setJoinError] = useState("");
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [submitting, setSubmitting] = useState(false);

  // ✅ Fetch bookings
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch(getApiUrl("/api/bookings"), {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setBookings(data.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // ✅ Countdown for join availability
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (remainingTime !== null && remainingTime > 0) {
      timer = setInterval(() => {
        setRemainingTime((prev) => (prev !== null ? prev - 1 : null));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [remainingTime]);

  // ✅ Join Now Logic
  const handleJoinClick = (booking: Booking) => {
    setJoinError("");
    setRemainingTime(null);
    setJoiningBooking(booking);
  };

  const confirmAttendance = async () => {
    if (!joiningBooking?.meeting_link) return;
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(
        getApiUrl(`/api/bookings/${joiningBooking.id}/can-join`),
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const result = await res.json();

      if (!result.success || !result.can_join) {
        setJoinError("Meeting has not started yet.");
        setRemainingTime(result.remaining_seconds || null);
        return;
      }

      await fetch(
        getApiUrl(`/api/bookings/${joiningBooking.id}/mark-attendance`),
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
    } catch {
      setJoinError("Error occurred while joining.");
    }
  };

  // ✅ Feedback Handling
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmitFeedback = async () => {
    if (!feedbackBooking) return;
    const token = localStorage.getItem("token");
    setError("");
    setSubmitting(true);

    try {
      const res = await fetch(
        getApiUrl(`/api/bookings/${feedbackBooking.id}/feedback`),
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const result = await res.json();

      if (!res.ok) {
        if (result.errors) {
          const msg = Object.entries(result.errors)
            .map(([k, v]) => `${k}: ${(v as string[]).join(", ")}`)
            .join("\n");
          setError(msg);
        } else {
          setError(result.message || "Failed to submit feedback");
        }
        setSubmitting(false);
        return;
      }

      setBookings((prev) =>
        prev.map((b) =>
          b.id === feedbackBooking.id ? { ...b, feedback: result.data } : b
        )
      );

      setFeedbackBooking(null);
      setFormData({});
    } catch {
      setError("Error submitting feedback.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="text-center py-10">Loading bookings...</p>;

  return (
    <div className="container mx-auto py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">My Bookings</h1>
        <Link href="/my-bookings/new">
          <Button className="flex items-center space-x-2">
            <PlusCircle className="h-4 w-4" />
            <span>New Booking</span>
          </Button>
        </Link>
      </div>

      {/* Bookings */}
      {bookings.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">No bookings found.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((booking) => (
            <Card key={booking.id} className="hover:shadow-md transition">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>
                    <CalendarCheck className="inline mr-2 text-green-500" />
                    {booking.date}
                  </span>
                  <span
                    className={`text-xs font-semibold ${
                      booking.status === "completed"
                        ? "text-green-600"
                        : booking.status === "confirmed"
                        ? "text-blue-500"
                        : booking.status === "cancelled"
                        ? "text-red-500"
                        : "text-gray-500"
                    }`}
                  >
                    {booking.status.toUpperCase()}
                  </span>
                </CardTitle>
              </CardHeader>

              <CardContent className="text-sm space-y-2">
                <p>
                  <strong>Time:</strong> {booking.start_time} - {booking.end_time}
                </p>
                <p>
                  <strong>Therapist:</strong>{" "}
                  {booking.therapist.first_name} {booking.therapist.last_name}
                </p>

                {/* ✅ Join Now Button */}
                {booking.status === "confirmed" && booking.meeting_link && (
                  <Button
                    className="mt-2 w-full"
                    variant="outline"
                    onClick={() => handleJoinClick(booking)}
                  >
                    Join Now
                  </Button>
                )}

                {/* ✅ Feedback */}
                {booking.status === "completed" && (
                  <>
                    {booking.feedback ? (
                      <div className="mt-2 text-gray-700 text-sm space-y-1 bg-gray-50 p-2 rounded-md">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <strong>Experience:</strong>{" "}
                          {booking.feedback.overall_experience}
                        </div>
                        <p>
                          <strong>Recommend:</strong>{" "}
                          {booking.feedback.recommend}
                        </p>
                        <p>
                          <strong>Comments:</strong>{" "}
                          {booking.feedback.other_comments || "—"}
                        </p>
                      </div>
                    ) : (
                      <Button
                        className="mt-3 w-full"
                        variant="secondary"
                        onClick={() => setFeedbackBooking(booking)}
                      >
                        <MessageSquare className="w-4 h-4 mr-2" /> Provide Feedback
                      </Button>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* ✅ Join Modal */}
      {joiningBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm">
            <h2 className="text-xl font-semibold mb-4 text-center">
              Confirm Attendance
            </h2>
            {joinError ? (
              <>
                <p className="text-red-500 text-sm mb-2 text-center">
                  {joinError}
                </p>
                {remainingTime !== null && (
                  <p className="text-sm text-gray-700 text-center mb-4">
                    You can join in {formatTime(remainingTime)}.
                  </p>
                )}
              </>
            ) : (
              <p className="mb-4 text-center text-gray-600">
                Please confirm your attendance before joining the session.
              </p>
            )}
            <div className="flex justify-center gap-2">
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

      {/* ✅ Feedback Modal */}
      {feedbackBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-xl p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-2 text-center">
              Therapy Feedback
            </h2>
            <p className="text-sm mb-4 text-gray-600 text-center">
              We appreciate your honest feedback to improve our service.
            </p>

            {error && (
              <div className="bg-red-100 text-red-700 p-2 rounded mb-2 whitespace-pre-wrap text-sm">
                {error}
              </div>
            )}

            <div className="space-y-3">
              {[ 
                { label: "Overall Experience", name: "overall_experience", options: ["excellent", "good", "okay", "poor"] },
                { label: "Did your wellbeing coach listen to you?", name: "listened", options: ["always", "often", "sometimes", "rarely"] },
                { label: "Did your wellbeing coach help you?", name: "helped", options: ["yes_a_lot", "yes_a_bit", "not_really", "not_at_all"] },
                { label: "Did you feel safe and comfortable?", name: "safe_comfort", options: ["always", "usually", "sometimes", "never"] },
                { label: "Would you recommend this therapist?", name: "recommend", options: ["yes", "no", "not_sure"] },
              ].map((field) => (
                <div key={field.name}>
                  <label className="font-medium text-sm">{field.label}</label>
                  <select
                    name={field.name}
                    className="border w-full p-2 rounded mt-1"
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select</option>
                    {field.options.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                      </option>
                    ))}
                  </select>
                </div>
              ))}

              <textarea
                name="helpful_activities"
                placeholder="Which activities or approaches were most helpful?"
                className="border rounded w-full p-2 text-sm"
                rows={2}
                onChange={handleChange}
              />
              <textarea
                name="improvements"
                placeholder="What would you like to see improved?"
                className="border rounded w-full p-2 text-sm"
                rows={2}
                onChange={handleChange}
              />
              <textarea
                name="other_comments"
                placeholder="Any other comments?"
                className="border rounded w-full p-2 text-sm"
                rows={2}
                onChange={handleChange}
              />
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setFeedbackBooking(null);
                  setFormData({});
                  setError("");
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleSubmitFeedback} disabled={submitting}>
                {submitting ? "Submitting..." : "Submit Feedback"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
