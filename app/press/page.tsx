"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Calendar,
  ExternalLink,
  ArrowLeftCircle,
  ArrowRightCircle,
} from "lucide-react";

// Swiper imports
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import DownloadPressRelease from "@/components/ui/download-press-release";

export default function PressRelease() {
  const photos = [
    "/press1.jpg",
    "/press2.jpg",
    "/press3.jpg",
    "/press4.jpg",
    "/press5.jpg",
    "/press6.jpg",
    "/press7.jpg",
  ];

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      {/* 🔹 Top Photo Slider */}
      <section className="mb-12">
        <div className="relative">
          <Swiper
            modules={[Navigation, Autoplay, Pagination]}
            navigation={{
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
            }}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            spaceBetween={20}
            slidesPerView={1}
            breakpoints={{
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="rounded-xl"
          >
            {photos.map((src, idx) => (
              <SwiperSlide key={idx}>
                <div className="relative h-72 rounded-xl overflow-hidden shadow-lg group">
                  <Image
                    src={src}
                    alt={`Press Release Photo ${idx + 1}`}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* 🔹 Navigation Buttons */}
          <button className="swiper-button-prev absolute left-2 top-1/2 -translate-y-1/2 z-10 p-1.5 bg-white/90 rounded-full shadow-sm hover:bg-white transition">
            <ArrowLeftCircle className="h-6 w-6 text-teal-700 hover:text-teal-900" />
          </button>
          <button className="swiper-button-next absolute right-2 top-1/2 -translate-y-1/2 z-10 p-1.5 bg-white/90 rounded-full shadow-sm hover:bg-white transition">
            <ArrowRightCircle className="h-6 w-6 text-teal-700 hover:text-teal-900" />
          </button>
        </div>
      </section>

      {/* 🔹 Page Header */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-[#ff961b] mb-2">
          UK’s First Wellbeing Hub to Tackle Community Violence Opens in
          Edmonton Green
        </h1>
        <p className="text-gray-600">
          Latest news and announcements from Right2Thrive UK
        </p>
      </div>

      {/* 🔹 Main Press Release */}
      <section className="mb-12">
        <Card className="border-2 border-teal-100">
          <CardHeader>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Calendar className="h-4 w-4" />
              <span>6th September 2025</span>
            </div>
            <CardTitle className="text-2xl font-bold text-[#ff961b]">
              A Pioneering Space Adopting a Public Health Approach to Address
              the Root Causes of Violence and Trauma
            </CardTitle>
            <CardDescription>
              Right2Thrive UK has officially launched the nation’s first
              Wellbeing Hub, bringing together therapy, mentoring, and community
              healing under one roof.
            </CardDescription>
          </CardHeader>

          <CardContent>
            {/* 🔹 Wrap content with ID for PDF export */}
            <div id="press-release-content" className="prose max-w-none space-y-4">
              {/* 🔹 Add "FOR IMMEDIATE RELEASE" */}
              <p>
                <strong>FOR IMMEDIATE RELEASE — 6th September 2025</strong>
              </p>

              {/* 🔹 Full Press Release Text */}
              <p>
                In a borough grappling with decades of persistent violence and a
                recent surge in crime, Right2Thrive UK has opened a transformative
                community space in Edmonton Green, Enfield. The nation’s first
                Wellbeing Hub adopts a bold public health approach to tackling
                violence and trauma by addressing their root causes through
                therapy, mentoring, and community healing.
              </p>

              <h3>The Need for Change in Enfield</h3>
              <p>
                Enfield continues to struggle with high levels of violent crime,
                leaving residents fearful and anxious about their safety. This
                year alone, incidents such as the murder of an 18-year-old on
                the A10 Great Cambridge Road on June 26th have shaken the local
                community. The young man was shot dead between Bush Hill Park
                and Southbury, prompting a police investigation but no arrests
                to date.
              </p>
              <blockquote>
                “We are living in fear and anxiety in Enfield due to the constant
                violence in our neighbourhood, and they expect us to live a normal
                life.” — Sarah, Enfield Resident
              </blockquote>
              <ul>
                <li>
                  Violent crimes in Enfield have risen by 18% this year, according
                  to the Metropolitan Police.
                </li>
                <li>
                  The borough has also seen over 430 knife crime incidents, many
                  involving young people.
                </li>
                <li>
                  Domestic violence cases have surged by 12%, with 1,150 incidents
                  reported so far in 2025.
                </li>
              </ul>

              <h3>Born from Community-Led Consultations</h3>
              <p>
                The Right2Thrive UK Wellbeing Hub was conceived after extensive
                community-led consultations, where residents, experts, and
                activists shared their experiences and research.
              </p>
              <p>
                Among the key contributors was Dr. Ron Dodzo, who presented his
                groundbreaking research <em>The Life of a Top Boy</em>, which
                explores the realities of young people caught in cycles of violence
                and gang culture.
              </p>
              <p>
                Another pivotal voice was Vanessa Boachie, a BABCP-accredited
                Cognitive Behavioural Psychotherapist who specializes in culturally
                sensitive and trauma-informed approaches to therapy.
              </p>

              <h3>The Wellbeing Hub: A Community-Led Solution</h3>
              <p>
                Located at <strong>37/38 North Square, Edmonton Green Shopping Centre</strong>, 
                the Hub was officially launched on Saturday, 6 September 2025, with overwhelming support.
              </p>
              <ul>
                <li>Beryl Little — Former Head of Enfield Council Education & Regeneration</li>
                <li>Rasheed Sadegh-Zadeh — Chair, Enfield Independent Advisory Group</li>
                <li>Paul Everret — Enfield Coordinator, Local Motion Enfield</li>
                <li>Indra Nauth — Deputy Chief Executive, Action For Race Equality</li>
                <li>
                  Pearls Loren — Founder, <strong>WISDOM (Say No! To Joint Enterprise)</strong>
                </li>
                <li>Courtney Brown — Founder, Father 2Father</li>
                <li>Colin Denton — CEO, North London Garages</li>
              </ul>

              <h3>Services Offered</h3>
              <ul>
                <li>Trauma-informed mental health support delivered by culturally competent practitioners</li>
                <li>Career and training pathways aimed at reducing unemployment and inequality</li>
                <li>12-week Wellbeing Programmes combining therapy, mentoring, and family healing</li>
                <li>Social and cultural workshops to strengthen identity, pride, and resilience</li>
                <li>Safe spaces where families and young people can rebuild trust and overcome fear</li>
              </ul>

              <h3>Professional Team</h3>
              <ul>
                <li>Evette Bailey — BABCP-accredited CBT Psychotherapist</li>
                <li>Mauva Johnson-Jones — Founder of Precious Moments & Health Ltd</li>
                <li>Kevin Bachan-Singh — Educator and psychodynamic therapist</li>
                <li>Raveen Charles — Registered psychotherapist</li>
                <li>Angela Williams — Registered MBACP with 15+ years’ experience</li>
                <li>Vanessa Boachie — BABCP-accredited CBT Psychotherapist</li>
              </ul>

              <h3>Made Possible by the Awards For All Community Fund</h3>
              <p>
                The creation of the Wellbeing Hub was made possible thanks to
                funding from the Awards For All Community Fund (The National Lottery
                Community Fund).
              </p>

              <h3>A Legacy of Action</h3>
              <p>
                The Hub’s founder, <strong>Colin Lee-Own</strong>, has spent over
                30 years championing community-led change in London’s most deprived
                areas.
              </p>

              <blockquote>
                “Persistent violence cannot be solved with enforcement alone. It
                must be tackled from the ground up — by healing trauma, creating
                opportunities, and restoring hope. Everyone has the right not just
                to survive, but to thrive.” <br />— Colin Lee-Own
              </blockquote>

              <h3>Contact</h3>
              <p>
                Colin Lee-Own <br />
                Email: info@right2thriveuk.com <br />
                Tel: 07415 771394
              </p>
            </div>

            {/* 🔹 Buttons */}
            <div className="mt-8 flex flex-wrap gap-4">
              <DownloadPressRelease />
              <Button variant="outline">
                <ExternalLink className="mr-2 h-4 w-4" />
                Media Kit
              </Button>
            </div>

            {/* 🔹 Funding Logo at Bottom */}
            <div className="mt-12 text-center">
              <Image
                src="/funding_logo.jpg"
                alt="Funding Logo"
                width={220}
                height={80}
                className="mx-auto"
              />
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
