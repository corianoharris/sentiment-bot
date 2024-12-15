import { expect, describe, beforeEach, it } from '@jest/globals'
import { SentimentAnalyzer } from '../../services/sentimentAnalyzer'

describe('SentimentAnalyzer', () =>
{
    let sentimentAnalyzer: SentimentAnalyzer

    beforeEach(() =>
    {
        sentimentAnalyzer = new SentimentAnalyzer()
    })

    it('should correctly analyze positive sentiment', () =>
    {
        const positiveTexts = [
            'I love this product!',
            'This is amazing and wonderful',
            'Great job, very happy'
        ]

        positiveTexts.forEach(text =>
        {
            const result = sentimentAnalyzer.analyze(text)
            expect(result.sentiment).toEqual('positive')
            expect(result.score).toBeGreaterThan(0)
        })
    })

    it('should correctly analyze negative sentiment', () =>
    {
        const negativeTexts = [
            'I hate this',
            'This is terrible and awful',
            'I had a terrible experience with this product'
        ]

        negativeTexts.forEach(text =>
        {
            const result = sentimentAnalyzer.analyze(text)
            expect(result.sentiment).toEqual('negative')
            expect(result.score).toBeLessThan(0)
        })
    })

    it('should correctly analyze neutral sentiment', () =>
    {
        const neutralTexts = [
            'The weather is okay',
            'This is just a statement',
            'I am neutral about this'
        ]

        neutralTexts.forEach(text =>
        {
            const result = sentimentAnalyzer.analyze(text)
            expect(result.sentiment).toEqual('neutral')
            expect(result.score).toBeCloseTo(0)
        })
    })

    it('should handle empty input', () =>
    {
        const result = sentimentAnalyzer.analyze('')
        expect(result.sentiment).toEqual('neutral')
        expect(result.score).toBe(0)
    })

    it('should handle whitespace-only input', () =>
    {
        const result = sentimentAnalyzer.analyze('   ')
        expect(result.sentiment).toEqual('neutral')
        expect(result.score).toBe(0)
    })
})