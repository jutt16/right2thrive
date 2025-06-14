"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import { Suspense } from 'react';
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

interface AssessmentData {
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

export default function WellbeingHub() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <WellbeingHubContent />
    </Suspense>
  );
}

function WellbeingHubContent() {
  // const [activeTab, setActiveTab] = useState("dashboard");
  // Inside your WellbeingHub component, replace the useState for activeTab with:
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState(
    searchParams.get("tab") || "assessments"
  );
  const [selectedAssessment, setSelectedAssessment] =
    useState<Assessment | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [gad7Assessments, setGad7Assessments] = useState<Assessment[]>([]);
  const [phq9Assessments, setPhq9Assessments] = useState<Assessment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      fetchAssessments();
    }
  }, [isClient]);

  useEffect(() => {
    if (isClient) {
      // Update the URL when activeTab changes
      const newUrl = `${window.location.pathname}?tab=${activeTab}`;
      window.history.pushState({}, "", newUrl);
    }
  }, [activeTab, isClient]);

  const fetchAssessments = async () => {
    if (!isClient) return;

    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No authentication token found");
        return;
      }

      const [gad7Response, phq9Response] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/assessments/gad7`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/assessments/phq9`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);

      const [gad7Data, phq9Data] = await Promise.all([
        gad7Response.json(),
        phq9Response.json(),
      ]);

      console.log("GAD-7 Assessments:", gad7Data);
      console.log("PHQ-9 Assessments:", phq9Data);

      if (gad7Data.success && phq9Data.success) {
        setGad7Assessments(gad7Data.assessments);
        setPhq9Assessments(phq9Data.assessments);
      }
    } catch (error) {
      console.error("Error fetching assessments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Handler for Take Assessment buttons
  const handleTakeAssessment = (assessmentPath: string) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("user");
      if (token && user) {
        router.push(assessmentPath);
      } else {
        router.push("/auth/login");
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Tabs
        defaultValue={activeTab}
        className="space-y-4"
        onValueChange={setActiveTab}
      >
        <TabsList className="gflex w-full overflow-x-auto pb-2 gap-2 md:grid md:grid-cols-4">
          <TabsTrigger
            value="dashboard"
            className="text-xs md:text-sm data-[state=active]:bg-red-500 data-[state=active]:text-white hover:bg-red-100"
          >
            Dashboard
          </TabsTrigger>
          <TabsTrigger
            value="assessments"
            className="text-xs md:text-sm data-[state=active]:bg-orange-500 data-[state=active]:text-white hover:bg-orange-100"
          >
            Assessments
          </TabsTrigger>
          <TabsTrigger
            value="resources"
            className="text-xs md:text-sm data-[state=active]:bg-green-500 data-[state=active]:text-white hover:bg-green-100"
          >
            Resources
          </TabsTrigger>
          <TabsTrigger
            value="wellbeing-update"
            className="text-xs md:text-sm data-[state=active]:bg-blue-500 data-[state=active]:text-white hover:bg-blue-100"
          >
            Wellbeing
          </TabsTrigger>
        </TabsList>

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
                <CardDescription>
                  Generalized Anxiety Disorder 7-item scale
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  The GAD-7 is a self-reported questionnaire for screening and
                  measuring the severity of generalized anxiety disorder.
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
                  Patient Health Questionnaire 9-item scale
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  The PHQ-9 is a self-administered depression scale used for
                  screening, diagnosing, and monitoring the severity of
                  depression.
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

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#ff961b]">
          Right2Thrive UK Wellbeing Hub
        </h1>
        <br />
        <p className="text-gray-600">
          Welcome To Right2ThriveUK Wellbeing Hub <br />
          <br />
          <span className="font-bold">
            • Culturally responsive mental health assessments <br />
            • A rich library of resources and self-help tools <br />
            • Access to in-person support activities and workshops <br />
            • Creative and cultural engagement opportunities <br />
          </span>
          <br />
          The Digital Wellbeing Hub ensures support is available anytime,
          anywhere, in ways that feel safe and empowering.
        </p>
        <h2 className="text-2xl font-bold text-[#ff961b]">
          Professional & Peer Support
        </h2>
        <p className="text-gray-600">
          Our model combines the expertise of qualified mental health
          practitioners with the empathy of peer mentors who share lived
          experience. This dual approach ensures young people and families
          receive both professional guidance and relatable support.
        </p>
      </div>

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
              {selectedAssessment.answers &&
                selectedAssessment.answers.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Question Responses</p>
                    <div className="space-y-2">
                      {selectedAssessment.answers.map((answer) => (
                        <div
                          key={answer.question_id}
                          className="rounded-md border p-3"
                        >
                          <p className="text-sm font-medium">
                            {answer.question_text}
                          </p>
                          <p className="text-sm text-gray-600">
                            {answer.answer_text} (Score: {answer.answer_value})
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
