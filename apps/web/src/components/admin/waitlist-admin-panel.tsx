"use client";

import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const STORAGE_KEY = "medlens_waitlist_admin_key";

interface WaitlistEntry {
  email: string;
  joinedAt: string;
}

function readStoredKey(): string {
  if (typeof window === "undefined") return "";
  return sessionStorage.getItem(STORAGE_KEY) ?? "";
}

export function WaitlistAdminPanel() {
  const [apiKey, setApiKey] = useState(readStoredKey);
  const [entries, setEntries] = useState<WaitlistEntry[]>([]);
  const [count, setCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [connected, setConnected] = useState(() => readStoredKey().length > 0);

  const fetchEntries = useCallback(async (key: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/waitlist", {
        headers: { Authorization: `Bearer ${key}` },
      });

      if (!response.ok) {
        throw new Error(response.status === 401 ? "Invalid API key." : "Failed to load waitlist.");
      }

      const data = (await response.json()) as { entries: WaitlistEntry[]; count: number };
      setEntries(data.entries);
      setCount(data.count);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setEntries([]);
      setCount(0);
    } finally {
      setLoading(false);
    }
  }, []);

  function handleConnect(event: React.FormEvent) {
    event.preventDefault();
    const trimmed = apiKey.trim();
    if (!trimmed) {
      setError("Enter your admin API key.");
      return;
    }
    sessionStorage.setItem(STORAGE_KEY, trimmed);
    setConnected(true);
    void fetchEntries(trimmed);
  }

  function handleSignOut() {
    sessionStorage.removeItem(STORAGE_KEY);
    setConnected(false);
    setApiKey("");
    setEntries([]);
    setCount(0);
    setError(null);
  }

  async function handleDownloadCsv() {
    const key = sessionStorage.getItem(STORAGE_KEY);
    if (!key) return;

    const response = await fetch("/api/admin/waitlist?format=csv", {
      headers: { Authorization: `Bearer ${key}` },
    });

    if (!response.ok) {
      setError("CSV export failed.");
      return;
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "waitlist.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  async function handleCopyEmails() {
    const emails = entries.map((entry) => entry.email).join(", ");
    await navigator.clipboard.writeText(emails);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <header className="mb-8 border-b border-border pb-6">
        <p className="font-sans text-sm font-semibold uppercase tracking-wide text-lens">Admin</p>
        <h1 className="mt-2 font-display text-3xl text-ink">Waitlist signups</h1>
        <p className="mt-2 text-sm text-muted">
          View early-access signups and export for email campaigns. This page is not indexed by
          search engines.
        </p>
      </header>

      <form onSubmit={handleConnect} className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label htmlFor="admin-api-key" className="mb-1 block text-sm font-medium text-ink">
            Admin API key
          </label>
          <Input
            id="admin-api-key"
            type="password"
            value={apiKey}
            onChange={(event) => setApiKey(event.target.value)}
            placeholder="Paste WAITLIST_ADMIN_API_KEY"
            autoComplete="off"
          />
        </div>
        <div className="flex gap-2">
          <Button type="submit" disabled={loading}>
            {loading ? "Loading…" : "Connect"}
          </Button>
          {connected && entries.length === 0 && !loading && (
            <Button
              type="button"
              variant="secondary"
              onClick={() => void fetchEntries(apiKey.trim())}
            >
              Load signups
            </Button>
          )}
          {connected && (
            <Button type="button" variant="outline" onClick={handleSignOut}>
              Sign out
            </Button>
          )}
        </div>
      </form>

      {error && (
        <p
          role="alert"
          className="mb-6 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive"
        >
          {error}
        </p>
      )}

      {entries.length > 0 && (
        <>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted">
              <span className="font-semibold text-ink">{count}</span> signup{count === 1 ? "" : "s"}
            </p>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => void handleCopyEmails()}
              >
                {copied ? "Copied" : "Copy emails"}
              </Button>
              <Button type="button" size="sm" onClick={() => void handleDownloadCsv()}>
                Download CSV
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border bg-surface">
                <tr>
                  <th className="px-4 py-3 font-medium text-ink">Email</th>
                  <th className="px-4 py-3 font-medium text-ink">Joined</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => (
                  <tr key={entry.email} className="border-b border-border last:border-0">
                    <td className="px-4 py-3 font-mono text-ink">{entry.email}</td>
                    <td className="px-4 py-3 text-muted">
                      {new Date(entry.joinedAt).toLocaleString("en-US", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
