import { postLogin } from "./api";

async function login() {
  const buttonConnect = document.querySelector(".bt1");
  let inputLog = document.querySelector(".email2");
  let inputPass = document.querySelector(".pass2");

  buttonConnect.addEventListener("click", async () => {
    let user = {
      email: inputLog.value,
      password: inputPass.value,
    };
    const loginUser = await postLogin(user);
    if (user.email === inputLog.value && user.password === inputPass.value) {
      window.location.href = "./index.html";
      return response.json();
    } else {
      alert("Erreur dans l’identifiant ou le mot de passe");
    }
  });
}
login();
