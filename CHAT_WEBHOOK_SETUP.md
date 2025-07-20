# Chat Widget Webhook Setup

## Overview
The chat widget is now integrated into your meme generator app! It appears as a floating chat button in the bottom-right corner of every page.

## How to Configure Your Webhook

### Option 1: Environment Variable (Recommended)
1. Create or edit your `.env.local` file in the root directory
2. Add your webhook URL:
   ```
   NEXT_PUBLIC_CHAT_WEBHOOK_URL=https://your-webhook-url.com/endpoint
   ```
3. Restart your development server

### Option 2: Direct Component Props
You can also pass the webhook URL directly to the ChatWidget component:

```tsx
<ChatWidget webhookUrl="https://your-webhook-url.com/endpoint" />
```

## Webhook Payload Format
When a user sends a message, your webhook will receive a POST request with this JSON payload:

```json
{
  "message": "User's message text",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "userAgent": "Mozilla/5.0...",
  "url": "https://yoursite.com/current-page"
}
```

## Expected Response Format
Your webhook should respond with JSON containing a `response` field:

```json
{
  "response": "Your bot's reply message"
}
```

## Features
- ✅ **Modern UI**: Beautiful gradient design with dark/light mode support
- ✅ **Real-time messaging**: Instant message display with typing indicators
- ✅ **Responsive**: Works on all screen sizes
- ✅ **Accessible**: Keyboard navigation and screen reader support
- ✅ **Customizable**: Easy to modify title, subtitle, and placeholder text
- ✅ **Error handling**: Graceful fallback when webhook is unavailable
- ✅ **Auto-scroll**: Messages automatically scroll to bottom
- ✅ **Loading states**: Visual feedback during message sending

## Customization
You can customize the chat widget by passing props:

```tsx
<ChatWidget 
  title="Custom Title"
  subtitle="Custom subtitle"
  placeholder="Custom placeholder..."
  webhookUrl="your-webhook-url"
/>
```

## Fallback Behavior
If no webhook URL is configured, the widget will show a friendly fallback message: "Thank you for your message! We'll get back to you soon."

## Supported Webhook Services
- Discord webhooks
- Slack webhooks
- Custom API endpoints
- Zapier webhooks
- Make.com (Integromat) webhooks
- Any HTTP POST endpoint

## Security Notes
- The webhook URL is exposed to the client (browser)
- Consider using a proxy endpoint if you need to keep your webhook URL private
- Implement rate limiting on your webhook endpoint
- Validate incoming requests on your webhook server 