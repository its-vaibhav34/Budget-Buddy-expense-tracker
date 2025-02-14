// Toggle password visibility
function togglePassword() {
  const passwordField = document.getElementById('password');
  passwordField.type = passwordField.type === 'password' ? 'text' : 'password';
}

document.addEventListener('DOMContentLoaded', function () {
  const signinForm = document.getElementById('signinForm');
  const errorMessage = document.getElementById('error-message');

  signinForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const enteredUsername = document.getElementById('username').value;
    const enteredPassword = document.getElementById('password').value;

    // Retrieve stored credentials from localStorage
    const storedUsername = localStorage.getItem('username');
    const storedPassword = localStorage.getItem('password');

    // Validate credentials
    if (enteredUsername === storedUsername && enteredPassword === storedPassword) {
      window.location.href = 'expenseMain.html'; // Redirect to main page
    } else {
      errorMessage.textContent = 'Invalid username or password. Please try again.';
      errorMessage.style.display = 'block'; // Show error message
    }
  });

  // Google OAuth 2.0 Authentication
  const googleSignInButton = document.getElementById("google-sign-in-btn");

  googleSignInButton.addEventListener("click", () => {
    const clientId = "1092971539002-7o0ncldc7f7pgar78tshtalsu32uebio.apps.googleusercontent.com"; // Replace with your Google OAuth Client ID
    const redirectUri = "http://127.0.0.1:5501"; // Change to your deployed URL when hosting
    const scope = "email profile openid";
    const responseType = "token";

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=${responseType}`;

    window.location.href = authUrl;
  });

  // Function to get Google OAuth access token
  function getAccessToken() {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    return params.get("access_token");
  }

  const accessToken = getAccessToken();

  if (accessToken) {
    // Fetch user details from Google API
    fetch("https://www.googleapis.com/oauth2/v1/userinfo?alt=json", {
      headers: { Authorization: `Bearer ${accessToken}` }
    })
    .then(response => response.json())
    .then(user => {
      console.log("User Info:", user);
      alert(`Welcome, ${user.name}!`);
      
      // Store user details in localStorage
      localStorage.setItem("user", JSON.stringify(user));

      // Redirect to main expense tracker page
      window.location.href = "expenseMain.html";
    })
    .catch(error => console.error("Error fetching user info:", error));
  }
});
