'use client'

import { useState, useRef } from "react";
import { birthdayRankings, defaultRanking } from "./rankings";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import ViewCounter from "@/components/ViewCounter";

interface Ranking {
    date: string;
    ranking: string;
}

const BirthdayRankings = () => {
    const [birthday, setBirthday] = useState("");
    const [result, setResult] = useState<Ranking | null>(null);
    const [inputDisabled, setInputDisabled] = useState(false);
    const screenshotRef = useRef(null);

    const handleInputChange = (event: { target: { value: any; }; }) => {
        let value = event.target.value;
        if (/^(\d{2})\/(\d{2})$/.test(value)) {
            setInputDisabled(false);
        } else {
            setInputDisabled(false);
        }

        if (value.length > 5) {
            value = value.slice(0, 5);
        }
        setBirthday(value);
    };

    const handleSubmit = (event: { preventDefault: () => void; }) => {
        event.preventDefault();

        const foundRanking = birthdayRankings.find(
            (entry: { date: string; }) => entry.date === birthday
        );

        setResult(foundRanking || defaultRanking);
    };

    const getTwitterShareLink = async () => {
        if (!result) return;
        const tweet = `I just found out my 2025 Birthday Ranking is ${result.ranking} 🎉 Try it yourself: buddhsentripathi.com/2025-birthday-rankings`;
        const twitterShareURL = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet)}`;
        window.open(twitterShareURL, "_blank");
    };

    return (
        <div className="space-y-8">
            <div className="w-full flex items-center justify-between mb-6">
                <Link href="/projects" className="flex items-center text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Projects
                </Link>
                <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                    <ViewCounter slug="2025-birthday-rankings" readOnly={false} />
                </div>
            </div>
            <div className="flex justify-center items-center bg-background">
                <div className="max-w-xl w-full bg-card text-card-foreground rounded-lg shadow-xl p-6" ref={screenshotRef}>
                    <h1 className="text-3xl font-bold text-center text-primary mb-8">2025 Lucky Birthday Rankings 🎉</h1>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <input
                            type="text"
                            placeholder="Enter your birthday (MM/DD)"
                            value={birthday}
                            onChange={handleInputChange}
                            className="p-3 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                            disabled={inputDisabled}
                        />
                        <button
                            type="submit"
                            className="bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition duration-300"
                        >
                            Find My Ranking
                        </button>
                    </form>

                    {result && (
                        <div className="mt-6 bg-secondary p-4 rounded-md shadow-md">
                            <h2 className="text-xl font-semibold text-primary text-center">
                                Your Ranking: {result.ranking}
                            </h2>
                            <div className="flex justify-center mt-4">
                                <button
                                    onClick={getTwitterShareLink}
                                    className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-md transition duration-300"
                                >
                                    Share on X (Twitter)
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BirthdayRankings;