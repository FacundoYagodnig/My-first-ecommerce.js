const form = document.getElementById("login-form");
const userElement = document.getElementById("user");
const passwordElement = document.getElementById("password");
const invalidTool = document.querySelector(".invalid-tooltip2");
const logOutbtn = document.getElementById("log-out");

let localStore = localStorage.getItem("users");
let userList = [];

invalidTool.style.display = "none";

if (localStore) {
  userList = JSON.parse(localStore);
}

console.log(userList);

function loginUser(e) {
  e.preventDefault();

  invalidTool.style.display = "none";

  let user = userElement.value;
  let password = passwordElement.value;

  if (user !== "" && password !== "") {
    let match = false;
    userList.forEach((userEl) => {
      if (userEl.user === user) {
        if (userEl.password === password) {
          //el ingreso es valido
          match = true;
          console.log("logueado con exito");
          location.href = "/index.html";
          localStorage.setItem("user", JSON.stringify(userEl));
          return;
        }
      }
    });
    if (!match) {
      invalidTool.style.display = "block";
      invalidTool.innerHTML = "datos incorrectos";
    }
  }
}

function logOutUser(e) {
  e.preventDefault();
  localStorage.removeItem("user");
  location.href = "/register.html";
}
form.addEventListener("submit", (e) => loginUser(e));
logOutbtn.addEventListener("click", (e) => logOutUser(e));
