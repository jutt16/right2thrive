import { generateMetadata as generateSEOMetadata } from "@/lib/seo-utils";

export const metadata = generateSEOMetadata({
  title: "Press Release: UK's First Wellbeing Hub Opens in Edmonton Green | Right2Thrive UK",
  description: "Right2Thrive UK opens the UK's first wellbeing hub to tackle community violence in Edmonton Green. Read our latest press release and media coverage.",
  keywords: [
    "press release",
    "wellbeing hub",
    "Edmonton Green",
    "community violence",
    "mental health hub",
    "North London news",
    "Right2Thrive UK news",
    "cultural wellbeing hub"
  ],
  path: "/press",
  image: "/press1.jpg",
  type: "article",
  publishedTime: "2024-09-06T00:00:00+00:00"
});

export default function PressLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}