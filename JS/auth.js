import { addCookie, getCookie, isAuthenticated } from "./cookies.js";

// redirect to home in case of it already signed in
window.onload = () => redirectToHome();
// const vars
const users = [];
const loginForm = document.querySelector(".login-form");
const signupForm = document.querySelector(".signup-form");
const signupBtn = document.getElementById("signupBtn");
const loginBtn = document.getElementById("loginBtn");
const loginEmailValidation = document.getElementById("login-email-validation");
const loginPasswordValidation = document.getElementById(
  "login-password-validation"
);
const signupNameValidation = document.getElementById("signup-name-validation");
const signupEmailValidation = document.getElementById(
  "signup-email-validation"
);
const signupPasswordValidation = document.getElementById(
  "signup-password-validation"
);
const signupConfirmPasswordValidation = document.getElementById(
  "signup-confirmPassword-validation"
);
const loginResult = document.getElementById("login-result");
const signupResult = document.getElementById("signup-result");

// For handling active btn & content
const loginOption = document.getElementById("loginOption");
const signupOption = document.getElementById("signupOption");
const activeBackground = document.querySelector(".active-background");

loginOption.addEventListener("click", toggle);
signupOption.addEventListener("click", toggle);

function toggle(event) {
  // to avoid double clicking
  if (!event.target.classList.contains("active")) {
    // Clear the form
    loginForm.reset();
    signupForm.reset();
    // toggle tabs
    document
      .querySelectorAll(".tab-content")
      .forEach((tab) => tab.classList.toggle("active"));
    // toggle active button
    document
      .querySelectorAll(".tab-buttons button")
      .forEach((btn) => btn.classList.toggle("active"));

    //handle the background
    activeBackground.style.left = loginOption.classList.contains("active")
      ? "0"
      : "50%";
  }
}

// Authentication logic
class User {
  #name;
  #email;
  #password;

  constructor(name, email, password) {
    this.#name = name;
    this.#email = email;
    this.#setPassword(password);
  }

  // getters/setters
  set name(value) {
    this.#name = value;
  }
  get name() {
    return this.#name;
  }

  set email(value) {
    this.#email = value;
  }
  get email() {
    return this.#email;
  }

  // private method for password
  #setPassword(value) {
    this.#password = value;
  }

  checkPassword(value) {
    return this.#password === value;
  }
}

class UserValidator {
  static validateEmail(value) {
    const regex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    value = value.trim();
    if (!value || !regex.test(value)) {
      return { valid: false, message: "Email is not valid" };
    }
    return { valid: true, message: "" };
  }
  static validateName(value) {
    value = value.trim();
    const regex = /^[A-Za-z\s]+$/;

    if (value.length < 3 || value.length > 50) {
      return { valid: false, message: "Name must between 3-50 letters" };
    } else if (!value || !regex.test(value)) {
      return { valid: false, message: "Name must contain only letters" };
    }
    return { valid: true, message: "" };
  }
  static validatePassword(value) {
    value = value.trim();
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!value || !regex.test(value)) {
      return {
        valid: false,
        message:
          "Password must be at least 8 characters containing with at least (one lowercase - one uppercase - one digit - one special character)",
      };
    }
    return { valid: true, message: "" };
  }
  static confirmPasswordValidator = (password, confirmPassword) => {
    if (password.length && password === confirmPassword) {
      return { valid: true, message: "" };
    }
    return { valid: false, message: "Passwords aren't the same" };
  };
}

loginBtn.addEventListener("click", handleLogin);

function handleLogin(event) {
  event.preventDefault();
  const formData = new FormData(loginForm);
  const userObj = Object.fromEntries(formData.entries());
  if (handleLoginValidation(userObj)) {
    loginResult.textContent = isCorrectCredentials(userObj)
      ? ""
      : "Couldn't find account with that information";
    if (loginResult.textContent.length == 0) {
      storeUserInfo(userObj);
      redirectToHome();
    }
  }
}
function handleLoginValidation(userObj) {
  var emailValidation = UserValidator.validateEmail(userObj.email);
  loginEmailValidation.textContent = emailValidation.message;

  var passwordValidation = UserValidator.validatePassword(userObj.password);
  loginPasswordValidation.textContent = passwordValidation.message;

  return emailValidation.valid && passwordValidation.valid;
}
function isCorrectCredentials(userObj) {
  var result = users.filter(
    (user) =>
      user.email == userObj.email && user.checkPassword(userObj.password)
  );
  return result && result.length == 1;
}

signupBtn.addEventListener("click", handleSignup);

function handleSignup(event) {
  event.preventDefault();
  const formData = new FormData(signupForm);
  const userObj = Object.fromEntries(formData.entries());
  if (handleSignupValidation(userObj)) {
    var user = new User(userObj.name, userObj.email, userObj.password);
    users.push(user);
    storeUserInfo(userObj);
    redirectToHome();
  }
}
function handleSignupValidation(userObj) {
  var nameValidation = UserValidator.validateName(userObj.name);
  signupNameValidation.textContent = nameValidation.message;

  var emailValidation = UserValidator.validateEmail(userObj.email);
  signupEmailValidation.textContent = emailValidation.message;

  var passwordValidation = UserValidator.validatePassword(userObj.password);
  signupPasswordValidation.textContent = passwordValidation.message;

  var confirmPasswordValidation = UserValidator.confirmPasswordValidator(
    userObj.password,
    userObj.confirmPassword
  );
  signupConfirmPasswordValidation.textContent =
    confirmPasswordValidation.message;

  var isUniqueEmail =
    users.filter((user) => user.email == userObj.email).length == 0;
  if (!isUniqueEmail) {
    signupResult.textContent = "There is already an account with that email";
  }
  return (
    nameValidation.valid &&
    emailValidation.valid &&
    passwordValidation.valid &&
    confirmPasswordValidation.valid &&
    isUniqueEmail
  );
}

let storeUserInfo = (userObj) => {
  addCookie("email", userObj.email);
  addCookie("password", userObj.password);
};

function redirectToHome() {
  if (isAuthenticated()) {
    window.location.replace("Home.html");
  }
}
