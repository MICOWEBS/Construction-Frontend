# Construction App Frontend

This is the frontend application for the Construction App, built with Next.js and Tailwind CSS.

## Features

- Role-based authentication (Buyer, Vendor, Rider)
- Modern UI with Tailwind CSS
- Responsive design
- Form validation
- Error handling
- Loading states

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env.local` file with the following variables:
   ```
   NEXT_PUBLIC_API_URL=https://construction-app-backend.onrender.com/api
   ```

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

## Deployment

The application is configured for deployment on Vercel.

### Vercel Deployment Steps

1. Push your code to a GitHub repository
2. Go to [Vercel](https://vercel.com)
3. Import your repository
4. Configure the following environment variables:
   - `NEXT_PUBLIC_API_URL`: Your backend API URL
5. Deploy

## Environment Variables

- `NEXT_PUBLIC_API_URL`: The URL of your backend API

## Project Structure

```
src/
  ├── components/     # Reusable components
  ├── contexts/       # React contexts
  ├── pages/          # Next.js pages
  ├── styles/         # Global styles
  └── utils/          # Utility functions
``` 