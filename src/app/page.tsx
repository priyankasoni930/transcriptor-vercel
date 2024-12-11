// app/page.tsx
"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Home() {
  const [url, setUrl] = useState("");
  const [transcript, setTranscript] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const extractVideoId = (url: string) => {
    const match = url.match(
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
    );
    return match ? match[1] : null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setTranscript([]);

    const videoId = extractVideoId(url);

    if (!videoId) {
      setError("Invalid YouTube URL");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/transcript?videoId=${videoId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch transcript");
      }

      setTranscript(data.transcript);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container mx-auto p-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>YouTube Transcript Viewer</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-2">
              <Input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter YouTube URL"
                className="flex-1"
              />
              <Button type="submit" disabled={loading}>
                {loading ? "Loading..." : "Get Transcript"}
              </Button>
            </div>

            {error && (
              <div className="text-red-500 p-2 rounded bg-red-50">{error}</div>
            )}

            {transcript.length > 0 && (
              <div className="mt-4 space-y-2">
                {transcript.map((line, index) => (
                  <p key={index} className="text-gray-700">
                    {line}
                  </p>
                ))}
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
