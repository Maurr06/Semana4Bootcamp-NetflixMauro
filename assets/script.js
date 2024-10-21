const apiKey = '';
const apiUrl = 'https://api.themoviedb.org/3';
const movieList = document.getElementById('movies');
const movieDetails = document.getElementById('movie-details');
const detailsContainer = document.getElementById('details');
const searchButton = document.getElementById('search-button');
const searchInput = document.getElementById('search-input');
const favoritesList = document.getElementById('favorites-list');
const addToFavoritesButton = document.getElementById('add-to-favorites');
let selectedMovieId = null;
let favoriteMovies = JSON.parse(localStorage.getItem('favorites')) || [];
let ListaPeliculas

// Fetch and display popular movies
async function fetchPopularMovies() {
    try {
        const datos = await fetch(`${apiUrl}/movie/popular?api_key=${apiKey}&language=es-ES`)
        const peliculas = await datos.json();
        ListaPeliculas = peliculas.results
        displayMovies(ListaPeliculas)

    } catch (error) {
        console.error('Error fetching popular movies:', error);
    }
}

// Display movies
function displayMovies(movies) {
    movieList.innerHTML = ''; // Limpia la lista de películas
    movies.forEach(movie => {
        const li = document.createElement('li');
        li.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
            <span>${movie.title}</span>
        `;
        li.onclick = () => showMovieDetails(movie.id); // Muestra detalles al hacer clic en la película
        movieList.appendChild(li);
    });
}

// Show movie details
async function showMovieDetails(movieId) {
    try {
        if (selectedMovieId === movieId) {
            movieDetails.classList.toggle('hidden');
        } else {
            selectedMovieId = movieId;
            movieDetails.classList.remove('hidden'); 
            
        }
        const pelicula = ListaPeliculas.find(pelicula => pelicula.id === movieId)
        let detalles = `
            <img src="https://image.tmdb.org/t/p/w200${pelicula.poster_path}" alt="Error en carga de imagen">
            <h3>${pelicula.title}</h3><br>
            <h3>Lanzamiento:</h3> <span>${pelicula.release_date}</span><br>
            <h3>Popularidad:</h3> <span>${pelicula.popularity}</span><br>
            <h3>Solo para adultos:</h3> <span>${pelicula.adult}</span><br>
            <h3>Lenguage original:</h3> <span>${pelicula.original_language} </span><br>
        `
        detailsContainer.innerHTML = detalles

    } catch (error) {
        console.error('Error fetching movie details:', error);
    }
}

// Search movies
searchButton.addEventListener('click', async () => {
    const query = searchInput.value;
    try {
        if(query){
            pelicula = ListaPeliculas.find(pelicula => pelicula.title === query)
            movieList.innerHTML = ''
            movieDetails.classList.add('hidden'); 

            if(pelicula !== undefined){                    
                const li = document.createElement('li');
                li.innerHTML = `
                    <img src="https://image.tmdb.org/t/p/w500${pelicula.poster_path}" alt="${pelicula.title}">
                    <span>${pelicula.title}</span>
                `
                li.onclick = () => showMovieDetails(pelicula.id)
                movieList.appendChild(li)

            }
            else{
                const li = document.createElement('li');
                li.innerHTML = `
                    <strong>No se han encontrado resultados, compruebe la ortografía e intentelo de nuevo,</strong><br><p>o vacie el campo de busqueda para mostrar todas las peliculas</p>
                `
                movieList.appendChild(li)
            }
        }
        else{
            displayMovies(ListaPeliculas)
        }
    } catch (error) {
        console.error('Error searching movies:', error);
    }
});

// Add movie to favorites
addToFavoritesButton.addEventListener('click', () => {
    if (selectedMovieId) {
        const favoriteMovie = {
            id: selectedMovieId,
            title: document.querySelector('#details h3').textContent
        };
        if (!favoriteMovies.some(movie => movie.id === selectedMovieId)) {
            favoriteMovies.push(favoriteMovie);
            localStorage.setItem('favorites', JSON.stringify(favoriteMovies)); // Guarda en localStorage
            displayFavorites(); // Muestra la lista actualizada de favoritos
        }
    }
});

// Display favorite movies
function displayFavorites() {
    favoritesList.innerHTML = ''; // Limpia la lista de favoritos
    favoriteMovies.forEach(movie => {
        const li = document.createElement('li');
        li.textContent = movie.title;
        favoritesList.appendChild(li);
    });
}
// Initial fetch of popular movies and display favorites
fetchPopularMovies(); // Obtiene y muestra las películas populares
displayFavorites(); // Muestra las películas favoritas guardadas