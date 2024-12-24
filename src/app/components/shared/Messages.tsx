

import React from 'react'
import { Message } from '../../types'

interface MessagesProps
{
    messages: Message[]
}

export function Messages({ messages }: MessagesProps)
{
    const sortedMessages = messages.sort((a, b) => b.timestamp - a.timestamp);
    
    return (
        <div
            className="mb-4 h-64 overflow-y-auto space-y-2 border-b pb-2"
            data-testid="message-list"
        >
            {sortedMessages.map((msg) => (
                <div
                    key={msg.id}
                    className={`p-3 rounded-lg shadow-md ${msg.sentiment === 'positive'
                        ? 'bg-green-50 border-green-200'
                        : msg.sentiment === 'negative'
                            ? 'bg-red-50 border-red-200'
                            : 'bg-gray-50 border-gray-200'
                        } border`}
                >
                    <p className="text-sm text-gray-600 mb-1 font-semibold">{msg.text}</p>
                    <div className="text-xs text-black mt-1">
                        <span>Sentiment: {msg.sentiment}</span>
                        <span className="ml-2">Score: {msg.score}</span>
                        {msg.language && (
                            <span className="ml-2">Language: {msg.language}</span>
                        )}
                        <p className="mt-1">Timestamp: {new Date(msg.timestamp).toLocaleString()}</p>
                    </div>
                </div>
            ))}
        </div>
    )
}

