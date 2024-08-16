import { Events } from './Events.js';
import { NavBar } from './Navbar.js';
import { ProfileView } from './profileView.js';

class App {
  #mainViewElm = null;
  #events = null;
  #tempView = null;

  constructor() {
    this.#events = Events.events();
  }

  async render(root) {
    const rootElm = document.getElementById(root);
    rootElm.innerHTML = '';

    const navbarElm = document.createElement('div');
    navbarElm.id = 'navbar';
    const navbar = new NavBar();
    navbarElm.appendChild(await navbar.render());

    this.#mainViewElm = document.createElement('div');
    this.#mainViewElm.id = 'main-view';

    rootElm.appendChild(navbarElm);
    rootElm.appendChild(this.#mainViewElm);

    this.#navigateTo('profile');
    this.#events.subscribe('navigateTo', view => this.#navigateTo(view));
  }

  async #navigateTo(view) {
    //this.#tempView = this.#mainViewElm;
    this.#mainViewElm.innerHTML = '';
    if (view === 'profile') {
      const profView = new ProfileView();
      this.#mainViewElm.appendChild(await profView.renderProfile());      
      window.location.hash = view;

    } else if (view === 'events') {
      const archive = document.createElement('div');
      archive.innerHTML = '<h1>Events View</h1>';
      this.#mainViewElm.appendChild(archive);
      window.location.hash = view;
    } else {
      window.location.hash = 'profile';
    }
  }  
}

const resetState = () => {
  localStorage.clear();
  const app = new App();
  app.render('root');
};

async function preloadBackgroundImage() {
  return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = 'https://media.gettyimages.com/id/171249150/photo/chess.jpg?s=612x612&w=0&k=20&c=VIJuXyYmabrrzBItMMIa70GMn778qIKjL_FK3uDK7tE='; // Use the direct URL to the image file
      img.onload = () => resolve();
      img.onerror = () => reject(new Error('Background image failed to load.'));
  });
}


// Mount the application to the root element.
try {
  await preloadBackgroundImage(); // Wait until the background image is loaded
} catch (error) {
  console.error(error.message);
}
const app = new App();
await app.render('root');


document.getElementById('reset-state').addEventListener('click', resetState);


