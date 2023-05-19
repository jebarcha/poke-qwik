import { component$, Slot, useStyles$ } from '@builder.io/qwik';

// import Header from '~/components/starter/header/header';
import Navbar from '../components/shared/navbar/navbar';

import styles from './styles.css?inline';

export default component$(() => {
  useStyles$(styles);
  return (
    <>
      <Navbar />
      <main class="flex flex-col items-center justify-center">
        <Slot />
      </main>
    </>
  );
});
