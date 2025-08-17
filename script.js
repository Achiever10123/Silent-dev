// Initialize AOS
AOS.init({
  duration: 1000,
  once: true,
});

// Toaster Notification Function
function showToaster(message, type = "info") {
  const toaster = document.getElementById("toaster");
  toaster.textContent = message;
  toaster.className = "toaster show"; // Reset classes and show
  if (type === "success") {
    toaster.classList.add("success");
  } else if (type === "error") {
    toaster.classList.add("error");
  }

  setTimeout(() => {
    toaster.classList.remove("show");
  }, 3000); // Hide after 3 seconds
}

// TypeWriter Class
class TypeWriter {
  constructor(element, words, options = {}) {
    this.element = element;
    this.words = words;
    this.options = {
      typingSpeed: 100,
      deleteSpeed: 60,
      pauseDuration: 1200,
      ...options,
    };
    this.index = 0;
    this.isDeleting = false;
    this.text = "";
    this.animate();
  }

  animate() {
    const currentWord = this.words[this.index % this.words.length];

    if (this.isDeleting) {
      this.text = currentWord.substring(0, this.text.length - 1);
    } else {
      this.text = currentWord.substring(0, this.text.length + 1);
    }

    this.element.textContent = this.text;

    let typeSpeed = this.options.typingSpeed;

    if (this.isDeleting) {
      typeSpeed = this.options.deleteSpeed;
    }

    if (!this.isDeleting && this.text === currentWord) {
      typeSpeed = this.options.pauseDuration;
      this.isDeleting = true;
    } else if (this.isDeleting && this.text === "") {
      this.isDeleting = false;
      this.index++;
      typeSpeed = this.options.typingSpeed / 2;
    }

    setTimeout(() => this.animate(), typeSpeed);
  }
}

