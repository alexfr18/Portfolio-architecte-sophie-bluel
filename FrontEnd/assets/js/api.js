// module api.js
const token = localStorage.getItem("Token");

export const getWorks = async () => {
  const response = await fetch("http://localhost:5678/api/works");
  return await response.json();
};

export const getCategories = async () => {
  const response = await fetch("http://localhost:5678/api/categories");
  return await response.json();
};

export const postLogin = async (user) => {
  const response = await fetch("http://127.0.0.1:5678/api/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });
  return await response.json();
};

export const deleteWork = async (workId) => {
  const response = await fetch(`http://localhost:5678/api/works/${workId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (response.ok) {
    console.log("Image supprimée avec succès");
  } else {
    alert("Erreur lors de la suppression de l'image");
  }
};

export const addWorks = async (formData) => {
  const response = await fetch("http://localhost:5678/api/works", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
    body: formData,
  });
  return await response.json();
};

// export const addWorks = async () => {
//   const formData = new FormData();
//   const response = await fetch("http://localhost:5678/api/works", {
//     method: "POST",
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//     body: formData,
//   });
//   if (response.ok) {
//     console.log("Le formulaire est envoyé");
//   } else {
//     alert("Le formulaire n'est pas rempli correctement");
//   }
// };
