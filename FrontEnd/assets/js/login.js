// import { postLogin } from "./api.js";

// async function login() {
//   let buttonConnect = document.querySelector(".bt1");
//   let inputLog = document.querySelector(".email2");
//   let inputPass = document.querySelector(".pass2");

//   let user = {
//     email: inputLog.value,
//     password: inputPass.value,
//   };
//   console.log(user);
//   buttonConnect.addEventListener("click", async () => {
//     const loginUser = await postLogin(user);
//     if (user.email === inputLog.value && user.password === inputPass.value) {
//       window.location.href = "./index.html";
//     } else {
//       alert("Erreur dans l’identifiant ou le mot de passe");
//     }
//     return await loginUser;
//   });
// }
// login();

let buttonConnect = document.querySelector(".bt1");
let inputLog = document.querySelector(".email2");
let inputPass = document.querySelector(".pass2");

let user = {
  email: "sophie.bluel@test.tld",
  password: "S0phie",
};

let postLogin = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(user),
};

buttonConnect.addEventListener("click", () => {
  fetch("http://localhost:5678/api/users/login", postLogin)
    .then((res) => res.json())
    .then((data) => {
      let userData = data.token;
      sessionStorage.setItem("Token", userData);
      if (
        data.token &&
        user.email === inputLog.value &&
        user.password === inputPass.value
      ) {
        window.location.href = "./index.html";
      } else {
        alert("Erreur dans l’identifiant ou le mot de passe");
      }
    });
});
