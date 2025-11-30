import { generateMetadata as generateSEOMetadata } from "@/lib/seo-utils";
import StructuredData from "@/components/structured-data";
import { generateServiceStructuredData } from "@/lib/seo-utils";
import ExpressInterestForm from "./ExpressInterestForm";

// Force dynamic rendering since we're using no-store cache
export const dynamic = 'force-dynamic';

export const metadata = generateSEOMetadata({
  title: "Wellbeing Activities & Wellbeing Workshops | Right2Thrive UK",
  description: "Join our wellbeing activities and wellbeing workshops designed to empower individuals, build emotional resilience, and promote healing through connection and creativity in North London.",
  keywords: [
    "wellbeing activities",
    "wellbeing workshops",
    "cultural wellbeing",
    "emotional resilience",
    "healing through connection",
    "creative therapy",
    "North London wellbeing activities",
    "community workshops"
  ],
  path: "/cultural-activities",
  image: "/right2thrive-logo.jpg"
});

const culturalServices = [
  {
    name: "Cultural Wellbeing Workshops",
    description: "Workshops designed to empower individuals, build emotional resilience, and promote healing through connection and creativity.",
    provider: "Right2Thrive UK",
    areaServed: "North London",
    serviceType: "Cultural Activity",
    offers: {
      price: "0",
      priceCurrency: "GBP",
      availability: "InStock"
    }
  },
  {
    name: "Creative Therapy Sessions",
    description: "Creative therapy sessions that combine wellbeing activities with therapeutic support to promote healing and personal growth.",
    provider: "Right2Thrive UK",
    areaServed: "North London",
    serviceType: "Therapeutic Service",
    offers: {
      price: "0",
      priceCurrency: "GBP",
      availability: "InStock"
    }
  }
];

