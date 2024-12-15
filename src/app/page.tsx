'use client'

import React from 'react'
import SentimentAnalysisForm from './components/SentimentAnalysisForm'


export default function Home() {
 
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <SentimentAnalysisForm />
    </main>
  )
}