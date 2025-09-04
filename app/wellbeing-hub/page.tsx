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
  BarChart,
  LineChart,
  Activity,
  FileText,
  Calendar,
  Clock,
  ArrowRight,
} from "lucide-react";
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
  therapist_id: number;
  total_score: number;
  severity_level: string;
  answers: AssessmentAnswer[];
  created_at: string;
  therapist: {
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

export default function WellbeingHub() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("user");
      if (token && user) {
        setIsAuthenticated(true);
        setUserData(JSON.parse(user));
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
  const [activeTab, setActiveTab] = useState(
    searchParams.get("tab") || "assessments"
  );
  const [selectedAssessment, setSelectedAssessment] =
    useState<Assessment | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const [gad7Assessments, setGad7Assessments] = useState<Assessment[]>([]);
  const [phq9Assessments, setPhq9Assessments] = useState<Assessment[]>([]);
  const [sessionNotes, setSessionNotes] = useState<SessionNote[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => setIsClient(true), []);

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

  const fetchAssessments = async () => {
    if (!isClient) return;
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const [gad7Res, phq9Res] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/assessments/gad7`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/assessments/phq9`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const [gad7Data, phq9Data] = await Promise.all([
        gad7Res.json(),
        phq9Res.json(),
      ]);

      if (gad7Data.success) setGad7Assessments(gad7Data.assessments);
      if (phq9Data.success) setPhq9Assessments(phq9Data.assessments);
    } catch (err) {
      console.error("Error fetching assessments:", err);
    } finally {
      setIsLoading(false);
    }
  };

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
        <TabsList className="gflex w-full overflow-x-auto pb-2 gap-2 md:grid md:grid-cols-5">
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
              <CardDescription>Notes shared by your therapist</CardDescription>
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
                        <div>{med.medications || "—"}</div>
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
        <TabsContent value="dashboard" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Latest GAD-7 Score
                </CardTitle>
                <Activity className="h-4 w-4 text-teal-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8/21</div>
                <p className="text-xs text-muted-foreground">
                  Moderate anxiety
                </p>
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
                <div className="text-2xl font-bold">10/27</div>
                <p className="text-xs text-muted-foreground">
                  Moderate depression
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Assessments Completed
                </CardTitle>
                <FileText className="h-4 w-4 text-teal-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4</div>
                <p className="text-xs text-muted-foreground">Last 30 days</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Next Assessment
                </CardTitle>
                <Calendar className="h-4 w-4 text-teal-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2 days</div>
                <p className="text-xs text-muted-foreground">Weekly check-in</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>GAD-7 Progress</CardTitle>
                <CardDescription>Your anxiety levels over time</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <div className="flex h-full items-center justify-center">
                  <LineChart className="h-40 w-40 text-gray-300" />
                  <p className="text-sm text-gray-500">
                    Chart visualization will appear here
                  </p>
                </div>
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
                <div className="flex h-full items-center justify-center">
                  <BarChart className="h-40 w-40 text-gray-300" />
                  <p className="text-sm text-gray-500">
                    Chart visualization will appear here
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Your recent assessments and activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <div className="flex items-center space-x-3">
                    <div className="rounded-full bg-teal-100 p-2">
                      <FileText className="h-4 w-4 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-medium">Completed GAD-7 Assessment</p>
                      <p className="text-sm text-gray-500">
                        Score: 8/21 (Moderate anxiety)
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Clock className="h-4 w-4" />
                    <span>2 days ago</span>
                  </div>
                </div>
                <div className="flex items-center justify-between border-b pb-2">
                  <div className="flex items-center space-x-3">
                    <div className="rounded-full bg-teal-100 p-2">
                      <FileText className="h-4 w-4 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-medium">Completed PHQ-9 Assessment</p>
                      <p className="text-sm text-gray-500">
                        Score: 10/27 (Moderate depression)
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Clock className="h-4 w-4" />
                    <span>2 days ago</span>
                  </div>
                </div>
                <div className="flex items-center justify-between border-b pb-2">
                  <div className="flex items-center space-x-3">
                    <div className="rounded-full bg-teal-100 p-2">
                      <FileText className="h-4 w-4 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-medium">Completed GAD-7 Assessment</p>
                      <p className="text-sm text-gray-500">
                        Score: 10/21 (Moderate anxiety)
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Clock className="h-4 w-4" />
                    <span>9 days ago</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="rounded-full bg-teal-100 p-2">
                      <FileText className="h-4 w-4 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-medium">Completed PHQ-9 Assessment</p>
                      <p className="text-sm text-gray-500">
                        Score: 12/27 (Moderate depression)
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Clock className="h-4 w-4" />
                    <span>9 days ago</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assessments" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>GAD-7 Assessment</CardTitle>
                <CardDescription>How Are You Feeling Lately?</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Your well-being coach is here to support you! These 7 simple
                  questions are designed to help you check in with yourself and
                  see how you’ve been feeling. It’s like a quick personal
                  check-up to better understand what’s going on in your life and
                  how things might be affecting you.
                </p>
                <br />
                <p className="text-sm text-gray-600">
                  1Your coach can use this to guide you and work with you to
                  help you feel your best!
                </p>
              </CardContent>
              <CardFooter>
                <Button
                  className="bg-[#00990d] text-white hover:bg-[#3c362f]"
                  onClick={() => handleTakeAssessment("/wellbeing-hub/gad7")}
                >
                  Take Assessment
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>PHQ-9 Assessment</CardTitle>
                <CardDescription>
                  How Are You Feeling? <br />
                  Let’s Check In!
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Your well-being coach is here to support you! This quick set
                  of questions is designed to help you reflect on how you’ve
                  been feeling lately. It’s a simple way to understand your
                  emotions, energy, and how life might be affecting you.
                </p>
                <br />
                <p className="text-sm text-gray-600">
                  By answering honestly, you’ll give your coach the insight they
                  need to better support you and help you feel your best!
                </p>
              </CardContent>
              <CardFooter>
                <Button
                  className="bg-[#00990d] text-white hover:bg-[#3c362f]"
                  onClick={() => handleTakeAssessment("/wellbeing-hub/phq9")}
                >
                  Take Assessment
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  Strengths & Difficulties Questionnaire (SDQ)
                </CardTitle>
                <CardDescription>
                  Understanding Your Strengths and Challenges
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  This short questionnaire helps you and your coach explore both
                  the positive strengths you bring to your life and any
                  difficulties you might be experiencing. It looks at areas like
                  emotions, behavior, relationships, and focus.
                </p>
                <br />
                <p className="text-sm text-gray-600">
                  By completing it, you’ll provide a fuller picture of your
                  well-being so your coach can better support you on your
                  journey.
                </p>
              </CardContent>
              <CardFooter>
                <Button
                  className="bg-[#00990d] text-white hover:bg-[#3c362f]"
                  onClick={() =>
                    handleTakeAssessment("../my-wellbeing/questionnaires")
                  }
                >
                  Take Assessment
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
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="gad7">GAD-7 Assessments</TabsTrigger>
                  <TabsTrigger value="phq9">PHQ-9 Assessments</TabsTrigger>
                </TabsList>

                <TabsContent value="gad7" className="space-y-4">
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
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {selectedAssessment?.therapist
                ? `Assessment by ${selectedAssessment.therapist.first_name} ${selectedAssessment.therapist.last_name}`
                : "Assessment Details"}
            </DialogTitle>
          </DialogHeader>
          {selectedAssessment && (
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
              <div>
                <p className="text-sm font-medium mb-2">Answers</p>
                <ul className="list-disc pl-6 text-sm text-gray-600">
                  {selectedAssessment.answers.map((ans, idx) => (
                    <li key={idx}>
                      {ans.question_text}:{" "}
                      <span className="font-semibold">{ans.answer_text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
