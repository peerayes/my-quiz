# My Quiz - Retail & Logic Challenges

A Next.js application featuring two distinct interactive modules: a Retail Business Management system with price encryption logic, and a Deck of Cards logic puzzle.

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/)
- **Frontend**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)

## Features

### 1. Retail Business Logic (Encryption Module)

Located at `/retail`, this module simulates a retail management system with a focus on cost privacy and bargaining.

- **Admin Panel**:
  - Add products with Buying Price (Cost), Profit Margin, and Name.
  - Automatically calculates Selling Price.
  - **Price Encryption**: Generates a secret 5-letter code strings (e.g., "ABCDE") that encodes the Buying Price. This allows staff to verify costs without revealing them to customers.
    - _Mechanism_: Uses a custom algorithm with rotating character maps and duplicate handling.
  - **Bargain Validator**: Input a customer's offer to instantly check if it meets the minimum acceptable cost.
  - **Decoder**: Admin tool to decode any price code back to its original numeric value.

### 2. Deck of Cards (Logic Puzzle)

Located at `/card`, this module visualizes a specific sorting algorithm.

- **Reverse Sort Logic**: Demonstrates a "reverse-result" sorting technique.
- **Visuals**: Simple visual representation of the logic flow.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `src/app`: App router pages (`/`, `/retail`, `/card`).
- `src/components`: Reusable UI components (e.g., `AdminPanel`, `CodeSnippet`).
- `src/constant`: Static data and constants.
