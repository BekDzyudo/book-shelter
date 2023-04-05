let token = localStorage.getItem("reg");
if (token) {
  window.location.replace("../admin.html");
}

let username = document.getElementById("username");
let password = document.getElementById("password");

let loginArr = [];

function addRegister() {
  let loginObj = {
    username: username.value,
    password: password.value,
  };
  loginArr.push(loginObj);
  localStorage.setItem("reg", JSON.stringify(loginArr));

  //   let token = JSON.parse(localStorage.getItem("reg"));
  //   console.log(token);
}

document.getElementById("loginBtn").onclick = function () {
  addRegister();
};
