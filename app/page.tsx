"use client"

import { useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";

export default function Page() {
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handlePing() {
    setLoading(true);
    try {
      const data = await api.ping();
      setMessage(data.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center gap-4 py-5">
      <Button onClick={handlePing} disabled={loading} size="lg">
        {loading ? "Connecting..." : "Test Backend Connection"}
      </Button>
      {message && (
        <p className="text-muted-foreground text-sm">{message}</p>
      )}
    </div>
  );
}
