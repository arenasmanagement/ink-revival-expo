"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to monitoring in production (no console.error in prod to avoid leaking info)
    if (process.env.NODE_ENV === "development") {
      console.error(error);
    }
  }, [error]);

  return (
    <div
      className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-20 text-center"
      style={{ background: "var(--color-parchment-light, #F5EDD8)" }}
    >
      {/* Star ornament */}
      <p className="text-crimson text-2xl mb-4">★</p>

      {/* Heading */}
      <h2
        className="text-ink text-3xl sm:text-4xl mb-4"
        style={{ fontFamily: "var(--font-rye, serif)" }}
      >
        Something Went Wrong
      </h2>

      {/* Divider */}
      <div
        className="mx-auto mb-6"
        style={{
          width: "80px",
          height: "2px",
          background: "linear-gradient(90deg,transparent,#C4902A,transparent)",
        }}
      />

      {/* Description */}
      <p
        className="text-ink/60 text-base sm:text-lg max-w-md mb-10 leading-relaxed"
        style={{ fontFamily: "var(--font-garamond, serif)" }}
      >
        An unexpected error occurred. Please try again or head back to the
        homepage.
      </p>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={reset}
          className="px-8 py-4 bg-crimson text-cream uppercase tracking-widest text-sm hover:bg-crimson-dark transition-all duration-200 active:scale-95"
          style={{ fontFamily: "var(--font-special-elite, monospace)" }}
        >
          Try Again
        </button>
        <Link
          href="/"
          className="px-8 py-4 border-2 border-ink text-ink uppercase tracking-widest text-sm hover:bg-ink hover:text-cream transition-all duration-200 active:scale-95"
          style={{ fontFamily: "var(--font-special-elite, monospace)" }}
        >
          Back to Homepage
        </Link>
      </div>
    </div>
  );
}
