// import { postLogin } from "./api.js";

// async function login() {
//   let buttonConnect = document.querySelector(".bt1");

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

function login() {
  let buttonConnect = document.querySelector(".bt1");

  buttonConnect.addEventListener("click", () => {
    let inputLog = document.querySelector(".email2");
    let inputPass = document.querySelector(".pass2");

    let user = {
      email: inputLog.value,
      password: inputPass.value,
    };

    let postLogin = {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    };
    fetch("http://127.0.0.1:5678/api/users/login", postLogin)
      .then((res) => res.json())
      .then((data) => {
        let userData = data.token;
        if (data.token) {
          sessionStorage.setItem("Token", userData);
          window.location.href = "./index.html";
        } else {
          alert("Erreur dans l'identifiant et le mot de passe");
        }
      })
      .catch((erreur) => {
        console.log(erreur);
      });
  });
}
login();
