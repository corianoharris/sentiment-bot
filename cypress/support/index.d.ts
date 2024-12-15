declare namespace Cypress
{
    interface Chainable
    {
        /**
         * Custom command to select elements by data-testid.
         * @example cy.getByTestId('my-test-id')
         */
        getByTestId(testId: string): Chainable<JQuery<HTMLElement>>;
    }
}
