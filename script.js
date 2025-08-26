document.addEventListener("DOMContentLoaded", function() {
    // --- Animation on Scroll Logic ---
    // Select all elements with the 'animate-on-scroll' class
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    // Define the options for the Intersection Observer
    const observerOptions = {
        root: null, // The viewport
        rootMargin: '0px',
        threshold: 0.1 // Trigger when 10% of the element is visible
    };

    // Create a new Intersection Observer
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;

                // Add the 'is-visible' class to trigger the CSS transition
                element.classList.add('is-visible');

                // If the element is the video container, start the video
                if (element.classList.contains('video-container')) {
                    const iframe = element.querySelector('iframe');
                    const videoId = element.dataset.videoId;
                    
                    if (iframe && videoId) {
                        // Change the iframe source to include autoplay
                        iframe.src = `https://www.youtube.com/embed/${videoId}?rel=0&autoplay=1`;
                    }
                }
                
                // Stop observing the element once it has been animated/triggered
                observer.unobserve(element);
            }
        });
    }, observerOptions);

    // Tell the observer to watch each animated element
    animatedElements.forEach(element => {
        observer.observe(element);
    });

    // --- Mobile Menu Toggle Logic ---
    const hamburger = document.querySelector('.hamburger-menu');
    const navContainer = document.querySelector('.nav-links-container');
    const navLinks = document.querySelectorAll('.nav-links a');

    hamburger.addEventListener('click', () => {
        navContainer.classList.toggle('is-open');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navContainer.classList.remove('is-open');
        });
    });

    // --- Form Submission Logic ---
    // Select the form and the status message element
    const form = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    // IMPORTANT: REPLACE THIS URL with your deployed Google Apps Script URL.
    const scriptURL = 'https://script.google.com/macros/s/AKfycby59GBtpm1FmUMAP2Y2F5zFfo5b83IMPMDCL9X5_AwSqnlbaZh2Pty493NS0czep7A/exec';

    form.addEventListener('submit', async e => {
        e.preventDefault(); // Prevents the default form submission behavior

        // Show a loading message and clear previous classes
        formStatus.textContent = 'Sending your message...';
        formStatus.className = '';
        
        try {
            const formData = new FormData(form);
            const response = await fetch(scriptURL, {
                method: 'POST',
                body: formData
            });

            // Check if the response was successful
            if (response.ok) {
                // Show success message and clear the form inputs
                formStatus.textContent = 'Thank you, we\'ll get in touch with you shortly!';
                formStatus.className = 'success';
                form.reset();
            } else {
                // If the response is not ok, throw an error
                throw new Error(`Server returned status code: ${response.status}`);
            }
        } catch (error) {
            // Show an error message if the fetch request fails
            console.error('Error!', error.message);
            formStatus.textContent = 'Something went wrong, please try again.';
            formStatus.className = 'error';
        }
    });
});
    