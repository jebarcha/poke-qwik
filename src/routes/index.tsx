import { component$, useSignal, $ } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import { PokemonImage } from '../components/pokemons/pokemon-image';

export default component$(() => {

  const pokemonId = useSignal(1); //primitives like booleans, strings, numbers
 // for objects we should use useStored

  const showBackImage = useSignal(false);

  const revealPokemon = useSignal(false);
  
  const changePokemonId = $((value: number) => {
    if ( (pokemonId.value + value) <= 0 ) return;

    revealPokemon.value = false;
    pokemonId.value += value;
  });


  return (
    <>
      
      <span class="text-2xl">Simple Searcher</span>

      <span class="text-9xl">{ pokemonId }</span>

      <PokemonImage id={pokemonId.value} backImage={showBackImage.value} isVisible={revealPokemon.value}/>

      <div class="mt-2">

        <button onClick$={ () => changePokemonId(-1) } 
          class="btn btn-primary mr-2"
          >
          Previous
        </button>

        <button onClick$={ () => changePokemonId(1) } class="btn btn-primary mr-2">Next</button>

        <button onClick$={ () => showBackImage.value = !showBackImage.value } class="btn btn-primary mr-2">Flip</button>

        <button onClick$={ () => revealPokemon.value = !revealPokemon.value } class="btn btn-primary">Reveal</button>

      </div>

    </>
  );
});

export const head: DocumentHead = {
  title: 'PokeQwik',
  meta: [
    {
      name: 'description',
      content: 'This is my first demo of Qwik',
    },
  ],
};
