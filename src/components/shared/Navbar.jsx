import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import axios from "axios";

function Navbar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchContainerRef = useRef(null);
  const navigate = useNavigate();
  const apiKey = "12750e83790c14a1a9c1acd50ff6bf8a";

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchTerm.trim()) {
        try {
          const response = await axios.get(
            `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&query=${encodeURIComponent(searchTerm)}`
          );
          setSearchResults(response.data.results);
        } catch (error) {
          console.error("Search error:", error);
          setSearchResults([]);
        }
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setSearchResults([]);
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (mediaType, id) => {
    setSearchTerm("");
    setSearchResults([]);
    navigate(`/${mediaType}/${id}`);
  };

    const handleLogout = () => {
        localStorage.removeItem('currentUser');
    }


  return (
    <>
      <nav className="navbar navbar-expand-lg fixed-top netflix-navbar">
        <div className="container-fluid">
          <Link className="navbar-brand netflix-red fw-bold fs-2" to="/home">
            FLIXVERSE
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link" to="/home">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/movies">
                  Movies
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/trending">
                  Trending
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/userlist">
                  My Lists
                </Link>
              </li>
            </ul>

            <div className="d-flex align-items-center position-relative" ref={searchContainerRef}>
              <div className="search-container">
                <input
                  type="search"
                  className="form-control netflix-search"
                  placeholder="Search movies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                />
                
                {searchResults.length > 0 && isSearchFocused && (
                  <div 
                    className="search-results-dropdown"
                    style={{
                      position: 'fixed',
                      top: '60px',
                      left: searchContainerRef.current?.offsetLeft,
                      width: searchContainerRef.current?.offsetWidth
                    }}
                  >
                    {searchResults.map((item) => (
                      <div
                        key={item.id}
                        className="search-result-item"
                        onClick={() => handleSearchSubmit(item.media_type || (item.title ? "movie" : "tv"), item.id)}
                      >
                        <img
                          src={item.poster_path 
                            ? `https://image.tmdb.org/t/p/w92${item.poster_path}`
                            : '/placeholder-search.jpg'}
                          alt={item.title || item.name}
                          className="search-result-poster"
                        />
                        <div className="search-result-info">
                          <div className="search-result-title">
                            {item.title || item.name}
                          </div>
                          <div className="search-result-type">
                            {item.media_type === "movie" ? "Movie" : "TV Show"} ·{" "}
                            {(item.release_date || item.first_air_date)?.substring(0, 4)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <Link to="/" onClick={handleLogout()} className="btn netflix-btn-logout ms-3">
                Logout
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;