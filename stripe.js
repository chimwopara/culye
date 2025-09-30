// Stripe configuration
const stripePublicKey = "pk_test_51S1hMrPakOX6JEqhZYcA0CldRqEFyXZNYfQE2blJM6C161eZqCkVSC41IVkPTtmzh6eEARu0rNTWcseCg59RWb3Q00tS7RQ6aX";
const functionUrl = "https://us-central1-culye-57a22.cloudfunctions.net/createPaymentIntent";
const scriptURL = 'https://script.google.com/macros/s/AKfycbxU5LfDBqXBgBzFTz1JbNodbtkuk3WG3YNxU9P-3nZCTu8eE2dceUnY7cag5-rWsHlRHg/exec';




let stripe;
let elements;
let currentClientSecret = null;

// Initialize Stripe safely
document.addEventListener('DOMContentLoaded', function() {
    try {
        if (typeof Stripe !== 'undefined' && stripePublicKey) {
            stripe = Stripe(stripePublicKey);
            console.log('Stripe initialized successfully');
        } else {
            console.error('Stripe or public key not available');
        }
    } catch (error) {
        console.error('Error initializing Stripe:', error);
    }

    // Attach form submission handler
    const form = document.getElementById('assessment-form');
    if (form) {
        form.addEventListener('submit', handleFormSubmission);
    }
});

// Initialize Stripe Elements with dynamic pricing
window.initializeStripe = async function(serviceType) {
    if (!stripe) {
        console.error('Stripe not initialized');
        return;
    }

    try {
        console.log('Creating payment intent for:', serviceType);
        
        const response = await fetch(functionUrl, { 
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                serviceType: serviceType
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('Payment intent created:', result);
        
        if (result.error) {
            throw new Error(result.error);
        }
        
        currentClientSecret = result.clientSecret;
        
        elements = stripe.elements({ clientSecret: currentClientSecret });
        const paymentElement = elements.create("payment");
        paymentElement.mount("#payment-element");
        
        console.log('Payment element mounted successfully');
    } catch (error) {
        console.error("Error initializing Stripe:", error);
        const paymentMessage = document.getElementById("payment-message");
        if (paymentMessage) {
            paymentMessage.textContent = `Could not initialize payment: ${error.message}. Please refresh and try again.`;
            paymentMessage.classList.remove('hidden');
        }
    }
}

// Handle form submission
async function handleFormSubmission(e) {
    e.preventDefault();
    
    // Collect form data FIRST
    const data = collectFormData();
    console.log('Form data collected:', data);
    
    try {
        const submitBtn = document.getElementById('submit-btn');
        const loadingSpinner = document.getElementById('loading-spinner');
        const formContainer = document.getElementById('assessment-form-container');
        const formFeedback = document.getElementById('form-feedback');
        const feedbackTitle = document.getElementById('feedback-title');
        const feedbackMessage = document.getElementById('feedback-message');
        
        // Show loading state
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Processing Payment...';
        }
        if (loadingSpinner) loadingSpinner.classList.remove('hidden');

        // Check if Stripe is properly initialized
        if (!elements || !currentClientSecret) {
            const paymentMessage = document.getElementById("payment-message");
            if (paymentMessage) {
                paymentMessage.textContent = "Payment system not ready. Please wait a moment and try again.";
                paymentMessage.classList.remove('hidden');
            }
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Pay & Submit';
            }
            if (loadingSpinner) loadingSpinner.classList.add('hidden');
            return;
        }

        // Submit payment elements first (required by Stripe)
        const { error: submitError } = await elements.submit();
        if (submitError) {
            const paymentMessage = document.getElementById("payment-message");
            if (paymentMessage) {
                paymentMessage.textContent = submitError.message;
                paymentMessage.classList.remove('hidden');
            }
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Pay & Submit';
            }
            if (loadingSpinner) loadingSpinner.classList.add('hidden');
            return;
        }

        // Confirm payment with Stripe
        const { error: stripeError } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: window.location.href,
            },
            redirect: "if_required"
        });
        
        if (stripeError) {
            const paymentMessage = document.getElementById("payment-message");
            if (paymentMessage) {
                paymentMessage.textContent = stripeError.message;
                paymentMessage.classList.remove('hidden');
            }
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Pay & Submit';
            }
            if (loadingSpinner) loadingSpinner.classList.add('hidden');
            return;
        }

        // Payment successful, submit to Google Sheet
        try {
            console.log('Submitting to Google Sheet:', data);
            
            const response = await fetch(scriptURL, { 
                method: 'POST', 
                body: JSON.stringify(data), 
                headers: {'Content-Type': 'application/json'} 
            });
            
            const result = await response.json();
            console.log('Google Sheet response:', result);

            if (result.result === 'success') {
                if (formContainer) formContainer.classList.add('hidden');
                if (feedbackTitle) feedbackTitle.textContent = "Payment Successful!";
                if (feedbackMessage) feedbackMessage.textContent = "Thank you! Your payment has been processed and we've received your information. We will contact you within 2 business days to schedule your consultation.";
                if (formFeedback) formFeedback.classList.remove('hidden');
                if (loadingSpinner) loadingSpinner.classList.add('hidden');
            } else {
                throw new Error(result.error || 'Unknown error submitting to Google Sheet.');
            }
        } catch (error) {
            console.error('Error submitting to Google Sheet:', error);
            // Payment was successful even if sheet submission failed
            if (formContainer) formContainer.classList.add('hidden');
            if (feedbackTitle) feedbackTitle.textContent = "Payment Successful!";
            if (feedbackMessage) feedbackMessage.textContent = "Your payment was processed successfully. However, there was an issue recording your details. Please contact us directly at your earliest convenience. We will assist you promptly.";
            if (formFeedback) formFeedback.classList.remove('hidden');
            if (loadingSpinner) loadingSpinner.classList.add('hidden');
        }
    } catch (error) {
        console.error('Error in form submission:', error);
        const paymentMessage = document.getElementById("payment-message");
        if (paymentMessage) {
            paymentMessage.textContent = `An error occurred: ${error.message}`;
            paymentMessage.classList.remove('hidden');
        }
        const submitBtn = document.getElementById('submit-btn');
        const loadingSpinner = document.getElementById('loading-spinner');
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Pay & Submit';
        }
        if (loadingSpinner) loadingSpinner.classList.add('hidden');
    }
}