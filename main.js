// DOM Elements
const amountButtons = document.querySelectorAll('.amount-btn');
const selectedAmountEl = document.getElementById('selectedAmount');
const themeToggle = document.getElementById('themeToggle');
const tabButtons = document.querySelectorAll('.tab-button');
const standardPaymentOptions = document.querySelectorAll('#standardTab .payment-option');
const cryptoOptions = document.querySelectorAll('[data-crypto]');
const walletOptions = document.querySelectorAll('[data-wallet]');
const customAmountModal = document.getElementById('customAmountModal');
const customAmountInput = document.getElementById('customAmount');
const saveAmountBtn = document.getElementById('saveAmount');
const privacyModal = document.getElementById('privacyModal');
const termsModal = document.getElementById('termsModal');
const privacyLink = document.getElementById('privacyLink');
const termsLink = document.getElementById('termsLink');
const closeButtons = document.querySelectorAll('.close');
const recurringToggle = document.getElementById('recurringToggle');
const paypalForm = document.getElementById('paypal-form');
const cardForm = document.getElementById('card-form');
const venmoForm = document.getElementById('venmo-form');
const applepayForm = document.getElementById('applepay-form');
const googlepayForm = document.getElementById('googlepay-form');
const cardDonateBtn = document.getElementById('cardDonateBtn');
const venmoDemoBtn = document.getElementById('venmoDemoBtn');
const applePayDemoBtn = document.getElementById('applePayDemoBtn');
const googlePayDemoBtn = document.getElementById('googlePayDemoBtn');
const cryptoConfirmBtn = document.getElementById('cryptoConfirmBtn');
const connectWalletBtn = document.getElementById('connectWalletBtn');
const copyAddressBtn = document.getElementById('copyAddress');
const cryptoAddressDisplay = document.getElementById('cryptoAddressDisplay');

// State variables
let selectedAmount = 10; // Default amount
let isRecurring = false;
let selectedPaymentMethod = 'paypal';
let selectedCrypto = 'btc';
let selectedWallet = 'metamask';

// Crypto addresses (replace with your actual addresses in production)
const cryptoAddresses = {
    btc: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
    eth: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    usdc: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    sol: 'Ht9CJnkYFkPyF8EamAuDKgMUZikiVZbBQxin7GbLSEbr'
};

// Theme toggle
function initTheme() {
    // Check for saved theme preference or use system preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.setAttribute('data-theme', 'dark');
        updateThemeIcon('dark');
    }
}

function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector('i');
    if (theme === 'dark') {
        icon.className = 'fas fa-sun';
    } else {
        icon.className = 'fas fa-moon';
    }
}

themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

// Modal handling
function openModal(modal) {
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
    modal.style.display = 'none';
    document.body.style.overflow = '';
}

closeButtons.forEach(button => {
    button.addEventListener('click', () => {
        const modal = button.closest('.modal');
        closeModal(modal);
    });
});

window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        closeModal(e.target);
    }
});

// Donation amount selection
amountButtons.forEach(button => {
    button.addEventListener('click', () => {
        const amount = button.getAttribute('data-amount');
        
        if (amount === 'custom') {
            openModal(customAmountModal);
        } else {
            selectAmount(parseInt(amount));
        }
    });
});

function selectAmount(amount) {
    selectedAmount = amount;
    
    // Remove active class from all buttons
    amountButtons.forEach(btn => btn.classList.remove('active'));
    
    // Add active class to selected button
    document.querySelector(`[data-amount="${amount}"]`)?.classList.add('active');
    
    // Update display
    selectedAmountEl.textContent = `Selected Amount: $${amount}${isRecurring ? ' monthly' : ''}`;
    selectedAmountEl.style.display = 'block';
    
    // If PayPal is selected, reinitialize the button with the new amount
    if (selectedPaymentMethod === 'paypal' && paypalForm.classList.contains('active')) {
        initializePayPalButton();
    }
}

