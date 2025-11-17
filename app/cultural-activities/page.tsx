import { generateMetadata as generateSEOMetadata } from "@/lib/seo-utils";
import StructuredData from "@/components/structured-data";
import { generateServiceStructuredData } from "@/lib/seo-utils";
import ExpressInterestForm from "./ExpressInterestForm";

export const metadata = generateSEOMetadata({
  title: "Cultural Activities & Wellbeing Workshops | Right2Thrive UK",
  description: "Join our cultural activities and wellbeing workshops designed to empower individuals, build emotional resilience, and promote healing through connection and creativity in North London.",
  keywords: [
    "cultural activities",
    "wellbeing workshops",
    "cultural wellbeing",
    "emotional resilience",
    "healing through connection",
    "creative therapy",
    "North London cultural activities",
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
    description: "Creative therapy sessions that combine cultural activities with therapeutic support to promote healing and personal growth.",
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

async function getEvents(): Promise<Event[]> {
  try {
    const res = await fetch("https://admin.right2thriveuk.com/api/events", {
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("Failed to fetch events", res.status, await res.text());
      return [];
    }

    const data = await res.json();

    if (Array.isArray(data?.events)) {
      return data.events;
    }

    return [];
  } catch (error) {
    console.error("Error fetching events", error);
    return [];
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
                  Cultural Activities & Wellbeing
                </p>
                <h1 className="mt-3 text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">
                  Right2Thrive UK
                  <br />
                  <span className="text-amber-200">
                    Wellbeing & Cultural Hub
                  </span>
                </h1>
                <p className="mt-5 max-w-2xl text-sm sm:text-base text-emerald-50">
                  Evidence-informed workshops and cultural activities designed to
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
                          Cultural activity
                        </span>
                      </div>
                      <div className="mt-3 space-y-1.5 text-xs text-slate-600">
                        <p>
                          <span className="font-semibold text-slate-800">
                            Date:
                          </span>{" "}
                          {event.event_date}
                        </p>
                        {typeof event.cost !== "undefined" &&
                          event.cost !== null && (
                            <p>
                              <span className="font-semibold text-slate-800">
                                Contribution:
                              </span>{" "}
                              £{Number(event.cost).toFixed(2)}
                            </p>
                          )}
                      </div>
                      {event.description && (
                        <p className="mt-3 line-clamp-4 text-sm text-slate-700">
                          {event.description}
                        </p>
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

          {/* About Raveen */}
          <section className="mb-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <div className="grid gap-6 md:grid-cols-[minmax(0,1.6fr),minmax(0,1.2fr)] md:items-center">
              <div>
                <h2 className="text-xl font-semibold text-slate-900 sm:text-2xl">
                  About Raveen
                </h2>
                <p className="mt-3 text-sm text-slate-700">
                  Raveen is a registered psychotherapist with over 10 years of
                  experience in mental health and social care, including work
                  within probation services, the NHS, and local authorities. Her
                  practice integrates evidence-based Western approaches with
                  Eastern traditions such as breathwork and mindfulness.
                </p>
                <p className="mt-3 text-sm text-slate-700">
                  Through Right2Thrive UK, she facilitates group programmes that
                  centre safety, dignity, and cultural understanding—supporting
                  participants to make sense of trauma, strengthen emotional
                  resources, and reconnect with creativity and community.
                </p>
              </div>
              <div className="rounded-2xl bg-emerald-50 p-5 text-sm text-slate-800">
                <h3 className="text-sm font-semibold text-emerald-900">
                  What you can expect from our spaces
                </h3>
                <ul className="mt-3 space-y-2 text-sm">
                  <li>• Culturally sensitive, non-judgemental facilitation.</li>
                  <li>• A focus on safety, consent, and choice in every session.</li>
                  <li>• Practical tools you can use beyond the workshop.</li>
                  <li>• Opportunities to connect with others who share similar experiences.</li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