type Event = {
  id: number;
  title: string;
  event_date: string;
  registration_link: string | null;
  registration_start?: string;
  registration_end?: string;
  cost?: number | string | null;
  description?: string;
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

function toSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch {
    // Fallback: just extract the date part from ISO string
    return dateString.split('T')[0];
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

// Static upcoming events
const staticEvents: Event[] = [
  {
    id: 1001,
    title: "Not Feeling Great but Looking Good",
    event_date: "2026-01-14T11:00:00",
    registration_link: null,
    cost: 0,
    description: "A relaxed, supportive session exploring how your emotions shape the way you act, connect with others, and understand yourself.\n\nWhat you will gain:\n• Better awareness of your emotions\n• Practical tools for handling tough feelings\n• Confidence in expressing yourself\n• Tips for healthier relationships\n• A safe space to talk and be heard\n\nWhy attend:\n• Real life strategies that actually help\n• Friendly and judgement free\n• No pressure to talk—just attend",
    location: {
      location_name: "Right2Thrive UK Wellbeing Hub",
      address: "37/38 North Square, Edmonton Green Shopping Centre",
      city: "London",
      postcode: "N9 0HY",
      latitude: null,
      longitude: null
    }
  },
  {
    id: 1002,
    title: "Understanding Trauma & PTSD",
    event_date: "2026-01-21T11:00:00",
    registration_link: null,
    cost: 0,
    description: "A calm, supportive session helping you understand trauma, its effects on your body and mind, and grounding methods for when things feel overwhelming.\n\nWhat you will gain:\n• Clear understanding of trauma and PTSD\n• Insight into trauma responses\n• Grounding methods you can use anytime\n• Tools for stability during stress\n• A gentle, safe learning space\n\nWhy attend:\n• Helps make sense of your experiences\n• Learn skills you can use straight away\n• Designed for young people",
    location: {
      location_name: "Right2Thrive UK Wellbeing Hub",
      address: "37/38 North Square, Edmonton Green Shopping Centre",
      city: "London",
      postcode: "N9 0HY",
      latitude: null,
      longitude: null
    }
  },
  {
    id: 1003,
    title: "Anger Management",
    event_date: "2026-01-28T11:00:00",
    registration_link: null,
    cost: 0,
    description: "A judgement free workshop exploring what's behind your anger and how to manage it in healthier, more positive ways.\n\nWhat you will gain:\n• Understanding anger triggers\n• Calming tools for mind and body\n• Strategies for conflict and frustration\n• Healthier ways to express emotions\n• Confidence in handling stressful situations\n\nWhy attend:\n• Makes everyday challenges easier\n• Safe, friendly environment\n• No pressure to share personal stories",
    location: {
      location_name: "Right2Thrive UK Wellbeing Hub",
      address: "37/38 North Square, Edmonton Green Shopping Centre",
      city: "London",
      postcode: "N9 0HY",
      latitude: null,
      longitude: null
    }
  },
  {
    id: 1004,
    title: "Reality Check: Poverty, Education & Independence",
    event_date: "2026-02-04T11:00:00",
    registration_link: null,
    cost: 0,
    description: "Aimed at families and young people in deprived areas experiencing cost of living stress, insecure housing or unemployment.\n\nA practical, down to earth workshop exploring how poverty, housing issues, and education challenges affect your daily life. Learn tools for building independence, accessing support, and planning a more stable future.\n\nWhat you will gain:\n• Understanding the impact of financial and social pressures\n• Tips for managing daily challenges\n• Guidance on education, training, and employment\n• Tools for building confidence and independence\n• A supportive space to connect with others\n\nWhy attend:\n• Tailored for families facing real life financial pressures\n• Provides useful, realistic strategies\n• Connect with others who understand your situation\n• Empowering—not judgemental",
    location: {
      location_name: "Right2Thrive UK Wellbeing Hub",
      address: "37/38 North Square, Edmonton Green Shopping Centre",
      city: "London",
      postcode: "N9 0HY",
      latitude: null,
      longitude: null
    }
  },
  {
    id: 1005,
    title: "Anxiety Awareness & Mindful Management",
    event_date: "2026-02-11T11:00:00",
    registration_link: null,
    cost: 0,
    description: "A calm, helpful session for anyone facing daily anxiety. Learn how anxiety works and discover mindfulness and CBT techniques to help you feel more grounded and in control.\n\nWhat you will gain:\n• Clear understanding of anxiety\n• Mindfulness tools to calm your thoughts\n• CBT strategies for unhelpful thinking\n• Everyday coping skills\n• A pressure free, supportive environment\n\nWhy attend:\n• Perfect for daily stress, worry, or overthinking\n• Builds confidence in managing anxiety\n• Practical techniques you can use instantly",
    location: {
      location_name: "Right2Thrive UK Wellbeing Hub",
      address: "37/38 North Square, Edmonton Green Shopping Centre",
      city: "London",
      postcode: "N9 0HY",
      latitude: null,
      longitude: null
    }
  },
  {
    id: 1006,
    title: "Intergenerational Trauma & Family Healing",
    event_date: "2026-02-18T11:00:00",
    registration_link: null,
    cost: 0,
    description: "A supportive, culturally aware session exploring how trauma can be passed through families and how racism, discrimination, and community pressures shape our experiences today. This workshop helps you understand these patterns, recognise your strengths, and explore ways to create healing within yourself, your family, and your future relationships.\n\nWhat you will gain:\n• A clearer understanding of intergenerational trauma and how it can show up in emotions, behaviours, and family dynamics\n• Tools to recognise the impact of racism and systemic inequality on mental health\n• Strategies for setting boundaries, communicating needs, and caring for yourself\n• Ways to break harmful cycles and build healthier patterns\n• A safe, affirming space to learn without judgement, pressure, or stigma\n\nWhy attend:\n• Created specifically for young Black people navigating racial stress and family pressures\n• Helps you understand your experiences in a validating, empowering way\n• Focuses on healing, resilience, and reclaiming your power\n• Encourages connection, community, and hope for the future",
    location: {
      location_name: "Right2Thrive UK Wellbeing Hub",
      address: "37/38 North Square, Edmonton Green Shopping Centre",
      city: "London",
      postcode: "N9 0HY",
      latitude: null,
      longitude: null
    }
  }
];

async function getEvents(): Promise<Event[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/events`, {
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("Failed to fetch events", res.status, await res.text());
      return staticEvents;
    }

    const data = await res.json();

    if (Array.isArray(data?.events)) {
      // Merge API events with static events, avoiding duplicates
      const apiEvents = data.events;
      const staticEventIds = new Set(staticEvents.map(e => e.id));
      const uniqueApiEvents = apiEvents.filter((e: Event) => !staticEventIds.has(e.id));
      return [...staticEvents, ...uniqueApiEvents].sort((a, b) => 
        new Date(a.event_date).getTime() - new Date(b.event_date).getTime()
      );
    }

    return staticEvents;
  } catch (error) {
    console.error("Error fetching events", error);
    return staticEvents;
  }
}

export default async function WellbeingWorkshops() {
  const events = await getEvents();
  return (
    <>
      {culturalServices.map((service, index) => (
        <StructuredData
          key={index}
          data={generateServiceStructuredData(service)}
          id={`cultural-service-schema-${index}`}
        />
      ))}
      <div className="min-h-screen bg-slate-50">
        <div className="container mx-auto px-4 py-12">
          {/* Hero */}
          <section className="mb-12 rounded-3xl bg-gradient-to-r from-[#00990d] via-[#00b83a] to-[#7dd56f] px-6 py-10 text-white shadow-lg md:px-10 md:py-14">
            <div className="grid gap-10 md:grid-cols-[1.7fr,1.1fr] md:items-center">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-100">
                  Wellbeing Activities & Wellbeing
                </p>
                <h1 className="mt-3 text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">
                  Right2Thrive UK
                  <br />
                  <span className="text-amber-200">
                    Wellbeing & Cultural Hub
                  </span>
                </h1>
                <p className="mt-5 max-w-2xl text-sm sm:text-base text-emerald-50">
                  Evidence-informed workshops and wellbeing activities designed to
                  build emotional resilience, support trauma recovery, and
                  strengthen community connection in North London.
                </p>

                <div className="mt-6 flex flex-wrap gap-4 text-xs sm:text-sm">
                  <div className="rounded-full bg-emerald-700/70 px-4 py-2 shadow-sm">
                    Trauma-informed & culturally responsive
                  </div>
                  <div className="rounded-full bg-emerald-700/70 px-4 py-2 shadow-sm">
                    Online & in-person group programmes
                  </div>
                  <div className="rounded-full bg-emerald-700/70 px-4 py-2 shadow-sm">
                    Accessible for communities across North London
                  </div>
                </div>
              </div>

              {/* Quick registration card in hero */}
              <div className="rounded-2xl bg-white/95 p-6 text-slate-900 shadow-xl backdrop-blur-sm">
                <h2 className="text-lg font-semibold text-[#00990d]">
                  Express your interest
                </h2>
                <p className="mt-2 text-sm text-slate-600">
                  Share your details and we&apos;ll send you upcoming dates and
                  registration links for our next programmes.
                </p>
                <ExpressInterestForm />
              </div>
            </div>
          </section>

          {/* Events */}
          <section className="mb-14">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900 sm:text-2xl">
                  Upcoming events & workshops
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  Explore our current programme of cultural and wellbeing
                  activities.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 font-medium text-emerald-800">
                  Live programme
                </span>
                <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-slate-600">
                  Updated regularly
                </span>
              </div>
            </div>

            {events.length === 0 && (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-10 text-center text-slate-600">
                <p className="text-sm font-medium">
                  There are currently no upcoming events scheduled.
                </p>
                <p className="mt-2 text-xs text-slate-500">
                  Join our mailing list above and we&apos;ll let you know as
                  soon as new workshops go live.
                </p>
              </div>
            )}

            {events.length > 0 && (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {events.map((event) => (
                  <article
                    key={event.id}
                    className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-base font-semibold text-slate-900 sm:text-lg">
                          {event.title}
                        </h3>
                        <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-100">
                          Wellbeing activity
                        </span>
                      </div>
                      <div className="mt-3 space-y-1.5 text-xs text-slate-600">
                        <p>
                          <span className="font-semibold text-slate-800">
                            Date:
                          </span>{" "}
                          {formatDate(event.event_date)}
                        </p>
                        <p>
                          <span className="font-semibold text-slate-800">
                            Time:
                          </span>{" "}
                          11:00 am – 1:00 pm
                        </p>
                        {event.location && formatLocation(event) && (
                          <p>
                            <span className="font-semibold text-slate-800">
                              Location:
                            </span>{" "}
                            {event.location.latitude && event.location.longitude ? (
                              <a
                                href={getGoogleMapsUrl(event.location.latitude, event.location.longitude)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#00990d] hover:underline"
                              >
                                {formatLocation(event)}
                              </a>
                            ) : (
                              formatLocation(event)
                            )}
                          </p>
                        )}
                        {typeof event.cost !== "undefined" &&
                          event.cost !== null && Number(event.cost) === 0 && (
                            <p>
                              <span className="font-semibold text-slate-800">
                                Cost:
                              </span>{" "}
                              Free
                            </p>
                          )}
                      </div>
                      {event.description && (
                        <div className="mt-3 text-sm text-slate-700">
                          <p className="line-clamp-3 whitespace-pre-line">
                            {event.description.split('\n\n')[0]}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="mt-5 flex flex-wrap gap-3">
                      {event.registration_link && (
                        <a
                          href={event.registration_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex flex-1 items-center justify-center rounded-md bg-[#00990d] px-4 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-green-700"
                        >
                          Register / Learn more
                        </a>
                      )}
                      <a
                        href={`/cultural-activities/${event.id}-${toSlug(
                          event.title
                        )}`}
                        className="inline-flex items-center text-xs font-semibold text-[#00990d] hover:underline"
                      >
                        View full details
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          {/* Programme themes */}
          <section className="mb-14">
            <h2 className="text-xl font-semibold text-slate-900 sm:text-2xl">
              Programme themes
            </h2>
            <p className="mt-2 text-sm text-slate-600 max-w-2xl">
              Our workshops are organised around key themes that support healing,
              resilience, and connection for communities impacted by trauma,
              displacement, and structural inequality.
            </p>
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="text-sm font-semibold text-slate-900">
                  Trauma, PTSD & the nervous system
                </h3>
                <p className="mt-2 text-sm text-slate-700">
                  Understand how trauma impacts the brain and body, and learn
                  grounding, breathwork, and somatic practices to restore a
                  sense of safety.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="text-sm font-semibold text-slate-900">
                  Anxiety, emotional regulation & distress tolerance
                </h3>
                <p className="mt-2 text-sm text-slate-700">
                  Develop practical tools from CBT and DBT to manage anxiety,
                  navigate intense emotions, and respond rather than react.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="text-sm font-semibold text-slate-900">
                  Mindfulness, creativity & cultural practices
                </h3>
                <p className="mt-2 text-sm text-slate-700">
                  Explore mindfulness through art, movement, and cultural
                  rituals that honour identity, heritage, and community.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="text-sm font-semibold text-slate-900">
                  Intergenerational wellbeing & belonging
                </h3>
                <p className="mt-2 text-sm text-slate-700">
                  Create space to reflect on migration, identity, and
                  intergenerational dynamics, and to strengthen relationships
                  across families and communities.
                </p>
              </div>
            </div>
          </section>

          {/* What you can expect from our spaces */}
          <section className="mb-10 flex justify-center">
            <div className="w-full max-w-2xl rounded-2xl bg-emerald-50 p-6 text-sm text-slate-800 shadow-sm md:p-8">
              <h3 className="text-base font-semibold text-emerald-900 sm:text-lg">
                What you can expect from our spaces
              </h3>
              <ul className="mt-4 space-y-2 text-sm">
                <li>• Culturally sensitive, non-judgemental facilitation.</li>
                <li>• A focus on safety, consent, and choice in every session.</li>
                <li>• Practical tools you can use beyond the workshop.</li>
                <li>• Opportunities to connect with others who share similar experiences.</li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
