'use client'

import React from 'react'
import ToggleEvents from './components/ToggleTextVoice/ToggleTextOrVoice'

export default function Home() {
 
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-4 text-center">Sentiment Bot</h1>
      <ToggleEvents />
    </main>
  )
}