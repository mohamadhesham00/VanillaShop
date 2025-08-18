// Handle redirect in case of not signed in
if (document.cookie.length == 0) {
  window.location.replace("auth.html");
}

window.onload = async () => {
  //   if (document.cookie.length) {
  document.getElementById("navbar").innerHTML = await (
    await fetch("navbar.html")
  ).text();
  //   }
};
