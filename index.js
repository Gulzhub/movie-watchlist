const searchForm = document.getElementById("controls");
export const main = document.getElementById("main");
const loader = document.getElementById("loader");
const movieList = [];

if (searchForm) {
  searchForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const searchInput = document.getElementById("find").value.trim();

    if (!searchInput) return;
    loader.classList.remove("hidden");

    main.innerHTML = "";

    try {
      const res = await fetch(
        `https://www.omdbapi.com/?apikey=8d1bd31c&s=${searchInput}`
      );
      const data = await res.json();
      if (data.Response === "False") {
        loader.classList.add("hidden");

        main.innerHTML = ` <h2 class="empty try-again">
          Unable to find what you’re looking for. Please try another search.
        </h2>`;
        return;
      }

      const filmDataList = await Promise.all(
        data.Search.map(async (movie) => {
          const filmResponse = await fetch(
            `https://www.omdbapi.com/?apikey=8d1bd31c&i=${movie.imdbID}`
          );
          return filmResponse.json();
        })
      );
      loader.classList.add("hidden");

      loadFilms(filmDataList);
    } catch (error) {
      loader.classList.add("hidden");
      console.error(`Error fetching data`, error);
      main.innerHTML = `<h2 class="empty try-again">
        Something went wrong. Please try again later.
      </h2>`;
    }
  });
}

document.addEventListener("click", function (e) {
  if (e.target.closest("[data-add]")) {
    addToWatchlist(e.target.closest("[data-add]"));
  }
});

export function loadFilms(filmList, mode = "add") {
  if (!main) return;
  for (let film of filmList) {
    movieList.push(film);
    main.innerHTML += `
            <div class="movie" id=${film.imdbID}>
          <img src="${film.Poster}" alt="poster of ${
      film.Poster
    }" class="poster" />
          <div class="details">
            <div class="title-rating">
              <h2 class="title">${film.Title}</h2>
              <p class="rating">⭐ ${film.imdbRating}</p>
            </div>
            <div class="genre-duration">
              <p class="time">${film.Runtime}</p>
              <p class="genre">${film.Genre}</p>
              <button class="add-watchlist" aria-label="${
                mode === "add" ? "Add to" : "Remove from"
              } watchlist" 
              data-${mode}="${film.imdbID}">
                <img src="images/${
                  mode === "add" ? "add" : "remove"
                }-icon.png" aria-hidden="true" />
                <p>${mode === "add" ? "Wathclist" : "Remove"}</p>
              </button>
            </div>
            <p class="plot">
              ${film.Plot}
            </p>
          </div>
        </div>
`;
  }
}

function addToWatchlist(btn) {
  const addedFilm = movieList.find((movie) => movie.imdbID === btn.dataset.add);
  let localList = getLocalStorage();

  if (localList.some((movie) => movie.imdbID === addedFilm.imdbID)) {
    showToast("Movie already added to watchlist");
    return;
  }
  showToast("Movie added to watchlist!");

  localList.push(addedFilm);
  localStorage.setItem("savedMovieList", JSON.stringify(localList));
}

export function getLocalStorage() {
  return localStorage.getItem("savedMovieList")
    ? JSON.parse(localStorage.getItem("savedMovieList"))
    : [];
}

export function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.remove("hidden");
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.classList.add("hidden"), 500); // hide after transition
  }, 1500); // show for 1.5s
}
