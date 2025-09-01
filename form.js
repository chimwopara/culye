// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeForm();
});

function initializeForm() {
    // Mobile Menu Toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            const firstSvg = mobileMenuButton.querySelector('svg:first-child');
            const lastSvg = mobileMenuButton.querySelector('svg:last-child');
            if (firstSvg) firstSvg.classList.toggle('hidden');
            if (lastSvg) lastSvg.classList.toggle('block');
        });
    }

    // Header scroll effect with mobile menu auto-dismiss
    const header = document.getElementById('header');
    if (header) {
        window.addEventListener('scroll', () => {
            // Header background effect
            if (window.scrollY > 50) {
                header.classList.add('bg-gray-900', 'shadow-lg');
                header.classList.remove('bg-gray-900/80');
            } else {
                header.classList.remove('bg-gray-900', 'shadow-lg');
                header.classList.add('bg-gray-900/80');
            }
            
            // Auto-dismiss mobile menu when scrolling
            if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
                const firstSvg = mobileMenuButton.querySelector('svg:first-child');
                const lastSvg = mobileMenuButton.querySelector('svg:last-child');
                if (firstSvg) firstSvg.classList.remove('hidden');
                if (lastSvg) lastSvg.classList.add('hidden');
            }
        });
    }
    
    // Smooth scroll for nav links
    window.smoothScroll = function(target) {
        const element = document.querySelector(target);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    }
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            smoothScroll(href);
            if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
                const firstSvg = mobileMenuButton.querySelector('svg:first-child');
                const lastSvg = mobileMenuButton.querySelector('svg:last-child');
                if (firstSvg) firstSvg.classList.remove('hidden');
                if (lastSvg) lastSvg.classList.add('hidden');
            }
        });
    });

    // Industry-standard pricing table
    const pricingTable = {
        "Work in Canada": { price: 5000, description: "Express Entry & Provincial Nominee Programs" },
        "Study in Canada": { price: 2750, description: "Study Permit & Educational Institution Support" },
        "Join Family": { price: 5000, description: "Family Sponsorship & Spousal Applications" },
        "Visit Canada": { price: 1250, description: "Visitor Visa & Temporary Residence" },
        "Invest/Start a Business": { price: 9000, description: "Business Class Immigration & Investment Programs" },
        "Work Permit": { price: 2500, description: "Work Permit Application Support" }
    };

    // Form elements
    const steps = Array.from(document.querySelectorAll('.form-step'));
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const submitBtn = document.getElementById('submit-btn');
    const form = document.getElementById('assessment-form');
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');
    const progressPercent = document.getElementById('progress-percent');
    
    const totalPriceElement = document.getElementById('total-price');
    const serviceDescriptionElement = document.getElementById('service-description');

    let currentStep = 0;
    let currentServiceType = "Work Permit";

    const stepConditions = {
        'Work in Canada': [0, 1, 2, 3, 4, 5, 6, 7],
        'Study in Canada': [0, 1, 2, 4, 5, 6, 7],
        'Invest/Start a Business': [0, 1, 2, 3, 5, 6, 7],
        'Join Family': [0, 1, 2, 4, 6, 7],
        'Visit Canada': [0, 1, 6, 7],
        'Work Permit': [0, 1, 2, 3, 5, 6, 7],
    };

    let activeSteps = [];

    // Helper function to collect all form data
    
