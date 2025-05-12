import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Home({ genres }) {
  const [featuredItem, setFeaturedItem] = useState(null);
  const [trailerUrl, setTrailerUrl] = useState('');
  const apiKey = '12750e83790c14a1a9c1acd50ff6bf8a';

  // My List state initialization
  const [myList, setMyList] = useState(() => {
    const savedList = localStorage.getItem('myList');
    return savedList ? JSON.parse(savedList) : [];
  });

  // Save My List to localStorage
  useEffect(() => {
    localStorage.setItem('myList', JSON.stringify(myList));
  }, [myList]);

  // My List functions
  const toggleMyList = (item) => {
    const isInList = myList.some(listItem => listItem.id === item.id);
    if (isInList) {
      setMyList(prev => prev.filter(listItem => listItem.id !== item.id));
    } else {
      setMyList(prev => [...prev, {
        id: item.id,
        title: item.title || item.name,
        poster_path: item.poster_path,
        media_type: item.media_type || (item.title ? 'movie' : 'tv'),
        genre: Object.keys(genres).find(genre => 
          genres[genre].items?.some(i => i.id === item.id)
        )
      }]);
    }
  };

  // Set featured item and trailer
  useEffect(() => {
    const allItems = Object.values(genres).flatMap(g => g.items || []);
    if (allItems.length > 0 && !featuredItem) {
      const randomItem = allItems[Math.floor(Math.random() * allItems.length)];
      setFeaturedItem(randomItem);
      
      const mediaType = randomItem.media_type || (randomItem.title ? 'movie' : 'tv');
      fetch(`https://api.themoviedb.org/3/${mediaType}/${randomItem.id}/videos?api_key=${apiKey}`)
        .then(res => res.json())
        .then(data => {
          const trailer = data.results?.find(v => 
            v.type === 'Trailer' && 
            v.site === 'YouTube' &&
            v.official
          );
          if (trailer) setTrailerUrl(`https://www.youtube.com/watch?v=${trailer.key}`);
        });
    }
  }, [genres]);

  // Sort genres: Popular first
  const sortedGenres = Object.entries(genres).sort(([genreA], [genreB]) => (
    genreA === 'Popular' ? -1 : genreB === 'Popular' ? 1 : 0
  ));

  return (
    <div>
      {/* Featured Section */}
      {featuredItem && (
        <section id="featured-section" className="featured-movie">
          <div className="container-fluid">
            <div className="row featured-card">
              <div className="col-12 position-relative">
                <img
                  src={`https://image.tmdb.org/t/p/w1280${featuredItem.backdrop_path}`}
                  className="img-fluid featured-background"
                  alt={`Featured ${featuredItem.title || featuredItem.name}`}
                />
                <div className="featured-overlay" />
                <div className="featured-content">
                  <h2 className="display-4 fw-bold mb-3 text-white">
                    {featuredItem.title || featuredItem.name}
                  </h2>
                  <p className="lead featured-description">
                    {featuredItem.release_date || featuredItem.first_air_date}
                  </p>
                  <div className="d-flex gap-3">
                    <button 
                      className="btn btn-lg netflix-play-btn"
                      onClick={() => trailerUrl && window.open(trailerUrl, '_blank')}
                    >
                      <i className="bi bi-play-fill" /> Play Now
                    </button>
                    <Link
                      to={`/${featuredItem.media_type || (featuredItem.title ? 'movie' : 'tv')}/${featuredItem.id}`}
                      className="btn btn-lg netflix-info-btn"
                    >
                      <i className="bi bi-info-circle" /> More Info
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Genre Sections */}
      {sortedGenres.map(([genre, { items }]) => (
        <section key={genre} className="movie-grid py-5">
          <div className="container-fluid movie-app">
            <h3 className="mb-4 text-white">{genre}</h3>
            <div className="row g-4">
              {items
                .filter(item => featuredItem?.id !== item.id)
                .map((item, index) => {
                  const mediaType = item.media_type || (item.title ? 'movie' : 'tv');
                  const isInList = myList.some(listItem => listItem.id === item.id);
                  
                  return (
                    <div key={item.id || index} className="movie-card-container col-6 col-sm-4 col-md-3 col-lg-2">
                      <div className="movie-card position-relative h-100">
                        <Link 
                          to={`/${mediaType}/${item.id}`}
                          className="h-100 d-block"
                        >
                          <img
                            src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                            className="img-fluid card-image h-100 w-100"
                            alt={item.title || item.name}
                            style={{ aspectRatio: '2/3' }}
                          />
                          <div className="card-overlay">
                            <h5>{item.title || item.name}</h5>
                            <div className="genre-tags">
                              <span>{genre}</span>
                            </div>
                            <button 
                              className={`btn netflix-add-btn ${isInList ? 'added' : ''}`}
                              onClick={(e) => {
                                e.preventDefault();
                                toggleMyList(item);
                              }}
                            >
                              <i className="bi bi-plus-lg" /> 
                              {isInList ? ' Remove' : ' My List'}
                            </button>
                          </div>
                        </Link>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}

export default Home;