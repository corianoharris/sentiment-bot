import sentiment from 'sentiment'
import { Message } from '../types'

export class SentimentAnalyzer
{
    private sentimentAnalyzer: sentiment

    constructor()
    {
        this.sentimentAnalyzer = new sentiment()
    }

    analyze(text: string): { sentiment: Message['sentiment'], score: number }
    {
        const result = this.sentimentAnalyzer.analyze(text)

        const sentimentThresholds = {
            positive: 2,
            negative: -2
        }

        let sentimentType: Message['sentiment']

        if (result.score > sentimentThresholds.positive)
        {
            sentimentType = 'positive'
        } else if (result.score < sentimentThresholds.negative)
        {
            sentimentType = 'negative'
        } else
        {
            sentimentType = 'neutral'
        }

        return {
            sentiment: sentimentType,
            score: result.score
        }
    }
}