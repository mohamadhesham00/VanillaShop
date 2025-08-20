function addCookie(key, value, expiresInDays = 3) {
  let date = new Date();
  date.setDate(date.getDate() + expiresInDays);
  document.cookie = `${key}=${value};expires=${date};`;
}

function getCookie(name) {
  const cookies = document.cookie.split(";");
  for (let cookie of cookies) {
    let [key, value] = cookie.split("=");
    key = key.trim();
    if (key === name) {
      return value;
    }
  }
  return null;
}

function removeCookie(key) {
  document.cookie = `${key}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
}

function isAuthenticated() {
  const email = getCookie("email");
  const password = getCookie("password");
  return email && password;
}
export { addCookie, getCookie, removeCookie, isAuthenticated };
