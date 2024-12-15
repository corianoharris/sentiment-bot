describe('Sentiment Analysis Form', () =>
{
    beforeEach(() =>
    {
        // Assuming the app is running on localhost:3000
        cy.visit('/')
    })

    it('should render the sentiment analysis form', () =>
    {
        cy.get('[data-testid="sentiment-form"]').should('exist')
        cy.get('[data-testid="sentiment-input"]').should('exist')
        cy.get('[data-testid="sentiment-submit"]').should('exist')
    })

    it('should analyze a positive sentiment text', () =>
    {
        const positiveText = 'I love this amazing product!'

        cy.get('[data-testid="sentiment-input"]').type(positiveText)
        cy.get('[data-testid="sentiment-submit"]').click()

        cy.get('[data-testid="message-list"]').within(() =>
        {
            cy.contains(positiveText).should('exist')
            cy.contains('Sentiment: positive').should('exist')
            cy.contains('Score:').should('exist')
        })
    })

    it('should analyze a negative sentiment text', () =>
    {
        const negativeText = 'This is terrible and frustrating!'

        cy.get('[data-testid="sentiment-input"]').type(negativeText)
        cy.get('[data-testid="sentiment-submit"]').click()

        cy.get('[data-testid="message-list"]').within(() =>
        {
            cy.contains(negativeText).should('exist')
            cy.contains('Sentiment: negative').should('exist')
            cy.contains('Score:').should('exist')
        })
    })

    it('should clear message history', () =>
    {
        // First, add some messages
        const texts = ['I love this!', 'This is bad', 'Neutral statement']
        texts.forEach(text =>
        {
            cy.get('[data-testid="sentiment-input"]').type(text)
            cy.get('[data-testid="sentiment-submit"]').click()
        })

        // Check messages were added
        cy.get('[data-testid="message-list"] > div').should('have.length', texts.length)

        // Clear messages
        cy.contains('button', 'Clear History').click()

        // Verify messages are cleared
        cy.get('[data-testid="message-list"] > div').should('have.length', 0)
    })

    it('should prevent empty submission', () =>
    {
        // Try to submit an empty input
        cy.get('[data-testid="sentiment-submit"]').click()

        // Verify no new message was added
        cy.get('[data-testid="message-list"] > div').should('have.length', 0)
    })
})