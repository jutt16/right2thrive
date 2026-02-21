import DashboardLayout from "@/components/dashboard-layout";

export default function WellbeingHubLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
