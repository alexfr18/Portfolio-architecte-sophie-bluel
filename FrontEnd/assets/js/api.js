// module api.js
export const getWorks = async () => {
  const response = await fetch("http://localhost:5678/api/works");
  return await response.json();
};

export const getCategories = async () => {
  const response = await fetch("http://localhost:5678/api/categories");
  return await response.json();
};

export const postLogin = async (user) => {
  let response = await fetch("http://127.0.0.1:5678/api/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });
  return response;
};

export const fetchDelete = async () => {
  const response = await fetch("http://localhost:5678/api/works/1", {
    method: "DELETE",
    headers: {
      Authorization: "Bearer ${token}",
    },
  });
  if (response.ok) {
    console.log("Image supprimée");
  } else {
    alert("Erreur lors de la supression de l'image");
  }
};
