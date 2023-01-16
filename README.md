# Anime series search web application

The exercise consists of developing an anime series search web application, which allows us to un / check the series as favorites and save them in local storage.



## Milestones:
### 1. Basic structure

First of all, a basic structure must be made. No need to worry about measurements, colors, or typography until a later milestone. The website search application has two parts:

* A text field and a button to search for series by title.
* A list of search results that shows the title and image of the anime series.

### 2. Search

* By clicking on the Search button, the application must connect to the open API of Jikan for the search of anime series.
* To build the search URL, we have to collect the text that the user has entered in the search field.
* For each series contained in the search result, a card must be painted where we show an image and the title.
* Some of the strings returned by the API do not have an image. In that case you have to show an image placeholder.

### 3. Favoritos

When search results appear, user can indicate which are her favorite series. To do this, when clicking on a series the following must happen:

* The background color and the font color change, indicating that it is a favorite series.
* A list must be displayed on the left side of the screen, below the search form, with your favorite series.
* Favorite series should continue to appear on the left even if the user performs another search.

### 4. Local storage

You have to store the list of favorites in the localStorage. So, when a user reloads the page the list of favorites should be shown.

## Programming languages, designing & development tools.

![HTML](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg)
![SCSS](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sass/sass-original.svg)
![Javascript](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg)
![NPM](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/npm/npm-original-wordmark.svg)
![Gulp](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/gulp/gulp-plain.svg)
![Node](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original-wordmark.svg)
