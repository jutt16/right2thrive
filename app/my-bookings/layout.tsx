import DashboardLayout from "@/components/dashboard-layout";

export default function MyBookingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