window.collectFormData = function() {
    // Helper to get checked radio button values safely
    const getRadioValue = (name) => {
        const checkedRadio = document.querySelector(`input[name="${name}"]:checked`);
        return checkedRadio ? checkedRadio.value : '';
    };

    return {
        // Personal Info
        fullName: document.getElementById('fullName')?.value || '',
        email: document.getElementById('email')?.value || '',
        phone: document.getElementById('phone')?.value || '',
        countryOfResidence: document.getElementById('countryOfResidence')?.value || '',
        
        // Immigration Goal & Service Details
        primaryGoal: getRadioValue('primaryGoal'),
        serviceType: currentServiceType,
        feePaid: `C$${pricingTable[currentServiceType].price.toLocaleString()}.00`,

        // Education & Work
        educationLevel: document.getElementById('educationLevel')?.value || '',
        fieldOfStudy: document.getElementById('fieldOfStudy')?.value || '',
        hasAcceptanceLetter: getRadioValue('hasAcceptanceLetter'),
        workExperience: document.getElementById('workExperience')?.value || '',
        occupation: document.getElementById('occupation')?.value || '',
        mgmtExperience: document.getElementById('mgmtExperience')?.value || '',
        
        // Family & Sponsorship
        sponsorRelationship: getRadioValue('sponsorRelationship'),
        sponsorStatus: getRadioValue('sponsorStatus'),
        
        // Financial & Additional Info
        proofOfFunds: document.getElementById('proofOfFunds')?.value || '',
        netWorth: document.getElementById('netWorth')?.value || '',
        additionalNotes: document.getElementById('additionalNotes')?.value || '',
        
        // System Generated
        timestamp: new Date().toISOString(),
        paymentStatus: 'Paid' // This is set automatically on successful payment
    };
}
    
    function calculateActiveSteps() {
        try {
            const primaryGoal = document.querySelector('input[name="primaryGoal"]:checked');
            const goalValue = primaryGoal ? primaryGoal.value : 'Work Permit';
            activeSteps = stepConditions[goalValue].map(i => steps[i]);
            currentServiceType = goalValue;
            updatePricing();
        } catch (error) {
            console.error('Error calculating active steps:', error);
        }
    }

    function updatePricing() {
        try {
            const pricing = pricingTable[currentServiceType];
            if (pricing && totalPriceElement && serviceDescriptionElement) {
                totalPriceElement.textContent = `C$${pricing.price.toLocaleString()}.00`;
                serviceDescriptionElement.textContent = pricing.description;
            }
        } catch (error) {
            console.error('Error updating pricing:', error);
        }
    }

    function updateFormView() {
        try {
            steps.forEach(step => step.classList.remove('active'));
            if (activeSteps[currentStep]) {
                activeSteps[currentStep].classList.add('active');
            }

            const totalActiveSteps = activeSteps.length;
            const progress = totalActiveSteps > 1 ? ((currentStep) / (totalActiveSteps - 1)) * 100 : 0;

            if (progressBar) progressBar.style.width = `${progress}%`;
            if (progressText) progressText.textContent = `Step ${currentStep + 1} of ${totalActiveSteps}`;
            if (progressPercent) progressPercent.textContent = `${Math.round(progress)}%`;

            if (prevBtn) prevBtn.style.display = currentStep > 0 ? 'inline-block' : 'none';
            if (nextBtn) nextBtn.style.display = currentStep < totalActiveSteps - 1 ? 'inline-block' : 'none';
            if (submitBtn) submitBtn.style.display = currentStep === totalActiveSteps - 1 ? 'inline-block' : 'none';
        } catch (error) {
            console.error('Error updating form view:', error);
        }
    }
    
    function validateStep() {
        try {
            const currentStepElement = activeSteps[currentStep];
            
            // Check required text inputs and hidden inputs (from dropdowns)
            const requiredInputs = currentStepElement.querySelectorAll('input[required], select[required]');
            for (let input of requiredInputs) {
                if (!input.value || input.value.trim() === '') {
                    input.focus();
                    const label = currentStepElement.querySelector(`label[for="${input.id}"]`);
                    const fieldName = label ? label.textContent.replace(' *', '') : input.name;
                    showValidationMessage(`Please fill out the ${fieldName} field.`);
                    return false;
                }
            }
            
            // Check radio button groups
            const radioGroups = {};
            const radios = currentStepElement.querySelectorAll('input[type="radio"]');
            radios.forEach(radio => {
                if (!radioGroups[radio.name]) {
                    radioGroups[radio.name] = [];
                }
                radioGroups[radio.name].push(radio);
            });
            
            for (const groupName in radioGroups) {
                const group = radioGroups[groupName];
                const isChecked = group.some(radio => radio.checked);
                if (group.length > 0 && !isChecked) {
                    showValidationMessage("Please select an option.");
                    return false;
                }
            }
            
            return true;
        } catch (error) {
            console.error('Error validating step:', error);
            return false;
        }
    }

    function showValidationMessage(message) {
        alert(message);
    }

    // Event listeners with error handling
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            try {
                if (validateStep()) {
                    if (currentStep === 1) {
                        calculateActiveSteps();
                    }
                    if (currentStep < activeSteps.length - 1) {
                        currentStep++;
                        updateFormView();
                        
                        // Initialize Stripe when reaching payment step
                        if (currentStep === activeSteps.length - 1) {
                            // Call Stripe initialization from stripe.js
                            if (typeof initializeStripe === 'function') {
                                initializeStripe(currentServiceType);
                            }
                        }
                    }
                }
            } catch (error) {
                console.error('Error in next button handler:', error);
            }
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            try {
                if (currentStep > 0) {
                    currentStep--;
                    if (currentStep === 1) {
                        calculateActiveSteps();
                    }
                    updateFormView();
                }
            } catch (error) {
                console.error('Error in prev button handler:', error);
            }
        });
    }
    
    document.querySelectorAll('input[name="primaryGoal"]').forEach(radio => {
        radio.addEventListener('change', () => {
            try {
                calculateActiveSteps();
            } catch (error) {
                console.error('Error in radio change handler:', error);
            }
        });
    });

    // Initialize form
    calculateActiveSteps();
    updateFormView();

    // Custom Dropdown Functionality
    function initCustomDropdowns() {
        const dropdowns = [
            { button: 'countryDropdownBtn', menu: 'countryDropdownMenu', selected: 'countrySelectedText', input: 'countryOfResidence' },
            { button: 'educationDropdownBtn', menu: 'educationDropdownMenu', selected: 'educationSelectedText', input: 'educationLevel' },
            { button: 'workExpDropdownBtn', menu: 'workExpDropdownMenu', selected: 'workExpSelectedText', input: 'workExperience' },
            { button: 'mgmtExpDropdownBtn', menu: 'mgmtExpDropdownMenu', selected: 'mgmtExpSelectedText', input: 'mgmtExperience' },
            { button: 'fundsDropdownBtn', menu: 'fundsDropdownMenu', selected: 'fundsSelectedText', input: 'proofOfFunds' },
            { button: 'netWorthDropdownBtn', menu: 'netWorthDropdownMenu', selected: 'netWorthSelectedText', input: 'netWorth' }
        ];

        dropdowns.forEach(dropdown => {
            const button = document.getElementById(dropdown.button);
            const menu = document.getElementById(dropdown.menu);
            const selectedText = document.getElementById(dropdown.selected);
            const hiddenInput = document.getElementById(dropdown.input);

            if (button && menu && selectedText && hiddenInput) {
                // Toggle dropdown
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // Close other dropdowns
                    dropdowns.forEach(otherDropdown => {
                        if (otherDropdown.button !== dropdown.button) {
                            const otherMenu = document.getElementById(otherDropdown.menu);
                            const otherButton = document.getElementById(otherDropdown.button);
                            if (otherMenu && otherButton) {
                                otherMenu.classList.remove('active');
                                otherButton.classList.remove('active');
                            }
                        }
                    });

                    menu.classList.toggle('active');
                    button.classList.toggle('active');
                });

                // Handle option selection
                menu.addEventListener('click', (e) => {
                    if (e.target.classList.contains('dropdown-option')) {
                        const value = e.target.getAttribute('data-value');
                        selectedText.textContent = e.target.textContent;
                        hiddenInput.value = value;
                        
                        // Remove active classes
                        menu.classList.remove('active');
                        button.classList.remove('active');
                        
                        // Update selected option styling
                        menu.querySelectorAll('.dropdown-option').forEach(option => {
                            option.classList.remove('selected');
                        });
                        e.target.classList.add('selected');
                    }
                });
            }
        });

        // Close dropdowns when clicking outside
        document.addEventListener('click', (e) => {
            dropdowns.forEach(dropdown => {
                const button = document.getElementById(dropdown.button);
                const menu = document.getElementById(dropdown.menu);
                if (button && menu && !button.contains(e.target) && !menu.contains(e.target)) {
                    menu.classList.remove('active');
                    button.classList.remove('active');
                }
            });
        });
    }

    // Initialize dropdowns
    initCustomDropdowns();

    // Sponsor relationship conditional display
    document.addEventListener('change', (e) => {
        if (e.target.name === 'sponsorRelationship') {
            const sponsorStatusDiv = document.getElementById('sponsorStatusDiv');
            if (e.target.value === 'No Sponsor') {
                sponsorStatusDiv.style.display = 'none';
                // Clear sponsor status selection
                const sponsorStatusInputs = document.querySelectorAll('input[name="sponsorStatus"]');
                sponsorStatusInputs.forEach(input => input.checked = false);
            } else {
                sponsorStatusDiv.style.display = 'block';
            }
        }
    });

    // Update radio/checkbox styling
    document.addEventListener('change', (e) => {
        if (e.target.type === 'radio' || e.target.type === 'checkbox') {
            const container = e.target.closest('.custom-radio') || e.target.closest('.custom-checkbox');
            if (container) {
                // Remove checked class from siblings
                const siblings = container.parentElement.querySelectorAll('.custom-radio, .custom-checkbox');
                siblings.forEach(sibling => sibling.classList.remove('checked'));
                
                // Add checked class to current
                if (e.target.checked) {
                    container.classList.add('checked');
                }
            }
        }
    });

    // Expose necessary variables and functions to global scope for stripe.js
    window.currentServiceType = currentServiceType;
    window.pricingTable = pricingTable;
}