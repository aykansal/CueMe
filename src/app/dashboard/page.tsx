// import StreamView from "@/components/StreamView";
// import { creatorId } from "../lib/config";

// export default function Dashboard() {
//   return <StreamView creatorId={creatorId} playVideo={true} />;
// }

import Link from 'next/link'
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <div className="flex flex-col justify-center items-center mx-auto p-4 min-h-[80vh] container max-h">
      <div className="flex sm:flex-row flex-col gap-4">
        <Link href="/create-space">
          <Button size="lg">Create Space</Button>
        </Link>
        <Link href="/join-space">
          <Button size="lg" variant="outline">Join Space</Button>
        </Link>
      </div>
    </div>
  )
}

