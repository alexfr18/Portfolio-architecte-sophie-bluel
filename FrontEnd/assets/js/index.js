// index.js
import { getWorks, getCategories, deleteWorkAPI, addWorksAPI } from "./api.js";

const galleryElement = document.querySelector(".gallery");
const filtersElement = document.querySelector(".filters");
const loginButton = document.querySelector(".to_log_in");
const firstButtonEdit = document.getElementById("firstButtonEdit");
const secondButtonEdit = document.getElementById("secondButtonEdit");
const modalGallery = document.querySelector(".gallery_modal");
let firstModal = document.getElementById("firstModal");
let secondModal = document.getElementById("secondModal");
const token = localStorage.getItem("Token");
let selectPicture = document.getElementById("button_add_picture");
let titleInput = document.getElementById("name");
let categoriesInput = document.getElementById("categories");
let valid = document.getElementById("valid");
const divAddPicture = document.querySelector(".add_picture");
const selectedImg = document.createElement("img");
divAddPicture.appendChild(selectedImg);
selectedImg.className = "selected_img";
const validFormMessage = document.querySelector(".valid_form_message");
const invalidFormMessage = document.querySelector(".invalid_form_message");
let formElements = divAddPicture.querySelectorAll(".add_picture > *");

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
  galleryElement.innerHTML = "";
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
  firstButtonEdit.style.visibility = token ? "visible" : "hidden";
  secondButtonEdit.style.visibility = token ? "visible" : "hidden";
  divHeader.style.visibility = token ? "visible" : "hidden";
  filters.style.visibility = token ? "hidden" : "visible";
}

//----- MODALE -----
function displayAndDeletePictures(works) {
  modalGallery.innerHTML = "";
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
    buttonDelete.addEventListener("click", async () => {
      try {
        await deleteWorkAPI(work.id);
        alert("Image supprimée avec succès");
        const works = await getWorks();
        displayGalleryWorks(works);
        displayAndDeletePictures(works);
        return;
      } catch (error) {
        console.log(error);
        alert("Erreur lors de la suppression de l image");
      }
    });
  });
}

//----- Fonction pour fermer la première modale -----
function closeFirstModal() {
  const close = document.querySelector(".close");
  close.addEventListener("click", () => {
    firstModal.style.display = "none";
  });
}

function openFirstModal() {
  firstModal.style.display = null;
}

//----- 2ème Modale -----
function openSecondModal() {
  const addPicture = document.getElementById("submit_picture");
  addPicture.addEventListener("click", () => {
    firstModal.style.display = "none";
    secondModal.style.display = null;
  });
}

function closeSecondModal() {
  const closeIcon = document.querySelector(".close_i");
  closeIcon.addEventListener("click", () => {
    secondModal.style.display = "none";
  });
}

//----- Fonction pour retouner à la première modale -----
function returnFirstModal() {
  const arrow = document.getElementById("open_modal_previous");
  arrow.addEventListener("click", () => {
    firstModal.style.display = null;
    secondModal.style.display = "none";
  });
}

//----- Affichage des catégories -----
function displayCategories(categories) {
  return categories.map((category) => {
    const option = document.createElement("option");
    categoriesInput.appendChild(option);
    option.value = category.id;
    option.textContent += category.id + category.name;
  });
}

//----- Fonction pour afficher l'image dasn le formulaire à la sélection -----
function displayPicture() {
  selectPicture.addEventListener("change", () => {
    if (selectPicture.files && selectPicture.files[0]) {
      const reader = new FileReader();

      reader.onload = (e) => {
        selectedImg.src = e.target.result;

        formElements.forEach((Element) => {
          Element.style.display = "none";
        });
        selectedImg.style.display = "flex";
      };
      reader.readAsDataURL(selectPicture.files[0]);
    }
  });
}

//----- Fonction pour ajouter le projet -----
async function addWork() {
  if (
    !selectPicture.files[0] ||
    titleInput.value === "" ||
    categoriesInput.value === ""
  ) {
    invalidFormMessage.style.display = "block";
    valid.classList.add("rouge");
  } else {
    invalidFormMessage.style.display = "none";
    valid.classList.remove("rouge");
    valid.classList.add("vert");
  }

  const formData = new FormData();
  formData.append("image", selectPicture.files[0]);
  formData.append("title", titleInput.value);
  formData.append("category", categoriesInput.value);

  const postWork = await addWorksAPI(formData);
  if (!postWork.id) {
    console.log("===> error", postWork);
    return;
  }
  firstModal.style.display = null;
  secondModal.style.display = "none";
  alert("Le projet a bien été envoyé");
  const works = await getWorks();
  displayGalleryWorks(works);
  displayAndDeletePictures(works);
}

//----- Fonction pour réinitialiser le formulaire -----
function resetForm() {
  formElements.forEach((Element) => {
    Element.style.display = "block";
  });
  selectedImg.style.display = "flex";
  selectedImg.src = "";
  selectPicture.value = "";
  titleInput.value = "";
  categoriesInput.value = "";
}

async function main() {
  administrator(token);

  const works = await getWorks();
  displayGalleryWorks(works);

  displayAndDeletePictures(works);

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
    a.addEventListener("click", openFirstModal);
  });

  closeFirstModal();

  openSecondModal();

  closeSecondModal();

  returnFirstModal();

  displayCategories(categories);

  displayPicture();

  valid.addEventListener("click", addWork);

  valid.addEventListener("click", resetForm);
}
main();
