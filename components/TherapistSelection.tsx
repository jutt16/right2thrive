"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Check, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

interface Therapist {
    id: number;
    name: string;
    email: string;
    gender: string | null;
    cultural_background: string | null;
    telephone: string | null;
    mobile: string | null;
    address: string | null;
    country: string | null;
    qualifications: string | null;
    experience: string | null;
    profile_picture_url: string | null;
}

export function TherapistSelection() {
    const [therapists, setTherapists] = useState<Therapist[]>([]);
    const [loading, setLoading] = useState(true);
    const [assigningId, setAssigningId] = useState<number | null>(null);
    const [assignedTherapistId, setAssignedTherapistId] = useState<number | null>(null);
    const router = useRouter();
    const { toast } = useToast();

    useEffect(() => {
        // Check local storage for assigned therapist
        const userStr = localStorage.getItem("user");
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                if (user.therapist_id) {
                    setAssignedTherapistId(user.therapist_id);
                }
            } catch (e) {
                console.error("Error parsing user from local storage", e);
            }
        }

        // Fetch therapists
        const fetchTherapists = async () => {
            try {
                const res = await fetch("https://admin.right2thriveuk.com/api/therapists");
                const data = await res.json();

                if (data.success && Array.isArray(data.data?.therapists)) {
                    setTherapists(data.data.therapists);
                } else {
                    console.error("Invalid therapist data format", data);
                }
            } catch (error) {
                console.error("Failed to fetch therapists", error);
                toast({
                    title: "Error",
                    description: "Failed to load therapists. Please try again later.",
                    variant: "destructive",
                });
            } finally {
                setLoading(false);
            }
        };

        fetchTherapists();
    }, [toast]);

    const handleSelectTherapist = async (therapistId: number) => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/auth/login");
            return;
        }

        setAssigningId(therapistId);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/api/therapists/assign`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ therapist_id: therapistId })
            });

            const data = await res.json();

            if (data.success) {
                toast({
                    title: "Success",
                    description: data.message || "Therapist assigned successfully.",
                });
                setAssignedTherapistId(therapistId);

                // Update local storage
                const userStr = localStorage.getItem("user");
                if (userStr) {
                    const user = JSON.parse(userStr);
                    user.therapist_id = therapistId;
                    localStorage.setItem("user", JSON.stringify(user));
                }

                // Replace therapist in localStorage with null after successful assignment
                localStorage.setItem("therapist", "null");
            } else {
                throw new Error(data.message || "Failed to assign therapist");
            }
        } catch (error) {
            console.error("Error assigning therapist", error);
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to assign therapist",
                variant: "destructive",
            });
        } finally {
            setAssigningId(null);
        }
    };

    // If user already has a therapist, do we hide the list? 
    // The requirement says "if user have no therapist assigned check from local storage". 
    // It implies we should check, and presumably if they DO have one, we might show it or disable selection?
    // I will show the list but highlight the assigned one, or maybe just show the list if they intend to change?
    // Current logic: highlight the assigned one and disable button.

    if (loading) {
        return (
            <div className="py-12 flex justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-green-600" />
            </div>
        );
    }

    if (therapists.length === 0) return null;

    return (
        <section id="choose-wellbeing-coach" className="py-16 bg-slate-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold text-slate-900 mb-4">Choose Your Wellbeing Coach</h2>
                    <p className="text-slate-600 max-w-2xl mx-auto">
                        Select a professional from our network to begin your journey.
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {therapists.map((therapist) => {
                        const isAssigned = assignedTherapistId === therapist.id;

                        return (
                            <Card key={therapist.id} className={`flex flex-col h-full transition-all duration-300 ${isAssigned ? 'ring-2 ring-green-500 shadow-lg' : 'hover:shadow-md'}`}>
                                <CardHeader>
                                    <div className="flex items-center gap-3">
                                        <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-700 overflow-hidden flex-shrink-0">
                                            {therapist.profile_picture_url ? (
                                                <img
                                                    src={therapist.profile_picture_url}
                                                    alt={`${therapist.name} profile picture`}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <User className="h-6 w-6" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <CardTitle className="text-lg truncate">{therapist.name}</CardTitle>
                                            <CardDescription className="truncate">{therapist.qualifications || "Professional Therapist"}</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="flex-grow space-y-2 text-sm text-slate-600">
                                    {therapist.gender && (
                                        <p><strong className="font-medium text-slate-900">Gender:</strong> {therapist.gender}</p>
                                    )}
                                    {therapist.cultural_background && (
                                        <p><strong className="font-medium text-slate-900">Background:</strong> {therapist.cultural_background}</p>
                                    )}
                                    {therapist.experience && (
                                        <p><strong className="font-medium text-slate-900">Experience:</strong> {therapist.experience}</p>
                                    )}
                                </CardContent>
                                <CardFooter className="pt-4">
                                    <Button
                                        className={`w-full ${isAssigned ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-[#00990d] hover:bg-[#007a0a] text-white'}`}
                                        onClick={() => !isAssigned && handleSelectTherapist(therapist.id)}
                                        disabled={isAssigned || assigningId !== null}
                                    >
                                        {assigningId === therapist.id ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Assigning...
                                            </>
                                        ) : isAssigned ? (
                                            <>
                                                <Check className="mr-2 h-4 w-4" />
                                                Assigned
                                            </>
                                        ) : (
                                            "Select Therapist"
                                        )}
                                    </Button>
                                </CardFooter>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
