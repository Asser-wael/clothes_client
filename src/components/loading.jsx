import React from "react";

export default function Loading() {
  return (
    <div className="min-h-screen w-full bg-bg flex items-center justify-center">
      <div
        className="
          bg-card/80
          backdrop-blur-xl
          border border-border
          rounded-3xl
          px-10 py-8
          flex flex-col items-center
          gap-5
          shadow-xl
        "
      >
        {/* Spinner */}
        <div className="relative">
          <div className="absolute inset-0 bg-accent/20 blur-xl rounded-full" />

          <div
            className="
              relative
              w-14 h-14
              border-4
              border-accent/20
              border-t-accent
              rounded-full
              animate-spin
            "
          />
        </div>

        {/* Text */}
        <p className="text-text font-semibold tracking-wide animate-pulse">
          Loading...
        </p>

        <span className="text-muted text-sm">
          Please wait a moment
        </span>
      </div>
    </div>
  );
}