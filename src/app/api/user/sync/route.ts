import { currentUser } from "@clerk/nextjs/server";
import { createUser } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    console.log("User sync API called");
    
    // Get the current authenticated user from Clerk
    const user = await currentUser();

    // If there's no authenticated user, return an error
    if (!user) {
      console.log("No authenticated user found");
      return new Response("Unauthorized", { status: 401 });
    }

    console.log("User found:", user.id);

    // Get the user's primary email
    const primaryEmail = user.emailAddresses.find(
      (email) => email.id === user.primaryEmailAddressId
    );

    if (!primaryEmail) {
      console.log("User does not have a primary email");
      return new Response("User does not have a primary email", { status: 400 });
    }

    // Extract user details from Clerk
    const clerkId = user.id;
    const email = primaryEmail.emailAddress;
    const firstName = user.firstName || undefined;
    const lastName = user.lastName || undefined;
    const imageUrl = user.imageUrl || undefined;

    console.log("Attempting to create/update user in Supabase:", {
      clerkId,
      email,
      firstName,
      lastName
    });

    // Create or update the user in Supabase
    const result = await createUser(clerkId, email, firstName, lastName, imageUrl);
    
    console.log("User sync result:", result);

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("Error syncing user:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
} 