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
        let allMobileLinks = document.getElementById('mobile-nav-links');
        let mobileNavLinks = document.querySelectorAll('#mobile-nav-links a'); // Get all links inside mobile nav

        // Project section tools 
        const projectToolsUl = document.querySelector(".project-tools");
        const projectContainer = document.querySelector(".projects");

    // ~Functions~
        // Skills, Education, Project and All sections 
        let showProjectsSection = function(event) {
        event.preventDefault();
        hideAllSections();
        projectSection.style.visibility = 'visible';
        projectSection.style.opacity = '1';
        projectSection.style.position = 'relative';  // Keeps the section in place visually
        projectSection.style.zIndex = '1'; // Makes sure it's above hidden sections
    };

    let showExperienceSection = function(event) {
        event.preventDefault();
        hideAllSections();
        experienceSection.style.visibility = 'visible';
        experienceSection.style.opacity = '1';
        experienceSection.style.position = 'relative';
        experienceSection.style.zIndex = '1';
    };

    let showSkillsSection = function(event) {
        event.preventDefault();
        hideAllSections();
        skillsSection.style.visibility = 'visible';
        skillsSection.style.opacity = '1';
        skillsSection.style.position = 'relative';
        skillsSection.style.zIndex = '1';
    };

    let showEducationSection = function(event) {
        event.preventDefault();
        hideAllSections();
        educationSection.style.visibility = 'visible';
        educationSection.style.opacity = '1';
        educationSection.style.position = 'relative';
        educationSection.style.zIndex = '1';
    };

    let showAllSections = function(event) {
        event.preventDefault();
        hideAllSections();
        allSection.style.visibility = 'visible';
        allSection.style.opacity = '1';
        allSection.style.position = 'relative';
        allSection.style.zIndex = '1';
    };

    let hideAllSections = function() {
        let sections = [skillsSection, educationSection, experienceSection, projectSection];
        sections.forEach(sec => {
            sec.style.visibility = 'hidden';
            sec.style.opacity = '0';
            sec.style.position = 'absolute'; // Removes section from flow but keeps space
            sec.style.zIndex = '-1'; // Keeps it behind other sections
        });
    };


        // Mobile nav bar
        let toggleMobileNavBar = function(event) {
            event.preventDefault(); // Prevent click from bubbling to the document
            if (allMobileLinks.style.visibility === 'hidden' || allMobileLinks.style.visibility === '') {
                allMobileLinks.style.visibility = 'visible';
                allMobileLinks.style.opacity = '1'; // Smooth transition if needed
                allMobileLinks.style.zIndex = '1000';
            } else {
                allMobileLinks.style.visibility = 'hidden';
                allMobileLinks.style.opacity = '0';
                allMobileLinks.style.zIndex = '-1';
            }
        };

        let hideMobileNavBar = function() {
            allMobileLinks.style.visibility = 'hidden';
            allMobileLinks.style.opacity = '0';
        };

    // ~Events~
        // Skills, Education, Project and All sections 
        skillsLink.addEventListener('click', showSkillsSection);
        experienceLink.addEventListener('click', showExperienceSection);
        educationLink.addEventListener('click', showEducationSection);
        projectLink.addEventListener('click', showProjectsSection);

        // Mobile nav bar
        mobileSandwichMenu.addEventListener('click', toggleMobileNavBar); // Event listener for the menu button
        document.addEventListener('click', function(event) {
            let isClickInsideNav = allMobileLinks.contains(event.target) || mobileSandwichMenu.contains(event.target);
            if (!isClickInsideNav) {
                hideMobileNavBar();
            }
        }); // Close menu when clicking outside
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', hideMobileNavBar);
        }); // Close menu when clicking outside

        mobileProjectLink.addEventListener('click', showProjectsSection);
        mobileExperienceLink.addEventListener('click', showExperienceSection);
        mobileSkillsLink.addEventListener('click', showSkillsSection);
        mobileEducationLink.addEventListener('click', showEducationSection);

        // Project section tools
        document.addEventListener("DOMContentLoaded", function () {
            if (projectToolsUl.children.length >= 6) {
                projectToolsUl.style.justifyContent = "flex-start";
            }
        });

        document.addEventListener("DOMContentLoaded", function () {
            if (projectContainer.children.length >= 3) {
                projectContainer.style.justifyContent = "flex-start";
            }
        });

// <---------------->

// *** Homepage section ***
    // ~Variables~

    // ~Functions~

    // ~Events~

// <---------------->





