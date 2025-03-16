// JavaScript for auto-sliding, manual navigation, and swipe functionality
const slides = document.getElementById('slides');
let startX = 0;
let currentIndex = 0;
const totalSlides = 4; // Total number of slides


// Function to go to a specific slide
function goToSlide(index) {
    if (index < 0) index = totalSlides - 1; // Loop to last slide if index is negative
    if (index >= totalSlides) index = 0; // Loop to first slide if index exceeds total slides
    const slideWidth = slides.clientWidth;
    slides.style.transform = `translateX(-${index * slideWidth}px)`;
    currentIndex = index;
}


// Auto-slide every 4 seconds
setInterval(() => {
    goToSlide(currentIndex + 1);
}, 5000);

// Touch event handlers for swipe functionality
slides.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
});

slides.addEventListener('touchmove', (e) => {
    e.preventDefault(); // Prevent default scrolling behavior
});

slides.addEventListener('touchend', (e) => {
    const endX = e.changedTouches[0].clientX;
    const diffX = startX - endX;

    if (diffX > 50 && currentIndex < totalSlides - 1) {
        // Swipe left: go to next slide
        goToSlide(currentIndex + 1);
    } else if (diffX < -50 && currentIndex > 0) {
        // Swipe right: go to previous slide
        goToSlide(currentIndex - 1);
    }
});


// animate on scroll

AOS.init({
  duration: 2000,
});



//Form Sending
mailjs.init('d7LZg9ro8mc9v6RvL'); // Replace with your Public Key

document.getElementById('contactForm').addEventListener('submit', function (event) {
  event.preventDefault();

  const formData = {
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    message: document.getElementById('message').value,
  };

  if (!formData.name || !formData.email || !formData.message) {
    alert('Please fill out all fields.');
    return;
  }

  emailjs.send('service_m4tzvuk', 'template_o98aznf', formData) // Replace with your Service ID and Template ID
    .then(() => {
      alert('Message sent successfully!');
      document.getElementById('contactForm').reset();
    })
    .catch((error) => {
      console.error('Error:', error);
      alert('Failed to send message. Please try again.');
    });
});