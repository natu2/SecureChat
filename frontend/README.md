# SecureChat Frontend

A modern, secure messaging application built with React, featuring end-to-end encryption capabilities and a beautiful UI.

## Features

- 🔐 **Secure Messaging**: End-to-end encrypted communication
- 🎨 **Modern UI**: Beautiful, responsive interface built with Tailwind CSS
- 🚀 **Real-time Updates**: Live message polling with efficient updates
- 📱 **Mobile Responsive**: Works perfectly on all device sizes
- ♿ **Accessible**: Built with accessibility best practices
- 🛡️ **Error Handling**: Comprehensive error boundaries and user feedback
- 🔄 **Offline Support**: Graceful handling of network issues
- 🎯 **Performance**: Optimized with React hooks and memoization

## Technology Stack

- **React 19+**: Latest React with hooks and concurrent features
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Accessible, unstyled UI components
- **Lucide React**: Beautiful, customizable icons
- **Custom Hooks**: Reusable logic for state management
- **Service Layer**: Clean API abstraction

## Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   ├── ErrorBoundary.jsx
│   ├── MessageList.jsx
│   └── SendMessage.jsx
├── config/             # Configuration files
│   └── api.js          # API configuration
├── hooks/              # Custom React hooks
│   └── useMessages.js  # Message management hook
├── services/           # API services
│   └── messageService.js
├── utils/              # Utility functions
│   └── constants.js    # Application constants
└── lib/                # Third-party integrations
    └── utils.js        # Utility functions
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Backend API server running on port 8000

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env
```

3. Update `.env` with your configuration:
```env
REACT_APP_API_BASE_URL=http://localhost:8000
REACT_APP_API_TIMEOUT=10000
REACT_APP_POLLING_INTERVAL=5000
REACT_APP_ENVIRONMENT=development
```

### Development

Start the development server:
```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Building for Production

```bash
npm run build
```

### Testing

```bash
npm test
```

### Linting

```bash
npm run lint
npm run lint:fix
```

### Bundle Analysis

```bash
npm run analyze
```

## Configuration

### Environment Variables

- `REACT_APP_API_BASE_URL`: Backend API URL
- `REACT_APP_API_TIMEOUT`: API request timeout (ms)
- `REACT_APP_POLLING_INTERVAL`: Message polling interval (ms)
- `REACT_APP_ENVIRONMENT`: Environment (development/production)

### API Endpoints

- `GET /get-messages`: Retrieve all messages
- `POST /send-message`: Send a new message

## Security Features

- **Input Validation**: All user inputs are validated and sanitized
- **XSS Protection**: Content is sanitized to prevent XSS attacks
- **CSRF Protection**: Proper request handling with tokens
- **Rate Limiting**: Client-side request throttling
- **Error Handling**: Secure error messages without sensitive data

## Performance Optimizations

- **Memoization**: Components and expensive operations are memoized
- **Lazy Loading**: Code splitting for better initial load times
- **Efficient Polling**: Smart polling with proper cleanup
- **Bundle Optimization**: Tree shaking and dead code elimination

## Accessibility

- **ARIA Labels**: Proper labeling for screen readers
- **Keyboard Navigation**: Full keyboard support
- **Focus Management**: Proper focus handling
- **Color Contrast**: WCAG AA compliant colors
- **Responsive Design**: Works on all devices

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -m 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue on GitHub or contact the development team.
