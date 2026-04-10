# Shelter Zimbabwe Website

A modern, state-of-the-art website built with Next.js, TypeScript, and Tailwind CSS.

## Features

- 🚀 **Next.js 14** with App Router
- 💎 **TypeScript** for type safety
- 🎨 **Tailwind CSS** for styling
- ✨ **Framer Motion** for smooth animations
- 📱 **Fully Responsive** design
- 🎯 **Modern UI/UX** with best practices
- ⚡ **Optimized Performance**

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Admin Access Setup

Set these environment variables before running the app:

- `ADMIN_PASSWORD` - password used on `/admin/login`
- `ADMIN_SECRET` - random secret used for admin session cookie

Example:

```bash
ADMIN_PASSWORD=your-strong-password
ADMIN_SECRET=use-a-long-random-secret
```

## Project Structure

```
├── app/
│   ├── globals.css      # Global styles
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Homepage
├── components/
│   ├── Navbar.tsx       # Navigation bar
│   ├── Hero.tsx         # Hero section
│   ├── Features.tsx     # Features section
│   ├── About.tsx        # About section
│   ├── Testimonials.tsx # Testimonials section
│   ├── CTA.tsx          # Call-to-action section
│   └── Footer.tsx       # Footer component
└── public/              # Static assets
```

## Customization

### Update Company Information

1. **Company Name**: Update "Shelter Zimbabwe" throughout the components
2. **Contact Info**: Edit `components/Footer.tsx` for contact details
3. **Content**: Modify text in each component file
4. **Colors**: Update gradient colors in Tailwind classes (blue-600, purple-600)

### Styling

The website uses Tailwind CSS. You can customize:
- Colors in `tailwind.config.ts`
- Global styles in `app/globals.css`
- Component-specific styles in each component file

## Build for Production

```bash
npm run build
npm start
```

## Technologies Used

- **Next.js** - React framework
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Lucide React** - Icon library

## License

MIT
