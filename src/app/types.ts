export interface Message {
    id: string
    text: string
    sentiment: 'positive' | 'negative' | 'neutral'
    score: number
    language?: string
    timestamp: number
  }