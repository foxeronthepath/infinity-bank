// Login form handling
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const remember = document.getElementById('remember').checked;
    
    // Login simulation (to be implemented with backend)
    console.log('Login attempt:', {
        email: email,
        remember: remember
    });
    
    // Show loading message
    const button = document.querySelector('.continue-button');
    const originalText = button.textContent;
    button.textContent = 'Logging in...';
    button.disabled = true;
    
    // Simulate API call (remove in production)
    setTimeout(() => {
        alert('Simulated login. In production, the server call will be made here.');
        button.textContent = originalText;
        button.disabled = false;
    }, 1500);
});

// UX improvement: automatic focus on first field
window.addEventListener('load', () => {
    const emailInput = document.getElementById('email');
    if (emailInput && !emailInput.value) {
        emailInput.focus();
    }
});

