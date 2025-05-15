"use client";

import { useSignUp, useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * This component can be used to sync users to Supabase directly from the client
 * as an alternative to the webhook approach.
 * 
 * You would add this component to your SignUp page if using this approach.
 */
export function ClerkCallbacks() {
  const { isLoaded: isSignUpLoaded, signUp, setActive: setSignUpActive } = useSignUp();
  const { isLoaded: isSignInLoaded, signIn, setActive: setSignInActive } = useSignIn();
  const router = useRouter();

  // Handle sign up completion
  useEffect(() => {
    if (!isSignUpLoaded) return;

    // Watch for changes in the signup status
    const checkSignUpStatus = async () => {
      try {
        console.log("Checking signup status:", signUp.status);
        
        // If the user successfully signed up, sync to Supabase
        if (signUp.status === "complete" && signUp.createdSessionId) {
          console.log("Sign up complete, syncing user to Supabase");
          
          // This sets the session and redirects after setting the session
          await setSignUpActive({ session: signUp.createdSessionId });
          
          // Sync the user to Supabase
          const response = await fetch("/api/user/sync", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          });
          
          const result = await response.json().catch(() => ({ error: "Failed to parse JSON" }));
          console.log("User sync response:", result);
          
          // Redirect to dashboard
          router.push("/dashboard");
        }
      } catch (error) {
        console.error("Error syncing user to Supabase:", error);
      }
    };

    // Check initial status
    checkSignUpStatus();

    // Create interval to check status changes (Clerk doesn't have addEventListener)
    const intervalId = setInterval(checkSignUpStatus, 1000);

    // Clean up interval when the component unmounts
    return () => {
      clearInterval(intervalId);
    };
  }, [isSignUpLoaded, signUp, setSignUpActive, router]);

  // Handle sign in completion
  useEffect(() => {
    if (!isSignInLoaded) return;

    const checkSignInStatus = async () => {
      try {
        console.log("Checking signin status:", signIn?.status);
        
        // If the user successfully signed in, sync to Supabase
        if (signIn?.status === "complete" && signIn.createdSessionId) {
          console.log("Sign in complete, syncing user to Supabase");
          
          // This sets the session
          await setSignInActive({ session: signIn.createdSessionId });
          
          // Sync the user to Supabase
          const response = await fetch("/api/user/sync", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          });
          
          const result = await response.json().catch(() => ({ error: "Failed to parse JSON" }));
          console.log("User sync response:", result);
          
          // Redirect to dashboard
          router.push("/dashboard");
        }
      } catch (error) {
        console.error("Error syncing user to Supabase on sign in:", error);
      }
    };

    // Check initial status
    checkSignInStatus();

    // Create interval to check status changes
    const intervalId = setInterval(checkSignInStatus, 1000);

    // Clean up interval when the component unmounts
    return () => {
      clearInterval(intervalId);
    };
  }, [isSignInLoaded, signIn, setSignInActive, router]);

  return null;
} 