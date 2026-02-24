// Force file update for VPS cache
import { notFound } from "next/navigation";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo-utils";
import Link from "next/link";
import { Calendar, MapPin, PoundSterling, ExternalLink, ArrowLeft, Clock, Users, User } from "lucide-react";

function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch {
    return dateString.split('T')[0];
  }
}

function formatTime(timeString?: string | null): string | null {
  if (!timeString) return null;

  try {
    const [hours, minutes] = timeString.split(":");
    const date = new Date();
    date.setHours(Number(hours), Number(minutes), 0, 0);

    return date.toLocaleTimeString("en-GB", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return timeString;
  }
}

function formatLocation(event: Event): string {
  if (!event.location) return '';

  const parts: string[] = [];
  if (event.location.location_name) parts.push(event.location.location_name);
  if (event.location.address) parts.push(event.location.address);
  if (event.location.city) parts.push(event.location.city);
  if (event.location.postcode) parts.push(event.location.postcode);

  return parts.join(', ');
}

function getGoogleMapsUrl(latitude: number, longitude: number): string {
  return `https://www.google.com/maps?q=${latitude},${longitude}`;
}

type Event = {
  id: number;
  title: string;
  event_date: string;
  event_type: 'physical' | 'online';
  session_link: string | null;
  start_time?: string | null;
  end_time?: string | null;
  registration_link: string | null;
  registration_start?: string;
  registration_end?: string;
  cost?: number | string | null;
  description?: string;
  organizer?: {
    id: number;
    name: string;
    title: string;
    slug: string;
    profile_image: string;
    short_intro: string;
    bio: string;
  } | null;
  location?: {
    location_name: string | null;
    address: string | null;
    city: string | null;
    postcode: string | null;
    latitude: number | null;
    longitude: number | null;
  };
  images?: string[];
  videos?: string[];
};

type EventResponse =
  | { success: boolean; event: Event }
  | { success: boolean; events: Event[] }
  | Event;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = await getEvent(id);

  if (!event) {
    return generateSEOMetadata({
      title: "Event not found | Right2Thrive UK",
      description: "The requested event could not be found.",
      path: `/cultural-activities/${id}`,
    });
  }

  return generateSEOMetadata({
    title: `${event.title} | Right2Thrive UK`,
    description: event.description || "Right2Thrive UK cultural activity event.",
    path: `/cultural-activities/${event.id}`,
  });
}

function extractNumericId(idOrSlug: string): string | null {
  // Supports "1", "1-some-title", etc.
  const match = idOrSlug.match(/^\d+/);
  return match ? match[0] : null;
}

