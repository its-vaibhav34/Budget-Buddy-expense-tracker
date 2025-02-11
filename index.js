function toggleTheme() {
    document.body.classList.toggle("dark-theme");

    const themeIcon = document.getElementById("theme-icon");
    if (document.body.classList.contains("dark-theme")) {
        themeIcon.src = "dark_theme-removebg-preview.png";
    } else {
        themeIcon.src = "light_theme-removebg-preview.png";
    }
}

emailjs.init("dfv2P03gg8iBL_PjH");

document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("emailForm");
    const sendButton = document.querySelector(".send");
    const statusMessage = document.getElementById("statusMessage");

    sendButton.addEventListener("click", function () {
        const message = document.getElementById("message").value;

        if (message.trim() === "") {
            statusMessage.textContent = "Please enter your feedback before sending.";
            statusMessage.style.color = "red";
            return;
        }

        const params = {
            message: message, 
        };

        console.log("Params being sent:", params);

        emailjs
            .send("service_t5fiso5", "template_ejupqxp", params)
            .then(response => {
                console.log("Email sent successfully:", response);
                statusMessage.textContent = "Feedback sent successfully! Thank you.";
                statusMessage.style.color = "rgb(26, 255, 0)";
                form.reset();
            })
            .catch(error => {
                console.error("Email sending failed:", error);
                statusMessage.textContent = "Failed to send feedback. Please try again.";
                statusMessage.style.color = "red";
            });
    });
});
class Navigation {
    constructor() {
      this.mobileNavBtn = document.querySelector(".mobile-navbar-btn");
      this.header = document.querySelector(".header");
      this.links = document.querySelectorAll(".navbar-list li");
  
      this.init();
    }
  
    init() {
      this.mobileNavBtn.addEventListener("click", () => this.toggleNavbar());
      this.links.forEach(link => link.addEventListener("click", () => this.removeNavbar()));
    }
  
    toggleNavbar() {
        this.header.classList.toggle("active");
      }
      
  
    removeNavbar() {
      this.header.classList.remove("active");
    }
  }
  
  new Navigation();
  const mobileNavBtn = document.querySelector('.mobile-navbar-btn');
  const navbar = document.querySelector('.navbar');
  const body = document.body;
  
  
  mobileNavBtn.addEventListener('click', () => {
    mobileNavBtn.classList.toggle('active');
    navbar.classList.toggle('active');
  });

  
  
  
  
