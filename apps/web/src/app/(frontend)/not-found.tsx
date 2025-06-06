import Link from "next/link";
import React from "react";

import { Button } from "@ui/components/ui/button";

export default function NotFound() {
  return (
    <div className="container py-28 h-screen flex flex-col items-center justify-center">
      <div className="prose max-w-none">
        <h1 style={{ marginBottom: 0 }}>404</h1>
        <p className="mb-4">This page could not be found.</p>
      </div>
      <Button asChild variant="default">
        <Link href="/">Go home</Link>
      </Button>
    </div>
  );
}
