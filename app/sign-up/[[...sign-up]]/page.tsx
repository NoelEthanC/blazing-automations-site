"use client"

import { SignUp } from "@clerk/nextjs"

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-[#09111f] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-white">Admin Sign Up</h2>
          <p className="mt-2 text-sm text-gray-400">Create an admin account for Blazing Automations</p>
        </div>
        <SignUp
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "bg-gray-800 border border-gray-700",
              headerTitle: "text-white",
              headerSubtitle: "text-gray-400",
              socialButtonsBlockButton: "bg-gray-700 border-gray-600 text-white hover:bg-gray-600",
              formFieldInput: "bg-gray-700 border-gray-600 text-white",
              formButtonPrimary: "bg-[#3f79ff] hover:bg-[#3f79ff]/80",
              footerActionLink: "text-[#3f79ff] hover:text-[#3f79ff]/80",
            },
          }}
        />
      </div>
    </div>
  )
}
