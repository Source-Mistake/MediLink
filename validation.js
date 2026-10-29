/*
 * MED-203: Client-Side Form Validation Script
 * Owner: Ricardo Lopez
 *
 * Rules (from acceptance criteria):
 *  - Institution must be selected
 *  - Age must be a number greater than 0
 *  - Gender must be selected
 *  - Weight must be a number greater than 0
 *  - Height must be a number greater than 0
 *
 * Usage: load this file in index.html before the main script:
 *   <script src="validation.js"></script>
 * then call validateForm() inside the submit handler. It returns true only
 * if every field is valid, and shows/hides the inline error messages.
 */
(function () {
    'use strict';

    var fieldIds = ['institution', 'age', 'gender', 'weight', 'height'];

    function getField(name) {
        return document.getElementById(name);
    }

    function getErrorBox(name) {
        return document.getElementById(name + 'Error');
    }

    function showFieldError(name) {
        getField(name).classList.add('invalid');
        getErrorBox(name).style.display = 'block';
    }

    function hideFieldError(name) {
        getField(name).classList.remove('invalid');
        getErrorBox(name).style.display = 'none';
    }

    // A numeric field is valid only if it holds a real number greater than 0.
    function isPositiveNumber(rawValue) {
        if (rawValue === '') return false;
        var value = Number(rawValue);
        return Number.isFinite(value) && value > 0;
    }

    // A dropdown is valid only if the user picked a non-empty option.
    function isSelected(rawValue) {
        return rawValue !== '';
    }

    var rules = {
        institution: isSelected,
        age: isPositiveNumber,
        gender: isSelected,
        weight: isPositiveNumber,
        height: isPositiveNumber
    };

    // Validate a single field and update its error message.
    function validateField(name) {
        var ok = rules[name](getField(name).value);
        if (ok) {
            hideFieldError(name);
        } else {
            showFieldError(name);
        }
        return ok;
    }

    // Validate the whole form. Returns true only if all fields pass.
    function validateForm() {
        var allValid = true;
        fieldIds.forEach(function (name) {
            if (!validateField(name)) {
                allValid = false;
            }
        });
        return allValid;
    }

    // Live feedback: re-check a field as soon as the user fixes it,
    // but only once it has already been flagged as invalid.
    fieldIds.forEach(function (name) {
        var eventName = getField(name).tagName === 'SELECT' ? 'change' : 'input';
        getField(name).addEventListener(eventName, function () {
            if (getField(name).classList.contains('invalid')) {
                validateField(name);
            }
        });
    });

    window.validateForm = validateForm;
})();
