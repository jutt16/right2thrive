'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Heart,
  ShieldCheck,
  Users,
  LifeBuoy,
  Baby,
  Flame,
} from "lucide-react";

const icons = [Users, ShieldCheck, Baby, Heart, LifeBuoy, Flame];

export default function Home() {
  const [content, setContent] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/home-content`)
      .then((res) => res.json())
      .then((data) => setContent(data.data || {}))
      .finally(() => setLoading(false));
  }, []);

  const cardData = Array.from({ length: 6 }, (_, i) => ({
    icon: icons[i],
    title: content[`how_card_${i + 1}_title`],
    description: content[`how_card_${i + 1}_description`],
  }));

  const stats = Array.from({ length: 3 }, (_, i) => ({
    number: content[`why_stat_${i + 1}_number`],
    label: content[`why_stat_${i + 1}_label`],
  }));

  const paragraphs = Array.from({ length: 3 }, (_, i) => content[`why_paragraph_${i + 1}`]);

  return (
    <>
      {loading && (
        <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
        </div>
      )}
      <div className="flex flex-col">
        {/* Hero Section */}
        <section className="relative bg-[#00990d] py-20 text-white">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center text-center md:text-left">
          <div className="md:w-1/2">
            <h1 className="text-4xl font-bold md:text-5xl mb-4">
              {content.hero_heading}
            </h1>
            <p className="text-lg text-gray-300 max-w-xl">
              {content.hero_paragraph}
            </p>
            <div className="mt-8 flex justify-center md:justify-start gap-4 flex-wrap">
              <Link href={content.hero_button_1_link || "#"}>
                <Button className="bg-blue-500 text-white hover:bg-blue-600">
                  {content.hero_button_1_text}
                </Button>
              </Link>
              <Link href={content.hero_button_2_link || "#"}>
                <Button variant="outline" className="bg-blue-500 text-white hover:bg-blue-600">
                  {content.hero_button_2_text}
                </Button>
              </Link>
            </div>
          </div>

          <div className="md:w-1/2 mt-10 md:mt-0 flex justify-center">
            {content.hero_image && (
              <img
                src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${content.hero_image}`}
                alt="Hero"
                className="max-w-full h-auto rounded-lg shadow-lg"
              />
            )}
          </div>
        </div>
      </section>

      {/* This Is How We Do It Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-[#ff961b] mb-6">{content.how_heading}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-12">{content.how_paragraph}</p>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {cardData.map((card, idx) =>
              card.title && card.description ? (
                <Card key={idx} className="border-2 border-teal-100">
                  <CardContent className="p-6 text-center">
                    <div className="mb-4 flex justify-center">
                      {card.icon && <card.icon className="h-8 w-8 text-orange-600" />}
                    </div>
                    <h3 className="text-xl font-semibold text-[#ff961b] mb-2">{card.title}</h3>
                    <p className="text-gray-600">{card.description}</p>
                  </CardContent>
                </Card>
              ) : null
            )}
          </div>
        </div>
      </section>

      {/* Why This Matters Right Now Section */}
      <section className="bg-[#f8fafc] py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          {/* Image */}
          {content.why_image && (
            <div className="mb-10">
              <img
                src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${content.why_image}`}
                alt="Why This Matters"
                className="mx-auto max-w-full h-auto rounded-lg shadow-lg"
              />
            </div>
          )}

          <h2 className="text-3xl font-bold text-[#ff961b] mb-6">{content.why_heading}</h2>
          {paragraphs.map(
            (para, idx) =>
              para && (
                <p key={idx} className="text-gray-700 mb-6">
                  {para}
                </p>
              )
          )}

          <div className="grid md:grid-cols-3 gap-6 mb-10 text-left text-gray-700 font-medium">
            {stats.map(
              (stat, idx) =>
                stat.number && stat.label && (
                  <div key={idx} className="bg-white p-4 shadow rounded">
                    <p>
                      <span className="text-2xl font-bold text-orange-600">{stat.number}</span>{" "}
                      {stat.label}
                    </p>
                  </div>
                )
            )}
          </div>

          {/* Testimonial */}
          {(content.why_testimonial_image || content.why_testimonial_quote) && (
            <div className="flex flex-col md:flex-row items-center gap-6 max-w-4xl mx-auto mb-8">
              {content.why_testimonial_image && (
                <img
                  src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${content.why_testimonial_image}`}
                  alt="Testimonial"
                  className="w-full md:w-1/3 rounded-lg shadow-md object-cover"
                />
              )}

              <blockquote className="italic text-gray-600 md:text-left text-center">
                {content.why_testimonial_quote}
                <br />
                <span className="block font-semibold text-[#ff961b] mt-2">
                  {content.why_testimonial_name}
                </span>
              </blockquote>
            </div>
          )}

          <Link href="/contact">
            <Button className="bg-teal-600 text-white hover:bg-teal-700">Let’s Talk</Button>
          </Link>
        </div>
      </section>
    </div>
    </>
  );
}
