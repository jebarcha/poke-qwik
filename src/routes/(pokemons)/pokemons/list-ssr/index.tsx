import { component$, useComputed$, useSignal, $, useStore, useVisibleTask$ } from '@builder.io/qwik';
import { type DocumentHead, Link, routeLoader$, useLocation } from '@builder.io/qwik-city';
import { getSmallPokemons } from '~/helpers/get-small-pokemons';
import type { SmallPokemon } from '~/interfaces';
import { PokemonImage } from '../../../components/pokemons/pokemon-image';
import { Modal } from '~/components/shared';
import { getFunFactAboutPoemon } from '~/helpers/get-chat-gpt-response';

export const usePokemonList = routeLoader$<SmallPokemon[]>(async({query, redirect, pathname}) => {

  const offset = Number(query.get('offset') || 0);
  if ( isNaN(offset)) redirect(301, pathname);
  if (offset < 0 ) redirect(301, pathname);

  return getSmallPokemons(offset);
})


export default component$(() => {

  const pokemons = usePokemonList();
  const location = useLocation();

  const modalVisible = useSignal(false);
  const modalPokemon = useStore({
    id: '',
    name: ''
  });

  const chatGptPokemonFact = useSignal('');


  // Modal functions
  const showModal = $((id: string, name: string) => {
    //console.log({id, name})
    modalPokemon.id = id;
    modalPokemon.name = name;

    modalVisible.value = true;
  });

  const closeModal = $(() => {
    modalVisible.value = false;
  });


  // TODO: test async
  useVisibleTask$(({track}) => {
    track(() => modalPokemon.name);

    chatGptPokemonFact.value = '';

    if (modalPokemon.name.length > 0) {
      getFunFactAboutPoemon(modalPokemon.name)
        .then( resp => chatGptPokemonFact.value = resp);
    }
  });


  const currentOffset = useComputed$<number>( () => {
    const offsetString = new URLSearchParams(location.url.search);
    return Number(offsetString.get('offset') || 0);
  });

  return (
    <>
      <div class="flex flex-col">
        <span class="my-5 text-5xl">Status</span>
        <span>Current offset: { currentOffset }</span>
        <span>Is loading: { location.isNavigating ? 'Yes' : 'No'}</span>

      </div>

      <div class="mt-10">
        <Link href={ `/pokemons/list-ssr/?offset=${currentOffset.value - 10}` }
          class="btn btn-primary mr-2">
          Previous
        </Link>

        <Link href={ `/pokemons/list-ssr/?offset=${currentOffset.value + 10}` }
          class="btn btn-primary mr-2">
          Next
        </Link>
      </div>

      <div class="grid grid-cols-6 mt-5">
        {
          pokemons.value.map( ({ name, id }) => (
            <div key={name} 
                 onClick$={() => showModal(id, name)}
                 class="m-5 flex flex-col justify-center items-center"
            >
              <PokemonImage id={id} isVisible></PokemonImage>
              <span class="capitalize">{name}</span>
            </div>
          ))
        }
        
      </div>

      <Modal
        size='md'
        persistent
        showModal={modalVisible.value} 
        closeFn={closeModal}
      >
        <div q:slot='title'>{ modalPokemon.name }</div>
        <div q:slot='content' class="flex flex-col justify-center items-center">
          <PokemonImage id={modalPokemon.id} isVisible/>
          <span>
            { chatGptPokemonFact.value === ''
              ? 'Asking ChatGPT'
              : chatGptPokemonFact.value
            }
          </span>
        </div>
      </Modal>


    </>
  )
});

export const head: DocumentHead = {
  title: 'List SSR',
  meta: [
    {
      name: 'description',
      content: 'This is Server side',
    },
  ],
};
