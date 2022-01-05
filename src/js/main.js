'use strict';

// 1. Variables Globales: querySelector, datos que se van a usar en todas las funciones, de toda la página
const animeTitle = document.querySelector('.js-input');
const searchBtn = document.querySelector('.js-btn-search');
const animeList = document.querySelector('.js-result');
const searchResetBtn = document.querySelector('.js-btn-reset');
const favsResetBtn = document.querySelector('.js-btn-favreset');
const favsAnimeList = document.querySelector('.js-favs');
let animeFavourites = [];

// 2. Funciones

//Fetch que devuelve resultados según la búsqueda de la usuaria:
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

//pintar resultados de búsqueda
function getAnimeCardHtml(anime) {
  const image = renderImg(anime.image_url, anime.title); //llamamos a la función que he creado para aplicar img por defecto en series sin imagen
  let htmlCode = '';
  htmlCode += `<li data-animeid='${anime.mal_id}' data-animetitle='${anime.title}' data-animeimage='${anime.image_url}' `;
  // antes de pintar, revisamos si ya está en favoritos. Como item.id es un string y mal_id es un entero, aplicamos parseInt para pasarlo a número y así poder compararlos. Si no está, lo pintamos normal
  if (
    animeFavourites.findIndex((item) => parseInt(item.id) === anime.mal_id) ===
    -1
  ) {
    htmlCode += `class="js-anime-item anime__card">`;
  } else {
    htmlCode += `class="js-anime-item anime__card anime__fav--item">`;
  }
  htmlCode += `${image}`;
  htmlCode += `<h3 class="anime__card--title">${anime.title}</h3>`;
  htmlCode += `</li>`;
  return htmlCode;
}

//función para pintar los resultados de la búsqueda (img y título del anime)

function renderAnime(results) {
  for (let index = 0; index < results.length; index++) {
    const anime = results[index];
    animeList.innerHTML += getAnimeCardHtml(anime);
  }

  //añadimos un listener para saber en qué anime hace clic para añadir a favoritos
  const animeListElement = document.querySelectorAll('.js-anime-item');
  for (const animeElement of animeListElement) {
    animeElement.addEventListener('click', handleAnimeClick);
  }
}

//Local storage
//leer del LS y llamamos a la variable al cargar la página para ver si ya hay datos en favoritos
const getFromLocalStorage = () => {
  const localStorageFavs = localStorage.getItem('animeFavourites');
  if (localStorageFavs !== null) {
    //si LS es diferente a null, (hay favoritos), hay que recuperarlos y pintarlos
    animeFavourites = JSON.parse(localStorageFavs); //hay que hacer lo contrario, parsear string a objeto
    renderFavourites();
  }
};

//creamos la variable para guardar en LS y la llamamos cada vez que haya cambios en la página
const setInLocalStorage = () => {
  const stringifyFavs = JSON.stringify(animeFavourites); //como solo podemos guardar datos primitivos, usamos stringify para convertir array a string
  localStorage.setItem('animeFavourites', stringifyFavs); //guardamos en LS con setItem y le damos nombre y guardamos el valor de la variable
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

//pintar favoritos

function renderFavourites() {
  favsAnimeList.innerHTML = ''; //limpiar lista
  for (const animeFav of animeFavourites) {
    //función que devuelve string con la imagen y la url correcta
    const image = renderImg(animeFav.image, animeFav.title);

    favsAnimeList.innerHTML += `<li data-animeid='${animeFav.id}' class="js-anime-item anime__card"> ${image} <h3 class="anime__card--title">${animeFav.title}</h3></li>`;
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
  return `<img src="${imageUrl}" alt="${altImage}" title="${altImage}" class='anime__card--image' />`;
}

//botón limpiar búsqueda
function clearSearch(event) {
  event.preventDefault();
  animeList.innerHTML = '';
  animeTitle.value = '';
}

//botón limpiar favoritos
function clearFavourites(event) {
  event.preventDefault();
  animeFavourites = []; //vacío array de favoritos
  setInLocalStorage(); //lo guardo en local storage
  renderFavourites(); //pinto el listado de favoritos
}

// 3. Código que se ejecuta cuando se carga la página: Listeners, pedir datos al servidor, leer datos de la memoria...

getFromLocalStorage();
renderFavourites();
searchBtn.addEventListener('click', getAnime);
searchResetBtn.addEventListener('click', clearSearch);
favsResetBtn.addEventListener('click', clearFavourites);
