// import { useEffect,useState } from "react";
// function ComedyAPI() {
//     const [movies, setMovies] = useState([]);
//     const [moviesDetails, setMoviesDetails] = useState([]);
//     const [comedyMovies, setComedyMovies] = useState([]);
//     useEffect(() => {
//         // Fetch initial movies
//         fetch("http://www.omdbapi.com/?s=comedy&type=movie&apikey=af4a2963")
//             .then(res => res.json())
//             .then(body => {
//             setMovies(body.Search || []);
//             // Fetch details for each movie
//             const detailsPromises = body.Search.map(movie => 
//                 fetch(`http://www.omdbapi.com/?i=${movie.imdbID}&apikey=af4a2963`)
//                 .then(res => res.json())
//             );
//             return Promise.all(detailsPromises);
//             })
//             .then(details => setMoviesDetails(details))
//             .catch(err => console.error("Fetch error:", err));
//         }, []);
//     useEffect(()=>{
//             moviesDetails.filter((movie) => {
//                 if (movie.Genre.includes("Comedy")) {
//                     setComedyMovies((prev) => [...prev, movie]);
//                 }
//             })
//         },[moviesDetails])
//     // useEffect(() => {
//     //     console.log("Comedy Movies: ", comedyMovies);
//     // }, [comedyMovies]);
    
//     return ( <>{comedyMovies}</> );
// }

// export default ComedyAPI;
//////////////////////////////////////////////////////////////
import { useEffect } from 'react';

function ComedyFetcher({ onDataReady }) {
  useEffect(() => {
    async function fetchData() {
      try {
        const apiKey = '12750e83790c14a1a9c1acd50ff6bf8a';

        const movieRes = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=35`);
        const movieData = await movieRes.json();

        const seriesRes = await fetch(`https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}&with_genres=35`);
        const seriesData = await seriesRes.json();

          onDataReady({
            genre: 'Comedy',
            items: [...(movieData.results || []), ...(seriesData.results || [])],
          });
        
      } catch (error) {
        console.error('Error fetching Comedy data:', error);
      }
    }
    fetchData();
  }, [onDataReady]);

  return null;
}

export default ComedyFetcher;
