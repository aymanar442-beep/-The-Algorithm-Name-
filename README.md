# Shaheen Pay

A TypeScript and React application exploring a PayPal-style payment workflow. This repository is a prototype: its payment, risk, fraud, biometric, and reversal endpoints are simulations and do **not** connect to PayPal or move real money. Do not use it to make financial, medical, or security decisions.

## Requirements

- Node.js 20 or newer
- npm or Bun
- Firebase project configuration for the Firebase-backed features

## Setup

1. Install dependencies:

   ```sh
   npm install
   ```

   Or, with Bun:

   ```sh
   bun install
   ```

2. Copy `.env.example` to `.env` and set the variables you need. Never commit `.env` or service-account credentials.
3. Configure `firebase-applet-config.json` for your own Firebase project. The checked-in configuration is project-specific; don't use it for production.
4. Start the development server:

   ```sh
   npm run dev
   ```

   The app is served at `http://localhost:3000`.

## Scripts

- `npm run dev` — start the development server
- `npm run build` — build the frontend and server
- `npm run lint` — run TypeScript checks
- `npm start` — start the built server

## API

The Express server exposes prototype endpoints under `/api/paypal` and `/api/health`. These are demonstrations only; they do not call PayPal APIs. Validate all inputs and add authentication, authorization, rate limiting, and production-grade error handling before exposing any endpoint publicly.

## Configuration and security

- Keep credentials and private keys in environment variables or a secret manager; never commit them.
- Firebase client configuration is not a substitute for Firebase Security Rules. Review `firestore.rules` and configure access for your own project.
- The current payment and risk logic is illustrative, not independently audited or suitable for production.

## License

Licensed under the Apache License, Version 2.0. See [LICENSE](LICENSE).
