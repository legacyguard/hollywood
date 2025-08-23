# LegacyGuard - Family Preparedness Platform

## Language Requirement

**IMPORTANT**: All code changes and the entire codebase must be in English language (except i18n key values).

## 🔒 Security & Environment Variables

**CRITICAL**: This project contains sensitive configuration that must NEVER be committed to Git.

### **Environment Setup:**
1. Copy the template: `cp env.template .env.local`
2. Edit `.env.local` with your actual values
3. Never commit `.env.local` to Git

### **Security Features:**
- ✅ `.gitignore` blocks all environment files
- ✅ Pre-commit hook prevents accidental commits
- ✅ Comprehensive security documentation
- ✅ Environment template system

**For detailed security information, see [SECURITY.md](./SECURITY.md)**

## Project info

**LegacyGuard** is a comprehensive family preparedness platform that helps users organize their digital life, protect their loved ones, and create a lasting legacy.

## Development Setup

**Use your preferred IDE**

Clone this repository and start developing locally using your favorite IDE.

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

## Deployment

### Build for Production

```sh
npm run build
```

### Preview Production Build

```sh
npm run preview
```

### Deploy to Your Platform

This project can be deployed to any static hosting platform that supports SPA (Single Page Applications):
- Vercel
- Netlify
- AWS S3 + CloudFront
- Google Cloud Platform
- Azure Static Web Apps

## Custom Domain

To connect a custom domain, configure it with your hosting provider's DNS settings.
