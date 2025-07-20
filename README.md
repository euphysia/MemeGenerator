# 🎭 Meme Generator App

A modern, feature-rich meme generator built with Next.js, TypeScript, and Tailwind CSS. Create, customize, and share memes instantly with a beautiful UI and real-time chat support.

## ✨ Features

- 🎨 **Modern UI/UX**: Beautiful gradient design with dark/light mode toggle
- 🖼️ **Meme Generation**: Upload images or use random images from Picsum
- 📝 **Text Overlay**: Add top and bottom text with custom styling
- 🎯 **Real-time Preview**: See your meme as you create it
- 💬 **Chat Widget**: Integrated chat support with n8n webhook
- 🌙 **Theme Toggle**: Switch between light and dark modes
- 📱 **Responsive Design**: Works perfectly on all devices
- ⚡ **Fast Performance**: Optimized with Next.js and Tailwind CSS
- 🔧 **TypeScript**: Full type safety and better development experience

## 🚀 Live Demo

[View Live Demo](https://your-netlify-url.netlify.app)

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: Custom component library
- **Backend**: Supabase (optional)
- **Chat**: n8n webhook integration
- **Deployment**: Netlify

## 📦 Installation

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
   Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_CHAT_WEBHOOK_URL=https://your-n8n-webhook-url
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:4000](http://localhost:4000)

## 🎯 Usage

### Creating Memes
1. **Upload Image**: Click "Upload Image" or use "Random Image"
2. **Add Text**: Enter top and bottom captions
3. **Preview**: See your meme in real-time
4. **Generate**: Click "Generate Meme" to create
5. **Download**: Save your meme instantly

### Chat Support
- Click the chat widget in the bottom-right corner
- Ask questions about meme creation
- Get instant support via n8n automation

### Theme Toggle
- Click the theme toggle button in the header
- Switch between light and dark modes
- Theme preference is saved automatically

## 🚀 Deployment

### Netlify Deployment

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Netlify**
   - Go to [Netlify](https://netlify.com)
   - Click "New site from Git"
   - Connect your GitHub repository
   - Select the main branch

3. **Build Settings**
   - **Build command**: `npm run build`
   - **Publish directory**: `out`
   - **Node version**: 18

4. **Environment Variables** (Optional)
   Add these in Netlify dashboard:
   ```
   NEXT_PUBLIC_CHAT_WEBHOOK_URL=https://your-n8n-webhook-url
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

5. **Deploy**
   - Click "Deploy site"
   - Your app will be live in minutes!

### Manual Deployment

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Upload to Netlify**
   - Drag and drop the `out` folder to Netlify
   - Or use Netlify CLI:
   ```bash
   npm install -g netlify-cli
   netlify deploy --dir=out --prod
   ```

## 🔧 Configuration

### Chat Widget Setup
1. Create an n8n workflow
2. Add a webhook trigger
3. Configure your response logic
4. Copy the webhook URL to your environment variables

### Supabase Setup (Optional)
1. Create a Supabase project
2. Set up your database tables
3. Add environment variables
4. Configure authentication if needed

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Home page
│   ├── create/            # Meme creation page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── meme/             # Meme-related components
│   └── ui/               # UI components
├── lib/                  # Utility functions
├── hooks/                # Custom React hooks
└── types/                # TypeScript type definitions
```

## 🎨 Customization

### Styling
- Modify `src/app/globals.css` for global styles
- Update Tailwind config in `tailwind.config.ts`
- Customize components in `src/components/ui/`

### Chat Widget
- Edit `src/components/ui/ChatWidget.tsx`
- Update webhook URL and styling
- Customize welcome messages

### Theme Colors
- Update CSS variables in `globals.css`
- Modify gradient colors in components
- Adjust dark/light mode colors

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing framework
- [Tailwind CSS](https://tailwindcss.com/) for the styling system
- [Picsum Photos](https://picsum.photos/) for random images
- [n8n](https://n8n.io/) for workflow automation

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/meme-generator/issues)
- **Email**: your-email@example.com
- **Chat**: Use the chat widget on the live site

---

Made with ❤️ by [Your Name]
