// index.js
import {
  getWorks as getWorksAPI,
  getCategories as getCategoriesAPI,
} from "./api.js";

import { fetchDelete } from "./api.js";

const galleryElement = document.querySelector(".gallery");
const filtersElement = document.querySelector(".filters");
const loginButton = document.querySelector(".log");
const firstEdit = document.getElementById("edit1");
const secondEdit = document.getElementById("edit2");

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
    const figure = document.querySelector("figure");
    const pictureModal = document.createElement("img");
    figure.appendChild(pictureModal);
    pictureModal.src = work.imageUrl;
  });
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
}
main();

// function openModal() {
//   const body = document.querySelector("body");
//   let divModal = document.createElement("div");
//   body.appendChild(divModal);
//   console.log(divModal);
//   divModal = `<aside id="modal" class="js-modal" aria-labelledby="title_modal">
//       <div class="modal_wrapper ">
//         <i class="fa-solid fa-xmark close_icon"></i>
//         <h3 id="title_modal">Galerie Photos</h3>
//         <div class="gallery_modal" id="galleryModal">`;
//   works.forEach((work) => {
//     let figure = document.createElement("figure");
//     figure = `
//           <figure>
//             <i class="fa-regular fa-trash-can" id="delete_picture"></i>
//             <img src="${work.imageUrl}" data-id=${work.title} alt="${work.id}">
//             <figcaption>éditer</figcaption>
//           </figure>
//         </div>
//       </div>
//     </aside>`;
//     divModal += figure.innerHTML;
//   });
// }
// firstEdit.addEventListener("click", openModal);
