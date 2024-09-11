import React, { Component } from 'react';
import './index.css';
import { downloadImage } from '../../utils';
import Header from '../Header';

class Community extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gifs: [],
      loading: true,
      offset: '',
      hasMore: true,
      query: '', // Search query state
      search: '', // Current search query
    };
    this.scrollContainer = React.createRef();
  }

  componentDidMount() {
    this.fetchGifs();
    if (this.scrollContainer.current) {
      this.scrollContainer.current.addEventListener('scroll', this.handleScroll);
    }
  }

  componentWillUnmount() {
    if (this.scrollContainer.current) {
      this.scrollContainer.current.removeEventListener('scroll', this.handleScroll);
    }
  }

  fetchGifs = async () => {
    if (!this.state.hasMore) return;

    try {
      const { query, offset } = this.state;
      console.log(offset)
      const apiUrl = query==='' ?  `https://tenor.googleapis.com/v2/featured?key=${process.env.REACT_APP_GOOGLE_API_KEY}&client_key=${process.env.REACT_APP_GOOGLE_CLIENT_ID}&limit=50&pos=${offset}`:`https://tenor.googleapis.com/v2/search?q=${query}&key=${process.env.REACT_APP_GOOGLE_API_KEY}&client_key=${process.env.REACT_APP_GOOGLE_CLIENT_ID}&limit=50&pos=${offset}`;

      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      const results = data.results || [];

      const existingIds = new Set(this.state.gifs.map(gif => gif.id));
      const newGifs = results.filter(gif => !existingIds.has(gif.id));

      this.setState(prevState => ({
        gifs: [...prevState.gifs, ...newGifs],
        loading: false,
        offset: data.next,
        hasMore: newGifs.length > 0
      }));

    } catch (error) {
      console.error('Error fetching GIFs:', error);
      this.setState({ loading: false });
    }
  };

  handleScroll = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const clientHeight = window.innerHeight || document.documentElement.clientHeight;
    const scrollHeight = document.documentElement.scrollHeight;
  
    if (scrollTop + clientHeight >= scrollHeight - 10) { // Adjust the threshold as needed
      this.fetchGifs();
    }
  };
  

  handleSearchChange = (event) => {
    this.setState({ query: event.target.value });
  };

  handleSearchSubmit = (event) => {
    event.preventDefault();
    this.setState({ 
      gifs: [], // Clear the existing GIFs
      offset: 0, // Reset the offset for the new search
      hasMore: true,
      search: this.state.query // Update the search query
    }, () => {
      this.fetchGifs(); // Fetch new GIFs based on the search query
    });
  };

  render() {
    const { gifs, loading, query } = this.state;

    return (
      <>
        <Header />
        <div className="gif-gallery-container" ref={this.scrollContainer}>
          <h1 className="page-title">Community GIF Showcase</h1>
          <form onSubmit={this.handleSearchSubmit} className="search-form">
            <input 
              type="text" 
              value={query}
              onChange={this.handleSearchChange} 
              placeholder="Search for GIFs..." 
              className="search-input"
            />
            <button type="submit" className="search-button">Search</button>
          </form>
          {loading && <p>Loading GIFs...</p>}
          {!loading && gifs.length === 0 && (
            <p className="no-results-message">Try searching for something!</p>
          )}
          <div className="gif-grid">
            {gifs.map(gif => (
              <div key={gif.id} className="gif-item">
                {gif.media_formats?.tinygif?.url ? (
                  <>
                    <img 
                      src={gif.media_formats.tinygif.url} 
                      alt={gif.content_description || 'GIF'} 
                    />
                    <button 
                      onClick={() => downloadImage(gif.content_description, `gif-${gif.id}.gif`)}
                      className="btn-download"
                    >
                      Download
                    </button>
                  </>
                ) : (
                  <p>Preview not available</p>
                )}
                <p>{gif.content_description || 'No description'}</p>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  }
}

export default Community;
