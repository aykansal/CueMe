"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlaySquare, Layers, Plus } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
// import { getServerSession } from "next-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LandingPage() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="py-12 md:py-24 lg:py-32 xl:py-48 w-full">
          <div className="px-4 md:px-6 container">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl/none tracking-tighter">
                  Your Music, Your Way
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Create custom spaces, add your favorite songs, and play them
                  in your perfect sequence.
                </p>
              </div>
              <div className="space-x-4">
                <Button onClick={() => signIn()}>Get Started</Button>
                <Link href="/about">
                  <Button variant="outline">Learn More</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section className="bg-gray-100 dark:bg-gray-800 py-12 md:py-24 lg:py-32 w-full">
          <div className="px-4 md:px-6 container">
            <h2 className="mb-8 font-bold text-3xl text-center sm:text-4xl md:text-5xl tracking-tighter">
              Key Features
            </h2>
            <div className="gap-10 grid sm:grid-cols-2 md:grid-cols-3">
              <div className="flex flex-col items-center space-y-2 border-gray-800 p-4 rounded-lg">
                <Plus className="mb-2 w-8 h-8" />
                <h3 className="font-bold text-xl">Add Your Songs</h3>
                <p className="text-center text-gray-500 text-sm dark:text-gray-400">
                  Easily add and manage your favorite tracks from various
                  sources.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border-gray-800 p-4 rounded-lg">
                <Layers className="mb-2 w-8 h-8" />
                <h3 className="font-bold text-xl">Create Spaces</h3>
                <p className="text-center text-gray-500 text-sm dark:text-gray-400">
                  Organize your music into custom spaces for different moods or
                  occasions.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border-gray-800 p-4 rounded-lg">
                <PlaySquare className="mb-2 w-8 h-8" />
                <h3 className="font-bold text-xl">Custom Sequencing</h3>
                <p className="text-center text-gray-500 text-sm dark:text-gray-400">
                  Play your music in the perfect order, tailored to your
                  preferences.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="py-16 md:py-28 lg:py-36 w-full">
          <div className="mx-auto px-4 md:px-6 max-w-5xl container">
            <div className="flex justify-between items-center space-y-8 text-center">
              <div className="space-y-4">
                <h2 className="font-bold text-3xl sm:text-4xl md:text-5xl tracking-tighter">
                  Start Streaming Today
                </h2>
              </div>
              <div className="space-y-2 mt-8 w-full max-w-sm">
                <form className="flex space-x-2">
                  <Input
                    className="flex-1 max-w-lg"
                    placeholder="Enter your email"
                    type="email"
                  />
                  <Button type="submit">Sign Up</Button>
                </form>
                <p className="text-gray-500 text-xs dark:text-gray-400">
                  By signing up, you agree to our{" "}
                  <Link className="underline underline-offset-2" href="#">
                    Terms & Conditions
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