async function getEvent(idOrSlug: string): Promise<Event | null> {
  try {
    const numericId = extractNumericId(idOrSlug);
    if (!numericId) {
      return null;
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/events/${numericId}`,
      {
        cache: "no-store",
      }
    );

    if (!res.ok) {
      console.error("Failed to fetch event", res.status, await res.text());
      return null;
    }

    const data: EventResponse = await res.json();

    if ("event" in data && data.event) {
      return data.event;
    }

    if ("events" in data && Array.isArray(data.events) && data.events[0]) {
      return data.events[0];
    }

    if ("id" in data) {
      return data as Event;
    }

    return null;
  } catch (error) {
    console.error("Error fetching event", error);
    return null;
  }
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = await getEvent(id);

  if (!event) {
    notFound();
  }

  const heroImage = event.images && event.images.length > 0 ? event.images[0] : null;
  const otherImages = event.images && event.images.length > 1 ? event.images.slice(1) : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50">
      {/* Back Button */}
      <div className="container mx-auto px-4 pt-6">
        <Link
          href="/cultural-activities"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-[#00990d] transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Events
        </Link>
      </div>

      <div className="container mx-auto px-4 pb-12">
        {/* Hero Section */}
        <div className="mb-8 rounded-3xl overflow-hidden shadow-xl bg-white">
          {heroImage && (
            <div className="relative h-64 md:h-96 w-full">
              <img
                src={heroImage}
                alt={event.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            </div>
          )}

          <div className="p-6 md:p-10">
            <div className="mb-4">
              <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${event.event_type === 'online'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-emerald-100 text-emerald-700'
                }`}>
                {event.event_type === 'online' ? 'Online Event' : 'Wellbeing Activity'}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 mb-6">
              {event.title}
            </h1>

            {/* Event Details Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
              <div className="flex items-start gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-100">
                <Calendar className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-emerald-900 uppercase tracking-wide mb-1">
                    Event Date
                  </p>
                  <p className="text-sm font-medium text-slate-700">
                    {formatDate(event.event_date)}
                  </p>
                  {(event.start_time || event.end_time) && (
                    <p className="text-xs text-slate-600 mt-1">
                      {event.start_time && event.end_time
                        ? `${formatTime(event.start_time)} - ${formatTime(event.end_time)}`
                        : formatTime(event.start_time) || formatTime(event.end_time) || ''}
                    </p>
                  )}
                </div>
              </div>

              {event.event_type === 'physical' && event.location && formatLocation(event) && (
                <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-50 border border-blue-100">
                  <MapPin className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-blue-900 uppercase tracking-wide mb-1">
                      Location
                    </p>
                    {event.location.latitude && event.location.longitude ? (
                      <a
                        href={getGoogleMapsUrl(event.location.latitude, event.location.longitude)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-blue-700 hover:text-blue-900 hover:underline inline-flex items-center gap-1"
                      >
                        {formatLocation(event)}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    ) : (
                      <p className="text-sm font-medium text-slate-700">
                        {formatLocation(event)}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {event.event_type === 'online' && (
                <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-50 border border-blue-100">
                  <MapPin className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-blue-900 uppercase tracking-wide mb-1">
                      Location
                    </p>
                    <p className="text-sm font-medium text-slate-700">
                      Online Event
                    </p>
                  </div>
                </div>
              )}

              {typeof event.cost !== "undefined" && event.cost !== null && (
                <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 border border-amber-100">
                  <PoundSterling className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-amber-900 uppercase tracking-wide mb-1">
                      Contribution
                    </p>
                    <p className="text-sm font-medium text-slate-700">
                      {Number(event.cost) === 0 ? 'Free' : `£${Number(event.cost).toFixed(2)}`}
                    </p>
                  </div>
                </div>
              )}

              {event.registration_start && event.registration_end && (
                <div className="flex items-start gap-3 p-4 rounded-xl bg-purple-50 border border-purple-100">
                  <Clock className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-purple-900 uppercase tracking-wide mb-1">
                      Registration Period
                    </p>
                    <p className="text-sm font-medium text-slate-700">
                      {formatDate(event.registration_start)} - {formatDate(event.registration_end)}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            {event.description && (
              <div className="mt-6 p-6 md:p-8 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-1 w-12 bg-gradient-to-r from-[#00990d] to-[#00b83a] rounded-full" />
                  <h2 className="text-xl font-bold text-slate-900">About this Event</h2>
                </div>
                <div className="prose prose-slate max-w-none">
                  <p className="text-slate-700 leading-relaxed whitespace-pre-line text-base">
                    {event.description}
                  </p>
                </div>
              </div>
            )}

            {/* Organizer Section */}
            {event.organizer && (
              <div className="mt-6 p-6 md:p-8 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-1 w-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full" />
                  <h2 className="text-xl font-bold text-slate-900">Event Organizer</h2>
                </div>
                <div className="flex flex-col md:flex-row gap-6">
                  {event.organizer.profile_image && (
                    <div className="flex-shrink-0">
                      <img
                        src={event.organizer.profile_image}
                        alt={event.organizer.name}
                        className="w-32 h-32 md:w-40 md:h-40 rounded-xl object-cover shadow-lg border-4 border-white"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-2">
                      <User className="h-5 w-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">{event.organizer.name}</h3>
                        {event.organizer.title && (
                          <p className="text-sm font-medium text-indigo-700 mt-0.5">{event.organizer.title}</p>
                        )}
                      </div>
                    </div>
                    {event.organizer.short_intro && (
                      <p className="text-sm text-slate-700 mb-3 leading-relaxed">
                        {event.organizer.short_intro}
                      </p>
                    )}
                    {event.organizer.bio && (
                      <div className="mt-4 p-4 rounded-lg bg-white/60 border border-indigo-100">
                        <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                          {event.organizer.bio}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Registration Button */}
            {/* Join / Registration Buttons */}
            {(event.registration_link || (event.event_type === 'online' && event.session_link)) && (
              <div className="mt-8 pt-6 border-t border-slate-200 flex flex-wrap gap-4">
                {event.event_type === 'online' && event.session_link && (
                  <a
                    href={event.session_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-8 py-4 text-base font-semibold text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
                  >
                    Join Session
                    <ExternalLink className="h-5 w-5" />
                  </a>
                )}
                {event.registration_link && (
                  <a
                    href={event.registration_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#00990d] to-[#00b83a] px-8 py-4 text-base font-semibold text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
                  >
                    Register / Visit Event Page
                    <ExternalLink className="h-5 w-5" />
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Images Gallery */}
        {otherImages.length > 0 && (
          <section className="mb-8">
            <div className="rounded-3xl bg-white p-6 md:p-10 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-1 w-12 bg-gradient-to-r from-[#00990d] to-[#00b83a] rounded-full" />
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
                  Event Gallery
                </h2>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {otherImages.map((src, index) => (
                  <div
                    key={index}
                    className="relative aspect-video rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow group cursor-pointer"
                  >
                    <img
                      src={src}
                      alt={`${event.title} image ${index + 2}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Videos Section */}
        {event.videos && event.videos.length > 0 && (
          <section className="mb-8">
            <div className="rounded-3xl bg-white p-6 md:p-10 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-1 w-12 bg-gradient-to-r from-[#00990d] to-[#00b83a] rounded-full" />
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
                  Event Videos
                </h2>
              </div>
              <div className="space-y-6">
                {event.videos.map((src, index) => (
                  <div
                    key={index}
                    className="relative aspect-video rounded-xl overflow-hidden shadow-lg bg-slate-900"
                  >
                    <video
                      src={src}
                      controls
                      className="w-full h-full object-contain"
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
