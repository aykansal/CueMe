import Link from "next/link";

export default function AppFooter() {
  return (
    <footer className="flex flex-col items-center gap-2 px-4 md:px-6 py-6 border-t w-full shrink-0">
      <div className="text-sm underline-offset-4">
        Made with 💖 by{" "}
        <Link href="https://x.com/aykansal" className="font-semibold hover:underline">
          Aykansal
        </Link>
      </div>
    </footer>
  );
}
