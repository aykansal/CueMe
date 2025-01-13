"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";

export default function CreateStreamPage() {
  const [spaceName, setSpaceName] = useState("");
  const router = useRouter();

  const handleCreateStream = async (e: React.FormEvent) => {
    e.preventDefault();
    const space = await axios.post("/api/spaces/create-space", {
      name: spaceName,
    });
    const spaceId = space?.data?.space?.id;
    if (space?.status === 201 && spaceId) {
      router.push(`/space/${spaceId}`);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center mx-auto p-4 min-h-[80vh] container">
      <h1 className="mb-8 font-bold text-3xl">Create a New Stream</h1>
      <form onSubmit={handleCreateStream} className="w-full max-w-md">
        <div className="mb-4">
          <Label htmlFor="spaceName">Stream Name</Label>
          <Input
            id="spaceName"
            type="text"
            value={spaceName}
            onChange={(e) => setSpaceName(e.target.value)}
            placeholder="Enter your stream name"
            required
          />
        </div>
        <Button type="submit" className="w-full">
          Create Stream
        </Button>
      </form>
    </div>
  );
}
