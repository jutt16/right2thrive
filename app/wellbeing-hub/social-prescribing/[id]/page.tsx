"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, ExternalLink, MapPin, Loader2, Tag, Phone, Globe } from "lucide-react";
import { getSocialPrescribingService } from "@/lib/social-prescribing-api";

export default function SocialPrescribingDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string | undefined;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [service, setService] = useState<Awaited<ReturnType<typeof getSocialPrescribingService>>>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !id) return;
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/auth/login");
      return;
    }

    getSocialPrescribingService(id)
      .then((data) => {
        setService(data);
        if (!data) setError("Service not found.");
      })
      .catch(() => setError("Failed to load service."))
      .finally(() => setLoading(false));
  }, [router, id]);

  if (typeof window !== "undefined" && !localStorage.getItem("token")) {
    return null;
  }

  if (!id) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <p className="text-gray-600">Invalid service.</p>
          <Link href="/wellbeing-hub/social-prescribing" className="text-[#00990d] hover:underline mt-4 inline-block">
            Back to Social Prescribing
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-6">
          <Link
            href="/wellbeing-hub/social-prescribing"
            className="inline-flex items-center gap-2 text-[#00990d] hover:text-[#007a0a] font-medium"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Social Prescribing
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-[#00990d]" />
          </div>
        ) : error || !service ? (
          <Card className="border-gray-200 bg-white">
            <CardContent className="pt-6">
              <p className="text-gray-600">{error || "Service not found."}</p>
              <Link
                href="/wellbeing-hub/social-prescribing"
                className="text-[#00990d] hover:text-[#007a0a] font-medium mt-4 inline-block"
              >
                View all services
              </Link>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-gray-200 shadow-sm overflow-hidden">
            <CardHeader className="bg-gray-50/50">
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                {service.category && (
                  <span className="inline-flex items-center gap-1">
                    <Tag className="h-3.5 w-3.5" />
                    {service.category}
                  </span>
                )}
                {service.area && (
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {service.area}
                  </span>
                )}
              </div>
              <CardTitle className="text-2xl text-gray-900">
                {service.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              {service.description && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Description</h3>
                  <p className="text-gray-700 whitespace-pre-wrap">{service.description}</p>
                </div>
              )}

              {service.url && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Website</h3>
                  <a
                    href={service.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-[#00990d] hover:text-[#007a0a] font-medium"
                  >
                    <Globe className="h-4 w-4" />
                    {service.url.replace(/^https?:\/\//, "")}
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              )}

              {service.contact && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Contact</h3>
                  <p className="text-gray-700 flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    {service.contact}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
