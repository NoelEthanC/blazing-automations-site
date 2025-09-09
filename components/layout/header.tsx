"use client"

import { useState, useRef, useEffect } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import gsap from "gsap"
import { Button } from "@/components/ui/button"
import { Menu, X, ExternalLink } from "lucide-react"
import { handleLinkClick } from "@/lib/utils"
import Image from "next/image"

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const navRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (navRef.current) {
      gsap.fromTo(navRef.current, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" })
    }
  }, [])

  const navItems = [
    { label: "Home", href: "/" },
    { label: "About us", href: "/about" },
    { label: "Services", href: "/#services" },
    { label: "Resources", href: "/resources" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/#contact" },
  ]

  const closeMobileMenu = () => {
    setIsMenuOpen(false)
  }

  return (
    <nav ref={navRef} className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-6xl px-4 md:px-8">
      <div className="bg-midnight-blue/70 backdrop-blur-sm border border-gray-text/20 rounded-2xl lg:rounded-full px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3 w-fit">
            <div className="w-8 h-8 bg-gradient-upstream rounded-lg flex items-center justify-center">
              <Image
                src="/images/logos/blazing-logo-trans.png"
                alt="Logo"
                width={64}
                height={64}
                className="w-24 h-24 object-contain"
              />
            </div>
            <Link href="/" onClick={closeMobileMenu} className="font-sora font-bold text-lg text-white w-auto">
              Blazing Automations
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 ml-8">
            {navItems.map((item) => (
              <Link
                href={item.href}
                onClick={() => handleLinkClick(item.href)}
                key={item.label}
                className="text-slate-text hover:text-white transition-colors font-work-sans text-sm"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:block ml-6">
            {pathname !== "/" && !pathname.includes("/#") ? (
              <Link
                href="https://www.youtube.com/@BlazingAutomations"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gradient-upstream text-white font-work-sans font-semibold px-4 py-2 rounded-full hover-glow text-base"
              >
                Watch Us Build
                <ExternalLink className="ml-2 w-4 h-4" />
              </Link>
            ) : (
              <Button
                onClick={() => handleLinkClick("#featured-resource")}
                className="bg-gradient-to-r from-flower-pink to-sunray text-white font-work-sans font-semibold px-4 py-2 rounded-full hover-glow text-sm"
              >
                Get Our Templates
                <span className="ml-2 bg-sunray text-green-800 px-2 py-1 rounded-full text-xs font-bold">FREE</span>
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button className="md:hidden text-midnight-blue font-bold ml-4" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-gray-text/10">
            <div className="flex flex-col space-y-3">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-slate-text hover:text-white transition-colors font-work-sans text-sm"
                  onClick={() => {
                    handleLinkClick(item.href)
                    closeMobileMenu()
                  }}
                >
                  {item.label}
                </Link>
              ))}

              <div className="ml-6">
                {pathname !== "/" && !pathname.includes("/#") ? (
                  <Link
                    href="https://www.youtube.com/@BlazingAutomations"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gradient-upstream text-white font-work-sans font-semibold px-4 py-2 rounded-full hover-glow text-base"
                  >
                    Watch Us Build
                    <ExternalLink className="ml-2 w-4 h-4" />
                  </Link>
                ) : (
                  <Button
                    onClick={() => handleLinkClick("#featured-resource")}
                    className="bg-gradient-to-r from-flower-pink to-sunray text-white font-work-sans font-semibold px-4 py-2 rounded-full hover-glow text-sm"
                  >
                    Get Our Templates
                    <span className="ml-2 bg-sunray text-green-800 px-2 py-1 rounded-full text-xs font-bold">FREE</span>
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Header