// DOM Content Loaded
document.addEventListener("DOMContentLoaded", () => {
  // Navbar active state logic
  const navItems = document.querySelectorAll(".navbar .nav-item");
  const sections = document.querySelectorAll("main section");

  const activateNavItem = (id) => {
    navItems.forEach((item) => {
      item.classList.remove("active");
      const anchor = item.querySelector("a");
      if (anchor && anchor.getAttribute("href") === `#${id}`) {
        item.classList.add("active");
      }
    });
  };

  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.7,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        activateNavItem(entry.target.id);
      }
    });
  }, observerOptions);

  sections.forEach((section) => {
    observer.observe(section);
  });

  navItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = item
        .querySelector("a")
        .getAttribute("href")
        .substring(1);
      const targetSection = document.getElementById(targetId);

      if (targetSection) {
        targetSection.scrollIntoView({ behavior: "smooth" });
        activateNavItem(targetId);
      }
    });
  });

  // Initialize TypeWriter
  const words = [
    "Abdullateef Abdulbasit Ayoola",
    "A Front-end Web Developer",
    "A Full Stack Developer",
    "A Graphic Designer",
    "A Problem Solver",
  ];
  const typingElement = document.getElementById("typing-text");
  if (typingElement) {
    new TypeWriter(typingElement, words, {
      typingSpeed: 100,
      deleteSpeed: 60,
      pauseDuration: 1500,
    });
  }

  // Testimonial Carousel
  const slidesContainer = document.getElementById("slides");
  const navButtonsContainer =
    document.getElementById("navigation-buttons");
  let currentSlideIndex = 0;
  const totalSlides = slidesContainer.children.length;
  let autoSlideInterval;
  let touchStartX = 0;

  const updateNavButtons = () => {
    Array.from(navButtonsContainer.children).forEach((button, index) => {
      if (index === currentSlideIndex) {
        button.classList.add("active");
      } else {
        button.classList.remove("active");
      }
    });
  };

  const goToSlide = (index) => {
    if (index < 0) {
      index = totalSlides - 1;
    } else if (index >= totalSlides) {
      index = 0;
    }
    const slideWidth = slidesContainer.clientWidth;
    slidesContainer.style.transform = `translateX(-${
      index * slideWidth
    }px)`;
    currentSlideIndex = index;
    updateNavButtons();
  };

  const startAutoSlide = () => {
    clearInterval(autoSlideInterval);
    autoSlideInterval = setInterval(() => {
      goToSlide(currentSlideIndex + 1);
    }, 5000);
  };

  navButtonsContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("nav-btn")) {
      const slideIndex = parseInt(e.target.dataset.slide);
      goToSlide(slideIndex);
      startAutoSlide();
    }
  });

  slidesContainer.addEventListener(
    "touchstart",
    (e) => {
      touchStartX = e.touches[0].clientX;
      clearInterval(autoSlideInterval);
    },
    { passive: true }
  ); // passive: true for better scroll performance

  slidesContainer.addEventListener(
    "touchmove",
    (e) => {
      // Only prevent default if it's a significant horizontal swipe
      if (Math.abs(e.touches[0].clientX - touchStartX) > 10) {
        e.preventDefault();
      }
    },
    { passive: false }
  );

  slidesContainer.addEventListener("touchend", (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diffX = touchStartX - touchEndX;

    if (diffX > 50) {
      goToSlide(currentSlideIndex + 1);
    } else if (diffX < -50) {
      goToSlide(currentSlideIndex - 1);
    }
    startAutoSlide();
  });

  // Initial load for carousel
  goToSlide(0);
  startAutoSlide();

  // Adjust slide position on window resize
  window.addEventListener("resize", () => {
    goToSlide(currentSlideIndex);
  });

  // FormSubmit AJAX handling
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", async function (event) {
      event.preventDefault(); // Prevent default form submission

      const formData = new FormData(this);
      const submitButton = this.querySelector(".sub");
      const originalButtonText = submitButton.value;

      submitButton.value = "Sending...";
      submitButton.disabled = true;

      try {
        const response = await fetch(this.action, {
          method: "POST",
          body: formData,
          headers: {
            Accept: "application/json", // Important for FormSubmit AJAX
          },
        });

        if (response.ok) {
          showToaster("Message sent successfully!", "success");
          this.reset(); // Clear the form
        } else {
          const data = await response.json();
          if (data.message) {
            showToaster("Error: " + data.message, "error");
          } else {
            showToaster(
              "Failed to send message. Please try again.",
              "error"
            );
          }
        }
      } catch (error) {
        console.error("Network error:", error);
        showToaster(
          "Network error. Please check your connection.",
          "error"
        );
      } finally {
        submitButton.value = originalButtonText;
        submitButton.disabled = false;
      }
    });
  }

  // Light/Dark Mode Toggle
  const themeToggle = document.getElementById("themeToggle");
  const themeIcon = document.getElementById("themeIcon");
  const body = document.body;

  // Load saved theme preference
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    body.classList.add(savedTheme);
    if (savedTheme === "light-mode") {
      themeIcon.classList.remove("fa-moon");
      themeIcon.classList.add("fa-sun");
    } else {
      themeIcon.classList.remove("fa-sun");
      themeIcon.classList.add("fa-moon");
    }
  } else {
    // Default to dark mode if no preference is saved
    body.classList.add("dark-mode");
    localStorage.setItem("theme", "dark-mode");
  }

  themeToggle.addEventListener("click", () => {
    if (body.classList.contains("light-mode")) {
      body.classList.remove("light-mode");
      body.classList.add("dark-mode");
      themeIcon.classList.remove("fa-sun");
      themeIcon.classList.add("fa-moon");
      localStorage.setItem("theme", "dark-mode");
    } else {
      body.classList.remove("dark-mode");
      body.classList.add("light-mode");
      themeIcon.classList.remove("fa-moon");
      themeIcon.classList.add("fa-sun");
      localStorage.setItem("theme", "light-mode");
    }
  });

  // Progress Bars Animation on Scroll
  const animateProgressBar = (progressBar) => {
    const progress = parseInt(progressBar.dataset.progress, 10);
    if (
      progressBar.style.width === "0%" ||
      progressBar.style.width === ""
    ) {
      // Animate only if not already animated
      progressBar.style.width = `${progress}%`;
    }
  };

  const skillSection = document.getElementById("exp");
  const progressBars = document.querySelectorAll(".progress-bar");
  let skillSectionObserved = false;

  const progressBarObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !skillSectionObserved) {
          progressBars.forEach((bar) => animateProgressBar(bar));
          skillSectionObserved = true; // Ensure animation runs only once
          observer.unobserve(entry.target); // Stop observing once animated
        }
      });
    },
    {
      threshold: 0.5, // Trigger when 50% of the section is visible
    }
  );

  if (skillSection) {
    progressBarObserver.observe(skillSection);
  }

  // Dynamic Skill Clouds/Tags
  const additionalSkills = [
    "Git",
    "GitHub",
    "Responsive Design",
    "Firebase",
    "REST APIs",
    "Problem Solving",
    "Teamwork",
    "Agile Methodologies",
    "UI/UX Principles",
    "Frontend Frameworks",
    "Backend Development",
    "Next.js",
    "Express.js",
    "Vercel",
    "Heroku",
    "Web Hosting",
    "Database Management",
    "Debugging",
    "Version Control",
    "Graphic Design",
  ];

  const skillCloudContainer = document.querySelector(
    ".skill-cloud-container"
  );
  if (skillCloudContainer) {
    additionalSkills.forEach((skill) => {
      const span = document.createElement("span");
      span.classList.add("skill-tag");
      span.textContent = skill;
      skillCloudContainer.appendChild(span);
    });
  }

  // Simulate Project Data Fetch with Loading Animation
  const projectsData = [
    {
      imgSrc: "./tda.png",
      fallbackImgSrc: "./tda.png",
      altText: "Screenshot of a To-Do App project",
      title: "To-Do App",
      githubLink: "https://github.com/Achiever10123/To-do.-app",
      demoLink: "https://todo-app-phi-seven-58.vercel.app",
    },
    {
      imgSrc: "./LI.png",
      fallbackImgSrc: "./LI.png",
      altText: "Screenshot of a Login Form project",
      title: "Login Form",
      githubLink: "https://github.com/Achiever10123/Login-form",
      demoLink: "https://login-form-beta-seven.vercel.app",
    },
    {
      imgSrc: "./SU.png",
      fallbackImgSrc: "./SU.png",
      altText: "Screenshot of a Sign-up Form project",
      title: "Sign-up Form",
      githubLink: "https://github.com/Achiever10123/Signup-form",
      demoLink: "https://signup-form-pink.vercel.app",
    },
    {
      imgSrc: "./tts.png",
      fallbackImgSrc: "./tts.png",
      altText: "Screenshot of a Text-to-Speech Converter project",
      title: "Text To Speech",
      githubLink: "https://github.com/Achiever10123/text_to_speech",
      demoLink: "https://texttospeech-eosin.vercel.app",
    },
    // Add more projects here
  ];

  const projectsContainer = document.getElementById("projectsContainer");

  const loadProjects = () => {
    // Clear skeleton loaders
    projectsContainer.innerHTML = "";

    projectsData.forEach((project, index) => {
      const projectDiv = document.createElement("div");
      projectDiv.classList.add("us");
      projectDiv.setAttribute("data-aos", "fade-up"); // Add AOS animation to each project

      // Add a delay to AOS animation for staggered effect
      projectDiv.setAttribute("data-aos-delay", (index * 100).toString());

      projectDiv.innerHTML = `
      <div class="tt">
        <picture>
          <source srcset="${project.imgSrc}" type="image/webp">
          <img class="tda" src="${project.fallbackImgSrc}" alt="${project.altText}" loading="lazy"/>
        </picture>
        <span>${project.title}</span>
        <div class="ton">
          <a target="_blank" class="git" href="${project.githubLink}">Github</a>
          <a target="_blank" class="Demo" href="${project.demoLink}">Demo</a>
        </div>
      </div>
    `;
      projectsContainer.appendChild(projectDiv);
    });

    // Re-initialize AOS after dynamic content is added
    AOS.refresh();
  };

  // Show skeleton loaders for a few seconds, then load actual projects
  setTimeout(() => {
    loadProjects();
  }, 1500); // Simulate 1.5 second loading time

  // Scroll-to-Top Button functionality
  const scrollToTopBtn = document.getElementById("scrollToTopBtn");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      // Show button after scrolling 300px
      scrollToTopBtn.classList.add("show");
    } else {
      scrollToTopBtn.classList.remove("show");
    }
  });

  scrollToTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
});
