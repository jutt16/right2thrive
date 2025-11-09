import { generateMetadata as generateSEOMetadata } from "@/lib/seo-utils";

export const metadata = generateSEOMetadata({
  title: "Contact Right2Thrive UK - Mental Health Support | North London",
  description: "Get in touch with Right2Thrive UK for culturally responsive mental health support, therapy sessions, and wellbeing services in North London. Book a consultation today.",
  keywords: [
    "contact Right2Thrive UK",
    "mental health support contact",
    "therapy booking",
    "wellbeing consultation",
    "North London mental health",
    "Edmonton therapy contact",
    "cultural wellbeing support"
  ],
  path: "/contact",
  image: "/right2thrive-logo.jpg"
});

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
