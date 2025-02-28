// Variables
    // Contact page
        // --Email--
        let emailForm = document.getElementById('email-form');
        let emailIcon = document.querySelector('#email a');
        let formClose = document.getElementById('email-close')
        let submitEmail = document.getElementById('email-submit')
        let emailMe = document.querySelector('#email-me h2')
        let hrLine = document.getElementById('separator');
        let contactMe = document.getElementById('all-contact')
        // ----------------

// Functions
    // Contact page
        // --Email--
        let showEmailForm = function() {
            if (window.matchMedia("(max-width: 768px)").matches) {
                hrLine.style.visibility = 'hidden';
                contactMe.style.visibility = 'hidden';
                emailIcon.style.visibility = 'hidden';
                emailMe.style.visibility = 'hidden';
                emailForm.style.visibility = 'visible';
                emailForm.style.zIndex = '1000'; // Bring to the front
            } else {
                emailIcon.style.visibility = 'hidden';
                emailMe.style.visibility = 'hidden';
                emailForm.style.visibility = 'visible';
            }
        }

        let hideEmailForm = function() {
            emailIcon.style.visibility = 'visible';
            emailMe.style.visibility = 'visible';
            emailForm.style.visibility = 'hidden';

            if (window.matchMedia("(max-width: 768px)").matches) {
                hrLine.style.visibility = 'visible';  // Use display instead of visibility
                contactMe.style.visibility = 'visible';  // Use display instead of visibility
                emailIcon.style.visibility = 'visible';
                emailMe.style.visibility = 'visible';
                emailForm.style.visibility = 'hidden';
                emailForm.style.zIndex = '-1'; 
            } else {
                emailIcon.style.visibility = 'visible';
                emailMe.style.visibility = 'visible';
                emailForm.style.visibility = 'hidden';
            }
        }

        // Validate email format using regex
        const validateEmail = (email) => {
            const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            return emailPattern.test(email);
        }

        let emailSubmission = async function(event) {
            event.preventDefault();
        
            const senderName = document.getElementById("email-name").value;
            const senderEmail = document.getElementById("email-email").value;
            const senderSubject = document.getElementById("email-subject").value;
            const senderMessage = document.getElementById("email-message").value;
        
            if (!senderName || !senderEmail || !senderSubject || !senderMessage) {
                alert("Please fill in all fields.");
                return;
            }
        
            if (!validateEmail(senderEmail)) {
                alert("Please enter a valid email address.");
                return;
            }
        
            const formData = {
                name: senderName,
                email: senderEmail,
                subject: senderSubject,
                message: senderMessage
            };
        
            // Disable the submit button and show a loading message
            submitEmail.disabled = true;
            submitEmail.innerText = "Sending...";
        
            try {
                // Send a POST request to the Node.js backends
                let response = await fetch('https://email-form.herokuapp.com/send-email', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });
        
                if (response.ok) {
                    alert('Your message has been sent successfully!');
                    emailForm.reset(); // Reset the form
                    hideEmailForm(); // Hide the form after successful submission
                } else {
                    alert('There was an error sending your message.');
                }
            } catch (error) {
                alert('Error: ' + error.message);
            }
        
            // Re-enable the submit button after the process completes
            submitEmail.disabled = false;
            submitEmail.innerText = "Submit";
        }
        // ----------------

// Events
    // Contact page
        // --Email--
        emailIcon.onclick = showEmailForm;
        formClose.onclick = hideEmailForm;
        submitEmail.onclick = emailSubmission;
        // ----------------