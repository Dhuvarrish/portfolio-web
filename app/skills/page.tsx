"use client"

import { useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";

export default function SkillsPage() {
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
    <div className="p-4 md:p-8">
      <h1 className="text-2xl md:text-3xl font-bold">Skills</h1>
      <p className="mt-4 text-base md:text-sm text-muted-foreground">This is the skills page.</p>
      <div className="mt-8 flex flex-col items-start gap-4">
        <Button onClick={handlePing} disabled={loading} size="lg">
          {loading ? "Connecting..." : "Test Backend Connection"}
        </Button>
        {message && (
          <p className="text-muted-foreground text-base md:text-sm">{message}</p>
        )}
      </div>
    </div>
  );
}
