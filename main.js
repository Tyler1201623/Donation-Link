// Add Stripe initialization
let stripe;
fetch('/stripe-key')
    .then(response => response.json())
    .then(data => {
        stripe = Stripe(data.publishableKey);
    });

document.addEventListener('DOMContentLoaded', () => {
    const amountButtons = document.querySelectorAll('.amount-btn');
    const customAmountInput = document.querySelector('.custom-amount-input');
    const donateButton = document.getElementById('donateButton');
    let selectedAmount = 0;

    // Handle amount button clicks
    amountButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            amountButtons.forEach(btn => btn.classList.remove('active'));
            
            if (button.classList.contains('custom')) {
                customAmountInput.style.display = 'block';
                button.classList.add('active');
            } else {
                customAmountInput.style.display = 'none';
                button.classList.add('active');
                selectedAmount = parseInt(button.dataset.amount);
            }
        });
    });

    // Handle custom amount input
    const customAmount = document.getElementById('customAmount');
    customAmount.addEventListener('input', (e) => {
        selectedAmount = parseInt(e.target.value) || 0;
    });

    // Update donate button click handler
    donateButton.addEventListener('click', async () => {
        if (selectedAmount <= 0) {
            alert('Please select or enter a valid donation amount');
            return;
        }

        try {
            // Create payment session
            const response = await fetch('/create-payment-intent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    amount: selectedAmount * 100 // Convert to cents
                })
            });

            const session = await response.json();
            
            // Redirect to Stripe checkout
            const result = await stripe.redirectToCheckout({
                sessionId: session.id
            });

            if (result.error) {
                throw new Error(result.error.message);
            }
        } catch (error) {
            console.error('Payment failed:', error);
            alert('Payment processing failed. Please try again.');
        }
    });

    const confetti = () => {
        const colors = ['#667eea', '#764ba2', '#ffffff'];
        for (let i = 0; i < 100; i++) {
            const particle = document.createElement('div');
            particle.className = 'confetti';
            particle.style.background = colors[Math.floor(Math.random() * colors.length)];
            particle.style.left = Math.random() * 100 + 'vw';
            particle.style.animationDuration = (Math.random() * 3 + 2) + 's';
            particle.style.opacity = Math.random();
            document.body.appendChild(particle);
            setTimeout(() => particle.remove(), 5000);
        }
    };

    // Add some nice hover effects
    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('mouseover', () => {
            button.style.transition = 'all 0.3s ease';
        });
    });
});
