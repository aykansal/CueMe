export interface User {
  id: string;
  email: string;
  provider: Provider;
  upvotes: Upvote[];
  CurrentStream: CurrentStream[];
  streams: Stream[];
  Space: Space[];
}

export interface Space {
  id: string;
  createdTimestamp: Date;
  name: string;
  Stream: Stream[];
  ownerId: string;
  owner: User;
}

export interface Stream {
  id: string;
  voteCount: number;
  title: string;
  played: boolean;
  active: boolean;
  smlImg: string;
  bigImg: string;
  createdTimestamp: Date;
  type: StreamType;
  url: string;
  extractedId: string;
  upvotes: Upvote[];
  playedTimestamp?: Date;
  CurrentStream: CurrentStream | null;
  userId: string;
  user: User;
  spaceId?: string | null;
  Space?: Space | null;
  hasUpvoted: boolean;
}

export interface CurrentStream {
  userId: string;
  streamId: string | null;
  stream: Stream | null;
  user: User;
}


export interface Upvote {
  id: string;
  userId: string;
  streamId: string;
  user: User;
  stream: Stream;
}

enum Provider {
  GOOGLE = 'GOOGLE',
}

// enum Role {
//   Streamer = 'Streamer',
//   EndUser = 'EndUser',
// }

enum StreamType {
  SPOTIFY = 'SPOTIFY',
  YOUTUBE = 'YOUTUBE',
}