saveAmountBtn.addEventListener('click', () => {
    const customAmount = parseInt(customAmountInput.value);
    if (customAmount && customAmount > 0) {
        selectAmount(customAmount);
        closeModal(customAmountModal);
        customAmountInput.value = '';
    }
});

// Recurring donation toggle
recurringToggle.addEventListener('change', () => {
    isRecurring = recurringToggle.checked;
    selectedAmountEl.textContent = `Selected Amount: $${selectedAmount}${isRecurring ? ' monthly' : ''}`;
    
    // Reinitialize PayPal button if it's the active payment method
    if (selectedPaymentMethod === 'paypal' && paypalForm.classList.contains('active')) {
        initializePayPalButton();
    }
});

// Tab switching
tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all tabs
        tabButtons.forEach(btn => btn.classList.remove('active'));
        
        // Add active class to clicked tab
        button.classList.add('active');
        
        // Hide all tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.style.display = 'none';
        });
        
        // Show selected tab content
        const tabId = button.getAttribute('data-tab');
        document.getElementById(`${tabId}Tab`).style.display = 'block';
        
        // Reset payment forms when switching tabs
        hideAllPaymentForms();
        resetPaymentOptions();
        
        // Set default payment method for each tab
        if (tabId === 'standard') {
            showPaymentForm('paypal');
            document.querySelector('[data-payment="paypal"]').classList.add('active');
            selectedPaymentMethod = 'paypal';
            initializePayPalButton();
        } else if (tabId === 'crypto') {
            selectedCrypto = 'btc';
            document.querySelector('[data-crypto="btc"]').classList.add('active');
            updateCryptoDisplay('btc');
        } else if (tabId === 'web3') {
            selectedWallet = 'metamask';
            document.querySelector('[data-wallet="metamask"]').classList.add('active');
        }
    });
});

// Payment method selection within Standard tab
standardPaymentOptions.forEach(option => {
    option.addEventListener('click', () => {
        // Remove active class from all options
        standardPaymentOptions.forEach(opt => opt.classList.remove('active'));
        
        // Add active class to clicked option
        option.classList.add('active');
        
        // Get selected payment method
        selectedPaymentMethod = option.getAttribute('data-payment');
        
        // Hide all payment forms
        hideAllPaymentForms();
        
        // Show selected payment form
        showPaymentForm(selectedPaymentMethod);
    });
});

// Crypto selection
cryptoOptions.forEach(option => {
    option.addEventListener('click', () => {
        // Remove active class from all options
        cryptoOptions.forEach(opt => opt.classList.remove('active'));
        
        // Add active class to clicked option
        option.classList.add('active');
        
        // Get selected crypto
        selectedCrypto = option.getAttribute('data-crypto');
        
        // Update crypto display
        updateCryptoDisplay(selectedCrypto);
    });
});

// Wallet selection
walletOptions.forEach(option => {
    option.addEventListener('click', () => {
        // Remove active class from all options
        walletOptions.forEach(opt => opt.classList.remove('active'));
        
        // Add active class to clicked option
        option.classList.add('active');
        
        // Get selected wallet
        selectedWallet = option.getAttribute('data-wallet');
    });
});

// Helper functions
function hideAllPaymentForms() {
    const paymentForms = document.querySelectorAll('.payment-form');
    paymentForms.forEach(form => {
        form.classList.remove('active');
    });
}

function showPaymentForm(method) {
    const form = document.getElementById(`${method}-form`);
    if (form) {
        form.classList.add('active');
        
        // Initialize PayPal button if PayPal is selected
        if (method === 'paypal') {
            initializePayPalButton();
        }
    }
}

function resetPaymentOptions() {
    standardPaymentOptions.forEach(opt => opt.classList.remove('active'));
    cryptoOptions.forEach(opt => opt.classList.remove('active'));
    walletOptions.forEach(opt => opt.classList.remove('active'));
}

