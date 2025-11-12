# HeyGen AI Assistant Setup Guide

## Overview
The HeyGen AI Assistant widget provides an interactive video avatar experience for users to chat with Wayne, the AI Library Assistant.

## Configuration Steps

### 1. Environment Setup
1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Get your HeyGen credentials:
   - Visit [HeyGen Dashboard](https://app.heygen.com/)
   - Create an account or log in
   - Navigate to API settings
   - Copy your API Key and Avatar ID

### 2. Configure Environment Variables
Edit your `.env` file and replace the placeholder values:

```env
# HeyGen AI Assistant Configuration
VITE_HEYGEN_API_KEY=your_actual_api_key_here
VITE_HEYGEN_AVATAR_ID=your_actual_avatar_id_here

# Other configurations
BASE_NAME=/
NODE_ENV=development
```

### 3. Widget Features
- **Floating Button**: Always visible in bottom-right corner
- **Configuration Check**: Shows setup instructions when not configured
- **Video Chat**: Interactive avatar conversation when properly configured
- **Responsive Design**: Works on all screen sizes

### 4. Files Updated
- `/src/components/ui/heygen-ai-assistant.tsx` - Main widget component
- `/src/components/Router.tsx` - Widget integration
- `/src/env.d.ts` - TypeScript environment definitions
- `/.env.example` - Environment variable template

### 5. Usage
Once configured, the widget will:
1. Display a blue floating button with video icon
2. Open an interactive chat window when clicked
3. Connect to HeyGen's streaming avatar service
4. Provide AI-powered assistance for library resources

### 6. Troubleshooting
- **Button not visible**: Check if component is included in Router.tsx
- **Configuration error**: Verify .env file exists and has correct values
- **Connection issues**: Check API key and avatar ID validity
- **Console errors**: Enable developer tools to see detailed error messages

## Security Notes
- Never commit your `.env` file to version control
- Keep your API keys secure and private
- Use environment-specific configurations for different deployments