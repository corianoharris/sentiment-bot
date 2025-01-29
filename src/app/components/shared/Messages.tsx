

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
            className="mb-4 mt-4 h-64 overflow-y-auto space-y-4 border-b pb-2"
            data-testid="message-list"
        >
            {sortedMessages.map((msg) => (
                <div
                    key={msg.id}
                    className={` p-3 rounded-lg shadow-md ${msg.sentiment === 'positive'
                        ? 'bg-green-50 border-green-200'
                        : msg.sentiment === 'negative'
                            ? 'bg-red-50 border-red-200'
                            : 'bg-gray-50 border-gray-200'
                        } border`}
                >
                    {msg.score >= 2 && msg.text.trim() !== '' && (
                        <div className='p-3 rounded-lg shadow-md mt-2 mb-6 font-light  ml-36 fade-in'>
                            <p className='text-sm text-gray-600 mb-1 text-right '> ...🤖 🤝</p>
                            <p className=" text-sm font-light text-black mb-1">{"Love the positivity!"}</p>
                        </div>
                    )}

                    {msg.score >= 0 && msg.score < 2 && msg.text.trim() !== '' && (
                        <div className='opacity-0 p-3 rounded-lg shadow-md mt-2 mb-6 font-light ml-36 fade-in'>
                            <p className='text-sm text-gray-600 mb-1 text-right'> ...🤖</p>
                            <p className=" text-sm font-light text-black mb-1">{"If you’d like, you could add a bit more detail or emotion to make it more engaging and relatable"}</p>
                        </div>
                    )}

                    {msg.score < 0 && msg.text.trim() !== '' && (

                        <div className='p-3 rounded-lg shadow-md mt-2 mb-6 font-light ml-36 fade-in'>
                            <p className='text-sm text-gray-600 mb-1  text-right'>...🤖</p>
                            <p className="text-sm text-black">{" I hear you—that sounds frustrating. Maybe shifting the focus to what could help or improve the situation might make it feel a little lighter."}</p>
                        </div>

                    )}

                 
                    <p className="text-md text-gray-600 mb-2 font-semibold">{` 👤 ...`}</p>
                    <p className="text-md text-gray-600 mb-2 font-semibold">{ msg.text}</p>
                    <div className="text-xs text-black mt-2 italic border-t-2 border-dotted  border-gray-400 pt-2">
                        <span>Sentiment: {msg.sentiment}</span>
                        <span className="ml-1">Score: {msg.score}</span>
                        {msg.language && (
                            <span className="ml-1">Language: {msg.language}</span>
                        )}
                        <p >Timestamp: {new Date(msg.timestamp).toLocaleString()}</p>
                    </div>
                </div>
            ))}
        </div>
    )
}

