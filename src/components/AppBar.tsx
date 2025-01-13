"use client";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "./ui/button";
import { Music } from "lucide-react";

export const AppBar = () => {
  const session = useSession();

  return (
    <header className="flex items-center px-4 lg:px-6 border-b h-14">
      <Link className="flex justify-center items-center" href="/">
        <Music className="w-6 h-6" />
          <p className="px-2 font-semibold">Cue Me</p>
      </Link>
      <nav className="flex gap-4 sm:gap-6 ml-auto">
        {/* <div className="font-medium text-sm underline-offset-4 hover:underline"> */}
        {session.data?.user ? (
          <>
            <Link href="/dashboard">
              <Button>Dashboard</Button>
            </Link>
            <Button onClick={() => signOut()}>Sign Out</Button>
          </>
        ) : (
          <Button onClick={() => signIn()}>Sign In</Button>
        )}
        {/* </div> */}
      </nav>
    </header>
  );
};
