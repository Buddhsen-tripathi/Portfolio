'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2 } from 'lucide-react'; 
interface SpamAnalysisResult {
  isSpam: boolean;
  reason: string;
  spamScore: number;
  exaResults?: any[]; // Keep raw results optional
  geminiAnalysis?: any;
}

export default function SpamOrNotPage() {
  const [username, setUsername] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<SpamAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!username.trim()) {
      setError('Please enter a Twitter/X username.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/spam-or-not', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `API request failed with status ${response.status}`);
      }

      setResult(data);

    } catch (err: any) {
      console.error("API Call failed:", err);
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6 text-center">Twitter/X Spam Check</h1>
      <p className="text-center text-muted-foreground mb-8">
Enter a Twitter/X username (without the @) to analyze their recent activity for potential spam-like behavior using AI.</p>

      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <div>
          <Label htmlFor="username" className="mb-2 block">Twitter/X Username</Label>
          <Input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="e.g., elonmusk"
            disabled={isLoading}
            required
          />
        </div>
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing...</>
          ) : (
            'Check for Spam'
          )}
        </Button>
      </form>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Analysis Result for "{username}"</CardTitle>
            <CardDescription>Based on recent activity analysis.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className={`p-4 rounded-md ${result.isSpam ? 'bg-destructive/10 border border-destructive' : 'bg-green-100 dark:bg-green-900/30 border border-green-500'}`}>
              <p className="text-lg font-semibold">
                Likely Spam: <span className={result.isSpam ? 'text-destructive' : 'text-green-600 dark:text-green-400'}>{result.isSpam ? 'Yes' : 'No'}</span>
              </p>
            </div>
            <div>
              <p className="font-medium">Reason:</p>
              <p className="text-muted-foreground">{result.reason}</p>
            </div>
            <div>
              <p className="font-medium">Spam Score:</p>
              <p className={`text-lg font-bold ${result.spamScore > 7 ? 'text-destructive' : result.spamScore > 4 ? 'text-yellow-600 dark:text-yellow-400' : 'text-green-600 dark:text-green-400'}`}>
                {result.spamScore}/10
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
