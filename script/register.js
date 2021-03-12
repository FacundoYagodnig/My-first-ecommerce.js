//selectores
const form = document.getElementById("register-form");
const firstName = document.getElementById("first-name");
const lastName = document.getElementById("last-name");
const userName = document.getElementById("user-name");
const email = document.getElementById("email");
const passwordElement = document.getElementById("password");
const city = document.getElementById("city");
const province = document.getElementById("provincia-select");
const cp = document.getElementById("codigo-postal");
const validTool = document.querySelector(".valid-tooltip");
const invalidTool = document.querySelector(".invalid-tooltip");

let localStore = localStorage.getItem("users");
let userList = [];

if (localStore) {
  userList = JSON.parse(localStore);
}

function saveUser(e) {
  e.preventDefault();

  let nombre = firstName.value;
  let apellido = lastName.value;
  let user = userName.value;
  let email2 = email.value;
  let password = passwordElement.value;
  let ciudad = city.value;
  let provincia = province.value;
  let codigoPostal = cp.value;

  let newUser = {
    nombre,
    apellido,
    user,
    email2,
    password,
    ciudad,
    provincia,
    codigoPostal,
  };

  // const usuario = new Usuario(
  //   nombre,
  //   apellido,
  //   user,
  //   password,
  //   ciudad,
  //   provincia,
  //   codigoPostal
  // );

  userList.push(newUser);

  let users = JSON.stringify(userList);
  localStorage.setItem("users", users);

  location.href = "/My-first-ecommerce/public/login.html";
}
console.log(userList);
form.addEventListener("submit", (e) => saveUser(e));
