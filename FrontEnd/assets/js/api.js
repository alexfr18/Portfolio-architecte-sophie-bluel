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

export const deleteWorkAPI = async (workId) => {
  const response = await fetch(`http://localhost:5678/api/works/${workId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return await response.json();
};

export const addWorksAPI = async (formData) => {
  const response = await fetch("http://localhost:5678/api/works", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
  return await response.json();
};
