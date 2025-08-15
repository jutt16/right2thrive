// IMPROVED UI NAVBAR WITH CLEANER STYLING
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Instagram, Twitter, User, Heart, LogOut } from "lucide-react";
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
    <header className="sticky top-0 z-50 w-full border-b bg-white/90 backdrop-blur-lg">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="/right2thrive-logo.jpg"
            alt="Right2Thrive UK Logo"
            width={45}
            height={45}
            className="rounded-full"
          />
          <span className="text-lg font-bold text-[#00990d]">
            Right2Thrive UK
          </span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          {[
            ["Home", "/"],
            ["About Us", "/about"],
            ["Cultural Activities", "/cultural-activities"],
            ["Blog", "/blog"],
            ["Press Release", "/press"],
            ["Privacy Policy", "/privacy-policy"], 
          ].map(([label, href]) => (
            <Link
              key={label}
              href={href}
              className="text-sm font-medium text-gray-700 hover:text-[#00990d] transition"
            >
              {label}
            </Link>
          ))}

          {isAuthenticated && (
            <Link
              href="/wellbeing-hub"
              className="text-sm font-medium text-gray-700 hover:text-[#00990d]"
            >
              My Wellbeing Assessments
            </Link>
          )}
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          <Link href="https://instagram.com/@Right2ThriveUK" target="_blank">
            <Instagram className="h-5 w-5 text-[#00990d] hover:text-orange-500" />
          </Link>
          <Link href="https://twitter.com/@Right2ThriveUK" target="_blank">
            <Twitter className="h-5 w-5 text-[#00990d] hover:text-orange-500" />
          </Link>
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="text-[#00990d] hover:bg-green-100"
                >
                  <User className="h-5 w-5 mr-1" />
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
                  className="text-orange-600 border-orange-500 hover:bg-orange-500 hover:text-white"
                >
                  Login
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button className="bg-[#00990d] text-white hover:bg-green-700">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>

        <button className="md:hidden text-[#00990d]" onClick={toggleMenu}>
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {isMenuOpen && (
        <div className="bg-white px-4 py-4 shadow-md md:hidden">
          <nav className="flex flex-col space-y-4 text-[#00990d]">
            {[
              ["Home", "/"],
              ["About Us", "/about"],
              ["Cultural Activities", "/cultural-activities"],
              ["Blog", "/blog"],
              ["Press Release", "/press"],
              ["Privacy Policy", "/privacy-policy"],
            ].map(([label, href]) => (
              <Link
                key={label}
                href={href}
                onClick={toggleMenu}
                className="text-sm font-medium hover:text-orange-500"
              >
                {label}
              </Link>
            ))}

            {isAuthenticated && (
              <Link
                href="/wellbeing-hub"
                onClick={toggleMenu}
                className="text-sm font-medium hover:text-orange-500"
              >
                My Wellbeing Assessments
              </Link>
            )}

            <div className="flex gap-4 mt-4">
              <Link
                href="https://instagram.com/@Right2ThriveUK"
                target="_blank"
              >
                <Instagram className="h-5 w-5 text-[#00990d] hover:text-orange-500" />
              </Link>
              <Link href="https://twitter.com/@Right2ThriveUK" target="_blank">
                <Twitter className="h-5 w-5 text-[#00990d] hover:text-orange-500" />
              </Link>
            </div>

            <div className="mt-4 border-t pt-4">
              {isAuthenticated ? (
                <div className="flex flex-col space-y-1">
                  <Button
                    variant="ghost"
                    className="justify-start text-green-700 hover:bg-green-100"
                    onClick={() => {
                      handleProfileClick();
                      toggleMenu();
                    }}
                  >
                    <User className="mr-2 h-4 w-4" /> Profile
                  </Button>
                  <Button
                    variant="ghost"
                    className="justify-start text-green-700 hover:bg-green-100"
                    onClick={() => {
                      router.push("/my-wellbeing");
                      toggleMenu();
                    }}
                  >
                    <Heart className="mr-2 h-4 w-4" /> My Wellbeing
                  </Button>
                  <Button
                    variant="ghost"
                    className="justify-start text-green-700 hover:bg-green-100"
                    onClick={() => {
                      router.push("/my-bookings");
                      toggleMenu();
                    }}
                  >
                    <User className="mr-2 h-4 w-4" /> My Bookings
                  </Button>
                  <Button
                    variant="ghost"
                    className="justify-start text-red-600 hover:bg-red-100"
                    onClick={() => {
                      handleLogout();
                      toggleMenu();
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" /> Logout
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col space-y-1">
                  <Link href="/auth/login" onClick={toggleMenu}>
                    <Button
                      variant="ghost"
                      className="justify-start text-orange-600 hover:bg-orange-100"
                    >
                      Login
                    </Button>
                  </Link>
                  <Link href="/auth/signup" onClick={toggleMenu}>
                    <Button className="justify-start bg-[#00990d] text-white hover:bg-green-700 w-full">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
