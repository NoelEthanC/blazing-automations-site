"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { UserButton, useUser } from "@clerk/nextjs"
import Image from "next/image"

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { isSignedIn, isLoaded } = useUser()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const navItems = [
    { name: "Home", href: "/" },
    { name: "About us", href: "/about" },
    { name: "Services", href: "/#services" },
    { name: "Resources", href: "/resources" },
    { name: "Contact", href: "/#contact" },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#09111f]/95 backdrop-blur-sm border-b border-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/images/logos/blazing-logo-trans.png"
              alt="Blazing Automations"
              width={32}
              height={32}
              className="w-8 h-8"
            />
            <span className="text-xl font-bold text-white">Blazing Automations</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-300 hover:text-white transition-colors duration-200"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA and User */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/watch-us-build">
              <Button
                variant="outline"
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-none hover:from-orange-600 hover:to-red-600"
              >
                Watch Us Build
              </Button>
            </Link>

            {/* Only show auth components if Clerk is configured */}
            {process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && isLoaded && (
              <>
                {isSignedIn ? (
                  <div className="flex items-center space-x-2">
                    <Link href="/admin">
                      <Button variant="ghost" size="sm">
                        Admin
                      </Button>
                    </Link>
                    <UserButton afterSignOutUrl="/" />
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Link href="/sign-in">
                      <Button variant="ghost" size="sm">
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/sign-up">
                      <Button size="sm">Sign Up</Button>
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button onClick={toggleMenu} className="text-gray-300 hover:text-white focus:outline-none focus:text-white">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-[#09111f] border-t border-gray-800">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2 text-gray-300 hover:text-white transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="px-3 py-2 space-y-2">
                <Link href="/watch-us-build" onClick={() => setIsMenuOpen(false)}>
                  <Button
                    variant="outline"
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white border-none hover:from-orange-600 hover:to-red-600"
                  >
                    Watch Us Build
                  </Button>
                </Link>

                {/* Only show auth components if Clerk is configured */}
                {process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && isLoaded && (
                  <>
                    {isSignedIn ? (
                      <div className="flex items-center justify-between">
                        <Link href="/admin" onClick={() => setIsMenuOpen(false)}>
                          <Button variant="ghost" size="sm">
                            Admin
                          </Button>
                        </Link>
                        <UserButton afterSignOutUrl="/" />
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Link href="/sign-in" onClick={() => setIsMenuOpen(false)}>
                          <Button variant="ghost" size="sm" className="w-full">
                            Sign In
                          </Button>
                        </Link>
                        <Link href="/sign-up" onClick={() => setIsMenuOpen(false)}>
                          <Button size="sm" className="w-full">
                            Sign Up
                          </Button>
                        </Link>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
