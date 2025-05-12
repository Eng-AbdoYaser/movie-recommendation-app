// ActionFetcher.jsx
import { useEffect } from 'react';

function ActionFetcher({ onDataReady }) {
  useEffect(() => {
    async function fetchData() {
      try {
        const apiKey = '12750e83790c14a1a9c1acd50ff6bf8a';
        
        // Action movies (genre ID 28)
        const movieRes = await fetch(
          `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=12`
        );
        const movieData = await movieRes.json();
        
        // Action TV shows (genre ID 10759)
        const seriesRes = await fetch(
          `https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}&with_genres=10759`
        );
        const seriesData = await seriesRes.json();

        onDataReady({
          genre: 'Adventure',
          items: [...(movieData.results || []), ...(seriesData.results || [])]
        });
      } catch (error) {
        console.error('Error fetching Action data:', error);
      }
    }
    fetchData();
  }, [onDataReady]);

  return null;
}

export default ActionFetcher;