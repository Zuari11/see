import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const user = await currentUser();
  
  // If the user is not authenticated, redirect to the auth page
  if (!user) {
    redirect("/auth");
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <UserButton afterSignOutUrl="/" />
      </div>
      
      <div className="bg-card p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Welcome to your dashboard!</h2>
        <p className="mb-4">You have successfully signed in with Clerk and your data is synced with Supabase.</p>
        <div className="mt-4">
          <Button>Continue to App</Button>
        </div>
      </div>
    </div>
  );
} 