// PIN Generator for KEY Bank Authenticator
class PinGenerator {
    constructor() {
        this.pinInterval = 30; // PIN refreshes every 30 seconds
        this.currentPin = '';
        this.timer = this.pinInterval;
        this.progressInterval = null;
        this.timerInterval = null;
        
        this.init();
    }

    init() {
        // Generate initial PIN
        this.generatePin();
        this.startTimer();
        
        // Setup event listeners
        document.getElementById('refresh-pin').addEventListener('click', () => this.refreshPin());
        document.getElementById('copy-pin').addEventListener('click', () => this.copyPin());
    }

    generatePin() {
        // Generate a 6-digit PIN based on current time
        // This simulates a time-based one-time password (TOTP)
        const timeStep = Math.floor(Date.now() / 1000 / this.pinInterval);
        const seed = timeStep * 1234567; // Simple seed based on time step
        
        // Generate 6-digit PIN
        this.currentPin = String(Math.abs(seed % 1000000)).padStart(6, '0');
        
        // Update display
        document.getElementById('pin-code').textContent = this.currentPin;
        
        // Reset timer
        this.timer = this.pinInterval;
    }

    startTimer() {
        // Update timer every second
        this.timerInterval = setInterval(() => {
            this.timer--;
            
            // Update timer display
            const timerElement = document.getElementById('timer-seconds');
            if (timerElement) {
                timerElement.textContent = this.timer;
            }
            
            // Update progress bar
            const progress = ((this.pinInterval - this.timer) / this.pinInterval) * 100;
            const progressBar = document.getElementById('progress-bar');
            if (progressBar) {
                progressBar.style.width = `${progress}%`;
                
                // Change color as time runs out
                if (this.timer <= 5) {
                    progressBar.style.background = 'linear-gradient(90deg, #ff6b9d 0%, #dc3545 100%)';
                } else if (this.timer <= 10) {
                    progressBar.style.background = 'linear-gradient(90deg, #ff8c42 0%, #ff6b9d 100%)';
                } else {
                    progressBar.style.background = 'linear-gradient(90deg, #6bb6ff 0%, #8b5cf6 100%)';
                }
            }
            
            // Generate new PIN when timer reaches 0
            if (this.timer <= 0) {
                this.generatePin();
                this.showStatus('PIN refreshed automatically', 'success');
            }
        }, 1000);
    }

    refreshPin() {
        // Force refresh PIN
        this.generatePin();
        this.showStatus('PIN refreshed', 'success');
    }

    copyPin() {
        // Copy PIN to clipboard
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(this.currentPin).then(() => {
                this.showStatus('PIN copied to clipboard', 'success');
            }).catch(() => {
                this.fallbackCopyPin();
            });
        } else {
            this.fallbackCopyPin();
        }
    }

    fallbackCopyPin() {
        // Fallback copy method for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = this.currentPin;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        
        try {
            document.execCommand('copy');
            this.showStatus('PIN copied to clipboard', 'success');
        } catch (err) {
            this.showStatus('Failed to copy PIN', 'error');
        }
        
        document.body.removeChild(textArea);
    }

    showStatus(message, type) {
        const statusElement = document.getElementById('status-message');
        if (statusElement) {
            statusElement.textContent = message;
            statusElement.className = `status-message status-${type}`;
            statusElement.style.display = 'block';
            
            // Hide after 3 seconds
            setTimeout(() => {
                statusElement.style.display = 'none';
            }, 3000);
        }
    }

    destroy() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
        if (this.progressInterval) {
            clearInterval(this.progressInterval);
        }
    }
}

// Initialize PIN generator when page loads
let pinGenerator;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        pinGenerator = new PinGenerator();
    });
} else {
    pinGenerator = new PinGenerator();
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (pinGenerator) {
        pinGenerator.destroy();
    }
});

