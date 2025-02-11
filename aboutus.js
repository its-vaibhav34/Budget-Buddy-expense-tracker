
// Theme Toggle Function
function toggleTheme() {
    const themeIcon = document.getElementById("theme-icon");

    // Toggle dark theme on the body
    const isDarkMode = document.body.classList.toggle("dark-mode"); 

    if (isDarkMode) {
        // Update the icon for dark mode and save preference
        themeIcon.src = "dark_theme-removebg-preview.png";
        localStorage.setItem("theme", "dark");
    } else {
        // Update the icon for light mode and save preference
        themeIcon.src = "light_theme-removebg-preview.png";
        localStorage.setItem("theme", "light");
    }
}
