// index.js
import { getWorks, getCategories, deleteWorkAPI, addWorksAPI } from "./api.js";

const galleryElement = document.querySelector(".gallery");
const filtersElement = document.querySelector(".filters");
const loginButton = document.querySelector(".log");
const firstEdit = document.getElementById("edit1");
const secondEdit = document.getElementById("edit2");
const modalGallery = document.querySelector(".gallery_modal");
let modalGalleryPicture = document.getElementById("modal1");
let modalAddPicture = document.getElementById("modal2");
const token = localStorage.getItem("Token");

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
    buttonDelete.className = `deleteButton${work.id} fa-regular fa-trash-can`;
    pictureModal.className = "pictureModal";
    figure.className = "figureModal";
    pictureModal.src = work.imageUrl;
    buttonDelete.addEventListener("click", async (event) => {
      event.preventDefault();
      const deleteP = await deleteWorkAPI(work.id);
      // if (event.target.classList.contains("fa-trash-can")) {
      //   alert("Image supprimée avec succès");
      // } else {
      //   alert("Erreur lors de la suppression de l'image");
      // }
      console.log(deleteP);
      return;
    });
  });
}

function closeModalGalleryPicture() {
  const close = document.querySelector(".close");
  close.addEventListener("click", () => {
    modalGalleryPicture.style.display = "none";
  });
}

function openModalGalleryPicture() {
  modalGalleryPicture.style.display = null;
}

async function deletePictures(works) {
  return works.map((work) => {
    const deleteButton = document.querySelector(`.deleteButton${work.id}`);
    deleteButton.addEventListener("click", async (event) => {
      event.preventDefault();
      if (event.target.classList.contains("fa-trash-can")) {
        alert("Image supprimée avec succès");
        await deleteWorkAPI(work.id);
      } else {
        alert("Erreur lors de la suppression de l'image");
      }
    });
  });
}

//----- 2ème Modale -----
function openModalAddPicture() {
  const addPicture = document.getElementById("submit_picture");
  addPicture.addEventListener("click", () => {
    modalAddPicture.style.display = null;
    modalGalleryPicture.style.display = "none";
  });
}

function closeModalAddPicture() {
  const closeIcon = document.querySelector(".close_i");
  closeIcon.addEventListener("click", () => {
    modalAddPicture.style.display = "none";
  });
}

function backArrow() {
  const arrow = document.getElementById("open_modal_previous");
  arrow.addEventListener("click", () => {
    modalGalleryPicture.style.display = null;
    modalAddPicture.style.display = "none";
  });
}

let addInput = document.getElementById("button_add_picture");
let titleInput = document.getElementById("name");
let categoriesInput = document.getElementById("categories");
let valid = document.getElementById("valid");

const divAddPicture = document.querySelector(".add_picture");

const selectedImg = document.createElement("img");
divAddPicture.appendChild(selectedImg);
selectedImg.className = "selected_img";

const invalidRequestFormMessage = document.querySelector(
  ".invalid_request_form_message"
);
const validFormMessage = document.querySelector(".valid_form_message");
const invalidFormMessage = document.querySelector(".invalid_form_message");

//----- Affichage des catégories -----
function displayCategory(categories) {
  return categories.map((category) => {
    const option = document.createElement("option");
    categoriesInput.appendChild(option);
    option.value = category.id;
    option.textContent += category.id + category.name;
  });
}

//----- Affichage de la l'image -----
function displayPicture() {
  addInput.addEventListener("change", () => {
    const file = addInput.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      selectedImg.src = e.target.result;
      const divAddPicture = document.querySelector(".add_picture");
      const formElements = divAddPicture.querySelectorAll(".add_picture > *");

      formElements.forEach((Element) => {
        Element.style.display = "none";
      });
      selectedImg.style.display = "flex";
    };
    reader.readAsDataURL(file);
  });
}

const modal2 = document.querySelector(".modal_wrapper");
modal2.addEventListener("submit", (e) => {
  e.preventDefault();
});

//----- Ajout d'un projet -----
function validAddWork() {
  valid.addEventListener("click", (e) => {
    e.preventDefault();
    if (
      addInput.value === "" ||
      titleInput.value === "" ||
      categoriesInput === ""
    ) {
      invalidFormMessage.style.display = "block";
      return false;
    } else {
      alert("Le projet a bien été envoyé");
    }
  });
}

async function addWork() {
  const formData = new FormData();

  formData.append("image", addInput.files[0]);
  formData.append("title", titleInput.value);
  formData.append("category", categoriesInput.value);
  console.log(addInput.value);

  const postWork = await addWorksAPI(formData);
  console.log(postWork);
}

async function main() {
  administrator(token);

  const works = await getWorks();
  displayGalleryWorks(works);

  displayPictures(works);

  const categories = await getCategories();
  displayGalleryCategories(categories);

  filterButtons().map((filterButton) => {
    filterButton.addEventListener("click", (e) => handleFilterClick(works, e));
  });

  loginButton.addEventListener("click", () => {
    if (token) localStorage.clear("Token");
    window.location.href = token ? "./index.html" : "./login.html";
  });

  document.querySelectorAll(".editButton").forEach((a) => {
    a.addEventListener("click", openModalGalleryPicture);
  });

  // deletePictures(works);

  closeModalGalleryPicture();

  openModalAddPicture();

  backArrow();

  closeModalAddPicture();

  displayCategory(categories);

  displayPicture();

  validAddWork();

  valid.addEventListener("click", addWork);
}

main();
