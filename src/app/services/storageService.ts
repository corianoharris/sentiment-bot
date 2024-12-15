import { Message } from '../types'

export default class StorageService
{
    private STORAGE_KEY = 'sentimentBotMessages'

    saveMessages(messages: Message[]): void
    {
        if (typeof window !== 'undefined')
        {
            try
            {
                localStorage.setItem(this.STORAGE_KEY, JSON.stringify(messages))
            } catch (error)
            {
                console.error('Failed to save messages', error)
            }
        }
    }

    getMessages(): Message[]
    {
        if (typeof window !== 'undefined')
        {
            try
            {
                const savedMessages = localStorage.getItem(this.STORAGE_KEY)
                return savedMessages ? JSON.parse(savedMessages) : []
            } catch (error)
            {
                console.error('Failed to retrieve messages', error)
                return []
            }
        }
        return []
    }

    clearMessages(): void
    {
        if (typeof window !== 'undefined')
        {
            try
            {
                localStorage.removeItem(this.STORAGE_KEY)
            } catch (error)
            {
                console.error('Failed to clear messages', error)
            }
        }
    }
}