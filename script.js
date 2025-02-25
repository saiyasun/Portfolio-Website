// Variables
    // Contact page
        // --Email--
        let emailForm = document.getElementById('email-form');
        let emailIcon = document.querySelector('#email a');
        let formClose = document.getElementById('email-close')
        let submitEmail = document.getElementById('email-submit')
        let emailMe = document.querySelector('#email-me h2')
        // ----------------

// Functions
    // Contact page
        // --Email--
        let showEmailForm = function() {
            emailIcon.style.visibility = 'hidden';
            emailMe.style.visibility = 'hidden';
            emailForm.style.visibility = 'visible';
        }

        let hideEmailForm = function() {
            emailIcon.style.visibility = 'visible';
            emailMe.style.visibility = 'visible';
            emailForm.style.visibility = 'hidden';
        }
        // ----------------

// Events
    // Contact page
        // --Email--
        emailIcon.onclick = showEmailForm;
        formClose.onclick = hideEmailForm;
        // ----------------