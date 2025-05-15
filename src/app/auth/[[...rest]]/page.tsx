"use client"

import { useState } from "react"
import { SignIn, SignUp } from "@clerk/nextjs"
import { motion, AnimatePresence } from "framer-motion"
import { ClerkCallbacks } from "../clerk-callbacks"

export default function AuthPage() {
  const [isSignIn, setIsSignIn] = useState(true)

  const toggleForm = () => {
    setIsSignIn(!isSignIn)
  }

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <AnimatePresence mode="wait">
          {isSignIn ? (
            <motion.div
              key="signin"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center"
            >
              <SignIn
                redirectUrl="/dashboard"
                appearance={{
                  elements: {
                    rootBox: "w-full",
                    card: "rounded-lg shadow-md w-full",
                  }
                }}
              />
              <div className="mt-4 text-center text-sm">
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  onClick={toggleForm}
                  className="underline underline-offset-4 hover:text-primary"
                >
                  Sign up
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="signup"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center"
            >
              <SignUp
                redirectUrl="/dashboard"
                appearance={{
                  elements: {
                    rootBox: "w-full",
                    card: "rounded-lg shadow-md w-full",
                  }
                }}
              />
              <div className="mt-4 text-center text-sm">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={toggleForm}
                  className="underline underline-offset-4 hover:text-primary"
                >
                  Sign in
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="text-muted-foreground mt-6 text-center text-xs">
        By signing up, you agree to our <a href="#" className="underline underline-offset-4 hover:text-primary">Terms of Service</a>{" "}
        and <a href="#" className="underline underline-offset-4 hover:text-primary">Privacy Policy</a>.
      </div>
      
      {/* This component handles the client-side sync to Supabase */}
      <ClerkCallbacks />
    </div>
  )
} 