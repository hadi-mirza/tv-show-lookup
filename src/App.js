import "./App.css";
import axios from "axios";
import React from "react";

const API_ENDPOINT = "http://api.tvmaze.com/search/shows?q=";

function App() {
  const showsReducer = (state, action) => {
    switch (action.type) {
      case "SHOWS_FETCH_INIT":
        return {
          ...state,
          isLoading: true,
          isError: false,
        };
      case "SHOWS_FETCH_SUCCESS":
        return {
          ...state,
          isLoading: false,
          isError: false,
          data: action.payload,
        };
      case "SHOWS_FETCH_FAILURE":
        return {
          ...state,
          isLoading: false,
          isError: true,
        };
      case "REMOVE_ITEM":
        return {
          ...state,
          data: state.data.filter(
            (show) => action.payload.show.id !== show.show.id
          ),
        };
      default:
        throw new Error();
    }
  };

  const [searchTerm, setSearchTerm] = React.useState("");
  const [url, setUrl] = React.useState(`${API_ENDPOINT}${searchTerm}`);

  const [shows, dispatchShows] = React.useReducer(showsReducer, {
    data: [],
    isLoading: false,
    isError: false,
  });

  const handleFetchShows = React.useCallback(async () => {
    dispatchShows({ type: "SHOWS_FETCH_INIT" });

    try {
      const result = await axios.get(url);

      dispatchShows({
        type: "SHOWS_FETCH_SUCCESS",
        payload: result.data,
      });
    } catch {
      dispatchShows({ type: "SHOWS_FETCH_FAILURE" });
    }
  }, [url]);

  React.useEffect(() => {
    handleFetchShows();
  }, [handleFetchShows]);

  const handleSearchTerm = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = (event) => {
    setUrl(`${API_ENDPOINT}${searchTerm}`);

    event.preventDefault();
  };

  const handleRemoveItem = React.useCallback((item) => {
    dispatchShows({
      type: "REMOVE_ITEM",
      payload: item,
    });
    console.log(item);
  });

  return (
    <div>
      <h1>TV Show lookup</h1>
      <Search handleSearchTerm={handleSearchTerm} handleSearch={handleSearch} />
      {shows.isError && <p>Something went wrong...</p>}
      {shows.isLoading ? (
        <p>Loading...</p>
      ) : (
        <List list={shows.data} onRemoveItem={handleRemoveItem} />
      )}
      {!searchTerm && <p>Enter a TV show</p>}
    </div>
  );
}

const List = ({ list, onRemoveItem }) => (
  <ul>
    {list.map((item) => (
      <Item key={item.show.id} item={item} onRemoveItem={onRemoveItem} />
    ))}
  </ul>
);

const Item = ({ item, onRemoveItem }) => (
  <li>
    <a href={item.show.url}>{item.show.name}</a>
    <span>
      <button type="button" onClick={() => onRemoveItem(item)}>
        Remove
      </button>
    </span>
  </li>
);

const Search = ({ handleSearchTerm, handleSearch }) => (
  <form onSubmit={handleSearch}>
    <input id="search" onChange={handleSearchTerm} />
    <button type="submit">Search</button>
  </form>
);

export default App;
