import Link from "next/link";
import { Zap, Twitter, Linkedin, Github, Mail, PlaySquare } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#09111f] border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="mb-8 md:mb-0">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <Zap className="h-6 w-6 text-[#3f79ff]" />
              <span className="text-xl font-bold text-white">
                Blazing Automations
              </span>
            </Link>
            <p className="text-gray-400 max-w-md">
              Transforming businesses with AI automation and web solutions that
              work for you.
            </p>
          </div>

          <div className="flex space-x-6">
            <Link
              href="https://www.youtube.com/@blazingautomations"
              className="text-gray-400 hover:text-[#3f79ff] transition-colors"
              aria-label="Youtube"
            >
              <PlaySquare className="h-5 w-5" />
            </Link>
            <Link
              href="https://x.com/noelethan_dev"
              className="text-gray-400 hover:text-[#3f79ff] transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="h-5 w-5" />
            </Link>
            <Link
              href="https://www.linkedin.com/in/noel-ethan-chiwamba/"
              className="text-gray-400 hover:text-[#3f79ff] transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
            </Link>

            <Link
              href="mailto:contact@blazingautomations.com"
              className="text-gray-400 hover:text-[#3f79ff] transition-colors"
              aria-label="Email"
            >
              <Mail className="h-5 w-5" />
            </Link>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2025 Blazing Automations. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link
              href="/privacy"
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
