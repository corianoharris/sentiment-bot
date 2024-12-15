describe('Sentiment Analysis Application', () =>
{
    beforeEach(() =>
    {
        cy.visit('/')
    })

    it('renders the sentiment analysis form', () =>
    {
        cy.get( '[data-testid="sentiment-form"]').should('exist')
        cy.get('[data-testid="sentiment-input"]').should('be.visible')
        cy.get('[data-testid="sentiment-submit"]').should('be.visible')
    })

    it('analyzes positive sentiment', () =>
    {
        const positiveText = 'I love this amazing product!'

        cy.get('[data-testid="sentiment-input"]').type(positiveText)
        cy.get('[data-testid="sentiment-submit"]').click()

        cy.get('[data-testid="message-list"]').within(() =>
        {
            cy.contains(positiveText).should('exist')
            cy.contains('Sentiment: positive').should('exist')
        })
    })

    it('analyzes negative sentiment', () =>
    {
        const negativeText = 'This is terrible and frustrating!'

        cy.get('[data-testid="sentiment-input"]').type(negativeText)
        cy.get('[data-testid="sentiment-submit"]').click()

        cy.get('[data-testid="message-list"]').within(() =>
        {
            cy.contains(negativeText).should('exist')
            cy.contains('Sentiment: negative').should('exist')
        })
    })

    it('clears message history', () =>
    {
        // Add multiple messages
        const messages = [
            'I love this!',
            'This is bad',
            'Neutral statement'
        ]

        messages.forEach(message =>
        {
            cy.get('[data-testid="sentiment-input"]').type(message)
            cy.get('[data-testid="sentiment-submit"]').click()
        })

        // Verify messages were added
        cy.get('[data-testid="message-list"]').find('> div').should('have.length', messages.length)

        // Clear messages
        cy.contains('button', 'Clear History').click()

        // Verify messages are cleared
        cy.get('[data-testid="message-list"]').find('> div').should('have.length', 0)
    })

    it('prevents empty submission', () =>
    {
        cy.get('[data-testid="sentiment-submit"]').click()
        cy.get('[data-testid="message-list"]').find('> div').should('have.length', 0)
    })
})