import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Sorts streams by vote count (descending) and creation timestamp (ascending) when votes are equal
 */

import { Stream } from "@/lib/types";
export const sortStreams = (streams: Stream[]): Stream[] => {
    return [...streams].sort((a, b) => {
        const votesDiff = b.voteCount - a.voteCount;
        if (votesDiff !== 0) return votesDiff;

        return new Date(a.createdTimestamp).getTime() - new Date(b.createdTimestamp).getTime();
    });
};