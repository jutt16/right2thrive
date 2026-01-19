"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Check, Loader2, Mail, Phone, MapPin, Briefcase, GraduationCap, Globe, Info } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

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
    const [selectedDetailsTherapist, setSelectedDetailsTherapist] = useState<Therapist | null>(null);
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

                // Update local storage with selected therapist details
                const selectedTherapist = therapists.find(t => t.id === therapistId);
                if (selectedTherapist) {
                    localStorage.setItem("therapist", JSON.stringify(selectedTherapist));
                }

                // Dispatch custom event to notify other components
                window.dispatchEvent(new CustomEvent("therapistAssigned", { detail: { therapistId } }));
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
                    <h2 className="text-3xl font-bold text-slate-900 mb-4 px-2">Choose Your Wellbeing Coach</h2>
                    <p className="text-slate-600 max-w-2xl mx-auto px-4">
                        Select a professional from our network to begin your journey.
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {therapists.map((therapist) => {
                        const isAssigned = assignedTherapistId === therapist.id;

                        return (
                            <Card key={therapist.id} className={`flex flex-col h-full transition-all duration-300 ${isAssigned ? 'ring-2 ring-green-500 shadow-lg' : 'hover:shadow-md'}`}>
                                <CardHeader className="p-5">
                                    <div className="flex items-center gap-4">
                                        <div className="h-14 w-14 rounded-full bg-green-100 flex items-center justify-center text-green-700 overflow-hidden flex-shrink-0 shadow-inner">
                                            {therapist.profile_picture_url ? (
                                                <img
                                                    src={therapist.profile_picture_url}
                                                    alt={`${therapist.name} profile picture`}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <User className="h-7 w-7" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <CardTitle className="text-lg font-bold truncate">{therapist.name}</CardTitle>
                                            <CardDescription className="text-xs text-slate-500 truncate">{therapist.qualifications || "Wellbeing Coach"}</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="flex-grow space-y-3 text-sm text-slate-600">
                                    {therapist.gender && (
                                        <div className="flex justify-between items-center py-1 border-b border-slate-50">
                                            <span className="font-medium text-slate-500">Gender</span>
                                            <span className="text-slate-900">{therapist.gender}</span>
                                        </div>
                                    )}
                                    {therapist.cultural_background && (
                                        <div className="flex justify-between items-start py-1 border-b border-slate-50">
                                            <span className="font-medium text-slate-500">Background</span>
                                            <span className="text-slate-900 text-right">{therapist.cultural_background}</span>
                                        </div>
                                    )}
                                </CardContent>
                                <CardFooter className="pt-4 flex flex-col gap-3">
                                    <Button
                                        variant="outline"
                                        className="w-full h-11 border-green-600 text-green-700 hover:bg-green-50 rounded-xl"
                                        onClick={() => setSelectedDetailsTherapist(therapist)}
                                    >
                                        <Info className="mr-2 h-4 w-4" />
                                        View Profile
                                    </Button>
                                    <Button
                                        className={`w-full h-11 rounded-xl ${isAssigned ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-[#00990d] hover:bg-[#007a0a] text-white'}`}
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
                                            "Select Coach"
                                        )}
                                    </Button>
                                </CardFooter>
                            </Card>
                        );
                    })}
                </div>

                {/* Therapist Details Dialog */}
                <Dialog open={!!selectedDetailsTherapist} onOpenChange={(open) => !open && setSelectedDetailsTherapist(null)}>
                    <DialogContent className="max-w-3xl w-[95vw] sm:w-full h-[90dvh] md:h-[85vh] p-0 overflow-hidden border-none shadow-2xl flex flex-col rounded-2xl">
                        {selectedDetailsTherapist && (
                            <div className="flex flex-col flex-1 bg-white overflow-hidden">
                                <div className="relative h-32 sm:h-40 bg-gradient-to-r from-green-600 to-teal-600">
                                    <div className="absolute -bottom-12 left-4 sm:left-8 p-1 bg-white rounded-2xl shadow-lg">
                                        <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-xl bg-green-50 flex items-center justify-center overflow-hidden">
                                            {selectedDetailsTherapist.profile_picture_url ? (
                                                <img
                                                    src={selectedDetailsTherapist.profile_picture_url}
                                                    alt={selectedDetailsTherapist.name}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <User className="h-12 w-12 text-green-600" />
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-16 px-4 sm:px-8 pb-4">
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                        <div className="flex-1 min-w-0">
                                            <DialogTitle className="text-2xl font-bold text-slate-900 break-words">{selectedDetailsTherapist.name}</DialogTitle>
                                            <p className="text-slate-500 text-sm mt-1">{selectedDetailsTherapist.qualifications || "Wellbeing Coach"}</p>
                                        </div>
                                        <Button
                                            onClick={() => {
                                                handleSelectTherapist(selectedDetailsTherapist.id);
                                                setSelectedDetailsTherapist(null);
                                            }}
                                            disabled={assignedTherapistId === selectedDetailsTherapist.id || assigningId !== null}
                                            className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white min-h-[44px]"
                                        >
                                            {assignedTherapistId === selectedDetailsTherapist.id ? "Already Assigned" : "Select This Coach"}
                                        </Button>
                                    </div>
                                </div>

                                <ScrollArea className="flex-1 px-4 sm:px-8 pb-8">
                                    <Tabs defaultValue="professional" className="w-full">
                                        <TabsList className="bg-slate-100 p-1 rounded-lg mb-6 sticky top-0 z-10 w-full justify-start overflow-x-auto">
                                            <TabsTrigger value="professional" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Professional</TabsTrigger>
                                            <TabsTrigger value="personal" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Personal Info</TabsTrigger>
                                        </TabsList>

                                        <TabsContent value="professional" className="space-y-6 mt-0">
                                            <section>
                                                <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                                                    <GraduationCap className="h-4 w-4 text-green-600" />
                                                    Qualifications
                                                </h4>
                                                <p className="text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                                                    {selectedDetailsTherapist.qualifications || "Information not provided."}
                                                </p>
                                            </section>
                                            <section>
                                                <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                                                    <Briefcase className="h-4 w-4 text-green-600" />
                                                    Professional Experience
                                                </h4>
                                                <p className="text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                                                    {selectedDetailsTherapist.experience || "No experience details available."}
                                                </p>
                                            </section>
                                        </TabsContent>

                                        <TabsContent value="personal" className="space-y-6 mt-0">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                                    <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Gender</h4>
                                                    <p className="text-slate-900 font-medium">{selectedDetailsTherapist.gender || "Not specified"}</p>
                                                </div>
                                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                                    <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Cultural Background</h4>
                                                    <p className="text-slate-900 font-medium">{selectedDetailsTherapist.cultural_background || "Not specified"}</p>
                                                </div>
                                            </div>
                                        </TabsContent>


                                    </Tabs>
                                </ScrollArea>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </section>
    );
}
