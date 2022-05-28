// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'

// 🐨 you'll want the following additional things from '../pokemon':
// fetchPokemon: the function we call to get the pokemon info
// PokemonInfoFallback: the thing we show while we're loading the pokemon info
// PokemonDataView: the stuff we use to display the pokemon info
import {PokemonForm, fetchPokemon, PokemonInfoFallback, PokemonDataView} from '../pokemon'

const pokemonReducer = (state, action) => {
  switch (action.type) {
    case 'ERROR': {
      return {
        ...state,
        status: 'rejected',
        error: action.error,
      }
    }
    case 'SUCCESS': {
      return {
        ...state,
        status: 'resolved',
        pokemon: action.pokemon,
      }
    }
    case 'STARTED': {
      return {
        ...state,
        status: 'pending',
        pokemon: null,
      }
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`)
    }
  }
}

function PokemonInfo({pokemonName}) {
  // 🐨 Have state for the pokemon (null)
  const [{pokemon, error, status}, dispatch] = React.useReducer(pokemonReducer, {pokemon: null, status: "idle", error: null});
  // 🐨 use React.useEffect where the callback should be called whenever the
  React.useEffect(() => {
    if (pokemonName) {
      dispatch({type:'STARTED'})
      fetchPokemon(pokemonName).then(
        pokemonData => dispatch({type:'SUCCESS', pokemon: pokemonData}),
        error => dispatch({type:'ERROR', error: error}),
      )
    }  
  }, [pokemonName])
  
  if (status === "idle") return 'Submit a pokemon'

  if (status === 'rejected') {
    return (<div role="alert">
  There was an error: <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
</div>)
  }

  if (status === 'resolved') {
    return <PokemonDataView pokemon={pokemon} />
  }

  if (status === 'pending') {
    return <PokemonInfoFallback name={pokemonName} />
  }

}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <PokemonInfo pokemonName={pokemonName} />
      </div>
    </div>
  )
}

export default App
