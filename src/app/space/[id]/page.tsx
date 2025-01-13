"use client";

import { useState, useEffect, useCallback, use } from "react";

import axios from "axios";
import Image from "next/image";
import { Play, ChevronUpCircle, ChevronDownCircle } from "lucide-react";

import { Stream } from "@/lib/types";

import { useToast } from "@/hooks/use-toast";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/toaster";
import YouTubePlayer from "@/components/YoutubePlayer";
import { ShareButton } from "@/components/share-button";
import { sortStreams } from "@/lib/utils";

const REFRESH_INTERVAL_MS = 30000;

export default function StreamPage({ params }: { params: { id: string } }) {
  const { toast } = useToast();
  const [streamName, setStreamName] = useState<string>("");
  const [currentStream, setCurrentStream] = useState<Stream | null>(null);
  const [streamQueue, setStreamQueue] = useState<Stream[]>([]);
  const [newStreamUrl, setNewStreamUrl] = useState<string>("");
  const [previewStreamId, setPreviewStreamId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // @ts-expect-error ignore type-confict
  const spaceId = use(params).id;

  useEffect(() => {
    const spaceName = async () => {
      await axios.get(`/api/spaces/${spaceId}`).then((response) => {
        setStreamName(`You're listening ${response.data.name}`);
      });
    };
    spaceName();
  }, [spaceId]);

  const extractStreamId = (url: string) => {
    const regex =
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setNewStreamUrl(url);
    const streamId = extractStreamId(url);
    setPreviewStreamId(streamId);
  };

  const handleSubmit = async () => {
    const streamId = extractStreamId(newStreamUrl);
    if (!streamId) return;

    setIsLoading(true);
    try {
      // Send stream URL to the backend to fetch stream details and add to the queue
      const response = await axios.post("/api/streams/", {
        spaceId,
        url: newStreamUrl,
      });
      const data = response.data;

      toast({
        title: data?.message?.title,
        description: data?.message?.description,
      });

      setNewStreamUrl("");
      setPreviewStreamId(null);
    } catch (error) {
      console.error("Error submitting stream:", error);
      toast({
        title: "Error",
        description: "An error occurred while submitting the stream.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const playNext = async () => {
    try {
      const res = await axios.get("/api/streams/next");
      const nextStream = res.data?.stream;
      setCurrentStream(nextStream);
    } catch (error) {
      console.error("Error fetching next stream:", error);
    }
  };

  const handleVote = async (stream: Stream, index: number) => {
    try {
      const res = await axios.post<{
        message: string;
        voteCount: number;
        hasUpvoted: boolean;
      }>(`/api/streams/vote`, {
        streamId: stream.id,
      });

      const updatedStreamQueue = [...streamQueue];
      const updatedStream = {
        ...updatedStreamQueue[index],
        voteCount: res.data.voteCount,
        hasUpvoted: res.data.hasUpvoted,
      };

      updatedStreamQueue[index] = updatedStream;
      setStreamQueue(sortStreams(updatedStreamQueue));

      toast({
        title: res.data.message,
      });
    } catch (error) {
      console.error("Error voting:", error);
      toast({
        title: "Error processing vote",
        variant: "destructive",
      });
    }
  };

  const refreshStreams = useCallback(async () => {
    try {
      const res = await axios.get(`/api/streams/?spaceId=${spaceId}`);
      const data = res.data;
      setStreamQueue(data?.streams ? sortStreams(data.streams) : []);
      setCurrentStream(data?.activeStream?.stream || null);
    } catch (error) {
      console.error("Error refreshing streams:", error);
    }
  }, [spaceId]);

  useEffect(() => {
    refreshStreams();
    const intervalId = setInterval(refreshStreams, REFRESH_INTERVAL_MS);
    return () => clearInterval(intervalId);
  }, [refreshStreams]);

  console.log(streamQueue);

  return (
    <div className="mx-auto p-4 min-h-[80vh] container">
      <div className="flex justify-between items-center mb-4">
        <h1 className="font-bold text-2xl">{streamName}</h1>
        <ShareButton spaceId={spaceId} />
      </div>

      <div className="flex justify-between gap-x-20 mb-8">
        {/* Current Stream Player */}
        <div className="basis-1/2">
          <h2 className="mb-2 font-semibold text-xl">Now Playing</h2>
          {/* @ts-expect-error ignore type-confict */}
          <YouTubePlayer currentStream={currentStream} onStreamEnd={playNext} />
        </div>

        {/* Stream Submission */}
        <div className="h-full basis-1/2">
          <h2 className="mb-2 font-semibold text-xl">Submit a Song</h2>
          <div className="flex gap-2 mb-2">
            <Input
              type="text"
              placeholder="Enter YouTube URL"
              value={newStreamUrl}
              onChange={handleUrlChange}
              disabled={isLoading}
              onKeyDownCapture={(e) => e.key === "Enter" && handleSubmit()}
            />
            <Button
              onClick={handleSubmit}
              disabled={isLoading || !previewStreamId}
            >
              {isLoading ? "Submitting..." : "Submit"}
            </Button>
          </div>
          {previewStreamId && (
            <div className="max-w-sm aspect-stream">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${previewStreamId}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}
        </div>
      </div>

      {/* Stream Queue */}
      <div>
        <div className="flex justify-between items-center mb-3.5">
          <h2 className="mb-1 font-semibold text-xl">Upcoming Songs</h2>
          {streamQueue.length > 0 && (
            <Button className="mt-4" onClick={playNext}>
              <Play className="mr-2 w-4 h-4" />
              Play Next
            </Button>
          )}
        </div>
        {streamQueue.length === 0 ? (
          <p className="py-4 text-center text-gray-500">No songs in queue</p>
        ) : (
          <ul className="space-y-2">
            {streamQueue.map((stream, index) => (
              <li
                key={stream.id}
                className="flex justify-between items-center bg-gray-100 p-2 rounded"
              >
                <div className="flex items-center gap-2">
                  <Image
                    src={stream.smlImg}
                    alt={stream.title}
                    width={90}
                    height={68}
                    className="rounded"
                  />
                  <span className="font-medium">{stream?.title}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>{stream.voteCount}</span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleVote(stream, index)}
                  >
                    <span>
                      {stream.hasUpvoted ? (
                        <ChevronDownCircle className="w-4 h-4" />
                      ) : (
                        <ChevronUpCircle className="w-4 h-4" />
                      )}
                    </span>
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Toaster />
    </div>
  );
}
