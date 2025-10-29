# WhatsApp Messenger Frontend

A clean, production-quality React frontend for testing and demonstrating Twilio WhatsApp messaging capabilities.

## Features

- **Send Message**: Send WhatsApp messages through Twilio Sandbox with full validation and error handling
- **Webhook Tester**: Simulate incoming WhatsApp webhooks for local development
- **API Health Monitor**: Real-time backend connection status
- **Dark Mode**: Built-in light/dark theme support
- **Mobile Responsive**: Works seamlessly on all devices
- **Type-Safe**: Full TypeScript implementation with Zod validation

## Architecture

- **Frontend**: React 18 + Vite + TypeScript
- **UI**: Tailwind CSS + shadcn/ui components
- **Validation**: Zod schemas with react-hook-form
- **API Client**: Centralized fetch wrapper with timeout and error handling
- **Routing**: React Router v6

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Backend API running (default: http://localhost:3000)

### Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Update VITE_API_BASE_URL if your backend runs on a different URL

# Start development server
npm run dev
```

The app will be available at http://localhost:8080

### Environment Configuration

Create a `.env` file with:

```env
VITE_API_BASE_URL=http://localhost:3000
```

## Backend Integration

This frontend connects to a Twilio WhatsApp backend with these endpoints:

- `POST /send-message` - Send WhatsApp messages
- `POST /webhook` - Receive incoming messages (Twilio webhook)
- `GET /swagger` - OpenAPI documentation

## Project Structure

```
src/
├── components/        # Reusable UI components
│   ├── ui/           # shadcn/ui components
│   ├── Layout.tsx    # Main layout with navigation
│   ├── ApiHealthBadge.tsx
│   └── CodeBlock.tsx
├── pages/            # Route pages
│   ├── SendMessage.tsx
│   ├── WebhookTester.tsx
│   └── Status.tsx
├── lib/              # Utilities
│   ├── api.ts        # API client
│   ├── validation.ts # Zod schemas
│   └── utils.ts      # Helpers
└── App.tsx           # Root component
```

## Development Tips

- Use the **Prefill Sample** button to quickly test forms
- Check the **Status** page to verify backend connectivity
- View **cURL examples** in each page for API testing
- Monitor browser console for detailed error messages

## Building for Production

```bash
npm run build
```

## Project info

**URL**: https://lovable.dev/projects/17bf8246-5e56-4afe-a05b-83e9480e26fb

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/17bf8246-5e56-4afe-a05b-83e9480e26fb) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/17bf8246-5e56-4afe-a05b-83e9480e26fb) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
