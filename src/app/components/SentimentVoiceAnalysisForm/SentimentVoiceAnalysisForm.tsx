/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { SentimentAnalyzer } from '../../services/sentimentAnalyzer';
import StorageService from '../../services/storageService';
import { LanguageDetector } from '../../services/languageDetector';

interface Message {
    id: string;
    text: string;
    sentiment: 'positive' | 'negative' | 'neutral';
    score: number;
    language?: string;
    timestamp: number;
}

const VoiceSentiment = () => {
    const [transcript, setTranscript] = useState<string>('');
    const [isListening, setIsListening] = useState<boolean>(false);
    const [sentiment, setSentiment] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [speechRecognition, setSpeechRecognition] = useState<any>(null);

    // Memoize services
    const sentimentAnalyzer = useMemo(() => new SentimentAnalyzer(), []);
    const storageService = useMemo(() => new StorageService(), []);
    const languageDetector = useMemo(() => new LanguageDetector(), []);

    // Memoize sentiment analysis function
    const analyzeSentiment = useCallback(
        (text: string) => {
            try {
                // Detect language
                const detectedLanguage = languageDetector.detect(text);

                // Analyze sentiment
                const result = sentimentAnalyzer.analyze(text);

                // Store messages
                const storedMessages = storageService.getMessages();
                const updatedMessages = [
                    ...storedMessages,
                    {
                        text,
                        id: `msg-${Date.now()}`,
                        score: result.score,
                        sentiment: result.score,
                        language: detectedLanguage,
                        timestamp: Date.now().toLocaleString(),
                    },
                ];
                storageService.saveMessages(updatedMessages as Message[]);

                // Set sentiment based on score
                if (result.score > 0) {
                    setSentiment('Positive');
                } else if (result.score < 0) {
                    setSentiment('Negative');
                } else {
                    setSentiment('Neutral');
                }
            } catch (err) {
                setError(
                    `Sentiment analysis error: ${err instanceof Error ? err.message : 'Unknown error'}`
                );
            }
        },
        [sentimentAnalyzer, languageDetector, storageService]
    );

    // Speech recognition setup
    useEffect(() => {
        const SpeechRecognition =
            typeof window !== 'undefined' &&
            (window.SpeechRecognition || window.webkitSpeechRecognition);

        if (!SpeechRecognition) {
            setError('Speech Recognition is not supported in your browser.');
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;

        recognition.onresult = (event: any) => {
            const result = event.results[event.results.length - 1][0].transcript;
            setTranscript(result);
            analyzeSentiment(result);
        };

        recognition.onerror = (event: any) => {
            const errorType = event.error;
            let userFriendlyError = 'An error occurred with speech recognition.';

            switch (errorType) {
                case 'network':
                    userFriendlyError = 'Network error. Please check your connection.';
                    break;
                case 'no-speech':
                    userFriendlyError = 'No speech detected. Please try again.';
                    break;
                case 'audio-capture':
                    userFriendlyError = 'Microphone not accessible. Check permissions.';
                    break;
                case 'not-allowed':
                    userFriendlyError = 'Microphone access denied. Please enable it.';
                    break;
                default:
                    userFriendlyError = `Error: ${errorType}`;
            }

            setError(userFriendlyError);
            recognition.stop();
            setIsListening(false);
        };

        if (isListening) {
            try {
                recognition.start();
                setSpeechRecognition(recognition);
                setError('');
            } catch (err) {
                setError(`Failed to start speech recognition: ${err instanceof Error ? err.message : 'Unknown error'}`);
            }
        }

        return () => {
            if (speechRecognition) {
                speechRecognition.stop();
            }
        };
    }, [isListening, analyzeSentiment]);

    const toggleListening = () => {
        if (isListening && speechRecognition) {
            speechRecognition.stop();
            setIsListening(false);
            setSpeechRecognition(null);
        } else {
            setIsListening(true);
        }
    };

    const getSentimentColor = (sentiment: string) => {
        switch (sentiment) {
            case 'Positive':
                return 'text-green-500';
            case 'Neutral':
                return 'text-yellow-500';
            case 'Negative':
                return 'text-red-500';
            default:
                return 'text-black';
        }
    };

    return (
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="p-6">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold text-blue-600">Voice Analysis</h1>
                {/* Optional: Added a clear/reset button similar to the new design */}
                <button 
                    onClick={() => {
                        // Add a reset/clear functionality if needed
                        // For example, clearing transcript or resetting state
                    }} 
                    className="text-red-500 hover:bg-red-50 p-2 rounded-md transition"
                >
                    Reset
                </button>
            </div>
    
            <div className="mb-4 space-y-2">
            <button
                        className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition duration-200 mb-4"
                        onClick={toggleListening}
                    >
                        {isListening ? 'Stop Listening' : 'Start Listening'}
                    </button>
                <div className="p-4 border rounded-lg bg-gray-50 border-gray-200 shadow-md">
                   
    
                    {error && <p className="text-red-500 mb-2">{error}</p>}
                    <p className="text-sm text-gray-600 mb-1">
                        Transcript: {transcript || 'No text detected yet.'}
                    </p>
                    <div className="text-xs text-black mt-1">
                        <span className={`font-semibold ${getSentimentColor(sentiment)}`}>
                            Sentiment: {sentiment || 'Analysis not available yet.'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
    );
};

export default VoiceSentiment;