function updateCryptoDisplay(crypto) {
    const address = cryptoAddresses[crypto];
    cryptoAddressDisplay.value = address;
    
    // Generate QR code
    const qrcodeContainer = document.getElementById('qrcode');
    qrcodeContainer.innerHTML = '';
    
    try {
        // Using the QR code library
        const qr = qrcode(0, 'M');
        qr.addData(address);
        qr.make();
        qrcodeContainer.innerHTML = qr.createImgTag(5);
    } catch (error) {
        console.error('Error generating QR code:', error);
        qrcodeContainer.innerHTML = '<p>QR Code generation failed. Please copy the address manually.</p>';
    }
}

// Copy crypto address
copyAddressBtn.addEventListener('click', () => {
    cryptoAddressDisplay.select();
    document.execCommand('copy');
    
    // Show feedback
    const originalText = copyAddressBtn.innerHTML;
    copyAddressBtn.innerHTML = '<i class="fas fa-check"></i>';
    setTimeout(() => {
        copyAddressBtn.innerHTML = originalText;
    }, 2000);
});

// Demo payment buttons
cardDonateBtn.addEventListener('click', simulatePayment);
venmoDemoBtn.addEventListener('click', simulatePayment);
applePayDemoBtn.addEventListener('click', simulatePayment);
googlePayDemoBtn.addEventListener('click', simulatePayment);
cryptoConfirmBtn.addEventListener('click', simulatePayment);
connectWalletBtn.addEventListener('click', simulateWalletConnection);

function simulatePayment() {
    // Show loading
    const originalText = this.innerHTML;
    this.innerHTML = '<div class="spinner"></div> Processing...';
    this.disabled = true;
    
    // Simulate processing
    setTimeout(() => {
        showSuccessMessage('Demo User', true);
        this.innerHTML = originalText;
        this.disabled = false;
    }, 2000);
}

function simulateWalletConnection() {
    // Show loading
    const originalText = this.innerHTML;
    this.innerHTML = '<div class="spinner"></div> Connecting...';
    this.disabled = true;
    
    // Simulate connection
    setTimeout(() => {
        const walletMessage = document.querySelector('.connect-wallet-message');
        walletMessage.innerHTML = `
            <p>Connected to ${selectedWallet.charAt(0).toUpperCase() + selectedWallet.slice(1)} wallet (Demo)</p>
            <div class="selected-amount">Amount: $${selectedAmount}${isRecurring ? ' monthly' : ''}</div>
            <button class="donate-btn" id="web3DonateBtn">Send ${selectedAmount} USDC (Demo)</button>
        `;
        
        document.getElementById('web3DonateBtn').addEventListener('click', simulatePayment);
        this.innerHTML = originalText;
        this.disabled = false;
    }, 2000);
}

// Privacy and Terms links
privacyLink.addEventListener('click', (e) => {
    e.preventDefault();
    openModal(privacyModal);
});

termsLink.addEventListener('click', (e) => {
    e.preventDefault();
    openModal(termsModal);
});

// PayPal integration (fully functional)
function initializePayPalButton() {
    const paypalContainer = document.getElementById('paypal-button-container');
    paypalContainer.innerHTML = '';
    
    // Check if PayPal SDK is loaded
    if (typeof paypal === 'undefined') {
        paypalContainer.innerHTML = `
            <div class="error-message">
                <p>PayPal SDK failed to load. Please refresh the page and try again.</p>
            </div>
        `;
        return;
    }
    
    try {
        paypal.Buttons({
            style: {
                layout: 'vertical',
                color: 'blue',
                shape: 'rect',
                label: 'pay'
            },
            
            createOrder: function(data, actions) {
                return actions.order.create({
                    purchase_units: [{
                        amount: {
                            value: selectedAmount.toString(),
                            currency_code: 'USD'
                        },
                        description: isRecurring ? 'Monthly donation' : 'One-time donation',
                        payee: {
                            email_address: 'keeseetyler17@yahoo.com'
                        }
                    }],
                    application_context: {
                        shipping_preference: 'NO_SHIPPING'
                    }
                });
            },
            
            onApprove: function(data, actions) {
                return actions.order.capture().then(function(details) {
                    showSuccessMessage(details.payer.name.given_name);
                });
            },
            
            onError: function(err) {
                showErrorMessage('There was an error processing your payment. Please try again.');
                console.error('PayPal Error:', err);
            }
        }).render('#paypal-button-container');
    } catch (error) {
        console.error('PayPal button initialization error:', error);
        paypalContainer.innerHTML = `
            <div class="error-message">
                <p>Error initializing PayPal. Please refresh the page and try again.</p>
                <p>Error details: ${error.message}</p>
            </div>
        `;
    }
}

