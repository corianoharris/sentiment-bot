'use client'

import React from 'react'
import ToggleEvents from './components/ToggleTextVoice/ToggleTextOrVoice'

export default function Home() {
 
  return (
    <main className="min-w-screen min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-4 mt-0 text-center">Sentiment Bot</h1>
      <ToggleEvents />
    </main>
  )
}