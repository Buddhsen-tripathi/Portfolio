import React, { useState, useRef } from "react";
import { birthdayRankings, defaultRanking } from "./rankings";

const BirthdayRankings = () => {
    const [birthday, setBirthday] = useState("");
    const [result, setResult] = useState(null);
    const [inputDisabled, setInputDisabled] = useState(false); 
    const screenshotRef = useRef(null);

    const handleInputChange = (event) => {
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

    const handleSubmit = (event) => {
        event.preventDefault();

        const foundRanking = birthdayRankings.find(
            (entry) => entry.date === birthday
        );

        setResult(foundRanking || defaultRanking);
    };

    const getTwitterShareLink = async () => {
        const tweet = `I just found out my 2025 Birthday Ranking is ${result.ranking} 🎉 Try it yourself: buddhsentripathi.com/2025-birthday-rankings`;
        const twitterShareURL = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet)}`;
        window.open(twitterShareURL, "_blank");
    };

    return (
        <div className="max-w-[1000px] mx-auto p-6 mt-28 bd-page">
            <div className="container-box-bd" ref={screenshotRef}>
                <h1 className="heading-bd">2025 Lucky Birthday Rankings 🎉</h1>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Enter your birthday (MM/DD)"
                        value={birthday}
                        onChange={handleInputChange}
                        className="input-field"
                        required
                        disabled={inputDisabled} // Disable input once format is correct
                    />
                    <button type="submit" className="button-bd">
                        Find My Ranking
                    </button>
                </form>

                {result && (
                    <div className="result-box mt-4">
                        <h2 className="ranking">Your Ranking: {result.ranking}</h2>
                        <button
                            onClick={getTwitterShareLink}
                            className="button-bd mt-4 bg-blue-500 hover:bg-blue-600 text-white"
                        >
                            Share on X (Twitter)
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BirthdayRankings;