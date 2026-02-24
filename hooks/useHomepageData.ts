import { useState, useEffect } from "react";
interface HomepageData {
  hero: {
    id: number;
    title: string;
    description: string;
    primary_button_text: string;
    primary_button_link: string;
    secondary_button_text: string;
    secondary_button_link: string;
    background_image: string;
  } | null;
  community_stories: Array<{
    id: number;
    name: string;
    role: string;
    image: string;
    objectPosition: string;
    quote: string;
  }>;
  testimonials: Array<{
    id: number;
    quote: string;
    name: string;
    age: string;
  }>;
  services: Array<{
    id: number;
    title: string;
    description: string;
    short: string;
    icon_name: string;
    link: string;
    isFeatured: boolean;
  }>;
  flow_steps: Array<{
    id: number;
    title: string;
    description: string;
    icon_name: string;
    link: string;
    step_number: number;
  }>;
  section_headings: {
    [key: string]: {
      heading: string;
      subheading: string | null;
    };
  };
  cta_section: {
    id: number;
    title: string;
    description: string;
    button_text: string;
    button_link: string;
    login_link_text: string;
    login_link_url: string;
    benefits: string[];
  } | null;
  support_services: {
    id: number;
    title: string;
    description: string;
    service_name: string;
    service_url: string;
    service_description: string;
    crisis_lines: string[];
    view_all_link_text: string;
    view_all_link_url: string;
  } | null;
}

interface UseHomepageDataReturn {
  data: HomepageData | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useHomepageData(): UseHomepageDataReturn {
  const [data, setData] = useState<HomepageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/homepage/all`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch homepage data");
      }

      const result = await response.json();

      if (result.success) {
        setData(result.data);
      } else {
        throw new Error(result.message || "Failed to fetch homepage data");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error fetching homepage data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
}

