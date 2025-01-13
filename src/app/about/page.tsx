import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Music, Users, ThumbsUp, PlaySquare } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="mx-auto px-4 py-8 container">
      <h1 className="mb-8 font-bold text-4xl text-center">
        About Song Voting Queue
      </h1>

      <div className="space-y-8 mx-auto max-w-3xl">
        <section>
          <h2 className="mb-4 font-semibold text-2xl">
            What is Song Voting Queue?
          </h2>
          <p className="text-gray-700 text-lg dark:text-gray-300">
            Song Voting Queue is an interactive platform that allows streamers
            and their audience to collaboratively create music playlists.
            Viewers can submit songs and vote on their favorites, creating a
            dynamic and engaging streaming experience.
          </p>
        </section>

        <section>
          <h2 className="mb-4 font-semibold text-2xl">Key Features</h2>
          <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Music className="mr-2" /> Create Streams
                </CardTitle>
              </CardHeader>
              <CardContent>
                Streamers can easily set up new music streams for their
                audience.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="mr-2" /> Join Streams
                </CardTitle>
              </CardHeader>
              <CardContent>
                Viewers can join ongoing streams and participate in song
                selection.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ThumbsUp className="mr-2" /> Vote on Songs
                </CardTitle>
              </CardHeader>
              <CardContent>
                Participants can upvote or downvote submitted songs to influence
                the playlist.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PlaySquare className="mr-2" /> YouTube Integration
                </CardTitle>
              </CardHeader>
              <CardContent>
                Easily add and play songs from YouTube within the platform.
              </CardContent>
            </Card>
          </div>
        </section>

        <section>
          <h2 className="mb-4 font-semibold text-2xl">How It Works</h2>
          <ol className="space-y-2 text-gray-700 text-lg dark:text-gray-300 list-decimal list-inside">
            <li>
              Streamers create a new stream or viewers join an existing one.
            </li>
            <li>
              Participants submit YouTube links for songs they want to hear.
            </li>
            <li>Everyone in the stream can vote on the submitted songs.</li>
            <li>
              Songs are played in order based on the number of votes they
              receive.
            </li>
            <li>
              The process continues, creating a collaborative and interactive
              playlist!
            </li>
          </ol>
        </section>

        <section className="text-center">
          <h2 className="mb-4 font-semibold text-2xl">Ready to Get Started?</h2>
          <div className="space-x-4">
            <Link href="/create-space">
              <Button size="lg">Create a Stream</Button>
            </Link>
            <Link href="/join-space">
              <Button size="lg" variant="outline">
                Join a Space
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
