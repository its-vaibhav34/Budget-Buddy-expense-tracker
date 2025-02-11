// Function to toggle password visibility
function togglePassword() {
  const passwordField = document.getElementById('password');
  passwordField.type = passwordField.type === 'password' ? 'text' : 'password';
}

// Function to toggle confirm password visibility
function toggleConfirmPassword() {
  const confirmPasswordField = document.getElementById('confirm-password');
  confirmPasswordField.type = confirmPasswordField.type === 'password' ? 'text' : 'password';
}

document.addEventListener('DOMContentLoaded', function () {
  const signupForm = document.getElementById('signupForm');

  signupForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const recaptchaResponse = grecaptcha.getResponse(); // Get reCAPTCHA response

    // Validate passwords
    if (password !== confirmPassword) {
      displayError('Passwords do not match. Please try again.');
      return;
    }

    // Validate reCAPTCHA
    if (recaptchaResponse === '') {
      displayError('Please complete the reCAPTCHA.');
      return;
    }

    // Store credentials in localStorage
    localStorage.setItem('username', username);
    localStorage.setItem('password', password);

    // Success message and redirect
    displaySuccess('Account created successfully!');
    setTimeout(() => {
      window.location.href = 'signin.html'; // Redirect to sign-in page
    }, 2000);
  });
});

// Function to display error messages below the form
function displayError(message) {
  let errorElement = document.querySelector('.error-message');
  if (!errorElement) {
    errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.style.color = 'red';
    errorElement.style.marginTop = '10px';
    document.querySelector('.signup-form').appendChild(errorElement);
  }
  errorElement.textContent = message;
}

// Function to display success messages below the form
function displaySuccess(message) {
  let successElement = document.querySelector('.success-message');
  if (!successElement) {
    successElement = document.createElement('div');
    successElement.className = 'success-message';
    successElement.style.color = 'green';
    successElement.style.marginTop = '10px';
    document.querySelector('.signup-form').appendChild(successElement);
  }
  successElement.textContent = message;
}
