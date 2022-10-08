/***********************************
 * Global
 ***********************************/

const localUsers = localStorage.getItem('Users');
const LocalUser = localStorage.getItem('Current-User');
const registeredUsers = localUsers ? JSON.parse(localUsers) : [];
const loggedInUser = LocalUser ? LocalUser : '';

function debugUsers() {
  console.log('Users =>', { loggedInUser, registeredUsers });
}
debugUsers();
/***********************************
 * Redirects
 ***********************************/

// Redirect To Login Page If User Didn't Sign In
if (location.pathname == '/' && loggedInUser == '') {
  location.replace('/login.html');
}

/***********************************
 * Validation
 ***********************************/

// RFC 2822 Email Validation
const EmailRegEx =
  /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g;

const NameMinLength = 3;
const PasswordMinLength = 8;

function showMessage(element) {
  element.classList.remove('d-none');
}
function hideMessage(element) {
  element.classList.add('d-none');
}

/***********************************
 * Sign Up
 ***********************************/

// Signup Input Fields

const signupNameInput = document.querySelector('.signup-name');
const signupEmailInput = document.querySelector('.signup-email');
const signupPasswordInput = document.querySelector('.signup-password');
const signupSubmitBtn = document.querySelector('.signup-submit');

// Signup Messages

const signupNameError = document.querySelector('.signup-name-error');
const signupEmailError = document.querySelector('.signup-email-error');
const signupPasswordError = document.querySelector('.signup-password-error');

const signupSuccess = document.querySelector('.signup-success');
const signupError = document.querySelector('.signup-fail');

// Log Every Thing In Console
function debugSignUp() {
  console.log('SignUp Page Variables =>', {
    signupNameInput,
    signupEmailInput,
    signupPasswordInput,
    signupSubmitBtn,
    signupNameError,
    signupEmailError,
    signupPasswordError,
  });
}
/***********************************
 * Sign Up Validation
 ***********************************/
let isValidRegName = false;
let isValidRegEmail = false;
let isValidRegPassword = false;

function clearSignUpFields() {
  signupNameInput.value = '';
  signupEmailInput.value = '';
  signupPasswordInput.value = '';
}

function hideSignUpMessages() {
  hideMessage(signupSuccess);
  hideMessage(signupError);
}

// If Any Input Element Of SignUp Page Exists => We're On SignUp Page
if (signupNameInput) {
  // SignUp Name Validation
  signupNameInput.addEventListener('input', function () {
    // Hide Old Messages
    hideMessage(signupNameError);
    hideSignUpMessages();

    if (this.value.length < NameMinLength) {
      signupNameError.innerText = 'Name Length Is Less Than 3 Characters';
      showMessage(signupNameError);
      isValidRegName = false;
    } else {
      if (registeredUsers.some((x) => x.name === this.value)) {
        // Check If Name Exists
        signupNameError.innerText = '&cross; This Name Already Exists';
        showMessage(signupNameError);
        isValidRegName = false;
      } else {
        isValidRegName = true;
      }
    }
  });

  // SignUp Email Validation
  signupEmailInput.addEventListener('input', function () {
    // Hide Old Messages
    hideMessage(signupEmailError);
    hideSignUpMessages();

    if (!this.value.match(EmailRegEx)) {
      signupEmailError.innerText = '\u2a2f Bad Email Format';
      showMessage(signupEmailError);
      isValidRegEmail = false;
    } else {
      isValidRegEmail = true;
    }
  });

  // SignUp Password Validation
  signupPasswordInput.addEventListener('input', function () {
    // Hide Old Messages
    hideMessage(signupPasswordError);
    hideSignUpMessages();

    console.log(this.value);
    if (this.value.length < PasswordMinLength) {
      signupPasswordError.innerText = '\u2a2f Password Is Too short';
      showMessage(signupPasswordError);
      isValidRegPassword = false;
    } else {
      isValidRegPassword = true;
    }
  });

  // Submit Validation
  signupSubmitBtn.addEventListener('click', function (e) {
    e.preventDefault();
    if (isValidRegName && isValidRegEmail && isValidRegPassword) {
      registeredUsers.push({
        userName: signupNameInput.value,
        email: signupEmailInput.value,
        password: signupPasswordInput.value,
      });
      clearSignUpFields();
      showMessage(signupSuccess);
      localStorage.setItem('Users', JSON.stringify(registeredUsers));
    } else {
      showMessage(signupError);
    }
  });
} // end-if

/***********************************
 * Sign In
 ***********************************/

const signinEmailInput = document.querySelector('.signin-email');
const signinPasswordInput = document.querySelector('.signin-password');
const signinSubmitBtn = document.querySelector('.signin-submit');

// Signin Error Messages

const signinEmailError = document.querySelector('.signin-email-error');
const signinPasswordError = document.querySelector('.signin-password-error');

// Log Every Thing In Console
function debugSignIn() {
  console.log('SignIn Page Variables =>', {
    signinEmailInput,
    signinPasswordInput,
    signinSubmitBtn,
    signinEmailError,
    signinPasswordError,
  });
}

/***********************************
 * Sign In Validation
 ***********************************/

function getUser(email) {
  return registeredUsers.filter((u) => u.email === email)[0];
}

function clearSignInMessages() {
  hideMessage(signinEmailError);
  hideMessage(signinPasswordError);
}

if (signinEmailInput) {
  signinSubmitBtn.addEventListener('click', function (e) {
    e.preventDefault();
    clearSignInMessages();
    const user = getUser(signinEmailInput.value);
    if (!user) {
      showMessage(signinEmailError);
    }
    if (user.password !== signinPasswordInput.value) {
      showMessage(signinPasswordError);
    } else {
      localStorage.setItem('Current-User', user.userName);
      location.replace('/');
    }
  });
}

/***********************************
 * Home Page Variables
 ***********************************/

const homeGreeting = document.querySelector('.greeting');
const logoutBtn = document.querySelector('.logout-btn');

if (homeGreeting) {
  homeGreeting.innerText = `Greeting ${loggedInUser}`;
  logoutBtn.addEventListener('click', function () {
    localStorage.setItem('Current-User', '');
    location.reload();
  });
}
