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
  const response = await fetch("http://127.0.0.1:5678/api/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });
  return await response.json();
};

export const deleteAPI = async (workId) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`http://localhost:5678/api/works/${workId}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (response.ok) {
    console.log("Image supprimée avec succès");
  } else {
    alert("Erreur lors de la suppression de l'image");
  }
  console.log(workId);
};
