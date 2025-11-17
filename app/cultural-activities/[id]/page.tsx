import { notFound } from "next/navigation";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo-utils";

type Event = {
  id: number;
  title: string;
  event_date: string;
  registration_link: string | null;
  registration_start?: string;
  registration_end?: string;
  cost?: number | string | null;
  description?: string;
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
      `https://admin.right2thriveuk.com/api/events/${numericId}`,
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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-[#ff961b] mb-4">
        {event.title}
      </h1>

      <div className="mb-4 text-gray-700 space-y-1">
        <p>
          <span className="font-semibold">Date:</span> {event.event_date}
        </p>
        {event.registration_start && event.registration_end && (
          <p>
            <span className="font-semibold">Registration:</span>{" "}
            {event.registration_start} - {event.registration_end}
          </p>
        )}
        {typeof event.cost !== "undefined" && event.cost !== null && (
          <p>
            <span className="font-semibold">Cost:</span> £
            {Number(event.cost).toFixed(2)}
          </p>
        )}
      </div>

      {event.description && (
        <p className="text-gray-800 mb-6 whitespace-pre-line">
          {event.description}
        </p>
      )}

      {event.registration_link && (
        <div className="mb-8">
          <a
            href={event.registration_link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-md bg-[#00990d] px-6 py-2 text-sm font-semibold text-white hover:bg-green-700 transition-colors"
          >
            Register / Visit event page
          </a>
        </div>
      )}

      {event.images && event.images.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-[#00990d] mb-3">
            Event Images
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {event.images.map((src, index) => (
              <img
                key={index}
                src={src}
                alt={`${event.title} image ${index + 1}`}
                className="w-full h-auto rounded-lg border border-gray-200 object-cover"
              />
            ))}
          </div>
        </div>
      )}

      {event.videos && event.videos.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-[#00990d] mb-3">
            Event Videos
          </h2>
          <div className="space-y-4">
            {event.videos.map((src, index) => (
              <video
                key={index}
                src={src}
                controls
                className="w-full rounded-lg border border-gray-200"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