// Success and Error Messages
function showSuccessMessage(name = '', isDemo = false) {
    // Create success message
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    
    let messageText = `Your donation of $${selectedAmount}${isRecurring ? ' monthly' : ''} has been received. Your generosity is greatly appreciated!`;
    if (isDemo) {
        messageText = `This is a demonstration only. In a real environment, your donation of $${selectedAmount}${isRecurring ? ' monthly' : ''} would be processed. No actual payment has been made.`;
    }
    
    successMessage.innerHTML = `
        <h3>Thank You${name ? ', ' + name : ''}!</h3>
        <p>${messageText}</p>
    `;
    
    // Remove any existing messages
    document.querySelectorAll('.success-message, .error-message').forEach(el => el.remove());
    
    // Insert the message
    const donationCard = document.querySelector('.donation-card');
    const footer = document.querySelector('.donation-footer');
    donationCard.insertBefore(successMessage, footer);
    
    // Scroll to the message
    successMessage.scrollIntoView({ behavior: 'smooth' });
    
    // Create confetti effect
    createConfetti();
    
    // Remove message after a delay
    setTimeout(() => {
        successMessage.remove();
    }, 10000);
}

function showErrorMessage(message) {
    // Create error message
    const errorMessage = document.createElement('div');
    errorMessage.className = 'error-message';
    
    errorMessage.innerHTML = `
        <h3>Payment Failed</h3>
        <p>${message}</p>
    `;
    
    // Remove any existing messages
    document.querySelectorAll('.success-message, .error-message').forEach(el => el.remove());
    
    // Insert the message
    const donationCard = document.querySelector('.donation-card');
    const footer = document.querySelector('.donation-footer');
    donationCard.insertBefore(errorMessage, footer);
    
    // Scroll to the message
    errorMessage.scrollIntoView({ behavior: 'smooth' });
    
    // Remove message after a delay
    setTimeout(() => {
        errorMessage.remove();
    }, 7000);
}

// Confetti animation
function createConfetti() {
    const colors = ['#667eea', '#764ba2', '#48bb78', '#4299e1', '#ed8936'];
    
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        
        // Randomize confetti properties
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.animationDuration = Math.random() * 3 + 2 + 's';
        confetti.style.opacity = Math.random() + 0.5;
        confetti.style.transform = 'rotate(' + Math.random() * 360 + 'deg)';
        
        document.body.appendChild(confetti);
        
        // Remove confetti after animation
        setTimeout(() => {
            confetti.remove();
        }, 5000);
    }
}

// GitHub Pages notice
function addGithubPagesNotice() {
    if (window.location.hostname.includes('github.io')) {
        const donationCard = document.querySelector('.donation-card');
        const impactText = document.querySelector('.impact-text');
        
        const githubNotice = document.createElement('div');
        githubNotice.className = 'github-notice';
        githubNotice.innerHTML = `
            <p><i class="fas fa-info-circle"></i> This page is deployed on GitHub Pages. Only PayPal donations are fully functional. Other payment methods are demonstrations only.</p>
        `;
        
        if (donationCard && impactText) {
            donationCard.insertBefore(githubNotice, impactText.nextSibling);
        }
    }
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    selectAmount(10); // Default $10
    addGithubPagesNotice();
    
    // Set up default payment method
    showPaymentForm('paypal');
    initializePayPalButton();
    
    // Set up default crypto display
    updateCryptoDisplay('btc');
}); 