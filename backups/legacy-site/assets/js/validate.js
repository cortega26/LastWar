/**
 * Simple form validation utility
 * Validates required fields and number ranges, shows inline errors.
 */
(function() {
    'use strict';

    function showError(field, message) {
        var errorEl = field.nextElementSibling;
        if (!errorEl || !errorEl.classList.contains('error-message')) {
            errorEl = document.createElement('div');
            errorEl.className = 'error-message';
            errorEl.setAttribute('aria-live', 'polite');
            field.insertAdjacentElement('afterend', errorEl);
        }
        errorEl.textContent = message;
    }

    function validateField(field) {
        var value = field.value.trim();
        var valid = true;
        var message = '';

        if (field.hasAttribute('required') && !value) {
            message = 'This field is required.';
            valid = false;
        } else if (field.type === 'number') {
            var num = Number(value);
            var min = field.getAttribute('min');
            var max = field.getAttribute('max');
            if (value === '' || isNaN(num)) {
                message = 'Please enter a number.';
                valid = false;
            } else {
                if (min !== null && num < Number(min)) {
                    message = 'Value must be ≥ ' + min + '.';
                    valid = false;
                }
                if (max !== null && num > Number(max)) {
                    message = 'Value must be ≤ ' + max + '.';
                    valid = false;
                }
            }
        }

        showError(field, message);
        return valid;
    }

    window.attachValidation = function(form) {
        if (!form) return;
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            var valid = true;
            var fields = form.querySelectorAll('[data-validate]');
            fields.forEach(function(field) {
                if (!validateField(field)) {
                    valid = false;
                }
            });
            if (valid) {
                form.dispatchEvent(new CustomEvent('formvalid'));
            }
        });
    };
})();
