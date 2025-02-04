/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { SentimentAnalyzer } from '../../services/sentimentAnalyzer';
import StorageService from '../../services/storageService';
import { LanguageDetector } from '../../services/languageDetector';

import { Messages } from '../shared/Messages';

import { Message } from '@/app/types';

interface VoiceSentimentProps
{

    isRecording?: boolean;
    onRecordingChange?: (isRecording: boolean) => void;
}


const VoiceSentiment = ({
    onRecordingChange
}: VoiceSentimentProps) =>
{
    const [transcript, setTranscript] = useState<string>('');
    const [isListening, setIsListening] = useState<boolean>(false);
    const [sentiment, setSentiment] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [speechRecognition, setSpeechRecognition] = useState<any>(null);
    const [messages, setMessages] = useState<Message[]>([]);



    // Memoize services
    const sentimentAnalyzer = useMemo(() => new SentimentAnalyzer(), []);
    const storageService = useMemo(() => new StorageService('sentimentVoiceBotMessages'), []);
    const languageDetector = useMemo(() => new LanguageDetector(), []);

    // Memoize sentiment analysis function
    const analyzeSentiment = useCallback(
        async (text: string) =>
        {
            try
            {
            

                  const detectedLanguage = await languageDetector.detect(text);

                // Analyze sentiment
                const result = sentimentAnalyzer.analyze(text);

                // Store messages
                const newMessage: Message = {
                    id: `msg-${Date.now()}`,
                    text: text,
                    sentiment: result.sentiment,
                    score: result.score,
                    language: detectedLanguage ?? 'en',
                    timestamp: Date.now()
                }

                const updatedMessages = [...messages, newMessage];
                setMessages(updatedMessages);
                storageService.saveMessages(updatedMessages);


                // Set sentiment based on score
                if (result.score > 0)
                {
                    setSentiment('Positive');
                } else if (result.score < 0)
                {
                    setSentiment('Negative');
                } else
                {
                    setSentiment('Neutral');
                }
            } catch (err)
            {
                setError(
                    `Sentiment analysis error: ${err instanceof Error ? err.message : 'Unknown error'}`
                );
            }
        },
        [sentimentAnalyzer, languageDetector, storageService, messages]
    );

    useEffect(() =>
    {
        // Load messages from storage on client-side
        const loadedMessages = storageService ? storageService.getMessages() : [];
        setMessages(loadedMessages)
    }, [storageService])

    // Speech recognition setup
    useEffect(() =>
    {
        const SpeechRecognition =
            typeof window !== 'undefined' &&
            (window.SpeechRecognition || window.webkitSpeechRecognition);

        if (!SpeechRecognition)
        {
            setError('Speech Recognition is not supported in your browser.');
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;

        recognition.onresult = (event: any) =>
        {
            const result = event.results[event.results.length - 1][0].transcript;
            setTranscript(result);
            setMessages([...messages, {
                text: result, id: Date.now().toString(),
                sentiment: 'neutral',
                score: 0,
                timestamp: Date.now()
            }]);
            analyzeSentiment(result);
            setIsListening(true);

        };

        recognition.onerror = (event: any) =>
        {
            const errorType = event.error;
            let userFriendlyError = 'An error occurred with speech recognition.';

            switch (errorType)
            {
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

        if (isListening)
        {
            try
            {
                recognition.start();
                setSpeechRecognition(recognition);
                setError('');

            } catch (err)
            {
                setError(`Failed to start speech recognition: ${err instanceof Error ? err.message : 'Unknown error'}`);
                setIsListening(false);
            }
        }

        return () =>
        {
            if (speechRecognition)
            {
                speechRecognition.stop();
            }
        };
    }, [ isListening]);

    const toggleListening = () =>
    {
        if (isListening && speechRecognition)
        {
            // Stop speech recognition if it's listening
            speechRecognition.stop();
            setIsListening(false);
            setSpeechRecognition(null); // Optional, depending on your logic
            onRecordingChange?.(false); // Indicating recording has stopped
        } else
        {
            // Start speech recognition if it's not listening
            setIsListening(true);
            onRecordingChange?.(true);
            setTranscript(''); // Indicating recording has started
        }
    };


    const getSentimentColor = (sentiment: string) =>
    {
        switch (sentiment)
        {
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

    const clearMessages = () =>
    {
        setMessages([]);
        storageService.clearMessages();
        setTranscript('');
        setSentiment('');
        setError('');
    };

    return (
        <>
            <div className="min-w-[400px] max-w-md max-h-max bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-2xl font-bold text-blue-600">Voice Analysis</h1>
                        <button
                            onClick={clearMessages}
                            className={`text-red-500 hover:bg-red-50 p-2 rounded-md transition ${messages.length === 0 ? 'cursor-not-allowed opacity-50' : ''}`}
                            disabled={messages.length === 0}
                        >
                            Clear History
                        </button>
                    </div>

                    <div className="mb-4 space-y-2">
                        <button
                            className={`w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition duration-200 mb-4 ${error === 'Speech Recognition is not supported in your browser.' ? 'cursor-not-allowed opacity-50' : ''}`}
                            onClick={toggleListening}
                            disabled={error === 'Speech Recognition is not supported in your browser.'}
                        >
                            {isListening ? 'Stop Listening' : 'Start Listening'}
                        </button>
                        <div className="p-4 border rounded-lg bg-gray-50 border-gray-200 shadow-md">

                            {/* Message List */}
                           <Messages messages={messages} />

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
        </>
    );
};

export default VoiceSentiment;



