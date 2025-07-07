"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, Zap } from "lucide-react"
import { fadeInUp } from "@/lib/animations"
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    fadeInUp(".header-content", 0.2)
  }, [])

  const navigation = [
    { name: "Home", href: "/" },
    { name: "About us", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Resources", href: "/resources" },
    { name: "Contact", href: "/contact" },
  ]

  return (
    <header className="fixed top-0 w-full z-50 bg-[#09111f]/95 backdrop-blur-sm border-b border-gray-800">
      <div className="header-content max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <Zap className="h-6 w-6 text-[#3f79ff]" />
            <span className="text-xl font-bold text-white">Blazing Automations</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-300 hover:text-white transition-colors duration-200"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <Button
              asChild
              className="bg-gradient-to-r from-[#ca6678] to-[#fcbf5b] hover:from-[#b85a6a] hover:to-[#e6ac52] text-white font-medium px-6"
            >
              <Link href="/watch-us-build">Watch Us Build</Link>
            </Button>

            <SignedOut>
              <Button
                asChild
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
              >
                <Link href="/sign-in">Admin</Link>
              </Button>
            </SignedOut>

            <SignedIn>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8",
                  },
                }}
              />
            </SignedIn>
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden text-gray-300 hover:text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-800">
            <nav className="flex flex-col space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <Button
                asChild
                className="bg-gradient-to-r from-[#ca6678] to-[#fcbf5b] hover:from-[#b85a6a] hover:to-[#e6ac52] text-white font-medium w-fit"
              >
                <Link href="/watch-us-build">Watch Us Build</Link>
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
