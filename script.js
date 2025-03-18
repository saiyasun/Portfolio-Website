// *** About section ***
    // ~Variables~
    let slideIndex = 0;
    let slideInterval = 5000; // Adjust to 5000ms (5s), 7000ms (7s), etc.

    const slides = document.querySelectorAll(".slideshow-container img");

    // ~Functions~
    function showSlides() {
    slides.forEach(slide => slide.classList.remove("active")); // Hide all images
    slideIndex = (slideIndex + 1) % slides.length; // Loop back to the first image
    slides[slideIndex].classList.add("active"); // Show active image
}

    function plusSlides(n) {
        slideIndex = (slideIndex + n + slides.length) % slides.length; // Handle manual navigation
        slides.forEach(slide => slide.classList.remove("active"));
        slides[slideIndex].classList.add("active");
    }

    // Start slideshow
    slides[slideIndex].classList.add("active");
    setInterval(showSlides, slideInterval);

    // ~Events~

// <---------------->

// *** Contact section ***
    // ~Variables~
        // --Email--
        let emailForm = document.getElementById('email-form');
        let emailIcon = document.querySelector('#email a');
        let formClose = document.getElementById('email-close')
        let submitEmail = document.getElementById('email-submit')
        let emailMe = document.querySelector('#email-me h2')
        let hrLine = document.getElementById('separator');
        let contactMe = document.getElementById('all-contact')

    // ~Functions~
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
                    // Send a POST request to the Node.js backend
                    let response = await fetch('https://email-form-13a77e0aa401.herokuapp.com/send-email', {
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

    // ~Events~
        // --Email--
        emailIcon.onclick = showEmailForm;
        formClose.onclick = hideEmailForm;
        submitEmail.onclick = emailSubmission;
        formClose.addEventListener("click", function(event) {
            event.preventDefault();  // Prevents the button from acting like a form submission
            hideEmailForm();
        });
// <---------------->

// *** Projects section ***
    // ~Variables~
        // Skills, Education, Project and All sections   
        let skillsSection = document.getElementById('skills-section');
        let educationSection = document.getElementById('education-section');
        let allSection = document.getElementById('all-experience-section');
        let experienceSection = document.getElementById('experience-section');
        let projectSection = document.getElementById('project-section');

        let projectsNavBar = document.getElementById('project-nav');
        // ----
        let projectLink = document.getElementById('projects-link');
        let experienceLink = document.getElementById('experience-link');
        let allLink = document.getElementById('all-link');
        let skillsLink = document.getElementById('skills-link');
        let educationLink = document.getElementById('education-link');

        // Mobile nav bar
        let mobileSandwichMenu = document.getElementById('menu-toggle');

        let mobileProjectLink = document.getElementById('mobile-projects-link');
        let mobileExperienceLink = document.getElementById('mobile-experience-link');
        let mobileAllLink = document.getElementById('mobile-all-link');
        let mobileSkillsLink = document.getElementById('mobile-skills-link');
        let mobileEducationLink = document.getElementById('mobile-education-link');
        let allMobileLinks = document.getElementById('mobile-nav-bar');

    // ~Functions~
        // Skills, Education, Project and All sections 
        let showProjectsSection = function(event) {
            event.preventDefault();  // Prevent the default click behavior (e.g., following the link)
        
            allSection.style.display = 'none';
            educationSection.style.display = 'none';
            experienceSection.style.display = 'none';
            skillsSection.style.display = 'none';
        
            projectSection.style.display = 'block';
        };
        
        let showExperienceSection = function(event) {
            event.preventDefault();  // Prevent the default click behavior
        
            allSection.style.display = 'none';
            educationSection.style.display = 'none';
            projectSection.style.display = 'none';
            skillsSection.style.display = 'none';
        
            experienceSection.style.display = 'block';
        };
        
        let showSkillsSection = function(event) {
            event.preventDefault();  // Prevent the default click behavior
        
            allSection.style.display = 'none';
            educationSection.style.display = 'none';
            experienceSection.style.display = 'none';
            projectSection.style.display = 'none';
            
            skillsSection.style.display = 'block';
        };
        
        let showEducationSection = function(event) {
            event.preventDefault();  // Prevent the default click behavior
        
            allSection.style.display = 'none';
            projectSection.style.display = 'none';
            experienceSection.style.display = 'none';
            skillsSection.style.display = 'none';
            
            educationSection.style.display = 'block';
        };
        
        let showAllSections = function(event) {
            event.preventDefault();  // Prevent the default click behavior
        
            projectSection.style.display = 'none';
            educationSection.style.display = 'none';
            experienceSection.style.display = 'none';
            skillsSection.style.display = 'none';
            
            allSection.style.display = 'block';
        };

        // Mobile nav bar
        let showMobileNavBar = function() {
            allMobileLinks.style.display = 'block';
            mobileSandwichMenu.style.display = 'none';
        }

        let hideMobileNavBar = function() {
            allMobileLinks.style.display = 'none';
            mobileSandwichMenu.style.display = 'block';
        }

    // ~Events~
        // Skills, Education, Project and All sections 
        skillsLink.addEventListener('click', showSkillsSection);
        experienceLink.addEventListener('click', showExperienceSection);
        allLink.addEventListener('click', showAllSections);
        educationLink.addEventListener('click', showEducationSection);
        projectLink.addEventListener('click', showProjectsSection);

        // Mobile nav bar
// <---------------->

// *** Homepage section ***
    // ~Variables~

    // ~Functions~

    // ~Events~

// <---------------->





