// Login form handling (only on login page)
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const remember = document.getElementById('remember').checked;
        
        // Accept any email and password - no validation needed
        console.log('Login attempt:', {
            email: email,
            remember: remember
        });
        
        // Show loading animation
        const button = document.querySelector('.continue-button');
        const originalText = button.textContent;
        button.disabled = true;
        button.classList.add('loading');
        
        // Create loading content with spinner and animated text
        button.innerHTML = '<span class="loading-spinner"></span><span class="loading-text">Logging in</span>';
        
        // Redirect to dashboard after a realistic delay
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1800);
    });
}

// UX improvement: automatic focus on first field
window.addEventListener('load', () => {
    const emailInput = document.getElementById('email');
    if (emailInput && !emailInput.value) {
        emailInput.focus();
    }
});

// Operations Flow Handler
function initOperationsFlow() {
    const operationsNav = document.getElementById('operations-nav');
    const defaultContent = document.getElementById('default-dashboard-content');
    const operationsContent = document.getElementById('operations-content');
    const operationsSelection = document.getElementById('operations-selection');
    const transferForm = document.getElementById('international-transfer-form');
    const transferConfirmation = document.getElementById('transfer-confirmation');
    const pinEntry = document.getElementById('pin-entry');
    const backToDashboard = document.getElementById('back-to-dashboard');
    const backToOperations = document.getElementById('back-to-operations');
    const transferFormElement = document.getElementById('transfer-form');
    const proceedToPin = document.getElementById('proceed-to-pin');
    const pinInput = document.getElementById('pin-input');
    const submitPin = document.getElementById('submit-pin');

    // Show operations when clicking Operations nav
    if (operationsNav && defaultContent && operationsContent) {
        // Check if listener is already attached
        if (!operationsNav.hasAttribute('data-listener-attached')) {
            // Remove any existing onclick handler first
            operationsNav.onclick = null;
            
            // Attach click handler using addEventListener for better reliability
            operationsNav.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Operations clicked');
            
            const defaultContentEl = document.getElementById('default-dashboard-content');
            const operationsContentEl = document.getElementById('operations-content');
            const operationsSelectionEl = document.getElementById('operations-selection');
            
            if (defaultContentEl && operationsContentEl) {
                defaultContentEl.style.display = 'none';
                operationsContentEl.style.display = 'block';
                
                // Hide all operation views first
                document.querySelectorAll('.operations-view').forEach(view => {
                    view.style.display = 'none';
                });
                
                // Show operations selection
                if (operationsSelectionEl) {
                    operationsSelectionEl.style.display = 'block';
                } else if (window.showView) {
                    showView('operations-selection');
                }
                console.log('Operations view shown successfully');
            } else {
                console.error('Missing elements:', {
                    defaultContent: !!defaultContentEl,
                    operationsContent: !!operationsContentEl
                });
            }
            return false;
            }, { once: false, capture: false });
            
            // Mark as attached
            operationsNav.setAttribute('data-listener-attached', 'true');
            console.log('Operations click handler attached successfully');
        } else {
            console.log('Operations listener already attached, skipping');
        }
    } else {
        console.error('Operations elements not found:', {
            operationsNav: !!operationsNav,
            defaultContent: !!defaultContent,
            operationsContent: !!operationsContent
        });
    }

    // Back to dashboard
    if (backToDashboard) {
        backToDashboard.addEventListener('click', function(e) {
            e.preventDefault();
            operationsContent.style.display = 'none';
            defaultContent.style.display = 'block';
        });
    }

    // Back to operations selection
    if (backToOperations) {
        backToOperations.addEventListener('click', function(e) {
            e.preventDefault();
            showView('operations-selection');
        });
    }

    // Operation card clicks
    const operationCards = document.querySelectorAll('.operation-card');
    operationCards.forEach(card => {
        card.addEventListener('click', function() {
            const operation = this.getAttribute('data-operation');
            if (operation === 'international-transfer') {
                showView('international-transfer-form');
            }
        });
    });

    // Form validation functions
    function validateIBAN(iban) {
        // Basic IBAN validation - should be alphanumeric, 15-34 characters
        const cleaned = iban.replace(/\s/g, '');
        return /^[A-Z0-9]{15,34}$/i.test(cleaned);
    }

    function validateSWIFT(swift) {
        // SWIFT/BIC should be 8-11 alphanumeric characters
        return /^[A-Z0-9]{8,11}$/i.test(swift);
    }

    function validateForm() {
        const recipientName = document.getElementById('recipient-name').value.trim();
        const recipientAddress = document.getElementById('recipient-address').value.trim();
        const recipientCity = document.getElementById('recipient-city').value.trim();
        const recipientCountry = document.getElementById('recipient-country').value;
        const bankName = document.getElementById('bank-name').value.trim();
        const iban = document.getElementById('iban').value.trim();
        const swift = document.getElementById('swift').value.trim();
        const amount = document.getElementById('amount').value;
        const currency = document.getElementById('currency').value;
        const purpose = document.getElementById('purpose').value;

        // Clear previous errors/warnings
        document.querySelectorAll('.error-message').forEach(err => err.remove());
        document.querySelectorAll('.form-group').forEach(group => group.classList.remove('has-error'));

        // Show warnings but don't block - validation is informational only
        let isValid = true;

        // Show warnings for incomplete/invalid fields (informational only, doesn't block)
        if (!recipientName || recipientName.length < 2) {
            showError('recipient-name', 'Recipient name is recommended (minimum 2 characters)');
        }

        if (!recipientAddress || recipientAddress.length < 5) {
            showError('recipient-address', 'Recipient address is recommended (minimum 5 characters)');
        }

        if (!recipientCity || recipientCity.length < 2) {
            showError('recipient-city', 'City is recommended (minimum 2 characters)');
        }

        if (!recipientCountry) {
            showError('recipient-country', 'Country selection is recommended');
        }

        if (!bankName || bankName.length < 2) {
            showError('bank-name', 'Bank name is recommended (minimum 2 characters)');
        }

        if (!iban) {
            showError('iban', 'IBAN is recommended');
        } else if (!validateIBAN(iban)) {
            showError('iban', 'IBAN format may be incorrect (15-34 alphanumeric characters)');
        }

        if (!swift) {
            showError('swift', 'SWIFT/BIC code is recommended');
        } else if (!validateSWIFT(swift)) {
            showError('swift', 'SWIFT/BIC format may be incorrect (8-11 alphanumeric characters)');
        }

        const amountNum = parseFloat(amount);
        if (!amount || isNaN(amountNum)) {
            showError('amount', 'Please enter a valid amount');
        } else if (amountNum <= 0) {
            showError('amount', 'Amount should be greater than 0');
        }

        if (!currency) {
            showError('currency', 'Currency selection is recommended');
        }

        if (!purpose) {
            showError('purpose', 'Purpose selection is recommended');
        }

        return isValid;
    }

    function showError(fieldId, message) {
        const field = document.getElementById(fieldId);
        if (!field) return;

        const formGroup = field.closest('.form-group');
        if (formGroup) {
            formGroup.classList.add('has-error');
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.textContent = message;
            errorDiv.style.color = '#dc3545';
            errorDiv.style.fontSize = '12px';
            errorDiv.style.marginTop = '4px';
            formGroup.appendChild(errorDiv);
        }
    }

    // Transfer form submission - allows submission even with invalid/incomplete fields
    if (transferFormElement) {
        transferFormElement.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Show validation warnings but don't block submission
            validateForm();
            
            // Get form values (use empty strings or defaults if not filled)
            const recipientName = document.getElementById('recipient-name').value.trim() || 'Not provided';
            const amount = document.getElementById('amount').value || '0';
            const currency = document.getElementById('currency').value || 'USD';
            const bankName = document.getElementById('bank-name').value.trim() || 'Not provided';
            const iban = document.getElementById('iban').value.trim() || 'Not provided';
            const purpose = document.getElementById('purpose').value || 'Not specified';
            
            const formData = {
                recipient: recipientName,
                amount: amount,
                currency: currency,
                bank: bankName,
                iban: iban,
                purpose: purpose
            };

            // Populate confirmation view
            document.getElementById('confirm-recipient').textContent = formData.recipient;
            
            // Format amount safely
            const amountNum = parseFloat(formData.amount);
            if (!isNaN(amountNum) && amountNum > 0) {
                document.getElementById('confirm-amount').textContent = `${formData.currency} ${amountNum.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
            } else {
                document.getElementById('confirm-amount').textContent = `${formData.currency} 0.00`;
            }
            
            document.getElementById('confirm-bank').textContent = formData.bank;
            document.getElementById('confirm-iban').textContent = formData.iban;
            document.getElementById('confirm-purpose').textContent = formData.purpose.charAt(0).toUpperCase() + formData.purpose.slice(1);

            // Show confirmation
            showView('transfer-confirmation');
        });

        // Real-time validation on input
        const formInputs = transferFormElement.querySelectorAll('input, select');
        formInputs.forEach(input => {
            input.addEventListener('blur', function() {
                // Clear error for this field
                const formGroup = this.closest('.form-group');
                if (formGroup) {
                    formGroup.classList.remove('has-error');
                    const errorMsg = formGroup.querySelector('.error-message');
                    if (errorMsg) errorMsg.remove();
                }
                
                // Re-validate this specific field
                if (this.id === 'iban' && this.value.trim()) {
                    if (!validateIBAN(this.value.trim())) {
                        showError('iban', 'Please enter a valid IBAN (15-34 alphanumeric characters)');
                    }
                } else if (this.id === 'swift' && this.value.trim()) {
                    if (!validateSWIFT(this.value.trim())) {
                        showError('swift', 'Please enter a valid SWIFT/BIC code (8-11 alphanumeric characters)');
                    }
                } else if (this.id === 'amount' && this.value) {
                    const amountNum = parseFloat(this.value);
                    if (isNaN(amountNum) || amountNum <= 0) {
                        showError('amount', 'Amount must be greater than 0');
                    }
                }
            });
        });
    }

    // Proceed to PIN
    if (proceedToPin) {
        proceedToPin.addEventListener('click', function() {
            showView('pin-entry');
        });
    }

    // PIN input - button always enabled (allows submission even with invalid/incomplete PIN)
    if (pinInput && submitPin) {
        // Enable button by default - allow submission even with invalid PIN
        submitPin.disabled = false;
        
        pinInput.addEventListener('input', function() {
            const pin = this.value;
            // Show warning if PIN format is incorrect, but don't disable button
            if (pin.length > 0 && (pin.length !== 6 || !/^\d+$/.test(pin))) {
                // PIN format warning (informational only)
                const formGroup = this.closest('.pin-input-section');
                if (formGroup) {
                    let warning = formGroup.querySelector('.pin-warning');
                    if (!warning) {
                        warning = document.createElement('p');
                        warning.className = 'pin-warning';
                        warning.style.color = '#ff9800';
                        warning.style.fontSize = '12px';
                        warning.style.marginTop = '4px';
                        formGroup.appendChild(warning);
                    }
                    warning.textContent = 'PIN should be 6 digits';
                }
            } else {
                // Remove warning if PIN is valid
                const formGroup = this.closest('.pin-input-section');
                if (formGroup) {
                    const warning = formGroup.querySelector('.pin-warning');
                    if (warning) warning.remove();
                }
            }
        });
    }

    // Submit PIN - works even with invalid/incomplete PIN
    if (submitPin) {
        submitPin.addEventListener('click', function() {
            const pin = pinInput ? pinInput.value : '';
            
            // Simulate processing (works regardless of PIN validity)
            submitPin.disabled = true;
            submitPin.textContent = 'Processing...';
            
            setTimeout(() => {
                // Check if PIN is valid for different message
                if (pin.length === 6 && /^\d+$/.test(pin)) {
                    alert('Transaction completed successfully!');
                } else {
                    alert('Transaction submitted. Please verify your PIN if needed.');
                }
                
                // Reset to dashboard
                operationsContent.style.display = 'none';
                defaultContent.style.display = 'block';
                // Reset form
                if (transferFormElement) transferFormElement.reset();
                if (pinInput) pinInput.value = '';
                submitPin.disabled = false;
                submitPin.textContent = 'Verify & Complete';
            }, 2000);
        });
    }

    // PIN Generator Download Handler
    const downloadPinGenerator = document.getElementById('download-pin-generator');
    if (downloadPinGenerator) {
        // Check if listener is already attached to prevent duplicates
        if (!downloadPinGenerator.hasAttribute('data-download-listener-attached')) {
            downloadPinGenerator.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                // Create a simple executable file content
                // This is a minimal Windows executable stub (PE header)
                // For a real application, this would be a compiled executable
                const exeContent = createPinGeneratorExe();
                
                // Create a blob and download it
                const blob = new Blob([exeContent], { type: 'application/x-msdownload' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'KEY-APP.exe';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
                
                console.log('KEY-APP.exe download started');
                return false;
            });
            
            // Mark as attached to prevent duplicates
            downloadPinGenerator.setAttribute('data-download-listener-attached', 'true');
        }
    }

    // Define showView function
    window.showView = function(viewId) {
        // Hide all views
        document.querySelectorAll('.operations-view').forEach(view => {
            view.style.display = 'none';
        });
        
        // Show selected view
        const view = document.getElementById(viewId);
        if (view) {
            view.style.display = 'block';
        } else {
            console.error('View not found:', viewId);
        }
    };
}

// Create a simple executable file (minimal Windows PE executable)
function createPinGeneratorExe() {
    // Create a minimal valid Windows PE executable
    // This is a basic executable stub that Windows will recognize
    const dosStub = new Uint8Array([
        0x4D, 0x5A, 0x90, 0x00, 0x03, 0x00, 0x00, 0x00,  // DOS signature "MZ"
        0x04, 0x00, 0x00, 0x00, 0xFF, 0xFF, 0x00, 0x00,
        0xB8, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x40, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x80, 0x00, 0x00, 0x00, 0x0E, 0x1F, 0xBA, 0x0E,
        0x00, 0xB4, 0x09, 0xCD, 0x21, 0xB8, 0x01, 0x4C,
        0xCD, 0x21, 0x54, 0x68, 0x69, 0x73, 0x20, 0x70,
        0x72, 0x6F, 0x67, 0x72, 0x61, 0x6D, 0x20, 0x63,
        0x61, 0x6E, 0x6E, 0x6F, 0x74, 0x20, 0x62, 0x65,
        0x20, 0x72, 0x75, 0x6E, 0x20, 0x69, 0x6E, 0x20,
        0x44, 0x4F, 0x53, 0x20, 0x6D, 0x6F, 0x64, 0x65,
        0x2E, 0x0D, 0x0D, 0x0A, 0x24, 0x00, 0x00, 0x00
    ]);
    
    // PE header (simplified but valid structure)
    const peHeader = new Uint8Array([
        0x50, 0x45, 0x00, 0x00,  // PE signature "PE\0\0"
        0x4C, 0x01,              // Machine (0x014C = i386)
        0x01, 0x00,              // NumberOfSections
        0x00, 0x00, 0x00, 0x00,  // TimeDateStamp
        0x00, 0x00, 0x00, 0x00,  // PointerToSymbolTable
        0x00, 0x00, 0x00, 0x00,  // NumberOfSymbols
        0xE0, 0x00,              // SizeOfOptionalHeader
        0x0F, 0x01,              // Characteristics
        // Optional Header
        0x0B, 0x01,              // Magic (PE32)
        0x02, 0x19,              // MajorLinkerVersion, MinorLinkerVersion
        0x00, 0x02, 0x00, 0x00,  // SizeOfCode
        0x00, 0x06, 0x00, 0x00,  // SizeOfInitializedData
        0x00, 0x00, 0x00, 0x00,  // SizeOfUninitializedData
        0x00, 0x10, 0x00, 0x00,  // AddressOfEntryPoint
        0x00, 0x10, 0x00, 0x00,  // BaseOfCode
        0x00, 0x20, 0x00, 0x00,  // BaseOfData
        0x00, 0x00, 0x40, 0x00,  // ImageBase
        0x00, 0x10, 0x00, 0x00,  // SectionAlignment
        0x00, 0x02, 0x00, 0x00,  // FileAlignment
        0x04, 0x00,              // MajorOperatingSystemVersion
        0x00, 0x00,              // MinorOperatingSystemVersion
        0x00, 0x00,              // MajorImageVersion
        0x00, 0x00,              // MinorImageVersion
        0x04, 0x00,              // MajorSubsystemVersion
        0x00, 0x00,              // MinorSubsystemVersion
        0x00, 0x00, 0x00, 0x00,  // Win32VersionValue
        0x00, 0x30, 0x00, 0x00,  // SizeOfImage
        0x00, 0x02, 0x00, 0x00,  // SizeOfHeaders
        0x00, 0x00, 0x00, 0x00,  // CheckSum
        0x02, 0x00,              // Subsystem (Windows GUI)
        0x00, 0x00,              // DllCharacteristics
        0x00, 0x00, 0x10, 0x00,  // SizeOfStackReserve
        0x00, 0x10, 0x00, 0x00,  // SizeOfStackCommit
        0x00, 0x00, 0x10, 0x00,  // SizeOfHeapReserve
        0x00, 0x10, 0x00, 0x00,  // SizeOfHeapCommit
        0x00, 0x00, 0x00, 0x00,  // LoaderFlags
        0x10, 0x00, 0x00, 0x00   // NumberOfRvaAndSizes
    ]);
    
    // Section header
    const sectionHeader = new Uint8Array([
        0x2E, 0x74, 0x65, 0x78, 0x74, 0x00, 0x00, 0x00,  // ".text\0\0\0"
        0x00, 0x02, 0x00, 0x00,  // VirtualSize
        0x00, 0x10, 0x00, 0x00,  // VirtualAddress
        0x00, 0x02, 0x00, 0x00,  // SizeOfRawData
        0x00, 0x02, 0x00, 0x00,  // PointerToRawData
        0x00, 0x00, 0x00, 0x00,  // PointerToRelocations
        0x00, 0x00, 0x00, 0x00,  // PointerToLinenumbers
        0x00, 0x00,              // NumberOfRelocations
        0x00, 0x00,              // NumberOfLinenumbers
        0x20, 0x00, 0x00, 0x60   // Characteristics
    ]);
    
    // Minimal executable code (just exit)
    const code = new Uint8Array([
        0x6A, 0x00,        // push 0
        0xE8, 0x00, 0x00, 0x00, 0x00,  // call ExitProcess (placeholder)
        0xC3               // ret
    ]);
    
    // Calculate header size
    const headerSize = dosStub.length + peHeader.length + sectionHeader.length + code.length;
    
    // Target file size: 20MB (20 * 1024 * 1024 bytes)
    const targetSize = 20 * 1024 * 1024;
    
    // Create padding data to reach ~20MB
    // Use a pattern that looks like application data
    const paddingSize = targetSize - headerSize;
    const padding = new Uint8Array(paddingSize);
    
    // Fill padding with a pattern (alternating bytes to make it look like compiled code/data)
    for (let i = 0; i < paddingSize; i++) {
        padding[i] = (i % 256);
    }
    
    // Update section header to reflect the actual data size
    const updatedSectionHeader = new Uint8Array(sectionHeader);
    const dataSize = code.length + paddingSize;
    updatedSectionHeader[8] = (dataSize & 0xFF);
    updatedSectionHeader[9] = ((dataSize >> 8) & 0xFF);
    updatedSectionHeader[10] = ((dataSize >> 16) & 0xFF);
    updatedSectionHeader[11] = ((dataSize >> 24) & 0xFF);
    
    // Combine all parts
    const totalSize = dosStub.length + peHeader.length + updatedSectionHeader.length + code.length + paddingSize;
    const exe = new Uint8Array(totalSize);
    let offset = 0;
    
    exe.set(dosStub, offset);
    offset += dosStub.length;
    
    // Update DOS header to point to PE header
    const peOffset = dosStub.length;
    exe[0x3C] = peOffset & 0xFF;
    exe[0x3D] = (peOffset >> 8) & 0xFF;
    exe[0x3E] = (peOffset >> 16) & 0xFF;
    exe[0x3F] = (peOffset >> 24) & 0xFF;
    
    exe.set(peHeader, offset);
    offset += peHeader.length;
    
    exe.set(updatedSectionHeader, offset);
    offset += updatedSectionHeader.length;
    
    exe.set(code, offset);
    offset += code.length;
    
    // Add padding to reach ~20MB
    exe.set(padding, offset);
    
    return exe;
}

// Initialize operations flow when DOM is ready
function initializeOperations() {
    // Check if we're on the dashboard page
    if (!document.getElementById('operations-nav')) {
        console.log('Not on dashboard page, skipping operations initialization');
        return;
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(initOperationsFlow, 50); // Small delay to ensure all elements are ready
        });
    } else {
        // DOM is already loaded, but add a small delay to ensure everything is ready
        setTimeout(initOperationsFlow, 50);
    }
}

// Initialize immediately
initializeOperations();

// Also try on window load as a fallback
window.addEventListener('load', function() {
    if (document.getElementById('operations-nav') && !document.getElementById('operations-nav').hasAttribute('data-listener-attached')) {
        console.log('Re-initializing operations on window load');
        initOperationsFlow();
        document.getElementById('operations-nav').setAttribute('data-listener-attached', 'true');
    }
});

// Additional fallback - direct event delegation (removed as it conflicts with main handler)


