"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Loader2, ArrowLeft, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  getPreSessionChecklist,
  submitPreSessionChecklist,
} from "@/lib/pre-session-checklist-api";

export default function PreSessionChecklistPage() {
  const router = useRouter();
  const [items, setItems] = useState<string[]>([]);
  const [upcomingBooking, setUpcomingBooking] = useState<{
    id: number;
    date: string;
    start_time: string;
  } | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!localStorage.getItem("token")) {
      router.replace("/auth/login");
      return;
    }
    getPreSessionChecklist()
      .then(({ items: i, upcoming_booking }) => {
        setItems(i);
        setUpcomingBooking(upcoming_booking ?? null);
      })
      .catch(() => setError("Failed to load checklist."))
      .finally(() => setLoading(false));
  }, [router]);

  const toggle = (item: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(item)) next.delete(item);
      else next.add(item);
      return next;
    });
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError("");
    const result = await submitPreSessionChecklist({
      booking_id: upcomingBooking?.id ?? undefined,
      items: Array.from(selected),
    });
    setSubmitting(false);
    if (result.success) {
      setSubmitted(true);
    } else {
      setError(result.message ?? "Failed to submit checklist.");
    }
  };

  if (typeof window !== "undefined" && !localStorage.getItem("token")) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Link
          href="/my-bookings"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#00990d] hover:text-[#007a0a] mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to My Bookings
        </Link>

        <Card className="border-slate-200/90 bg-white shadow-md">
          <CardHeader>
            <div className="flex items-center gap-2 text-[#00990d]">
              <ClipboardList className="h-5 w-5" />
              <CardTitle className="text-xl">Pre-session checklist</CardTitle>
            </div>
            <CardDescription>
              {upcomingBooking
                ? `Complete these before your session on ${upcomingBooking.date} at ${upcomingBooking.start_time}.`
                : "Complete these items before your next session when you have a booking."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-[#00990d]" />
              </div>
            ) : submitted ? (
              <div className="text-center py-6">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
                <p className="font-medium text-slate-900">Checklist submitted</p>
                <p className="text-sm text-slate-500 mt-1">
                  You&apos;re all set. We hope your session goes well.
                </p>
                <Button asChild className="mt-4" variant="outline">
                  <Link href="/my-bookings">Back to My Bookings</Link>
                </Button>
              </div>
            ) : items.length === 0 ? (
              <p className="text-slate-500 text-sm py-4">
                No checklist items are configured yet. Check back later or go to
                your booking.
              </p>
            ) : (
              <>
                {error && (
                  <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded">
                    {error}
                  </p>
                )}
                <div className="space-y-3">
                  {items.map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 rounded-lg border border-slate-100 p-3 hover:bg-slate-50/50"
                    >
                      <Checkbox
                        id={`item-${item}`}
                        checked={selected.has(item)}
                        onCheckedChange={() => toggle(item)}
                      />
                      <Label
                        htmlFor={`item-${item}`}
                        className="flex-1 cursor-pointer text-sm font-medium text-slate-800"
                      >
                        {item}
                      </Label>
                    </div>
                  ))}
                </div>
                <Button
                  className="w-full bg-[#00990d] hover:bg-[#008008] mt-4"
                  onClick={handleSubmit}
                  disabled={submitting || selected.size === 0}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit checklist"
                  )}
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
