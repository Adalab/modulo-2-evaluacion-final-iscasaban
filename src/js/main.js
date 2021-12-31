"use strict";

// 1. Variables Globales: querySelector, datos que se van a usar en todas las funciones, de toda la página
const animeTitle = document.querySelector(".js-input");
const searchBtn = document.querySelector(".js-btn-search");
const animeList = document.querySelector(".js-result");
const searchResetBtn = document.querySelector(".js-btn-reset");

// 2. Funciones: se ordenan según gustos, pero se pueden agrupar por las que tengan que ver entre sí

function getAnime(event) {
  event.preventDefault();
  const animeSearch = animeTitle.value;
  animeList.innerHTML = "";

  fetch(`https://api.jikan.moe/v3/search/anime?q=${animeSearch}`)
    .then((response) => response.json())
    .then((data) => {
      renderAnime(data.results);
    });
}

function renderAnime(results) {
  for (let index = 0; index < results.length; index++) {
    const anime = results[index];
    const image = renderImg(anime.image_url, anime.title);

    animeList.innerHTML += `<li data-animeid=${anime.mal_id} class="js-anime-item"> ${image} <h3>${anime.title}</h3></li>`;
  }

  const animeListElement = document.querySelectorAll(".js-anime-item");
  for (const animeElement of animeListElement) {
    animeElement.addEventListener("click", handleAnimeClick);
  }
}

function handleAnimeClick(event) {
  const cardElement = event.currentTarget;
  const animeId = cardElement.dataset.animeid;
  cardElement.classList.toggle('anime__fav');
}

//Para poder poner una imagen por defecto si no tiene, creo una función que me devuelva la imagen y que podré sustituir en el innerHTML y aplicarle lógica sin complicar el código del for

function renderImg(imageUrl, altImage) {
  if (
    imageUrl ===
      "https://cdn.myanimelist.net/images/qm_50.gif?s=e1ff92a46db617cb83bfc1e205aff620" ||
    imageUrl === "" ||
    imageUrl === null
  ) {
    imageUrl =
      "https://via.placeholder.com/225x317.png?text=No+image+available";
  }
  return `<img src="${imageUrl}" alt="${altImage}" title="${altImage}" />`;
}

function clearSearch(event) {
  event.preventDefault();
  animeList.innerHTML = "";
  animeTitle.value = "";
}

// function handleClickUpdate(event) {
//   event.preventDefault();
// }

// 3. Código que se ejecuta cuando se carga la página: Listeners, pedir datos al servidor, leer datos de la memoria...

// searchBtn.addEventListener("click", handleClickUpdate);
searchBtn.addEventListener("click", getAnime);
searchResetBtn.addEventListener("click", clearSearch);
