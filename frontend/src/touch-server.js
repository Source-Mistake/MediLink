/*
 * MED-207: Local Storage Client Intake Draft Saver
 * Owner: Ricardo Lopez
 *
 * - Auto-saves every form field to localStorage as the user types/selects.
 * - Restores the saved values when the page loads (so a refresh keeps them).
 * - clearDraft() removes the saved draft (call it after a successful submit).
 *
 * Usage: load this file in index.html after validation.js:
 *   <script src="draft-saver.js"></script>
 */
(function () {
    'use strict';

    var STORAGE_KEY = 'medilinkIntakeDraft';
    var fieldIds = ['institution', 'age', 'gender', 'weight', 'height'];

    // localStorage can throw (private mode, blocked storage), so wrap access.
    function readDraft() {
        try {
            var raw = localStorage.getItem(STORAGE_KEY);
            return raw ? JSON.parse(raw) : {};
        } catch (err) {
            return {};
        }
    }

    function writeDraft(draft) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
        } catch (err) {
            // Storage unavailable: fail silently, the form still works.
        }
    }

    function saveDraft() {
        var draft = {};
        fieldIds.forEach(function (name) {
            draft[name] = document.getElementById(name).value;
        });
        writeDraft(draft);
    }

    function restoreDraft() {
        var draft = readDraft();
        fieldIds.forEach(function (name) {
            if (typeof draft[name] === 'string') {
                document.getElementById(name).value = draft[name];
            }
        });
    }

    function clearDraft() {
        try {
            localStorage.removeItem(STORAGE_KEY);
        } catch (err) {
            // ignore
        }
    }

    // Restore on page load, then save on every change.
    restoreDraft();

    fieldIds.forEach(function (name) {
        var el = document.getElementById(name);
        el.addEventListener('input', saveDraft);
        el.addEventListener('change', saveDraft);
    });

    window.clearDraft = clearDraft;
})();