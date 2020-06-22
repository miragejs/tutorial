import React from "react";

export function About() {
  return (
    <div className="p-12 bg-white rounded-md shadow-lg overflow-hidden max-w-md mx-auto">
      <h1 className="mb-4 text-3xl font-bold leading-none">About</h1>
      <p className="mt-6">
        This is the demo app for the{" "}
        <a
          className="underline"
          href="https://miragejs.com/tutorial"
          style={{
            textDecorationColor: "#64748b",
          }}
        >
          Mirage JS Tutorial
        </a>
        .
      </p>
    </div>
  );
}
