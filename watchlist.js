import { getLocalStorage, loadFilms, main, showToast } from "./index.js";

window.addEventListener("DOMContentLoaded", setUpList);

function setUpList() {
  let movieList = getLocalStorage();

  if (!movieList || movieList.length === 0) {
    main.innerHTML = `<h2 class="empty try-again">
          Your watchlist is looking a little empty...
        </h2>
        <a
          href="index.html"
          class="add-watchlist go-search"
          aria-label="Search for movies to add"
        >
          <img src="images/add-icon.png" aria-hidden="true" />
          <p>Let’s add some movies!</p>
        </a>`;

    return;
  }
  main.innerHTML = "";
  loadFilms(movieList, "remove");
}

document.addEventListener("click", function (e) {
  if (e.target.closest("[data-remove]")) {
    removeFromWatchlist(e.target.closest("[data-remove]"));
    showToast("Movie removed from watchlist!");
  }
});

function removeFromWatchlist(btn) {
  const id = btn.dataset.remove;
  let localList = getLocalStorage();
  localList = localList.filter((movie) => movie.imdbID !== id);
  localStorage.setItem("savedMovieList", JSON.stringify(localList));
  setUpList();
}
