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
  Download,
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

export default function PressRelease() {
  const photos = [
    "/press1.jpg",
    "/press2.jpg",
    "/press3.jpg",
    "/press4.jpg",
    "/press5.jpg",
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

          {/* 🔹 Navigation Buttons (smaller + sharp) */}
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
              A pioneering space adopting a public health approach to address
              the root causes of violence and trauma
            </CardTitle>
            <CardDescription>
              Right2Thrive UK has officially launched the nation’s first
              Wellbeing Hub, bringing together therapy, mentoring, and community
              healing under one roof.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="prose max-w-none space-y-4">
              <p>
                <strong>FOR IMMEDIATE RELEASE</strong> — In one of London’s most
                deprived areas, where community crime has persisted for decades,
                a bold new initiative is offering hope. Right2Thrive UK has
                officially opened the nation’s first Wellbeing Hub, a pioneering
                space adopting a public health approach to address the root
                causes of violence and trauma.
              </p>
              <p>
                Located at{" "}
                <strong>
                  37/38 North Square, Edmonton Green Shopping Centre
                </strong>
                , the Hub was launched on Saturday, 6 September 2025, drawing
                overwhelming support from residents, local leaders, and
                organisations. Distinguished guests included:
              </p>
              <ul>
                <li>
                  Beryl Little — Former Head of Enfield Council Education &
                  Regeneration
                </li>
                <li>
                  Rasheed Sadegh-Zadeh — Chair, Enfield Independent Advisory
                  Group
                </li>
                <li>Paul Everret — Enfield Coordinator, Local Motion Enfield</li>
                <li>
                  Indra Nauth — Deputy Chief Executive, Action For Race Equality
                </li>
                <li>
                  Pearls Loren — Founder, WISDOM (Say No! To Joint Enterprise)
                </li>
                <li>Courtney Brown — Founder, Father 2Father</li>
                <li>Colin Denton — CEO, North London Garages</li>
              </ul>

              <h3>A Groundbreaking Community-Led Solution</h3>
              <p>
                The Right2Thrive UK Wellbeing Hub is the first of its kind in
                the UK: a safe and inclusive space built by the community, for
                the community. It provides:
              </p>
              <ul>
                <li>
                  Trauma-informed mental health support delivered by culturally
                  competent practitioners
                </li>
                <li>
                  Career and training pathways to tackle unemployment and
                  inequality
                </li>
                <li>
                  Social and cultural workshops that strengthen identity,
                  resilience, and pride
                </li>
                <li>
                  A 12-week wellbeing programme combining therapy, mentoring,
                  and family healing
                </li>
                <li>
                  Safe spaces where families and young people can rebuild trust
                  and overcome fear
                </li>
              </ul>

              <h3>The Professional Team</h3>
              <p>
                The Hub is powered by a highly skilled team of Black and
                culturally competent professionals, bringing decades of expertise
                in mental health, education, and trauma recovery:
              </p>
              <ul>
                <li>Evette Bailey — BABCP-accredited CBT Psychotherapist …</li>
                <li>
                  Mauva Johnson-Jones — Founder of Precious Moments & Health Ltd
                  …
                </li>
                <li>
                  Kevin Bachan-Singh — Educator and psychodynamic therapist …
                </li>
                <li>Raveen Charles — Registered psychotherapist …</li>
                <li>
                  Angela Williams — Registered MBACP with 15+ years’ experience
                  …
                </li>
                <li>
                  Vanessa Boachie — Founding Director of Inside Out Well-being …
                </li>
              </ul>

              <h3>A Legacy of Action</h3>
              <p>
                The Hub was founded by <strong>Colin Lee-Own</strong>, who has
                dedicated more than 30 years to community-led change in some of
                London’s hardest-hit neighbourhoods.
              </p>
              <p>
                In 1994, he launched AD2000 Productions in Edmonton Green
                Shopping Centre, helping over 300 young people into education,
                training, and employment.
              </p>
              <p>
                Following the tragic 2019 murder of market trader Julio Gomes,
                Colin personally funded the transformation of a derelict
                building into the Right2Thrive Wellbeing Hub. (Source:{" "}
                <a
                  href="https://www.standard.co.uk/news/crime/julio-gomes-murder-edmonton-lukasz-siemienowicz-london-b971703.html"
                  className="text-blue-600 underline"
                  target="_blank"
                >
                  Evening Standard
                </a>
                )
              </p>
              <p>
                This vision became a reality thanks to the crucial support of
                National Lottery Awards for All (The National Lottery Community
                Fund).
              </p>

              <blockquote className="italic border-l-4 border-teal-500 pl-4">
                “Persistent violence cannot be solved with enforcement alone. It
                must be tackled from the ground up — by healing trauma, creating
                opportunities, and restoring hope. Everyone has the right not
                just to survive, but to thrive.”
                <br />— Colin Lee-Own
              </blockquote>
            </div>

            {/* 🔹 Buttons */}
            <div className="mt-8 flex flex-wrap gap-4">
              <Button className="flex items-center bg-[#00990d] text-white hover:bg-[#3c362f]">
                <Download className="mr-2 h-4 w-4" />
                Download Press Release
              </Button>
              <Button variant="outline">
                <ExternalLink className="mr-2 h-4 w-4" />
                Media Kit
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
