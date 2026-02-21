import DashboardLayout from "@/components/dashboard-layout";

export default function ComplaintsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
