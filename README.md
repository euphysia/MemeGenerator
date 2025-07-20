# 🎭 Meme Generator

A modern, high-performance meme generator built with Next.js, React, and Supabase. Create, customize, and share memes with ease!

## ✨ Features

- **🎨 Easy Meme Creation**: Upload images or use URLs to create memes
- **📝 Text Overlay**: Add custom text with positioning and styling
- **🖼️ Image Optimization**: Automatic compression and format optimization
- **📱 PWA Support**: Install as a mobile app with offline functionality
- **⚡ Performance Optimized**: Fast loading with lazy loading and caching
- **🎯 SEO Optimized**: Full meta tags, structured data, and social sharing
- **🔒 Secure**: Error boundaries, validation, and security headers
- **📊 Analytics Ready**: Performance monitoring and Core Web Vitals tracking

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/meme-generator.git
   cd meme-generator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.template .env.local
   ```
   
   Edit `.env.local` and add your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
meme-generator/
├── src/
│   ├── app/                 # Next.js App Router pages
│   ├── components/          # React components
│   │   ├── ui/             # Reusable UI components
│   │   └── meme/           # Meme-specific components
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utilities and configurations
│   └── types/              # TypeScript type definitions
├── public/                 # Static assets
├── scripts/                # Build and deployment scripts
├── netlify.toml           # Netlify configuration
└── package.json           # Dependencies and scripts
```

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking
- `npm run format` - Format code with Prettier
- `npm run test:build` - Test build and performance
- `npm run validate-env` - Validate environment variables

### Code Quality

The project uses:
- **ESLint** for code linting
- **Prettier** for code formatting
- **TypeScript** for type safety
- **Tailwind CSS** for styling

### Performance Monitoring

Built-in performance monitoring tracks:
- Core Web Vitals (FCP, LCP, FID, CLS)
- Bundle size analysis
- Build performance
- Image optimization metrics

## 🚀 Deployment

### Netlify Deployment

1. **Prepare for deployment**
   ```bash
   npm run validate-env
   npm run test:build
   ```

2. **Deploy to Netlify**
   ```bash
   npm run deploy:production
   ```

### Manual Deployment

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   - Connect your GitHub repository to Netlify
   - Set build command: `npm run build`
   - Set publish directory: `.next`
   - Configure environment variables in Netlify dashboard

### Environment Variables

Set these in your Netlify dashboard:

#### Required
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key

#### Optional
- `NEXT_PUBLIC_GA_ID` - Google Analytics ID
- `NEXT_PUBLIC_VERCEL_ANALYTICS_ID` - Vercel Analytics ID

### Supabase Setup

1. **Create a Supabase project**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Note your project URL and anon key

2. **Set up database tables**
   ```sql
   -- Create memes table
   CREATE TABLE memes (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     image_url TEXT NOT NULL,
     top_text TEXT,
     bottom_text TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Enable Row Level Security
   ALTER TABLE memes ENABLE ROW LEVEL SECURITY;

   -- Create policy for public read access
   CREATE POLICY "Allow public read access" ON memes
     FOR SELECT USING (true);

   -- Create policy for public insert access
   CREATE POLICY "Allow public insert access" ON memes
     FOR INSERT WITH CHECK (true);
   ```

3. **Configure storage**
   - Create a `memes` bucket in Supabase Storage
   - Set bucket to public
   - Configure CORS if needed

## 📱 PWA Features

The app includes Progressive Web App features:
- **Offline functionality** with Service Worker
- **App installation** prompts
- **Background sync** for offline actions
- **Push notifications** support
- **App manifest** with proper icons

## 🔧 Configuration

### Next.js Configuration

The app uses Next.js 15 with:
- App Router for routing
- Turbopack for development
- Image optimization
- TypeScript support
- Tailwind CSS integration

### Netlify Configuration

See `netlify.toml` for:
- Build settings
- Redirect rules
- Security headers
- Caching strategies
- Environment-specific configurations

### Performance Optimization

- **Image compression** before upload
- **Lazy loading** for non-critical components
- **Code splitting** for better loading
- **Service Worker** for caching
- **Bundle analysis** and optimization

## 🧪 Testing

### Performance Testing

```bash
npm run test:performance
```

This runs:
- Build performance tests
- Bundle size analysis
- Image validation
- Service Worker checks

### Environment Validation

```bash
npm run validate-env
```

Validates:
- Required environment variables
- Node.js version
- Package.json configuration
- Netlify configuration

## 📊 Analytics

### Performance Monitoring

The app includes built-in performance monitoring:
- Core Web Vitals tracking
- Bundle size analysis
- Build performance metrics
- User interaction timing

### Optional Analytics

To add Google Analytics:
1. Get your GA4 measurement ID
2. Add `NEXT_PUBLIC_GA_ID` to environment variables
3. Analytics will be automatically included

## 🔒 Security

### Security Features

- **Content Security Policy** headers
- **XSS Protection** headers
- **Frame options** to prevent clickjacking
- **Input validation** and sanitization
- **Error boundaries** for graceful error handling
- **Rate limiting** on API routes

### Environment Security

- Environment variables validation
- Secure API key handling
- CORS configuration
- HTTPS enforcement

## 🐛 Troubleshooting

### Common Issues

1. **Build fails with Supabase error**
   - Check environment variables are set correctly
   - Verify Supabase project is active
   - Run `npm run validate-env`

2. **Images not uploading**
   - Check Supabase storage bucket configuration
   - Verify storage policies allow public access
   - Check file size limits

3. **Performance issues**
   - Run `npm run test:performance`
   - Check bundle size with `npm run analyze-bundle`
   - Optimize images before upload

4. **PWA not working**
   - Check Service Worker is registered
   - Verify manifest.json is accessible
   - Test on HTTPS (required for PWA)

### Debug Mode

Enable debug logging:
```bash
DEBUG=* npm run dev
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and validation
5. Submit a pull request

### Development Guidelines

- Follow TypeScript best practices
- Use ESLint and Prettier
- Write meaningful commit messages
- Test your changes thoroughly
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the React framework
- [Supabase](https://supabase.com/) for the backend
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Netlify](https://netlify.com/) for hosting

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Check the troubleshooting section
- Review the documentation

---

**Made with ❤️ for the meme community**
