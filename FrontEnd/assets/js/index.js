// index.js
import {
  getWorks as getWorksAPI,
  getCategories as getCategoriesAPI,
} from "./api.js";

import { fetchDelete } from "./api.js";

const galleryElement = document.querySelector(".gallery");
const filtersElement = document.querySelector(".filters");
const loginButton = document.querySelector(".log");

function filterButtons() {
  const buttons = [...document.querySelectorAll(".filter-button")];
  if (!buttons) return [];
  return buttons;
}

function getWorksByCategoryId(works, categoryId) {
  if (categoryId === "all" || !categoryId) {
    return works;
  }
  return works.filter((work) => work.categoryId == categoryId);
}

function createFilterButton(id, name) {
  const button = document.createElement("button");
  button.textContent = name;
  button.dataset.categoryId = id;
  button.setAttribute("class", "filter-button");
  filtersElement.appendChild(button);
}

function displayGalleryWorks(works) {
  return works.map((work) => {
    const fig = document.createElement("figure");
    const image = document.createElement("img");
    image.src = work.imageUrl;
    const title = document.createElement("figcaption");
    title.innerHTML = work.title;
    fig.dataset.categoryId = work.categoryId;

    fig.appendChild(image);
    fig.appendChild(title);
    galleryElement.appendChild(fig);
  });
}

function displayGalleryCategories(categories) {
  filtersElement.innerHTML = "";
  createFilterButton("all", "Tous");

  categories.map((category) => {
    createFilterButton(category.id, category.name);
  });
}

function handleFilterClick(data, e) {
  galleryElement.innerHTML = "";
  const newWorks = getWorksByCategoryId(data, e.target.dataset.categoryId);
  displayGalleryWorks(newWorks);
  updateFilterButtons(e.target.dataset.categoryId);
}

function updateFilterButtons(categoryId) {
  filterButtons().map((filter) => {
    if (filter.dataset.categoryId === categoryId) {
      filter.classList.add("active");
    } else {
      filter.classList.remove("active");
    }
  });
}

// async function main() {
//   const works = await getWorksAPI();
//   displayGalleryWorks(works);

//   const categories = await getCategoriesAPI();
//   displayGalleryCategories(categories);

//   return filterButtons().map((filterButton) => {
//     filterButton.addEventListener("click", (e) => handleFilterClick(works, e));
//   });
// }

// main();

// let loginButton = document.querySelector(".log");
// let token = sessionStorage.getItem("Token");
// let firstEdit = document.getElementById("edit1");
// let secondEdit = document.getElementById("edit2");
// let filters = document.querySelector(".filters");
// let divHeader = document.querySelector(".divHeader");

// loginButton.addEventListener("click", () => {
//   if (loginButton.textContent === "login") {
//     window.location.href = "./login.html";
//   } else if (token) {
//     sessionStorage.clear("Token");
//     window.location.href = "./index.html";
//   }
// });

// loginButton.addEventListener("click", () => {
//   if (token) sessionStorage.clear("Token");
//   window.location.href = token ? "./index.html" : "./login.html";
// });

// function clickLogout() {
//   if (token) {
//     loginButton.textContent = "logout";
//   }
// }
// clickLogout();

// function administrator() {
//   if (token) {
//     firstEdit.style.visibility = "visible";
//     secondEdit.style.visibility = "visible";
//     divHeader.style.visibility = "visible";
//     filters.style.visibility = "hidden";
//   } else {
//     firstEdit.style.visibility = "hidden";
//     secondEdit.style.visibility = "hidden";
//     divHeader.style.visibility = "hidden";
//     filters.style.visibility = "visible";
//   }
// }

// function administrator(token) {
//   firstEdit.style.visibility = token ? "visible" : "hidden";
//   secondEdit.style.visibility = token ? "visible" : "hidden";
//   divHeader.style.visibility = token ? "visible" : "hidden";
//   filters.style.visibility = token ? "hidden" : "visible";
// }
// administrator(token);

function administrator(token) {
  const firstEdit = document.getElementById("edit1");
  const secondEdit = document.getElementById("edit2");
  const filters = document.querySelector(".filters");
  const divHeader = document.querySelector(".divHeader");

  if (token) {
    loginButton.textContent = "logout";
  }
  firstEdit.style.visibility = token ? "visible" : "hidden";
  secondEdit.style.visibility = token ? "visible" : "hidden";
  divHeader.style.visibility = token ? "visible" : "hidden";
  filters.style.visibility = token ? "hidden" : "visible";
}

async function main() {
  const token = sessionStorage.getItem("Token");

  administrator(token);

  const works = await getWorksAPI();
  displayGalleryWorks(works);

  const categories = await getCategoriesAPI();
  displayGalleryCategories(categories);

  filterButtons().map((filterButton) => {
    filterButton.addEventListener("click", (e) => handleFilterClick(works, e));
  });

  loginButton.addEventListener("click", () => {
    if (token) sessionStorage.clear("Token");
    window.location.href = token ? "./index.html" : "./login.html";
  });
}
main();
