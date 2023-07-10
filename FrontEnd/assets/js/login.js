const buttonConnect = document.querySelector(".bt1");
console.log(buttonConnect);

async function fetchUsers() {
  let user = {
    email: "sophie.bluel@test.tld",
    password: "S0phie",
  };

  let response = await fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });

  let inputLog = document.querySelector(".email2");

  let inputPass = document.querySelector(".pass2");

  buttonConnect.addEventListener("click", () => {
    if (user.email === inputLog.value && user.password === inputPass.value) {
      window.location.href = "./index.html";
      return response.json();
    } else {
      alert("Impossible de se connecter");
    }
  });
}
fetchUsers();
