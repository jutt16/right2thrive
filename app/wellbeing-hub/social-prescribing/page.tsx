"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, ExternalLink, MapPin, Loader2, Tag } from "lucide-react";
import {
  getSocialPrescribingServices,
  type SocialPrescribingService,
} from "@/lib/social-prescribing-api";

const CATEGORY_OPTIONS = [
  { value: "all", label: "All categories" },
  { value: "activities", label: "Activities" },
  { value: "groups", label: "Groups" },
  { value: "link_workers", label: "Link workers" },
  { value: "local_services", label: "Local services" },
];

export default function SocialPrescribingPage() {
  const router = useRouter();
  const [services, setServices] = useState<SocialPrescribingService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [category, setCategory] = useState("all");
  const [area, setArea] = useState("");

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
        const data = await getSocialPrescribingServices({
          category: category && category !== "all" ? category : undefined,
          area: area.trim() || undefined,
        });
        setServices(data);
      } catch {
        setError("Failed to load services.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [router]);

  const handleFilter = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    getSocialPrescribingServices({
      category: category && category !== "all" ? category : undefined,
      area: area.trim() || undefined,
    })
      .then(setServices)
      .catch(() => setError("Failed to load services."))
      .finally(() => setLoading(false));
  };

  if (typeof window !== "undefined" && !localStorage.getItem("token")) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-6">
          <Link
            href="/wellbeing-hub"
            className="inline-flex items-center gap-2 text-[#00990d] hover:text-[#007a0a] font-medium"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Wellbeing Hub
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#00990d] mb-4">
            Social Prescribing
          </h1>
          <p className="text-lg text-gray-700">
            Find local activities, groups, link workers and services that can support your wellbeing. Filter by category or area.
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-8 border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Filter services</CardTitle>
            <CardDescription>
              Narrow results by category or area (e.g. North London).
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleFilter} className="flex flex-wrap gap-4 items-end">
              <div className="space-y-2 min-w-[180px]">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={category}
                  onValueChange={(v) => {
                    setCategory(v);
                  }}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORY_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 min-w-[180px]">
                <Label htmlFor="area">Area</Label>
                <Input
                  id="area"
                  placeholder="e.g. North London"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                />
              </div>
              <Button type="submit" variant="secondary" className="bg-gray-100 hover:bg-gray-200">
                Apply filters
              </Button>
            </form>
          </CardContent>
        </Card>

        {error && (
          <p className="mb-4 text-sm text-red-600 bg-red-50 px-3 py-2 rounded">
            {error}
          </p>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-[#00990d]" />
          </div>
        ) : services.length === 0 ? (
          <Card className="border-gray-200 bg-white">
            <CardContent className="pt-6">
              <p className="text-gray-600">
                No services match your filters. Try changing the category or area, or check back later.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {services.map((service) => (
              <Card
                key={service.id}
                className="border-gray-200 shadow-sm hover:border-[#00990d]/40 transition-colors"
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <CardTitle className="text-xl">
                        <Link
                          href={`/wellbeing-hub/social-prescribing/${service.id}`}
                          className="text-[#00990d] hover:text-[#007a0a] hover:underline"
                        >
                          {service.name}
                        </Link>
                      </CardTitle>
                      {service.category && (
                        <span className="inline-flex items-center gap-1 mt-1 text-sm text-gray-500">
                          <Tag className="h-3.5 w-3.5" />
                          {service.category}
                        </span>
                      )}
                    </div>
                    <Link
                      href={`/wellbeing-hub/social-prescribing/${service.id}`}
                      className="shrink-0 text-[#00990d] hover:text-[#007a0a] font-medium text-sm flex items-center gap-1"
                    >
                      View details
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  {service.description && (
                    <p className="text-gray-700 text-sm line-clamp-2 mb-2">
                      {service.description}
                    </p>
                  )}
                  {service.area && (
                    <p className="text-gray-500 text-sm flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {service.area}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
