# Donation Link

A cutting-edge, comprehensive donation system with multiple payment options and modern features.

## Features

- **Adaptive Dark Mode** - Automatic and manual dark/light theme switching
- **Multiple Payment Methods**:
  - Traditional: PayPal, Credit/Debit Cards, Venmo, Apple Pay, Google Pay
  - Cryptocurrency: Bitcoin, Ethereum, USDC, Solana
  - Web3 Wallets: MetaMask, WalletConnect, Phantom
- **Recurring Donations** - Monthly subscription option
- **Responsive Design** - Works seamlessly on all devices and screen sizes
- **Animated UI** - Smooth transitions and micro-interactions
- **Success Confirmation** - Confetti animation and confirmation message
- **Accessible Design** - WCAG 2.2 compliant with keyboard navigation
- **GDPR Compliant** - Privacy policy and consent implementation
- **QR Code Generation** - For cryptocurrency donations
- **System Theme Detection** - Automatically matches user's system preference

## GitHub Pages Limitations

When deployed on GitHub Pages:

- Only PayPal payments are fully functional
- Other payment methods (credit cards, crypto, etc.) are in demonstration mode
- PayPal payments are directed to keeseetyler17@yahoo.com

## Setup

1. Clone this repository
2. Open `index.html` in a web browser
3. No server required for basic PayPal integration - works client-side
4. For full feature set with cryptocurrency and Web3 wallets, server-side implementation is required

## Payment Processing

All payments are processed securely and directed to the account associated with keeseetyler17@yahoo.com.

### Traditional Payments

- PayPal payments are processed directly through the PayPal API
- Credit card payments use PayPal's Hosted Fields (requires server in production)
- Venmo payments are processed through PayPal's Venmo integration (requires server)
- Apple Pay requires merchant validation through a server
- Google Pay requires Google Pay API integration (requires server)

### Cryptocurrency Payments

- BTC, ETH, USDC, and SOL address display with QR code generation
- Transaction confirmation (requires server verification in production)

### Web3 Wallets

- MetaMask integration for ETH and ERC-20 tokens
- WalletConnect for cross-platform wallet support
- Phantom Wallet integration for Solana

## Customization

- Edit the `index.html` file to change the text and donation amounts
- Modify the `style.css` file to update colors and styling
- Update the PayPal client ID in the `index.html` file to use a different PayPal account
- Replace placeholder cryptocurrency addresses in the JavaScript file

## Browser Support

Works in all modern browsers including:

- Chrome/Edge/Brave (Chromium-based browsers)
- Firefox
- Safari
- Mobile browsers

## Technical Features

- Theme persistence with localStorage
- Auto-detects system color scheme preference
- Modular JavaScript architecture
- Responsive grid layout with CSS custom properties
- Form validation and error handling
- Secure payment processing
- Animated UX with optimized performance
- Reduced motion support for accessibility
