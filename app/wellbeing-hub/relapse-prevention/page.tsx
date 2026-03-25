"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Shield, FileText, Users, Save, Loader2 } from "lucide-react";
import {
  getRelapsePreventionSections,
  getPatientRelapsePlan,
  savePatientRelapsePlan,
  type RelapsePreventionSection,
  type PatientRelapsePlan,
} from "@/lib/relapse-prevention-api";

export default function RelapsePreventionPage() {
  const router = useRouter();
  const [sections, setSections] = useState<RelapsePreventionSection[]>([]);
  const [plan, setPlan] = useState<PatientRelapsePlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Editable plan fields
  const [earlySigns, setEarlySigns] = useState("");
  const [copingStrategies, setCopingStrategies] = useState("");
  const [emergencyContacts, setEmergencyContacts] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/auth/login");
      return;
    }

    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const [sectionsData, planData] = await Promise.all([
          getRelapsePreventionSections(),
          getPatientRelapsePlan(),
        ]);
        setSections(sectionsData);
        setPlan(planData ?? null);
        if (planData) {
          setEarlySigns(planData.early_signs ?? "");
          setCopingStrategies(planData.coping_strategies ?? "");
          setEmergencyContacts(planData.emergency_contacts ?? "");
        }
      } catch {
        setError("Failed to load content.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [router]);

  const handleSavePlan = async () => {
    setSaving(true);
    setSuccess(false);
    setError("");
    const result = await savePatientRelapsePlan({
      early_signs: earlySigns,
      coping_strategies: copingStrategies,
      emergency_contacts: emergencyContacts,
    });
    setSaving(false);
    if (result.success) {
      setPlan(result.plan);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } else {
      setError(result.message);
    }
  }

  if (typeof window !== "undefined" && !localStorage.getItem("token")) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-6">
          <Link
            href="/my-wellbeing"
            className="inline-flex items-center gap-2 text-[#00990d] hover:text-[#007a0a] font-medium"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to My Wellbeing
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#00990d] mb-4">
            Relapse Prevention
          </h1>
          <p className="text-lg text-gray-700">
            Learn about early warning signs, coping strategies, and when to seek help. You can also create your own personal relapse prevention plan.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-[#00990d]" />
          </div>
        ) : (
          <div className="space-y-8">
            {/* Content sections from API */}
            {sections.length > 0 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-gray-900">
                  Information &amp; resources
                </h2>
                {sections
                  .sort((a, b) => a.display_order - b.display_order)
                  .map((section) => (
                    <Card key={section.id} className="border-gray-200 shadow-sm">
                      <CardHeader>
                        <CardTitle className="text-xl flex items-center gap-2">
                          {section.title.toLowerCase().includes("warning") && (
                            <Shield className="h-5 w-5 text-amber-600" />
                          )}
                          {section.title.toLowerCase().includes("coping") && (
                            <FileText className="h-5 w-5 text-blue-600" />
                          )}
                          {section.title.toLowerCase().includes("crisis") ||
                            section.title.toLowerCase().includes("help") ? (
                            <Users className="h-5 w-5 text-red-600" />
                          ) : null}
                          {section.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700 whitespace-pre-wrap">
                          {section.content}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            )}

            {sections.length === 0 && (
              <Card className="border-gray-200 bg-white">
                <CardContent className="pt-6">
                  <p className="text-gray-600">
                    No relapse prevention content is available yet. Check back later or speak to your therapist for resources.
                  </p>
                </CardContent>
              </Card>
            )}

            {/* My relapse plan */}
            <Card className="border-[#00990d]/30 bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900">
                  My relapse prevention plan
                </CardTitle>
                <CardDescription>
                  Personalise your plan with your own early warning signs, coping strategies, and emergency contacts. Only you and your therapist can see this.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {error && (
                  <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded">
                    {error}
                  </p>
                )}
                {success && (
                  <p className="text-sm text-green-700 bg-green-50 px-3 py-2 rounded">
                    Plan saved successfully.
                  </p>
                )}

                <div className="space-y-2">
                  <Label htmlFor="early_signs">Early warning signs</Label>
                  <Textarea
                    id="early_signs"
                    placeholder="e.g. Not sleeping well, avoiding people, low energy..."
                    value={earlySigns}
                    onChange={(e) => setEarlySigns(e.target.value)}
                    rows={3}
                    className="resize-none"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="coping_strategies">Coping strategies that help me</Label>
                  <Textarea
                    id="coping_strategies"
                    placeholder="e.g. Going for a walk, talking to a friend, breathing exercises..."
                    value={copingStrategies}
                    onChange={(e) => setCopingStrategies(e.target.value)}
                    rows={3}
                    className="resize-none"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergency_contacts">Emergency contacts</Label>
                  <Textarea
                    id="emergency_contacts"
                    placeholder="e.g. Samaritans 116 123, my therapist, a trusted friend..."
                    value={emergencyContacts}
                    onChange={(e) => setEmergencyContacts(e.target.value)}
                    rows={3}
                    className="resize-none"
                  />
                </div>
                <Button
                  onClick={handleSavePlan}
                  disabled={saving}
                  className="bg-[#00990d] hover:bg-[#007a0a]"
                >
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save my plan
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
              <p className="text-sm text-gray-800">
                <strong>Need support now?</strong> Visit{" "}
                <Link
                  href="/wellbeing-hub/support"
                  className="text-[#00990d] hover:text-[#007a0a] underline font-medium"
                >
                  Support Services
                </Link>{" "}
                for crisis and urgent support links.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
