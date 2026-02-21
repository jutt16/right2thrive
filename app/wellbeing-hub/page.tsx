"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Activity,
  FileText,
  Calendar,
  Clock,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
} from "lucide-react";
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart as RechartsBarChart,
  Bar,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";
import { useRouter } from "next/navigation";

interface AssessmentAnswer {
  question_id: number;
  question_text: string;
  answer_value: number;
  answer_text: string;
}

interface Assessment {
  id: number;
  user_id: number;
  therapist_id?: number | null;
  total_score: number;
  severity_level?: string;
  answers?: AssessmentAnswer[];
  created_at: string;
  therapist?: {
    id: number;
    first_name: string;
    last_name: string;
  };
  flagged?: boolean;
  worst_event?: string;
  responses?: number[];
}

interface SdqAssessment {
  id: number;
  user_id: number;
  questionnaire_id: number;
  completed_at: string;
  created_at: string;
  updated_at: string;
  questionnaire?: {
    id: number;
    title: string;
    description: string;
  };
  responses?: Array<{
    id: number;
    question_id: number;
    choice_id?: number;
    text_response?: string;
    question?: {
      id: number;
      text: string;
      type: string;
    };
    choice?: {
      id: number;
      label: string;
      value: number;
    };
  }>;
}

interface RiskAssessment {
  id: string;
  patient_id: number;
  therapist_id?: number | null;
  score: number;
  risk_level: "low" | "moderate" | "high" | "critical";
  is_acknowledged: boolean;
  created_at: string;
  updated_at: string;
  therapist?: {
    id: number;
    first_name: string;
    last_name: string;
  };
}

interface SessionNote {
  id: number;
  patient_id: number;
  therapist_id: number;
  notes: string;
  date: string;
  created_at: string;
  therapist?: {
    id: number;
    first_name: string;
    last_name: string;
  };
}

interface Medication {
  id: number;
  condition: string;
  medications: string;
  notes: string;
  last_updated: string;
  patient: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  };
  therapist: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  };
}

type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled";

interface Booking {
  id: number;
  date: string;
  start_time: string;
  end_time: string;
  status: BookingStatus;
  meeting_link?: string | null;
  therapist?: {
    first_name?: string;
    last_name?: string;
  };
}

const QUICK_CHECK_IN_OPTIONS = [
  { value: "great", emoji: "??", label: "Great" },
  { value: "okay", emoji: "??", label: "Okay" },
  { value: "down", emoji: "??", label: "Down" },
  { value: "anxious", emoji: "??", label: "Anxious" },
  { value: "frustrated", emoji: "??", label: "Frustrated" },
] as const;

export default function WellbeingHub() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("user");
      if (token && user) {
        const parsedUser = JSON.parse(user);
        // Check if email is verified
        if (!parsedUser.is_email_verified) {
          localStorage.setItem("pendingVerificationEmail", parsedUser.email);
          router.push(`/auth/verify-email?email=${encodeURIComponent(parsedUser.email)}`);
          return;
        }
        setIsAuthenticated(true);
        setUserData(parsedUser);
      } else {
        router.push("/auth/login");
      }
    }
  }, [router]);

  if (!isAuthenticated) return null;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <WellbeingHubContent userData={userData} />
    </Suspense>
  );
}

