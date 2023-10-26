import { postLogin } from "./api.js";

async function login() {
  let buttonConnect = document.querySelector(".bt1");
  let inputEmail = document.querySelector(".email2");
  let inputPassword = document.querySelector(".pass2");

  buttonConnect.addEventListener("click", async () => {
    let user = {
      email: inputEmail.value,
      password: inputPassword.value,
    };
    const loginUser = await postLogin(user);
    let userData = loginUser.token;

    if (userData) {
      localStorage.setItem("Token", userData);
      window.location.href = "./index.html";
      alert("Connexion réussie");
    } else {
      alert("Erreur dans l'identifiant et le mot de passe");
    }
    return loginUser;
  });
}
login();
