// IMPROVED UI NAVBAR WITH CLEANER STYLING
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Instagram, Twitter, User, Heart, LogOut, MessageSquareWarning, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    if (token && user) {
      setIsAuthenticated(true);
      setUserData(JSON.parse(user));
    }
  }, []);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/logout`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Logout failed");
      }

      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setIsAuthenticated(false);
      setUserData(null);
      window.location.href = "/";
    } catch {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setIsAuthenticated(false);
      setUserData(null);
      window.location.href = "/";
    }
  };

  const handleProfileClick = () => router.push("/profile");
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur-md shadow-sm relative">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="/right2thrive-logo-no.jpg"
            alt="Right2Thrive UK - Cultural Wellbeing Hub Logo"
            width={45}
            height={45}
            priority={true}
            quality={90}
            className="rounded-full"
          />
          <span className="text-lg font-bold text-[#00990d]">
            Right2Thrive UK
          </span>
        </Link>

        <nav className="hidden md:flex items-center space-x-1" role="navigation" aria-label="Main navigation">
          {[
            ["Home", "/"],
            ["About Us", "/about"],
            ["Wellbeing Activities", "/cultural-activities"],
            ["Blog", "/blog"],
            ["Press Release", "/press"],
            ["Privacy Policy", "/privacy-policy"],
            ["Privacy Compliance", "/privacy-compliance"], 
          ].map(([label, href]) => (
            <Link
              key={label}
              href={href}
              className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-[#00990d] hover:bg-green-50 rounded-md transition-all duration-200"
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center space-x-2">
          <Link href="https://www.instagram.com/right2thriveuk/" target="_blank" className="p-2 hover:bg-green-50 rounded-md transition-colors">
            <Instagram className="h-5 w-5 text-[#00990d] hover:text-orange-500" />
          </Link>
          <Link href="https://twitter.com/@Right2ThriveUK" target="_blank" className="p-2 hover:bg-green-50 rounded-md transition-colors">
            <Twitter className="h-5 w-5 text-[#00990d] hover:text-orange-500" />
          </Link>
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="text-[#00990d] hover:bg-green-100 px-3 py-2 rounded-md transition-all duration-200"
                >
                  <User className="h-5 w-5 mr-2" />
                  {userData?.name || "Profile"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleProfileClick}>
                  <User className="h-4 w-4 mr-2" /> Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/my-wellbeing")}>
                  <Heart className="h-4 w-4 mr-2" /> My Wellbeing
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/wellbeing-hub")}>
                  <ClipboardList className="h-4 w-4 mr-2" /> My Wellbeing Assessments
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/complaints")}>
                  <MessageSquareWarning className="mr-2 h-4 w-4" /> Complaints
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/my-bookings")}>
                  <User className="h-4 w-4 mr-2" /> My Bookings
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-500"
                >
                  <LogOut className="h-4 w-4 mr-2" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex space-x-2">
              <Link href="/auth/login">
                <Button
                  variant="outline"
                  className="text-orange-600 border-orange-500 hover:bg-orange-500 hover:text-white px-4 py-2 rounded-md transition-all duration-200"
                >
                  Login
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button className="bg-[#00990d] text-white hover:bg-green-700 px-4 py-2 rounded-md transition-all duration-200">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>

        <button 
          className="md:hidden text-[#00990d] focus:ring-2 focus:ring-[#00990d] focus:ring-opacity-50 rounded-md p-3 min-h-[44px] min-w-[44px] flex items-center justify-center" 
          onClick={toggleMenu}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
          aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {isMenuOpen && (
        <>
          {/* Backdrop overlay */}
          <div 
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={toggleMenu}
            aria-hidden="true"
          />
          {/* Mobile menu */}
          <div id="mobile-menu" className="fixed top-0 left-0 right-0 bottom-0 bg-white shadow-lg md:hidden overflow-y-auto overscroll-contain z-50" style={{ height: '100dvh', minHeight: '100dvh', maxHeight: '100dvh' }}>
            {/* Mobile menu header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between z-10" style={{ paddingTop: 'max(0.75rem, env(safe-area-inset-top))' }}>
              <Link href="/" className="flex items-center space-x-2" onClick={toggleMenu}>
                <Image
                  src="/right2thrive-logo-no.jpg"
                  alt="Right2Thrive UK - Cultural Wellbeing Hub Logo"
                  width={40}
                  height={40}
                  priority={true}
                  quality={90}
                  className="rounded-full"
                />
                <span className="text-base font-bold text-[#00990d]">
                  Right2Thrive UK
                </span>
              </Link>
              <button 
                className="text-[#00990d] focus:ring-2 focus:ring-[#00990d] focus:ring-opacity-50 rounded-md p-2 min-h-[44px] min-w-[44px] flex items-center justify-center" 
                onClick={toggleMenu}
                aria-label="Close navigation menu"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            {/* Mobile menu content */}
            <nav className="flex flex-col space-y-2 text-[#00990d] px-4 py-4" style={{ paddingBottom: 'max(4rem, calc(4rem + env(safe-area-inset-bottom)))' }} role="navigation" aria-label="Mobile navigation menu">
            {[
              ["Home", "/"],
              ["About Us", "/about"],
              ["Wellbeing Activities", "/cultural-activities"],
              ["Blog", "/blog"],
              ["Press Release", "/press"],
              ["Privacy Policy", "/privacy-policy"],
              ["Privacy Compliance", "/privacy-compliance"],
            ].map(([label, href]) => (
              <Link
                key={label}
                href={href}
                onClick={toggleMenu}
                className="text-base font-medium hover:text-orange-500 py-3 px-2 min-h-[44px] flex items-center"
              >
                {label}
              </Link>
            ))}

            <div className="flex gap-4 mt-4">
              <Link
                href="https://www.instagram.com/right2thriveuk/"
                target="_blank"
                className="p-3 min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <Instagram className="h-6 w-6 text-[#00990d] hover:text-orange-500" />
              </Link>
              <Link 
                href="https://twitter.com/@Right2ThriveUK" 
                target="_blank"
                className="p-3 min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <Twitter className="h-6 w-6 text-[#00990d] hover:text-orange-500" />
              </Link>
            </div>

            <div className="mt-4 border-t pt-4">
              {isAuthenticated ? (
                <div className="flex flex-col space-y-2">
                  <Button
                    variant="ghost"
                    className="justify-start text-green-700 hover:bg-green-100 min-h-[44px] text-base"
                    onClick={() => {
                      handleProfileClick();
                      toggleMenu();
                    }}
                  >
                    <User className="mr-2 h-5 w-5" /> Profile
                  </Button>
                  <Button
                    variant="ghost"
                    className="justify-start text-green-700 hover:bg-green-100 min-h-[44px] text-base"
                    onClick={() => {
                      router.push("/my-wellbeing");
                      toggleMenu();
                    }}
                  >
                    <Heart className="mr-2 h-5 w-5" /> My Wellbeing
                  </Button>
                  <Button
                    variant="ghost"
                    className="justify-start text-green-700 hover:bg-green-100 min-h-[44px] text-base"
                    onClick={() => {
                      router.push("/wellbeing-hub");
                      toggleMenu();
                    }}
                  >
                    <ClipboardList className="mr-2 h-5 w-5" /> My Wellbeing Assessments
                  </Button>
                  <Button
                    variant="ghost"
                    className="justify-start text-green-700 hover:bg-green-100 min-h-[44px] text-base"
                    onClick={() => {
                      router.push("/complaints");
                      toggleMenu();
                    }}
                  >
                    <MessageSquareWarning className="mr-2 h-5 w-5" /> Complaints
                  </Button>
                  <Button
                    variant="ghost"
                    className="justify-start text-green-700 hover:bg-green-100 min-h-[44px] text-base"
                    onClick={() => {
                      router.push("/my-bookings");
                      toggleMenu();
                    }}
                  >
                    <User className="mr-2 h-5 w-5" /> My Bookings
                  </Button>
                  <Button
                    variant="ghost"
                    className="justify-start text-red-600 hover:bg-red-100 min-h-[44px] text-base"
                    onClick={() => {
                      handleLogout();
                      toggleMenu();
                    }}
                  >
                    <LogOut className="mr-2 h-5 w-5" /> Logout
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col space-y-2">
                  <Link href="/auth/login" onClick={toggleMenu}>
                    <Button
                      variant="ghost"
                      className="justify-start text-orange-600 hover:bg-orange-100 min-h-[44px] text-base w-full"
                    >
                      Login
                    </Button>
                  </Link>
                  <Link href="/auth/signup" onClick={toggleMenu}>
                    <Button className="justify-start bg-[#00990d] text-white hover:bg-green-700 w-full min-h-[44px] text-base">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
        </>
      )}
    </header>
  );
}
