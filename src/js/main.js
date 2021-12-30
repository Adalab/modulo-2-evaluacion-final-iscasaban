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
      for (let index = 0; index < data.results.length; index++) {
        const anime = data.results[index];
        animeList.innerHTML += `<li><img src="${anime.image_url}" alt="${anime.title}" title="${anime.title}">  ${anime.title}</li>`;
      }
    });
}

function cleanSearch(event) {
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
searchResetBtn.addEventListener("click", cleanSearch);
