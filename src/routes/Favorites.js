import React from "react";
import { useLocation } from "react-router-dom";

const Favorites = () => {
  const data = useLocation();
  const favoriteItems = data.state.favorites.shows.favorites;
  console.log(favoriteItems);
  return (
    <div>
      <h1>Favorites</h1>
      <ul>
        {favoriteItems.map((item) => (
          <li key={item.show.id}>{item.show.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default Favorites;
