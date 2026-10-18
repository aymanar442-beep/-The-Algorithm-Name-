# Plan: Revert to PayPal-Only Project

## Goal
To restore the application to focus exclusively on the Shaheen PayPal functionality, removing all recently added dashboard and portfolio tracking components and features.

## Steps
1. **Clean Codebase (Components)**: Delete `src/components/PortfolioTracker.tsx`, `src/components/MarketNews.tsx`, and `src/components/SentimentCard.tsx`.
2. **Clean App Entry Point (`App.tsx`)**:
    - Remove imports for the deleted components.
    - Remove the dashboard and portfolio state and rendering logic from `App.tsx`.
    - Set the default `activeTab` back to 'paypal_shaheen'.
3. **Clean Server (`server.ts`)**: Remove API routes added for portfolio, news, sentiment, and Telegram alerts.
4. **Final Cleanup**: Run build/lint to ensure the project remains stable and clean after removal.

## Feedback
Please approve this plan to proceed with the removal of these features.
