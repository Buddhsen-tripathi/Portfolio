'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ArrowLeft, Loader2, AlertCircle, CheckCircle, Twitter } from 'lucide-react';
import ViewCounter from '@/components/ViewCounter';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Progress } from "@/components/ui/progress";

interface SpamAnalysisResult {
    isSpam: boolean;
    reason: string;
    spamScore: number;
    exaResults?: any[];
    geminiAnalysis?: any;
}

export default function SpamOrNotPage() {
    const [username, setUsername] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [result, setResult] = useState<SpamAnalysisResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [submittedUsername, setSubmittedUsername] = useState<string>('');

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const trimmedUsername = username.trim();
        if (!trimmedUsername) {
            setError('Please enter a Twitter/X username.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setResult(null);
        setSubmittedUsername(trimmedUsername);

        try {
            const response = await fetch('/api/spam-or-not', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username: trimmedUsername }),
            });

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 429) {
                    throw new Error('Too many requests. Please wait a moment and try again.');
                }
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

    const getScoreColor = (score: number): string => {
        if (score > 7) return 'text-destructive';
        if (score > 4) return 'text-yellow-600 dark:text-yellow-400';
        return 'text-green-600 dark:text-green-400';
    };

    return (
        <main className="container mx-auto space-y-4 px-4">
            <div className="flex items-center justify-between mb-16">
                <Link href="/projects" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Projects
                </Link>
                <div className="text-sm text-muted-foreground">
                    <ViewCounter slug="spam-or-not" readOnly={false} />
                </div>
            </div>

            <div className="text-center mb-10">
                <h1 className="text-3xl md:text-4xl font-bold mb-4">Twitter/X Spam Check</h1>
                <p className="text-muted-foreground max-w-xl mx-auto">
                    Enter a Twitter/X username (without the @) to analyze their recent activity for potential spam-like behavior using AI.
                </p>
                <p className="text-muted-foreground max-w-xl mx-auto mt-2">
                    Built using Exa and Gemini AI models for accurate analysis.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 mb-10">
                <div className="relative">
                    <Label htmlFor="username" className="sr-only">Twitter/X Username</Label>
                    <Twitter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value.replace(/@/g, ''))}
                        placeholder="e.g., elonmusk"
                        disabled={isLoading}
                        required
                        className="pl-10"
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
                <Alert variant="destructive" className="mb-8">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {result && !isLoading && (
                <Card className="overflow-hidden animate-in fade-in duration-500">
                    <CardHeader className="pb-4">
                        <CardTitle className="flex items-center justify-between">
                            <span>Analysis for "{submittedUsername}"</span>
                            <Badge variant={result.isSpam ? "destructive" : "outline"} className={`text-sm ${!result.isSpam && 'border-green-500 text-green-600 dark:text-green-400'}`}>
                                {result.isSpam ? <AlertCircle className="w-4 h-4 mr-1.5" /> : <CheckCircle className="w-4 h-4 mr-1.5" />}
                                {result.isSpam ? 'Likely Spam' : 'Likely Not Spam'}
                            </Badge>
                        </CardTitle>
                        <CardDescription>Based on recent activity analysis.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-5">
                        <div>
                            <Label className="text-xs text-muted-foreground">Reason</Label>
                            <p className="text-sm">{result.reason}</p>
                        </div>
                        <div>
                            <Label className="text-xs text-muted-foreground mb-1 block">Spam Score ({result.spamScore}/10)</Label>
                            <div className="relative w-full h-2 rounded-full overflow-hidden bg-muted border border-border">
                                <Progress value={result.spamScore * 10} className={`absolute top-0 left-0 h-full w-full ${getScoreColor(result.spamScore).replace('text-', 'bg-')}`} style={{ transformOrigin: 'left center' }} />
                            </div>
                            <p className={`text-xs mt-1 ${getScoreColor(result.spamScore)}`}>
                                {result.spamScore > 7 ? 'High Spam Likelihood' : result.spamScore > 4 ? 'Moderate Spam Likelihood' : 'Low Spam Likelihood'}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            )}
        </main>
    );
}
