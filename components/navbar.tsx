"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X, Instagram, Twitter, User, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userData, setUserData] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    const user = localStorage.getItem('user')
    if (token && user) {
      setIsAuthenticated(true)
      setUserData(JSON.parse(user))
    }
  }, [])

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Logout failed')
      }

      // Clear local storage and redirect regardless of API response
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      setIsAuthenticated(false)
      setUserData(null)
      window.location.href = '/'
    } catch (err) {
      // Even if the API call fails, we still want to clear local storage and redirect
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      setIsAuthenticated(false)
      setUserData(null)
      window.location.href = '/'
    }
  }

  const handleProfileClick = () => {
    router.push('/profile')
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const AuthButtons = () => (
    <>
      <Link href="/auth/login">
        <Button variant="outline" className="border-orange-500 text-orange-600 hover:bg-orange-500 hover:text-white">
          Login
        </Button>
      </Link>
      <Link href="/auth/signup">
        <Button className="bg-blue-500 text-white hover:bg-blue-600">Sign Up</Button>
      </Link>
    </>
  )

  const ProfileMenu = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center space-x-2 text-white hover:bg-[#3c362f]">
          <User className="h-5 w-5" />
          <span className="hidden md:inline-block">{userData?.name || 'Profile'}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={handleProfileClick} className="cursor-pointer">
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-[#00990d] text-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Image src="/logo.png" alt="Right2Thrive UK Logo" width={50} height={50} className="rounded-full" />
            <span className="hidden text-lg font-bold md:inline-block">Right2Thrive UK</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex md:items-center md:space-x-6">
          <Link href="/" className="text-sm font-medium transition-colors hover:text-orange-400">
            Home
          </Link>
          <Link href="/about" className="text-sm font-medium transition-colors hover:text-orange-400">
            About Us
          </Link>
          <Link href="/cultural-activities" className="text-sm font-medium transition-colors hover:text-orange-400">
            Cultural Activities
          </Link>
          <Link href="/blog" className="text-sm font-medium transition-colors hover:text-orange-400">
            Blog
          </Link>
          <Link href="/wellbeing-hub" className="text-sm font-medium transition-colors hover:text-orange-400">
            Wellbeing Hub
          </Link>
          <Link href="/press" className="text-sm font-medium transition-colors hover:text-orange-400">
            Press Release
          </Link>
        </nav>

        <div className="hidden items-center space-x-4 md:flex">
          <Link href="https://instagram.com/@Right2ThriveUK" target="_blank" rel="noopener noreferrer">
            <Instagram className="h-5 w-5 text-white hover:text-orange-400" />
          </Link>
          <Link href="https://twitter.com/@Right2ThriveUK" target="_blank" rel="noopener noreferrer">
            <Twitter className="h-5 w-5 text-white hover:text-orange-400" />
          </Link>
          {isAuthenticated ? <ProfileMenu /> : <AuthButtons />}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={toggleMenu}>
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      <div
        className={cn(
          "absolute left-0 right-0 z-50 bg-[#00990d] px-4 py-4 shadow-lg md:hidden",
          isMenuOpen ? "block" : "hidden",
        )}
      >
        <nav className="flex flex-col space-y-4">
          <Link href="/" className="text-sm font-medium transition-colors hover:text-orange-400" onClick={toggleMenu}>
            Home
          </Link>
          <Link
            href="/cultural-activities"
            className="text-sm font-medium transition-colors hover:text-orange-400"
            onClick={toggleMenu}
          >
            Cultural Activities
          </Link>
          <Link href="/blog" className="text-sm font-medium transition-colors hover:text-orange-400" onClick={toggleMenu}>
            Blog
          </Link>
          <Link
            href="/wellbeing-hub"
            className="text-sm font-medium transition-colors hover:text-orange-400"
            onClick={toggleMenu}
          >
            Wellbeing Hub
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium transition-colors hover:text-orange-400"
            onClick={toggleMenu}
          >
            Right2Thrive UK
          </Link>
          <Link
            href="/press"
            className="text-sm font-medium transition-colors hover:text-orange-400"
            onClick={toggleMenu}
          >
            Press Release
          </Link>
          <div className="flex items-center space-x-4 pt-2">
            <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <Instagram className="h-5 w-5 text-white hover:text-orange-400" />
            </Link>
            <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <Twitter className="h-5 w-5 text-white hover:text-orange-400" />
            </Link>
          </div>
          <div className="flex flex-col space-y-2">
            {isAuthenticated ? (
              <>
                <Button 
                  variant="outline" 
                  className="w-full border-orange-500 text-white hover:bg-orange-500 hover:text-white"
                  onClick={() => {
                    handleProfileClick()
                    toggleMenu()
                  }}
                >
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full border-orange-500 text-white hover:bg-orange-500 hover:text-white"
                  onClick={() => {
                    handleLogout()
                    toggleMenu()
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/auth/login" onClick={toggleMenu}>
                  <Button
                    variant="outline"
                    className="w-full border-orange-500 text-white hover:bg-orange-500 hover:text-white"
                  >
                    Login
                  </Button>
                </Link>
                <Link href="/auth/signup" onClick={toggleMenu}>
                  <Button className="w-full bg-blue-500 text-white hover:bg-blue-600">Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  )
}
