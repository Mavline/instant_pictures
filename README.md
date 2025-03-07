# Instant pictures

A real-time AI image generator featuring a starry background and gradient text effects. Generate amazing visuals with just a few words.

## Features

- Real-time image generation as you type
- Beautiful starry background with twinkling animations
- Multiple style presets for different visual aesthetics
- Image history to review previous generations
- Dark theme for comfortable viewing

## Tech stack

- [Flux Schnell](https://replicate.com/black-forest-labs/flux-schnell) - fast image generation model
- [Replicate](https://replicate.com/) - API for image inference
- Next.js app router
- Tailwind CSS for styling
- React Query for state management

## Setup

1. Clone the repository
2. Create a `.env.local` file and add your Replicate API token:
   ```
   REPLICATE_API_TOKEN=your_token_here
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Run the development server:
   ```
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. Type your prompt in the text area
2. Watch as images generate in real-time
3. Choose different styles from the presets
4. Download generated images with the download button
5. View and select previous generations from history
