// index.js
import {
  getWorks as getWorksAPI,
  getCategories as getCategoriesAPI,
} from "./api.js";

import { deleteAPI } from "./api.js";

const galleryElement = document.querySelector(".gallery");
const filtersElement = document.querySelector(".filters");
const loginButton = document.querySelector(".log");
const firstEdit = document.getElementById("edit1");
const secondEdit = document.getElementById("edit2");
const aside = document.querySelector("aside");

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

function administrator(token) {
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

/************** MODALE ***********/

function displayPicture(works) {
  return works.map((work) => {
    const modalGallery = document.querySelector(".gallery_modal");
    const figure = document.createElement("figure");
    const buttonDelete = document.createElement("i");
    const editPicture = document.createElement("p");
    const pictureModal = document.createElement("img");

    modalGallery.appendChild(figure);
    figure.appendChild(editPicture);
    figure.appendChild(buttonDelete);
    figure.appendChild(pictureModal);

    editPicture.textContent = "éditer";
    editPicture.className = "editPicture";
    buttonDelete.className = "deleteButton fa-regular fa-trash-can";
    pictureModal.className = "pictureModal";
    figure.className = "figureModal";
    pictureModal.src = work.imageUrl;
  });
}

function closeModal() {
  const close = document.querySelector(".close_icon");
  close.addEventListener("click", () => {
    aside.style.display = "none";
  });
}

function openModal() {
  aside.style.display = null;
}

async function main() {
  const token = localStorage.getItem("Token");

  administrator(token);

  const works = await getWorksAPI();
  displayGalleryWorks(works);

  displayPicture(works);

  const categories = await getCategoriesAPI();
  displayGalleryCategories(categories);

  filterButtons().map((filterButton) => {
    filterButton.addEventListener("click", (e) => handleFilterClick(works, e));
  });

  loginButton.addEventListener("click", () => {
    if (token) localStorage.clear("Token");
    window.location.href = token ? "./index.html" : "./login.html";
  });

  document.querySelectorAll(".editButton").forEach((a) => {
    a.addEventListener("click", openModal);
  });

  closeModal();
}
main();
