'use strict';

// 1. Variables Globales: querySelector, datos que se van a usar en todas las funciones, de toda la página
const animeTitle = document.querySelector('.js-input');
const searchBtn = document.querySelector('.js-btn-search');
const animeList = document.querySelector('.js-result');
const searchResetBtn = document.querySelector('.js-btn-reset');
const favsAnimeList = document.querySelector('.js-favs');
let animeFavourites = [];

// 2. Funciones: se ordenan según gustos, pero se pueden agrupar por las que tengan que ver entre sí

//función para hacer un fetch que devuelva resultados según la búsqueda de la usuaria:
function getAnime(event) {
  event.preventDefault();
  const animeSearch = animeTitle.value;
  animeList.innerHTML = '';

  fetch(`https://api.jikan.moe/v3/search/anime?q=${animeSearch}`)
    .then((response) => response.json())
    .then((data) => {
      renderAnime(data.results);
    });
}

//función para pintar los resultados de la búsqueda (img y título del anime)
function renderAnime(results) {
  for (let index = 0; index < results.length; index++) {
    const anime = results[index];
    const image = renderImg(anime.image_url, anime.title);

    animeList.innerHTML += `<li data-animeid='${anime.mal_id}' data-animetitle='${anime.title}' data-animeimage='${anime.image_url}' class="js-anime-item anime__card"> ${image} <h3>${anime.title}</h3></li>`;
  }

  //añadimos un listener para saber en qué anime hace clic para añadir a favoritos
  const animeListElement = document.querySelectorAll('.js-anime-item');
  for (const animeElement of animeListElement) {
    animeElement.addEventListener('click', handleAnimeClick);
  }
}

//Local storage

const getFromLocalStorage = () => {
  const localStorageFavs = localStorage.getItem('animeFavourites');
  if (localStorageFavs !== null) {
    animeFavourites = JSON.parse(localStorageFavs);
    renderFavourites();
  }
};

const setInLocalStorage = () => {
  const stringifyFavs = JSON.stringify(animeFavourites);
  localStorage.setItem('animeFavourites', stringifyFavs);
};

// con esta función sabemos en qué elemento hace clic y lo añadimos a favoritos (toggle anime__fav--item) o lo eliminamos si ya estaba en el listado
function handleAnimeClick(event) {
  const clickedAnime = event.currentTarget;
  clickedAnime.classList.toggle('anime__fav--item');

  const animeId = clickedAnime.dataset.animeid;
  const animeTitle = clickedAnime.dataset.animetitle;
  const animeImg = clickedAnime.dataset.animeimage;
  const animeFav = {
    id: animeId,
    title: animeTitle,
    image: animeImg,
  };

  const findIndexAnime = animeFavourites.findIndex(
    (item) => item.id === animeId
  );
  if (findIndexAnime === -1) {
    //así comprobamos si el id ya está en favoritos. Si devuelve -1, no está.
    animeFavourites.push(animeFav); //con push, lo añadimos al array de favoritos
  } else {
    animeFavourites.splice(findIndexAnime, 1); //si el id ya está en favoritos, no queremos que lo vuelva a agregar. Por eso usamos splice, que toma la posición con indexOf y borra ese elemento
  }
  setInLocalStorage();
  renderFavourites();
}

//ahora queremos saber a qué título e img se corresponde cada id que tengo guardado en el array favouritesIds:

function renderFavourites() {
  favsAnimeList.innerHTML = ''; //limpiar lista
  for (const animeFav of animeFavourites) {
    favsAnimeList.innerHTML += `<li data-animeid='${animeFav.id}' class="js-anime-item anime__card"> <img src='${animeFav.image}'> <h3>${animeFav.title}</h3></li>`;
  }
  setInLocalStorage();
}

//Para poder poner una imagen por defecto si no tiene, creo una función que me devuelva la imagen y que podré sustituir en el innerHTML y aplicarle lógica sin complicar el código del for
function renderImg(imageUrl, altImage) {
  if (
    imageUrl ===
      'https://cdn.myanimelist.net/images/qm_50.gif?s=e1ff92a46db617cb83bfc1e205aff620' ||
    imageUrl === '' ||
    imageUrl === null
  ) {
    imageUrl =
      'https://via.placeholder.com/225x317.png?text=No+image+available';
  }
  return `<img src="${imageUrl}" alt="${altImage}" title="${altImage}" />`;
}

function clearSearch(event) {
  event.preventDefault();
  animeList.innerHTML = '';
  animeTitle.value = '';
}

// 3. Código que se ejecuta cuando se carga la página: Listeners, pedir datos al servidor, leer datos de la memoria...

getFromLocalStorage();
renderFavourites();
searchBtn.addEventListener('click', getAnime);
searchResetBtn.addEventListener('click', clearSearch);
