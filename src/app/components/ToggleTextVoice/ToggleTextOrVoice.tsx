'use client';

import React, { useState } from 'react';
import SentimentAnalysisForm from '../SentimentAnalysisForm';
import VoiceSentiment from '../SentimentVoiceAnalysisForm';

const ToggleCards = () => {
    const [activeCard, setActiveCard] = useState<'text' | 'voice'>('text');
    const [isListening, setIsListening] = useState(false);


    return (
        <div className="flex flex-col items-center space-y-6 p-2 mt-4 mb-4">
            {/* Toggle Button */}
            <button
                className={`bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition duration-200 ${isListening ? 'cursor-not-allowed opacity-50' : ''}`}
                onClick={() => setActiveCard(activeCard === 'text' ? 'voice' : 'text')}
                disabled={isListening === true && activeCard === 'voice'}
            >
                {activeCard === 'text' ? 'Switch to Voice' : 'Switch to Text'}
            </button>

            {/* Cards */}
            <div className="w-full max-w-full space-y-4">
                {activeCard === 'text' ? <SentimentAnalysisForm  /> : ''}
                {activeCard === 'voice' ? <VoiceSentiment onRecordingChange={setIsListening} /> : ''}
            </div>
        </div>
    );
};

export default ToggleCards;
