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
      window.location.href = 'expenseMain.html'; // Redirect to dashboard
    } else {
      errorMessage.textContent = 'Invalid username or password. Please try again.';
      errorMessage.style.display = 'block'; // Show the error message
    }
  });
});
