"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.error(error);
    }
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          background: "#1A1008",
          color: "#F5EDD8",
          fontFamily: "serif",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          textAlign: "center",
          padding: "2rem",
        }}
      >
        <p style={{ color: "#C4902A", fontSize: "1.5rem", marginBottom: "1rem" }}>★</p>
        <h2
          style={{
            fontSize: "clamp(1.5rem, 4vw, 2.25rem)",
            marginBottom: "1rem",
            lineHeight: 1.2,
          }}
        >
          West TN Ink Revival Expo
        </h2>
        <p style={{ color: "rgba(245,237,216,0.6)", maxWidth: "36rem", marginBottom: "2rem" }}>
          An unexpected error occurred. Please refresh the page or try again
          shortly.
        </p>
        <button
          onClick={reset}
          style={{
            padding: "0.875rem 2rem",
            background: "#7A1714",
            color: "#F5EDD8",
            border: "none",
            cursor: "pointer",
            textTransform: "uppercase",
            letterSpacing: "0.15em",
            fontSize: "0.8rem",
          }}
        >
          Try Again
        </button>
      </body>
    </html>
  );
}
