// Live Clock Gadget
function updateClock() {
    const clockElement = document.getElementById('clock');
    const now = new Date();
    const options = { 
        weekday: 'long', year: 'numeric', month: 'long', 
        day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' 
    };
    clockElement.textContent = now.toLocaleDateString('en-US', options);
}

// Update clock every second
setInterval(updateClock, 1000);
updateClock(); // Initial call

// Theme Toggle
const toggleThemeButton = document.getElementById('toggle-theme');
toggleThemeButton.addEventListener('click', (e) => {
    e.preventDefault();
    document.body.classList.toggle('dark-theme');
});

// Smooth Scrolling
const links = document.querySelectorAll('nav ul li a[href^="#"]');

for (const link of links) {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetID = this.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetID);
        if (targetSection) {
            window.scrollTo({
                top: targetSection.offsetTop - 60, // Adjust for header height
                behavior: 'smooth'
            });
        }
    });
}

// Contact Form Submission (Basic Example)
const contactForm = document.getElementById('contact-form');
contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    // Simple form validation
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    if(name === '' || email === '' || message === '') {
        alert('Please fill in all fields.');
        return;
    }

    // Here you can add code to send the form data to your server
    // For now, we'll just display a success message
    alert('Thank you for your message!');
    contactForm.reset();
});
