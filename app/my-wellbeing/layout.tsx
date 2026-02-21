import DashboardLayout from "@/components/dashboard-layout";

export default function MyWellbeingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
