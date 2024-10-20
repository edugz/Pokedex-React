import React, { useState, useEffect } from "react";
import "./PokeList.css";
import ErrorScreen from "../../Common/ErrorScreen/ErrorScreen";
import LoadingScreen from "../../Common/LoadingScreen/LoadingScreen";
import PokeItem from "./PokeItem/PokeItem";

function PokeList() {
  const [pokemonList, setPokemonList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleCount, setVisibleCount] = useState(16);

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const response = await fetch(
          "https://pokeapi.co/api/v2/pokemon?limit=493"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch Pokemon Data");
        }
        const data = await response.json();

        const detailedPokemonList = await Promise.all(
          data.results.map(async (pokemon) => {
            const detailedResponse = await fetch(pokemon.url);
            const detailedData = await detailedResponse.json();
            return {
              name: detailedData.name,
              id: detailedData.id,
              types: detailedData.types.map((type) => type.type.name),
              sprite: detailedData.sprites.front_default,
              shinySprite: detailedData.sprites.front_shiny,
            };
          })
        );

        setPokemonList(detailedPokemonList);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemon();
  }, []);

  const handleLoadMore = () => {
    setVisibleCount((prevCount) => prevCount + 16);
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return <ErrorScreen message={error} />;
  }

  console.log(pokemonList);

  return (
    <div className="list-main-container">
      {pokemonList.slice(0, visibleCount).map((pokemon) => {
        const pokemonProps = {
          name: pokemon.name,
          id: pokemon.id,
          types: pokemon.types,
          sprite: pokemon.sprite,
          shinySprite: pokemon.shinySprite,
        };
        return <PokeItem {...pokemonProps} key={pokemon.name} />;
      })}
      {visibleCount < pokemonList.length && (
        <div className="load-more-container">
          <button className="load-more-button" onClick={handleLoadMore}>
            Load More
          </button>
        </div>
      )}
    </div>
  );
}

export default PokeList;