function WellbeingHubContent({ userData }: { userData: any }) {
  const searchParams = useSearchParams();
  const [medications, setMedications] = useState<Medication[]>([]);
  const [upcomingBooking, setUpcomingBooking] = useState<Booking | null>(null);
  const [isLoadingBookings, setIsLoadingBookings] = useState(true);
  const [activeTab, setActiveTab] = useState(
    searchParams.get("tab") || "dashboard"
  );

  const [selectedAssessment, setSelectedAssessment] =
    useState<Assessment | null>(null);
  const [selectedSdqAssessment, setSelectedSdqAssessment] =
    useState<SdqAssessment | null>(null);
  const [sdqDetailsLoading, setSdqDetailsLoading] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const [gad7Assessments, setGad7Assessments] = useState<Assessment[]>([]);
  const [phq9Assessments, setPhq9Assessments] = useState<Assessment[]>([]);
  const [sessionNotes, setSessionNotes] = useState<SessionNote[]>([]);
  const [pcl5Assessments, setPcl5Assessments] = useState<Assessment[]>([]);
  const [sdqAssessments, setSdqAssessments] = useState<SdqAssessment[]>([]);
  const [riskAssessments, setRiskAssessments] = useState<RiskAssessment[]>([]);

  const recentActivities = [
    ...gad7Assessments.map((a) => ({
      id: `gad7-${a.id}`,
      type: "GAD-7",
      score: a.total_score,
      max: 21,
      severity: a.severity_level,
      date: new Date(a.created_at),
    })),
    ...phq9Assessments.map((a) => ({
      id: `phq9-${a.id}`,
      type: "PHQ-9",
      score: a.total_score,
      max: 27,
      severity: a.severity_level,
      date: new Date(a.created_at),
    })),
    ...pcl5Assessments.map((a) => ({
      id: `pcl5-${a.id}`,
      type: "PCL-5",
      score: a.total_score,
      max: 80,
      severity: a.severity_level,
      date: new Date(a.created_at),
    })),
    ...riskAssessments.map((a) => ({
      id: `risk-${a.id}`,
      type: "Risk",
      score: a.score,
      max: null,
      severity: a.risk_level,
      date: new Date(a.created_at),
    })),
  ]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 5);

  const getRelativeTimeString = (date: Date) => {
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    return `${diffInDays} days ago`;
  };

  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const [quickCheckInSelection, setQuickCheckInSelection] = useState<string | null>(null);
  const [showCheckInConfirmation, setShowCheckInConfirmation] = useState(false);

  const parseBookingDateTime = (date?: string, time?: string) => {
    if (!date || !time) return null;
    const trimmedTime = time.trim();
    if (!trimmedTime) return null;

    let normalizedTime = trimmedTime;

    if (/^\d{1,2}:\d{2}$/.test(trimmedTime)) {
      const [hours, minutes] = trimmedTime.split(":");
      normalizedTime = `${hours.padStart(2, "0")}:${minutes}:00`;
    } else if (/^\d{1,2}:\d{2}:\d{2}$/.test(trimmedTime)) {
      const [hours, minutes, seconds] = trimmedTime.split(":");
      normalizedTime = `${hours.padStart(2, "0")}:${minutes}:${seconds}`;
    }

    const isoCandidate = `${date}T${normalizedTime}`;
    let parsed = new Date(isoCandidate);

    if (Number.isNaN(parsed.getTime())) {
      parsed = new Date(`${date} ${trimmedTime}`);
    }

    return Number.isNaN(parsed.getTime()) ? null : parsed;
  };

  const findUpcomingBookingWithinWeek = (items: Booking[]) => {
    const now = new Date();
    const weekAhead = new Date(now);
    weekAhead.setDate(now.getDate() + 7);

    const nextBooking = items
      .map((booking) => {
        const start = parseBookingDateTime(booking.date, booking.start_time);
        return { booking, start };
      })
      .filter(({ start, booking }) => {
        if (!start) return false;
        if (booking.status === "cancelled" || booking.status === "completed") {
          return false;
        }
        return start >= now && start <= weekAhead;
      })
      .sort((a, b) => a.start!.getTime() - b.start!.getTime())[0];

    return nextBooking?.booking ?? null;
  };

  const formatSessionReminder = (booking: Booking) => {
    const start = parseBookingDateTime(booking.date, booking.start_time);
    const therapistName =
      booking.therapist?.first_name?.trim() ||
      booking.therapist?.last_name?.trim() ||
      "your wellbeing coach";

    if (!start) {
      return `Your session with ${therapistName} is coming up soon. Complete these check-ins before your session for the best experience.`;
    }

    const today = new Date();
    const startOfToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const startOfSessionDay = new Date(
      start.getFullYear(),
      start.getMonth(),
      start.getDate()
    );
    const diffDays = Math.round(
      (startOfSessionDay.getTime() - startOfToday.getTime()) / (1000 * 60 * 60 * 24)
    );

    let dayDescriptor: string;
    if (diffDays === 0) {
      dayDescriptor = "today";
    } else if (diffDays === 1) {
      dayDescriptor = "tomorrow";
    } else {
      dayDescriptor = `on ${new Intl.DateTimeFormat("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "long",
      }).format(start)}`;
    }

    const timeLabelRaw = new Intl.DateTimeFormat("en-GB", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(start);
    const timeLabel = timeLabelRaw.replace("am", "AM").replace("pm", "PM");

    return `Your session with ${therapistName} is ${dayDescriptor} at ${timeLabel}. Complete these check-ins before your session for the best experience.`;
  };

  const handleQuickCheckIn = (
    value: (typeof QUICK_CHECK_IN_OPTIONS)[number]["value"]
  ) => {
    setQuickCheckInSelection(value);
    setShowCheckInConfirmation(true);
  };

  useEffect(() => setIsClient(true), []);

  // Fetch full SDQ assessment with responses when opening details (list may omit response data)
  useEffect(() => {
    if (!selectedSdqAssessment || !isClient) return;
    const hasResponses =
      selectedSdqAssessment.responses &&
      selectedSdqAssessment.responses.length > 0 &&
      selectedSdqAssessment.responses.some(
        (r) => r.question?.text || r.choice?.label || (r.text_response != null && r.text_response !== "")
      );
    if (hasResponses) return;

    let cancelled = false;
    setSdqDetailsLoading(true);
    const token = localStorage.getItem("token");
    if (!token) {
      setSdqDetailsLoading(false);
      return;
    }

    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/sdq/assessments/${selectedSdqAssessment.id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
      .then((res) => (res.ok ? res.json() : null))
      .then((raw: any) => {
        if (cancelled) return;
        const data = raw?.data ?? raw;
        const responses = data?.responses;
        if (responses && Array.isArray(responses) && responses.length > 0) {
          setSelectedSdqAssessment((prev) =>
            prev ? { ...prev, responses } : null
          );
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setSdqDetailsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [selectedSdqAssessment?.id, isClient]);

  useEffect(() => {
    if (isClient) {
      fetchAssessments();
      fetchSessionNotes();
      fetchMedications();
    }
  }, [isClient]);

  useEffect(() => {
    if (isClient) {
      const newUrl = `${window.location.pathname}?tab=${activeTab}`;
      window.history.pushState({}, "", newUrl);
    }
  }, [activeTab, isClient]);
  useEffect(() => {
    if (!isClient) return;

    let isMounted = true;

    const fetchBookings = async () => {
      setIsLoadingBookings(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          if (isMounted) {
            setUpcomingBooking(null);
          }
          return;
        }

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/bookings`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!isMounted) return;

        let data: any = null;
        try {
          data = await res.json();
        } catch {
          data = null;
        }

        if (
          res.ok &&
          data?.success &&
          Array.isArray(data.data)
        ) {
          const upcoming = findUpcomingBookingWithinWeek(data.data);
          setUpcomingBooking(upcoming);
        } else {
          setUpcomingBooking(null);
        }
      } catch (error) {
        if (isMounted) {
          console.error("Error fetching bookings:", error);
          setUpcomingBooking(null);
        }
      } finally {
        if (isMounted) {
          setIsLoadingBookings(false);
        }
      }
    };

    fetchBookings();

    return () => {
      isMounted = false;
    };
  }, [isClient]);

  const userFirstName =
    (typeof userData?.first_name === "string" && userData.first_name.trim().length > 0
      ? userData.first_name.trim()
      : typeof userData?.name === "string" && userData.name.trim().length > 0
        ? userData.name.trim().split(" ")[0]
        : "there");

  const sessionReminderMessage =
    !isLoadingBookings && upcomingBooking
      ? formatSessionReminder(upcomingBooking)
      : null;

  const gad7ChartData =
    gad7Assessments.length > 0
      ? gad7Assessments
        .slice()
        .sort(
          (a, b) =>
            new Date(a.created_at).getTime() -
            new Date(b.created_at).getTime()
        )
        .map((assessment) => ({
          date: new Date(assessment.created_at).toLocaleDateString(
            "en-GB",
            {
              day: "numeric",
              month: "short",
            }
          ),
          score: assessment.total_score,
        }))
      : [];

  const phq9ChartData =
    phq9Assessments.length > 0
      ? phq9Assessments
        .slice()
        .sort(
          (a, b) =>
            new Date(a.created_at).getTime() -
            new Date(b.created_at).getTime()
        )
        .map((assessment) => ({
          date: new Date(assessment.created_at).toLocaleDateString(
            "en-GB",
            {
              day: "numeric",
              month: "short",
            }
          ),
          score: assessment.total_score,
        }))
      : [];

  const latestGad7 =
    gad7Assessments.length > 0
      ? gad7Assessments
        .slice()
        .sort(
          (a, b) =>
            new Date(b.created_at).getTime() -
            new Date(a.created_at).getTime()
        )[0]
      : null;

  const latestPhq9 =
    phq9Assessments.length > 0
      ? phq9Assessments
        .slice()
        .sort(
          (a, b) =>
            new Date(b.created_at).getTime() -
            new Date(a.created_at).getTime()
        )[0]
      : null;

  // Chart data for PCL-5
  const pcl5ChartData =
    pcl5Assessments.length > 0
      ? pcl5Assessments
        .slice()
        .sort(
          (a, b) =>
            new Date(a.created_at).getTime() -
            new Date(b.created_at).getTime()
        )
        .map((assessment) => ({
          date: new Date(assessment.created_at).toLocaleDateString(
            "en-GB",
            {
              day: "numeric",
              month: "short",
            }
          ),
          score: assessment.total_score || 0,
        }))
      : [];

  // Chart data for Risk Assessments
  const riskChartData =
    riskAssessments.length > 0
      ? riskAssessments
        .slice()
        .sort(
          (a, b) =>
            new Date(a.created_at).getTime() -
            new Date(b.created_at).getTime()
        )
        .map((assessment) => ({
          date: new Date(assessment.created_at).toLocaleDateString(
            "en-GB",
            {
              day: "numeric",
              month: "short",
            }
          ),
          score: assessment.score,
          riskLevel: assessment.risk_level,
        }))
      : [];

  // Chart data for SDQ (using completion date)
  const sdqChartData =
    sdqAssessments.length > 0
      ? sdqAssessments
        .slice()
        .sort(
          (a, b) =>
            new Date(a.completed_at || a.created_at).getTime() -
            new Date(b.completed_at || b.created_at).getTime()
        )
        .map((assessment, index) => ({
          date: new Date(assessment.completed_at || assessment.created_at).toLocaleDateString(
            "en-GB",
            {
              day: "numeric",
              month: "short",
            }
          ),
          assessmentNumber: index + 1,
        }))
      : [];

  // Latest assessments
  const latestPcl5 =
    pcl5Assessments.length > 0
      ? pcl5Assessments
        .slice()
        .sort(
          (a, b) =>
            new Date(b.created_at).getTime() -
            new Date(a.created_at).getTime()
        )[0]
      : null;

  const latestRisk =
    riskAssessments.length > 0
      ? riskAssessments
        .slice()
        .sort(
          (a, b) =>
            new Date(b.created_at).getTime() -
            new Date(a.created_at).getTime()
        )[0]
      : null;

  const latestSdq =
    sdqAssessments.length > 0
      ? sdqAssessments
        .slice()
        .sort(
          (a, b) =>
            new Date(b.completed_at || b.created_at).getTime() -
            new Date(a.completed_at || a.created_at).getTime()
        )[0]
      : null;

  // Improvement calculation functions
  const calculateImprovement = (
    assessments: Array<{ total_score?: number; score?: number; created_at: string }>,
    isLowerBetter: boolean = true
  ): { percentage: number; trend: "improving" | "declining" | "stable" } => {
    if (assessments.length < 2) {
      return { percentage: 0, trend: "stable" };
    }

    const sorted = assessments
      .slice()
      .sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );

    const first = sorted[0];
    const last = sorted[sorted.length - 1];
    const firstScore = first.total_score ?? first.score ?? 0;
    const lastScore = last.total_score ?? last.score ?? 0;

    if (firstScore === 0) {
      return { percentage: 0, trend: "stable" };
    }

    const change = lastScore - firstScore;
    const percentage = Math.abs((change / firstScore) * 100);

    if (isLowerBetter) {
      // Lower scores are better (anxiety, depression, PTSD)
      if (change < 0) {
        return { percentage, trend: "improving" };
      } else if (change > 0) {
        return { percentage, trend: "declining" };
      }
    } else {
      // Higher scores are better (some assessments)
      if (change > 0) {
        return { percentage, trend: "improving" };
      } else if (change < 0) {
        return { percentage, trend: "declining" };
      }
    }

    return { percentage: 0, trend: "stable" };
  };

  const gad7Improvement = calculateImprovement(gad7Assessments, true);
  const phq9Improvement = calculateImprovement(phq9Assessments, true);
  const pcl5Improvement = calculateImprovement(pcl5Assessments, true);
  const riskImprovement = calculateImprovement(riskAssessments, true);

  // --- Fetch all assessments including PCL-5, SDQ, and Risk ---
  const fetchAssessments = async () => {
    if (!isClient) return;
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const [gad7Res, phq9Res, pcl5Res, sdqRes, riskRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/assessments/gad7`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/assessments/phq9`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/pcl5/assessments`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/sdq/assessments`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/patient/risk-assessments`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const [gad7Data, phq9Data, pcl5Data, sdqData, riskData] = await Promise.all([
        gad7Res.json().catch(() => ({ success: false })),
        phq9Res.json().catch(() => ({ success: false })),
        pcl5Res.json().catch(() => ({ success: false })),
        sdqRes.json().catch(() => ({ success: false })),
        riskRes.json().catch(() => ({ success: false })),
      ]);

      // Normalise different possible response shapes:
      // - Direct array: [...]
      // - { success: true, assessments: [...] }
      // - { success: true, data: [...]} or { success: true, data: { assessments: [...] } }
      const normaliseAssessments = (raw: any): any[] => {
        if (!raw) return [];
        if (Array.isArray(raw)) return raw;

        const ok = raw.success === true || raw.status === true;
        if (!ok) return [];

        if (Array.isArray(raw.assessments)) return raw.assessments;
        if (Array.isArray(raw.data?.assessments)) return raw.data.assessments;
        if (Array.isArray(raw.data)) return raw.data;
        return [];
      };

      const gad7List = normaliseAssessments(gad7Data);
      const phq9List = normaliseAssessments(phq9Data);
      const pcl5List = normaliseAssessments(pcl5Data);
      const sdqList = normaliseAssessments(sdqData);
      const riskList = normaliseAssessments(riskData);

      setGad7Assessments(gad7List as Assessment[]);
      setPhq9Assessments(phq9List as Assessment[]);
      setPcl5Assessments(pcl5List as Assessment[]);
      setSdqAssessments(sdqList as SdqAssessment[]);
      setRiskAssessments(riskList as RiskAssessment[]);

      if (process.env.NODE_ENV !== "production") {
        console.log("Assessments fetched", {
          gad7Count: gad7List.length,
          phq9Count: phq9List.length,
          pcl5Count: pcl5List.length,
          sdqCount: sdqList.length,
          riskCount: riskList.length,
        });
      }
    } catch (err) {
      console.error("Error fetching assessments:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // const fetchAssessments = async () => {
  //   if (!isClient) return;
  //   setIsLoading(true);

  //   try {
  //     const token = localStorage.getItem("token");
  //     if (!token) return;

  //     const [gad7Res, phq9Res] = await Promise.all([
  //       fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/assessments/gad7`, {
  //         headers: { Authorization: `Bearer ${token}` },
  //       }),
  //       fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/assessments/phq9`, {
  //         headers: { Authorization: `Bearer ${token}` },
  //       }),
  //     ]);

  //     const [gad7Data, phq9Data] = await Promise.all([
  //       gad7Res.json(),
  //       phq9Res.json(),
  //     ]);

  //     if (gad7Data.success) setGad7Assessments(gad7Data.assessments);
  //     if (phq9Data.success) setPhq9Assessments(phq9Data.assessments);
  //   } catch (err) {
  //     console.error("Error fetching assessments:", err);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const fetchSessionNotes = async () => {
    if (!isClient) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/session-notes`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();
      if (data.status) setSessionNotes(data.session_notes);
    } catch (err) {
      console.error("Error fetching session notes:", err);
    }
  };

  const fetchMedications = async () => {
    if (!isClient) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/medications`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();
      if (data.status === "success") {
        setMedications(data.data);
      }
    } catch (err) {
      console.error("Error fetching medications:", err);
    }
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  const handleTakeAssessment = (path: string) => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    if (token && user) router.push(path);
    else router.push("/auth/login");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Tabs
        defaultValue={activeTab}
        className="space-y-4"
        onValueChange={setActiveTab}
      >
        <TabsList className="flex w-full overflow-x-auto pb-2 gap-2 md:grid md:grid-cols-5">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="assessments">Assessments</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="session-notes">Session Notes</TabsTrigger>
          <TabsTrigger value="medications">Medications</TabsTrigger>
          <TabsTrigger value="wellbeing-update">Wellbeing</TabsTrigger>
        </TabsList>

        {/* Session Notes Tab */}
        <TabsContent value="session-notes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Session Notes</CardTitle>
              <CardDescription>Notes shared by your wellbeing coach</CardDescription>
            </CardHeader>
            <CardContent>
              {sessionNotes.length === 0 ? (
                <p className="text-center text-gray-500">
                  No session notes available
                </p>
              ) : (
                <div className="rounded-md border">
                  <div className="grid grid-cols-3 gap-4 bg-muted p-4 font-medium">
                    <div>Date</div>
                    <div>Therapist</div>
                    <div>Notes</div>
                  </div>
                  <div className="divide-y">
                    {sessionNotes.map((note) => (
                      <div key={note.id} className="grid grid-cols-3 gap-4 p-4">
                        {/* Date */}
                        <div>{formatDate(note.date || note.created_at)}</div>

                        {/* Therapist name */}
                        <div>
                          {note.therapist
                            ? `${note.therapist.first_name} ${note.therapist.last_name}`
                            : "Unknown Therapist"}
                        </div>

                        {/* Notes */}
                        <div>{note.notes}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="medications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Medications</CardTitle>
              <CardDescription>Your recorded medical history</CardDescription>
            </CardHeader>
            <CardContent>
              {medications.length === 0 ? (
                <p className="text-center text-gray-500">
                  No medical history added yet
                </p>
              ) : (
                <div className="rounded-md border">
                  <div className="grid grid-cols-4 gap-4 bg-muted p-4 font-medium">
                    <div>Date</div>
                    <div>Condition</div>
                    <div>Medications</div>
                    <div>Therapist</div>
                  </div>
                  <div className="divide-y">
                    {medications.map((med) => (
                      <div key={med.id} className="grid grid-cols-4 gap-4 p-4">
                        <div>{formatDate(med.last_updated)}</div>
                        <div>{med.condition}</div>
                        <div>{med.medications || ""}</div>
                        <div>
                          {med.therapist
                            ? `${med.therapist.first_name} ${med.therapist.last_name}`
                            : "Unknown"}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Keep your existing Dashboard, Assessments, Resources, Wellbeing tabs here... */}
        <TabsContent value="dashboard" className="space-y-6">
          <div className="rounded-2xl bg-gradient-to-r from-cyan-600 via-teal-500 to-emerald-500 p-6 text-white shadow-lg">
            <p className="text-sm font-medium uppercase tracking-wide text-white/80">
              Welcome back
            </p>
            <h2 className="mt-1 text-2xl font-semibold sm:text-3xl">
              Hello {userFirstName}! ??
            </h2>
            {isLoadingBookings ? (
              <p className="mt-3 text-sm text-white/85">
                Checking for your upcoming sessions...
              </p>
            ) : sessionReminderMessage ? (
              <p className="mt-3 text-base text-white/90">
                {sessionReminderMessage}
              </p>
            ) : (
              <p className="mt-3 text-sm text-white/80">
                Take a moment to complete a quick check-in below.
              </p>
            )}
          </div>

          <Card className="border border-cyan-100 shadow-sm">
            <CardHeader>
              <CardTitle>Quick Check-In: How are you feeling today?</CardTitle>
              <CardDescription>
                Takes 30 seconds and helps Raveen prepare for your session
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                {QUICK_CHECK_IN_OPTIONS.map((option) => {
                  const isSelected = quickCheckInSelection === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleQuickCheckIn(option.value)}
                      className={`flex h-full flex-col items-center justify-center gap-2 rounded-xl border p-4 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-2 ${isSelected
                        ? "border-teal-500 bg-teal-50 text-teal-700 shadow-sm focus:ring-teal-500 focus:ring-offset-white"
                        : "border-gray-200 text-gray-700 hover:border-teal-400 hover:bg-teal-50 focus:ring-teal-400 focus:ring-offset-white"
                        }`}
                      aria-pressed={isSelected}
                    >
                      <span className="text-3xl">{option.emoji}</span>
                      <span>{option.label}</span>
                    </button>
                  );
                })}
              </div>
            </CardContent>
            {showCheckInConfirmation && quickCheckInSelection && (
              <CardFooter className="border-t border-gray-100 pt-4">
                <p className="text-sm font-medium text-emerald-600">
                  Thanks for checking in! This helps us support you better.
                </p>
              </CardFooter>
            )}
          </Card>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Latest GAD-7 Score
                </CardTitle>
                <Activity className="h-4 w-4 text-teal-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {latestGad7 ? `${latestGad7.total_score}/21` : "-"}
                </div>
                <p className="text-xs text-muted-foreground">
                  {latestGad7 ? latestGad7.severity_level : "No assessments yet"}
                </p>
                {gad7Improvement.trend !== "stable" && gad7Assessments.length >= 2 && (
                  <div className="mt-2 flex items-center gap-1 text-xs">
                    {gad7Improvement.trend === "improving" ? (
                      <>
                        <TrendingDown className="h-3 w-3 text-green-600" />
                        <span className="text-green-600">
                          {gad7Improvement.percentage.toFixed(0)}% improvement
                        </span>
                      </>
                    ) : (
                      <>
                        <TrendingUp className="h-3 w-3 text-red-600" />
                        <span className="text-red-600">
                          {gad7Improvement.percentage.toFixed(0)}% increase
                        </span>
                      </>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Latest PHQ-9 Score
                </CardTitle>
                <Activity className="h-4 w-4 text-teal-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {latestPhq9 ? `${latestPhq9.total_score}/27` : "-"}
                </div>
                <p className="text-xs text-muted-foreground">
                  {latestPhq9
                    ? latestPhq9.severity_level
                    : "No assessments yet"}
                </p>
                {phq9Improvement.trend !== "stable" && phq9Assessments.length >= 2 && (
                  <div className="mt-2 flex items-center gap-1 text-xs">
                    {phq9Improvement.trend === "improving" ? (
                      <>
                        <TrendingDown className="h-3 w-3 text-green-600" />
                        <span className="text-green-600">
                          {phq9Improvement.percentage.toFixed(0)}% improvement
                        </span>
                      </>
                    ) : (
                      <>
                        <TrendingUp className="h-3 w-3 text-red-600" />
                        <span className="text-red-600">
                          {phq9Improvement.percentage.toFixed(0)}% increase
                        </span>
                      </>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Latest PCL-5 Score
                </CardTitle>
                <Activity className="h-4 w-4 text-teal-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {latestPcl5 ? `${latestPcl5.total_score || 0}/80` : "-"}
                </div>
                <p className="text-xs text-muted-foreground">
                  {latestPcl5
                    ? latestPcl5.flagged
                      ? "Flagged"
                      : "Not flagged"
                    : "No assessments yet"}
                </p>
                {pcl5Improvement.trend !== "stable" && pcl5Assessments.length >= 2 && (
                  <div className="mt-2 flex items-center gap-1 text-xs">
                    {pcl5Improvement.trend === "improving" ? (
                      <>
                        <TrendingDown className="h-3 w-3 text-green-600" />
                        <span className="text-green-600">
                          {pcl5Improvement.percentage.toFixed(0)}% improvement
                        </span>
                      </>
                    ) : (
                      <>
                        <TrendingUp className="h-3 w-3 text-red-600" />
                        <span className="text-red-600">
                          {pcl5Improvement.percentage.toFixed(0)}% increase
                        </span>
                      </>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Latest Risk Level
                </CardTitle>
                <AlertTriangle className="h-4 w-4 text-teal-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold capitalize">
                  {latestRisk ? latestRisk.risk_level : "-"}
                </div>
                <p className="text-xs text-muted-foreground">
                  {latestRisk
                    ? `Score: ${latestRisk.score}`
                    : "No assessments yet"}
                </p>
                {riskImprovement.trend !== "stable" && riskAssessments.length >= 2 && (
                  <div className="mt-2 flex items-center gap-1 text-xs">
                    {riskImprovement.trend === "improving" ? (
                      <>
                        <TrendingDown className="h-3 w-3 text-green-600" />
                        <span className="text-green-600">
                          {riskImprovement.percentage.toFixed(0)}% improvement
                        </span>
                      </>
                    ) : (
                      <>
                        <TrendingUp className="h-3 w-3 text-red-600" />
                        <span className="text-red-600">
                          {riskImprovement.percentage.toFixed(0)}% increase
                        </span>
                      </>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  SDQ Assessments
                </CardTitle>
                <FileText className="h-4 w-4 text-teal-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {sdqAssessments.length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Total completed
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Improvement Messages */}
          {(gad7Improvement.trend === "improving" ||
            phq9Improvement.trend === "improving" ||
            pcl5Improvement.trend === "improving") && (
              <Card className="border border-emerald-100 bg-emerald-50/80">
                <CardContent className="flex items-center justify-between gap-3 py-6">
                  <div className="flex items-center gap-2">
                    <TrendingDown className="h-5 w-5 text-emerald-600" />
                    <p className="text-base font-semibold text-emerald-900">
                      {gad7Improvement.trend === "improving" &&
                        `Your anxiety improved by ${gad7Improvement.percentage.toFixed(0)}%! `}
                      {phq9Improvement.trend === "improving" &&
                        `Your depression improved by ${phq9Improvement.percentage.toFixed(0)}%! `}
                      {pcl5Improvement.trend === "improving" &&
                        `Your PTSD symptoms improved by ${pcl5Improvement.percentage.toFixed(0)}%! `}
                      Keep up the great work!
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

          {/* Comprehensive Assessment Graphs */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>GAD-7 Progress</CardTitle>
                <CardDescription>Your anxiety levels over time</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                {gad7ChartData.length === 0 ? (
                  <div className="flex h-full items-center justify-center">
                    <p className="text-sm text-gray-500">
                      No GAD-7 data available yet. Complete an assessment to see
                      your progress.
                    </p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart
                      data={gad7ChartData}
                      margin={{ left: 12, right: 12, top: 12, bottom: 12 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="date" />
                      <YAxis domain={[0, 21]} />
                      <RechartsTooltip />
                      <Line
                        type="monotone"
                        dataKey="score"
                        stroke="#0f766e"
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        activeDot={{ r: 5 }}
                      />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>PHQ-9 Progress</CardTitle>
                <CardDescription>
                  Your depression levels over time
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                {phq9ChartData.length === 0 ? (
                  <div className="flex h-full items-center justify-center">
                    <p className="text-sm text-gray-500">
                      No PHQ-9 data available yet. Complete an assessment to see
                      your progress.
                    </p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart
                      data={phq9ChartData}
                      margin={{ left: 12, right: 12, top: 12, bottom: 12 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="date" />
                      <YAxis domain={[0, 27]} />
                      <RechartsTooltip />
                      <Line
                        type="monotone"
                        dataKey="score"
                        stroke="#2563eb"
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        activeDot={{ r: 5 }}
                      />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>PCL-5 Progress</CardTitle>
                <CardDescription>
                  Your PTSD symptoms over time
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                {pcl5ChartData.length === 0 ? (
                  <div className="flex h-full items-center justify-center">
                    <p className="text-sm text-gray-500">
                      No PCL-5 data available yet. Complete an assessment to see
                      your progress.
                    </p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart
                      data={pcl5ChartData}
                      margin={{ left: 12, right: 12, top: 12, bottom: 12 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="date" />
                      <YAxis domain={[0, 80]} />
                      <RechartsTooltip />
                      <Line
                        type="monotone"
                        dataKey="score"
                        stroke="#dc2626"
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        activeDot={{ r: 5 }}
                      />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Risk Assessment Progress</CardTitle>
                <CardDescription>
                  Your risk levels over time
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                {riskChartData.length === 0 ? (
                  <div className="flex h-full items-center justify-center">
                    <p className="text-sm text-gray-500">
                      No risk assessment data available yet. Complete an assessment to see
                      your progress.
                    </p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart
                      data={riskChartData}
                      margin={{ left: 12, right: 12, top: 12, bottom: 12 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <RechartsTooltip />
                      <Bar
                        dataKey="score"
                        fill="#f59e0b"
                        radius={[4, 4, 0, 0]}
                      />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </div>

          {/* SDQ Assessments Card */}
          {sdqAssessments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>SDQ Assessments</CardTitle>
                <CardDescription>
                  Your Strengths and Difficulties Questionnaire completions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {sdqAssessments
                    .slice()
                    .sort(
                      (a, b) =>
                        new Date(b.completed_at || b.created_at).getTime() -
                        new Date(a.completed_at || a.created_at).getTime()
                    )
                    .slice(0, 5)
                    .map((assessment) => (
                      <div
                        key={assessment.id}
                        className="flex items-center justify-between rounded-md border p-3"
                      >
                        <div>
                          <p className="font-medium">
                            {assessment.questionnaire?.title || "SDQ Assessment"}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatDate(assessment.completed_at || assessment.created_at)}
                          </p>
                        </div>
                        <div className="text-sm text-gray-600">
                          {assessment.responses?.length || 0} responses
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Your recent assessments and activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.length === 0 ? (
                  <p className="text-center text-gray-500 py-4">No recent activity found.</p>
                ) : (
                  recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                      <div className="flex items-center space-x-3">
                        <div className="rounded-full bg-teal-100 p-2">
                          <FileText className="h-4 w-4 text-orange-600" />
                        </div>
                        <div>
                          <p className="font-medium">Completed {activity.type} Assessment</p>
                          <p className="text-sm text-gray-500">
                            Score: {activity.score}{activity.max ? `/${activity.max}` : ""}
                            {activity.severity ? ` (${activity.severity})` : ""}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Clock className="h-4 w-4" />
                        <span>{getRelativeTimeString(activity.date)}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assessments" className="space-y-6">
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-emerald-800">
              Welcome to Your Wellbeing Space
            </h2>
            <p className="mt-2 text-sm text-emerald-700">
              These quick check-ins help your coach understand how best to support you.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>How Worry and Stress Are Affecting You</CardTitle>
                <CardDescription>(GAD-7 Assessment)</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  This quick check helps us understand if worry or stress is getting in the way of your daily life. Your responses are confidential and shared only with your coach.
                </p>
              </CardContent>
              <CardFooter>
                <Button
                  className="bg-[#00990d] text-white hover:bg-[#3c362f]"
                  onClick={() => handleTakeAssessment("/wellbeing-hub/gad7")}
                >
                  Start Check-In
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Understanding Your Emotional Well-being</CardTitle>
                <CardDescription>(PHQ-9 Assessment)</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Everyone has ups and downs, but sometimes low mood, tiredness, or a feeling of emptiness can last longer than usual. This check helps us understand how you&apos;ve been feeling over the past two weeks.
                </p>
              </CardContent>
              <CardFooter>
                <Button
                  className="bg-[#00990d] text-white hover:bg-[#3c362f]"
                  onClick={() => handleTakeAssessment("/wellbeing-hub/phq9")}
                >
                  Begin Check-In
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Your Strengths & Challenges</CardTitle>
                <CardDescription>
                  (SDQ - Strengths and Difficulties Questionnaire)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  This assessment looks at both sides to give your coach a complete understanding of who you are.
                </p>
              </CardContent>
              <CardFooter>
                <Button
                  className="bg-[#00990d] text-white hover:bg-[#3c362f]"
                  onClick={() =>
                    handleTakeAssessment("../my-wellbeing/questionnaires")
                  }
                >
                  Start Assessment
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>How Past Experiences Are Affecting You</CardTitle>
                <CardDescription>(PCL-5 Assessment)</CardDescription>
              </CardHeader>

              <CardContent>
                <p className="text-sm text-gray-600">
                  This check-in helps us understand if past events are showing up in your present life.
                </p>
              </CardContent>

              <CardFooter>
                <Button
                  className="bg-[#00990d] text-white hover:bg-[#3c362f]"
                  onClick={() => handleTakeAssessment("/wellbeing-hub/pcl5")}
                >
                  Start Check-In
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Risk Assessment</CardTitle>
                <CardDescription>(Safety & Wellbeing Check)</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  A confidential check to help us understand your current emotional state and ensure you receive the right level of support.
                </p>
              </CardContent>
              <CardFooter>
                <Button
                  className="bg-[#00990d] text-white hover:bg-[#3c362f]"
                  onClick={() =>
                    handleTakeAssessment("/wellbeing-hub/risk-assessment")
                  }
                >
                  Start Assessment
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Assessment History</CardTitle>
              <CardDescription>
                View your past assessment results
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="gad7" className="space-y-4">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="gad7">GAD-7</TabsTrigger>
                  <TabsTrigger value="phq9">PHQ-9</TabsTrigger>
                  <TabsTrigger value="pcl5">PCL-5</TabsTrigger>
                  <TabsTrigger value="sdq">SDQ</TabsTrigger>
                  <TabsTrigger value="risk">Risk</TabsTrigger>
                </TabsList>

                <TabsContent value="pcl5" className="space-y-4">
                  {pcl5ChartData.length > 0 && (
                    <Card className="p-4">
                      <h3 className="mb-4 text-sm font-medium">PCL-5 Progress Over Time</h3>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <RechartsLineChart data={pcl5ChartData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="date" />
                            <YAxis domain={[0, 80]} />
                            <RechartsTooltip />
                            <Line
                              type="monotone"
                              dataKey="score"
                              stroke="#dc2626"
                              strokeWidth={2}
                              dot={{ r: 4 }}
                            />
                          </RechartsLineChart>
                        </ResponsiveContainer>
                      </div>
                    </Card>
                  )}
                  <div className="rounded-md border">
                    <div className="grid grid-cols-4 gap-4 bg-muted p-4 font-medium">
                      <div>Date</div>
                      <div>Score</div>
                      <div>Severity</div>
                      <div>Actions</div>
                    </div>
                    <div className="divide-y">
                      {isLoading ? (
                        <div className="p-4 text-center">
                          Loading assessments...
                        </div>
                      ) : pcl5Assessments.length === 0 ? (
                        <div className="p-4 text-center">
                          No PCL-5 assessments found
                        </div>
                      ) : (
                        pcl5Assessments.map((assessment) => (
                          <div
                            key={assessment.id}
                            className="grid grid-cols-4 gap-4 p-4"
                          >
                            <div>{formatDate(assessment.created_at)}</div>
                            <div>{assessment.total_score}/80</div>
                            <div className="capitalize">
                              {assessment.severity_level}
                            </div>
                            <div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedAssessment(assessment);
                                  setIsDetailsOpen(true);
                                }}
                              >
                                View Details
                              </Button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="gad7" className="space-y-4">
                  {gad7ChartData.length > 0 && (
                    <Card className="p-4">
                      <h3 className="mb-4 text-sm font-medium">GAD-7 Progress Over Time</h3>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <RechartsLineChart data={gad7ChartData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="date" />
                            <YAxis domain={[0, 21]} />
                            <RechartsTooltip />
                            <Line
                              type="monotone"
                              dataKey="score"
                              stroke="#0f766e"
                              strokeWidth={2}
                              dot={{ r: 4 }}
                            />
                          </RechartsLineChart>
                        </ResponsiveContainer>
                      </div>
                    </Card>
                  )}
                  <div className="rounded-md border">
                    <div className="grid grid-cols-4 gap-4 bg-muted p-4 font-medium">
                      <div>Date</div>
                      <div>Score</div>
                      <div>Severity</div>
                      <div>Actions</div>
                    </div>
                    <div className="divide-y">
                      {isLoading ? (
                        <div className="p-4 text-center">
                          Loading assessments...
                        </div>
                      ) : gad7Assessments.length === 0 ? (
                        <div className="p-4 text-center">
                          No GAD-7 assessments found
                        </div>
                      ) : (
                        gad7Assessments.map((assessment) => (
                          <div
                            key={assessment.id}
                            className="grid grid-cols-4 gap-4 p-4"
                          >
                            <div>{formatDate(assessment.created_at)}</div>
                            <div>{assessment.total_score}/21</div>
                            <div className="capitalize">
                              {assessment.severity_level}
                            </div>
                            <div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedAssessment(assessment);
                                  setIsDetailsOpen(true);
                                }}
                              >
                                View Details
                              </Button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="phq9" className="space-y-4">
                  {phq9ChartData.length > 0 && (
                    <Card className="p-4">
                      <h3 className="mb-4 text-sm font-medium">PHQ-9 Progress Over Time</h3>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <RechartsLineChart data={phq9ChartData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="date" />
                            <YAxis domain={[0, 27]} />
                            <RechartsTooltip />
                            <Line
                              type="monotone"
                              dataKey="score"
                              stroke="#2563eb"
                              strokeWidth={2}
                              dot={{ r: 4 }}
                            />
                          </RechartsLineChart>
                        </ResponsiveContainer>
                      </div>
                    </Card>
                  )}
                  <div className="rounded-md border">
                    <div className="grid grid-cols-4 gap-4 bg-muted p-4 font-medium">
                      <div>Date</div>
                      <div>Score</div>
                      <div>Severity</div>
                      <div>Actions</div>
                    </div>
                    <div className="divide-y">
                      {isLoading ? (
                        <div className="p-4 text-center">
                          Loading assessments...
                        </div>
                      ) : phq9Assessments.length === 0 ? (
                        <div className="p-4 text-center">
                          No PHQ-9 assessments found
                        </div>
                      ) : (
                        phq9Assessments.map((assessment) => (
                          <div
                            key={assessment.id}
                            className="grid grid-cols-4 gap-4 p-4"
                          >
                            <div>{formatDate(assessment.created_at)}</div>
                            <div>{assessment.total_score}/27</div>
                            <div className="capitalize">
                              {assessment.severity_level}
                            </div>
                            <div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedAssessment(assessment);
                                  setIsDetailsOpen(true);
                                }}
                              >
                                View Details
                              </Button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="sdq" className="space-y-4">
                  <div className="rounded-md border">
                    <div className="grid grid-cols-4 gap-4 bg-muted p-4 font-medium">
                      <div>Date</div>
                      <div>Questionnaire</div>
                      <div>Responses</div>
                      <div>Actions</div>
                    </div>
                    <div className="divide-y">
                      {isLoading ? (
                        <div className="p-4 text-center">
                          Loading assessments...
                        </div>
                      ) : sdqAssessments.length === 0 ? (
                        <div className="p-4 text-center">
                          No SDQ assessments found
                        </div>
                      ) : (
                        sdqAssessments
                          .slice()
                          .sort(
                            (a, b) =>
                              new Date(b.completed_at || b.created_at).getTime() -
                              new Date(a.completed_at || a.created_at).getTime()
                          )
                          .map((assessment) => (
                            <div
                              key={assessment.id}
                              className="grid grid-cols-4 gap-4 p-4"
                            >
                              <div>
                                {formatDate(assessment.completed_at || assessment.created_at)}
                              </div>
                              <div>
                                {assessment.questionnaire?.title || "SDQ Assessment"}
                              </div>
                              <div>{assessment.responses?.length || 0} responses</div>
                              <div>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedAssessment(null);
                                    setSelectedSdqAssessment(assessment);
                                    setIsDetailsOpen(true);
                                  }}
                                >
                                  View Details
                                </Button>
                              </div>
                            </div>
                          ))
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="risk" className="space-y-4">
                  {riskChartData.length > 0 && (
                    <Card className="p-4">
                      <h3 className="mb-4 text-sm font-medium">Risk Assessment Variation</h3>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <RechartsBarChart data={riskChartData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <RechartsTooltip />
                            <Bar dataKey="score" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                          </RechartsBarChart>
                        </ResponsiveContainer>
                      </div>
                    </Card>
                  )}
                  <div className="rounded-md border">
                    <div className="grid grid-cols-4 gap-4 bg-muted p-4 font-medium">
                      <div>Date</div>
                      <div>Score</div>
                      <div>Risk Level</div>
                      <div>Status</div>
                    </div>
                    <div className="divide-y">
                      {isLoading ? (
                        <div className="p-4 text-center">
                          Loading assessments...
                        </div>
                      ) : riskAssessments.length === 0 ? (
                        <div className="p-4 text-center">
                          No risk assessments found
                        </div>
                      ) : (
                        riskAssessments
                          .slice()
                          .sort(
                            (a, b) =>
                              new Date(b.created_at).getTime() -
                              new Date(a.created_at).getTime()
                          )
                          .map((assessment) => (
                            <div
                              key={assessment.id}
                              className="grid grid-cols-4 gap-4 p-4"
                            >
                              <div>{formatDate(assessment.created_at)}</div>
                              <div>{assessment.score}</div>
                              <div className="capitalize">{assessment.risk_level}</div>
                              <div>
                                {assessment.is_acknowledged ? (
                                  <span className="text-green-600">Acknowledged</span>
                                ) : (
                                  <span className="text-amber-600">Pending</span>
                                )}
                              </div>
                            </div>
                          ))
                      )}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Mental Health Resources</CardTitle>
              <CardDescription>
                Helpful resources for your wellbeing journey
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-md border p-4">
                  <h3 className="mb-2 text-lg font-semibold">Crisis Support</h3>
                  <p className="mb-2 text-sm text-gray-600">
                    If you&apos;re experiencing a mental health crisis or need
                    immediate support:
                  </p>
                  <ul className="ml-6 list-disc space-y-1 text-sm text-gray-600">
                    <li>Samaritans: Call 116 123 (free, 24/7)</li>
                    <li>Crisis Text Line: Text SHOUT to 85258</li>
                    <li>NHS Mental Health Helpline: Call 111, option 2</li>
                    <li>
                      Emergency Services: Call 999 if you or someone else is in
                      immediate danger
                    </li>
                  </ul>
                </div>

                <div className="rounded-md border p-4">
                  <h3 className="mb-2 text-lg font-semibold">
                    Self-Help Resources
                  </h3>
                  <p className="mb-2 text-sm text-gray-600">
                    Explore these resources to support your mental wellbeing:
                  </p>
                  <ul className="ml-6 list-disc space-y-1 text-sm text-gray-600">
                    <li>
                      Mind:{" "}
                      <a
                        href="https://www.mind.org.uk"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-orange-600 hover:text-teal-700"
                      >
                        www.mind.org.uk
                      </a>
                    </li>
                    <li>
                      Mental Health Foundation:{" "}
                      <a
                        href="https://www.mentalhealth.org.uk"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-orange-600 hover:text-teal-700"
                      >
                        www.mentalhealth.org.uk
                      </a>
                    </li>
                    <li>
                      NHS Mental Health:{" "}
                      <a
                        href="https://www.nhs.uk/mental-health"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-orange-600 hover:text-teal-700"
                      >
                        www.nhs.uk/mental-health
                      </a>
                    </li>
                    <li>
                      Every Mind Matters:{" "}
                      <a
                        href="https://www.nhs.uk/every-mind-matters"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-orange-600 hover:text-teal-700"
                      >
                        www.nhs.uk/every-mind-matters
                      </a>
                    </li>
                  </ul>
                </div>

                <div className="rounded-md border p-4">
                  <h3 className="mb-2 text-lg font-semibold">
                    Culturally Responsive Support
                  </h3>
                  <p className="mb-2 text-sm text-gray-600">
                    Organizations providing culturally sensitive mental health
                    support:
                  </p>
                  <ul className="ml-6 list-disc space-y-1 text-sm text-gray-600">
                    <li>
                      Black Minds Matter UK:{" "}
                      <a
                        href="https://www.blackmindsmatteruk.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-orange-600 hover:text-teal-700"
                      >
                        www.blackmindsmatteruk.com
                      </a>
                    </li>
                    <li>
                      Muslim Youth Helpline:{" "}
                      <a
                        href="https://www.myh.org.uk"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-orange-600 hover:text-teal-700"
                      >
                        www.myh.org.uk
                      </a>
                    </li>
                    <li>
                      Nafsiyat Intercultural Therapy Centre:{" "}
                      <a
                        href="https://www.nafsiyat.org.uk"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-orange-600 hover:text-teal-700"
                      >
                        www.nafsiyat.org.uk
                      </a>
                    </li>
                    <li>
                      BAMEStream:{" "}
                      <a
                        href="https://www.bamestream.org.uk"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-orange-600 hover:text-teal-700"
                      >
                        www.bamestream.org.uk
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="wellbeing-update" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Wellbeing Updates</CardTitle>
              <CardDescription>
                Latest news and updates for your wellbeing journey
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="rounded-md border p-4">
                  <h3 className="mb-2 text-lg font-semibold">
                    New Mindfulness Workshop
                  </h3>
                  <p className="mb-2 text-sm text-gray-600">
                    Join our new weekly mindfulness sessions starting next
                    month. These sessions will help you develop techniques to
                    manage stress and improve your overall wellbeing.
                  </p>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>Starting June 5th, every Wednesday at 6pm</span>
                  </div>
                </div>

                <div className="rounded-md border p-4">
                  <h3 className="mb-2 text-lg font-semibold">
                    Community Support Group
                  </h3>
                  <p className="mb-2 text-sm text-gray-600">
                    Our new peer support group meets every Friday evening. Share
                    experiences and connect with others on similar journeys.
                  </p>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>Every Friday at 7pm</span>
                  </div>
                </div>

                <div className="rounded-md border p-4">
                  <h3 className="mb-2 text-lg font-semibold">
                    New Resources Available
                  </h3>
                  <p className="mb-2 text-sm text-gray-600">
                    We've added new culturally responsive resources to our
                    library, including guided meditations and self-help
                    workbooks.
                  </p>
                  <Button variant="outline" className="mt-2">
                    Explore Resources
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Assessment Details Modal */}
      <Dialog
        open={isDetailsOpen}
        onOpenChange={(open) => {
          setIsDetailsOpen(open);
          if (!open) {
            setSelectedAssessment(null);
            setSelectedSdqAssessment(null);
          }
        }}
      >
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedSdqAssessment
                ? (selectedSdqAssessment.questionnaire?.title || "SDQ Assessment")
                : selectedAssessment?.therapist
                  ? `Assessment by ${selectedAssessment.therapist.first_name} ${selectedAssessment.therapist.last_name}`
                  : "Assessment Details"}
            </DialogTitle>
          </DialogHeader>
          {selectedSdqAssessment && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Date</p>
                  <p className="text-sm text-gray-600">
                    {formatDate(selectedSdqAssessment.completed_at || selectedSdqAssessment.created_at)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Questionnaire</p>
                  <p className="text-sm text-gray-600">
                    {selectedSdqAssessment.questionnaire?.title || "SDQ Assessment"}
                  </p>
                </div>
              </div>
              {selectedSdqAssessment.responses && selectedSdqAssessment.responses.length > 0 ? (
                <div>
                  <p className="text-sm font-medium mb-2">Submitted Answers</p>
                  <ul className="space-y-3">
                    {selectedSdqAssessment.responses.map((r, idx) => (
                      <li key={r.id ?? idx} className="border-b border-gray-100 pb-2 last:border-0">
                        <p className="text-sm font-medium text-gray-800">
                          {r.question?.text ?? `Question ${idx + 1}`}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {r.text_response != null && r.text_response !== ""
                            ? r.text_response
                            : r.choice != null
                              ? r.choice.label
                              : r.choice_id != null
                                ? `Choice ID: ${r.choice_id}`
                                : "—"}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : sdqDetailsLoading ? (
                <p className="text-sm text-gray-500">Loading response details...</p>
              ) : (
                <p className="text-sm text-gray-500">No response details available for this assessment.</p>
              )}
            </div>
          )}
          {selectedAssessment && !selectedSdqAssessment && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Date</p>
                  <p className="text-sm text-gray-600">
                    {formatDate(selectedAssessment.created_at)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Total Score</p>
                  <p className="text-sm text-gray-600">
                    {selectedAssessment.total_score}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Severity Level</p>
                  <p className="text-sm text-gray-600 capitalize">
                    {selectedAssessment.severity_level}
                  </p>
                </div>
              </div>
              {selectedAssessment.answers && selectedAssessment.answers.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2">Answers</p>
                  <ul className="list-disc pl-6 text-sm text-gray-600">
                    {(selectedAssessment.answers || []).map((ans, idx) => (
                      <li key={idx}>
                        {ans.question_text}:{" "}
                        <span className="font-semibold">{ans.answer_text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
