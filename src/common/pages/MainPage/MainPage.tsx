import { observer } from 'mobx-react-lite';
import { CartOverlay, LoaderFullscreen } from '../../components';
import { useStore } from '../../hooks';
import './MainPage.css';
import { Modals } from './modals';
import { Sections } from './sections';

export const MainPage: React.FC = observer(() => {
  const { mainPage, cartStore } = useStore();
  const { selectedCourse, isLoading } = mainPage;
  return (
    <main className='page main_page'>
      <LoaderFullscreen isLoad={isLoading} />
      {selectedCourse &&
        <Modals.course course={selectedCourse} />
      }
      <Sections.header />
      <Sections.carusel />
      <Sections.filter />
      <Sections.categories />
      <Sections.footer />
      <CartOverlay count={cartStore.items.length}/>
    </main>
  )
})

