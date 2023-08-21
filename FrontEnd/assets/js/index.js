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
const modalGallery = document.querySelector(".gallery_modal");
let modal1 = document.getElementById("modal1");
let modal2 = document.getElementById("modal2");

//----- Fonction pour le filtre des bouttons -----
function filterButtons() {
  const buttons = [...document.querySelectorAll(".filter-button")];
  if (!buttons) return [];
  return buttons;
}

//----- Récupération des travaux par identifiant de catégorie -----
function getWorksByCategoryId(works, categoryId) {
  if (categoryId === "all" || !categoryId) {
    return works;
  }
  return works.filter((work) => work.categoryId == categoryId);
}

//----- Création des filtres pour les bouttons -----
function createFilterButton(id, name) {
  const button = document.createElement("button");
  button.textContent = name;
  button.dataset.categoryId = id;
  button.setAttribute("class", "filter-button");
  filtersElement.appendChild(button);
}

//----- Affichage des travaux de la gallerie -----
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

//----- Affichage des catégories de la gallerie -----
function displayGalleryCategories(categories) {
  filtersElement.innerHTML = "";
  createFilterButton("all", "Tous");

  categories.map((category) => {
    createFilterButton(category.id, category.name);
  });
}

//----- Gérer le clic sur les filtres -----
function handleFilterClick(data, e) {
  galleryElement.innerHTML = "";
  const newWorks = getWorksByCategoryId(data, e.target.dataset.categoryId);
  displayGalleryWorks(newWorks);
  updateFilterButtons(e.target.dataset.categoryId);
}

//----- Gérer la class active sur le filtre des bouttons -----
function updateFilterButtons(categoryId) {
  filterButtons().map((filter) => {
    if (filter.dataset.categoryId === categoryId) {
      filter.classList.add("active");
    } else {
      filter.classList.remove("active");
    }
  });
}

//----- Gérer les affichages à la connexion de l'administrateur -----
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

//----- MODALE -----
function displayPictures(works) {
  return works.map((work) => {
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
  const close = document.querySelector(".close");
  close.addEventListener("click", () => {
    aside.style.display = "none";
  });
}

function openModal() {
  modal1.style.display = null;
}

function deletePictures(works) {
  return works.map((work) => {
    const galleryModal = document.querySelector(".gallery_modal");

    galleryModal.addEventListener("click", (event) => {
      if (event.target.classList.contains("fa-trash-can")) {
        const pictureSelected = event.target.parentNode.querySelector("img");
        // console.log(pictureSelected);
        const workId = work.id;

        const pictureId = work.imageUrl;

        if (pictureSelected) {
          console.log("Image ID:", workId);
          console.log(pictureId);
          const deletePicture = deleteAPI(workId);
          pictureSelected.parentNode.remove();
          // console.log(work);
          return deletePicture;
        }
      }
    });
  });
}
//***** 2ème Modale *****/

function openModal2() {
  modal2.style.display = null;
  modal1.style.display = "none";
}

function arrow() {
  const arrow = document.getElementById("open_modal_previous");
  arrow.addEventListener("click", () => {
    modal1.style.display = null;
    modal2.style.display = "none";
  });
}

async function main() {
  const token = localStorage.getItem("Token");

  administrator(token);

  const works = await getWorksAPI();
  displayGalleryWorks(works);

  displayPictures(works);

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

  deletePictures(works);

  const addPicture = document.getElementById("submit_picture");
  addPicture.addEventListener("click", openModal2);

  arrow();
}
main();
