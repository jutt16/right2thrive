"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Heart,
  Target,
  FileText,
  BarChart3,
  ClipboardList,
  ShieldAlert,
  Coins,
  MessageCircle,
  Calendar,
  User,
  MessageSquareWarning,
  BookOpen,
  LifeBuoy,
  LogOut,
  Sparkles,
  Home,
  FileStack,
  Newspaper,
  Users,
  Download,
  Activity,
  Phone,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import Image from "next/image";

const SIDEBAR_NAV = {
  site: [
    { label: "Home", href: "/", icon: Home },
    { label: "About Us", href: "/about", icon: Users },
    { label: "Wellbeing Activities", href: "/cultural-activities", icon: Activity },
    { label: "Blog", href: "/blog", icon: FileStack },
    { label: "Press Release", href: "/press", icon: Newspaper },
    { label: "Wellbeing Team", href: "/wellbeing-team", icon: Users },
    { label: "Download App", href: "/app-release.apk", icon: Download },
  ],
  main: [
    { label: "My Dashboard", href: "/my-wellbeing/dashboard", icon: LayoutDashboard },
    { label: "My Wellbeing Space", href: "/my-wellbeing", icon: Heart },
    { label: "Wellbeing Hub", href: "/wellbeing-hub", icon: Sparkles },
  ],
  goals: [
    { label: "My Weekly Goals", href: "/my-wellbeing/upload-weekly-goals", icon: Target },
    { label: "My Wellbeing Plan", href: "/my-wellbeing/wellbeing-plan", icon: FileText },
    { label: "My Weekly Progress", href: "/my-wellbeing/weekly-progress", icon: BarChart3 },
  ],
  assessments: [
    { label: "GAD-7 (Anxiety)", href: "/wellbeing-hub/gad7", icon: ClipboardList },
    { label: "PHQ-9 (Depression)", href: "/wellbeing-hub/phq9", icon: ClipboardList },
    { label: "SDQ", href: "/my-wellbeing/questionnaires", icon: ClipboardList },
    { label: "PCL-5 (PTSD)", href: "/wellbeing-hub/pcl5", icon: ClipboardList },
    { label: "Risk Assessment", href: "/wellbeing-hub/risk-assessment", icon: ShieldAlert },
  ],
  engagement: [
    { label: "Thrive Tokens", href: "/my-wellbeing/thrive-tokens", icon: Coins },
    { label: "Reflect After Session", href: "/my-wellbeing/reflect", icon: MessageCircle },
    { label: "Voice Call", href: "/voice-call", icon: Phone },
  ],
  booking: [
    { label: "My Bookings", href: "/my-bookings", icon: Calendar },
  ],
  account: [
    { label: "Profile", href: "/profile", icon: User },
    { label: "Complaints", href: "/complaints", icon: MessageSquareWarning },
  ],
  resources: [
    { label: "Resources", href: "/wellbeing-hub/resources", icon: BookOpen },
    { label: "Support", href: "/wellbeing-hub/support", icon: LifeBuoy },
  ],
};

export function AppSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/my-wellbeing") {
      return pathname === "/my-wellbeing" && !pathname.startsWith("/my-wellbeing/");
    }
    return pathname === href || pathname.startsWith(href + "/");
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
    } catch {
      // ignore
    }
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("auth");
    localStorage.removeItem("therapist");
    window.location.href = "/";
  };

  return (
    <Sidebar collapsible="icon" className="z-50 border-r border-sidebar-border bg-white dark:bg-sidebar">
      <SidebarHeader className="border-b border-sidebar-border">
        <Link href="/my-wellbeing/dashboard" className="flex items-center gap-3 px-2 py-3">
          <Image
            src="/right2thrive-logo-no.jpg"
            alt="Right2Thrive UK"
            width={36}
            height={36}
            className="rounded-full shrink-0"
          />
          <div className="flex flex-col gap-0.5 overflow-hidden">
            <span className="font-semibold text-sm text-sidebar-foreground truncate">
              Right2Thrive UK
            </span>
            <span className="text-xs text-sidebar-foreground/70 truncate">
              My Wellbeing
            </span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Site</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {SIDEBAR_NAV.site.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={item.href !== "/app-release.apk" && isActive(item.href)}>
                    {item.href === "/app-release.apk" ? (
                      <a href="/app-release.apk" download>
                        <item.icon className="h-4 w-4 shrink-0" />
                        <span>{item.label}</span>
                      </a>
                    ) : (
                      <Link href={item.href}>
                        <item.icon className="h-4 w-4 shrink-0" />
                        <span>{item.label}</span>
                      </Link>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>Overview</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {SIDEBAR_NAV.main.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={isActive(item.href)}>
                    <Link href={item.href}>
                      <item.icon className="h-4 w-4 shrink-0" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>Goals & Progress</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {SIDEBAR_NAV.goals.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={isActive(item.href)}>
                    <Link href={item.href}>
                      <item.icon className="h-4 w-4 shrink-0" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>Assessments</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {SIDEBAR_NAV.assessments.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={isActive(item.href)}>
                    <Link href={item.href}>
                      <item.icon className="h-4 w-4 shrink-0" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>Engagement</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {SIDEBAR_NAV.engagement.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={isActive(item.href)}>
                    <Link href={item.href}>
                      <item.icon className="h-4 w-4 shrink-0" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Booking</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {SIDEBAR_NAV.booking.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={isActive(item.href)}>
                    <Link href={item.href}>
                      <item.icon className="h-4 w-4 shrink-0" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>Resources</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {SIDEBAR_NAV.resources.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={isActive(item.href)}>
                    <Link href={item.href}>
                      <item.icon className="h-4 w-4 shrink-0" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {SIDEBAR_NAV.account.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={isActive(item.href)}>
                    <Link href={item.href}>
                      <item.icon className="h-4 w-4 shrink-0" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border space-y-1">
        <a
          href="tel:116123"
          className="flex items-center gap-2 rounded-md px-2 py-1.5 text-xs text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
        >
          <span className="font-medium text-amber-600">Need support?</span>
          <span>116 123 · SHOUT 85258</span>
        </a>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout} className="text-red-600 hover:text-red-700 hover:bg-red-50">
              <LogOut className="h-4 w-4 shrink-0" />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
