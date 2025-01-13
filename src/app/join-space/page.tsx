"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import axios from "axios";

interface Stream {
  id: string;
  name: string;
}

export default function JoinStreamPage() {
  const [spaces, setSpaces] = useState<Stream[]>([]);
  const getExistingSpaces = async () => {
    try {
      const response = await axios.get("/api/spaces");
      const data = await response.data;
      setSpaces(data);
    } catch (error: any) {
      if (error.status === 403) {
        console.error("unauthenticated");
        return;
      }
      console.error(error);
    }
  };

  useEffect(() => {
    // const mockStreams: Stream[] = [
    //   { id: "123", name: "Cool Music Stream" },
    //   { id: "456", name: "Rock Night" },
    //   { id: "789", name: "Chill Vibes Only" },
    // ];
    getExistingSpaces();
  }, []);

  return (
    <div className="flex flex-col justify-center items-center mx-auto p-4 min-h-[80vh] container">
      <h1 className="mb-8 font-bold text-3xl">Join a Space</h1>
      <div className="space-y-4 w-full max-w-md">
        {spaces.map((space) => (
          <Link key={space.id} href={`/space/${space.id}`} className="w-full">
            <Button variant="outline" className="justify-start w-full">
              {space.name}
            </Button>
          </Link>
        ))}
      </div>
    </div>
  );
}
