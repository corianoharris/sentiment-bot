'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { Message } from '../../types';
import { SentimentAnalyzer } from '../../services/sentimentAnalyzer'
import StorageService from '../../services/storageService'
import { LanguageDetector } from '../../services/languageDetector'

import { Messages } from '../shared/Messages'

export default function SentimentAnalysisForm() {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const sentimentAnalyzer = new SentimentAnalyzer()
  const storageService = useMemo(() => new StorageService('sentimentTextBotMessages'), []);
  const languageDetector = new LanguageDetector()

  useEffect(() => {
    // Load messages from storage on client-side
    const loadedMessages = storageService ? storageService.getMessages() : [];
    setMessages(loadedMessages)
  }, [storageService])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!input.trim()) return

    try {
      // Detect language
      const language = await languageDetector.detect(input)

      // Analyze sentiment
      const sentimentResult = sentimentAnalyzer.analyze(input)

      const newMessage: Message = {
        id: `msg-${Date.now()}`,
        text: input,
        sentiment: sentimentResult.sentiment,
        score: sentimentResult.score,
        language: language,
        timestamp: Date.now()
      }

      const updatedMessages = [...messages, newMessage]
      setMessages(updatedMessages)
      storageService.saveMessages(updatedMessages)
      setInput('')
    } catch (error) {
      console.error('Analysis failed', error)
    }
  }

  const clearMessages = () => {
    setMessages([])
    storageService.clearMessages()
  }

  return (
      <div className="min-w-[400px] max-w-md max-h-[600px] bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="p-6 mt-3 mb-3">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-blue-600">Text Analysis</h1>
            <button 
              onClick={clearMessages} 
              className={`text-red-500 hover:bg-red-50 p-2 rounded-md transition ${messages.length === 0 ? 'cursor-not-allowed opacity-50' : ''}`}
              disabled={messages.length === 0}
            >
              Clear History
            </button>
          </div>

          {/* Message List */}
         <Messages messages={messages} />

          {/* Input Form */}
          <form 
            onSubmit={handleSubmit} 
            className="flex space-x-2"
            data-testid="sentiment-form"
          >
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter text to analyze"
              className="flex-grow p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 text-indigo-600"
              data-testid="sentiment-input"
            />
            <button 
              type="submit" 
              className={ `bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition ${!input.trim() ? 'cursor-not-allowed opacity-50' : ''}}`}
              disabled={!input.trim()}
              data-testid="sentiment-submit"
            >
              Analyze
            </button>
          </form>
        </div>
      </div>
  )
}