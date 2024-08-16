import { Events } from './Events.js';
import { NavBar } from './Navbar.js';
import { ProfileView } from './profileView.js';
import { EventsView } from './eventsView.js';
import { MembersView } from './membersView.js';

export class App {
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
      this.#mainViewElm.appendChild(await profView.render());      
      window.location.hash = view;

    } else if (view === 'events') {
      const eventsView = new EventsView();
      this.#mainViewElm.appendChild(await eventsView.render());
      window.location.hash = view;
    }else if (view === 'members') {
      const membersView = new MembersView();
      this.#mainViewElm.appendChild(await membersView.render());
      window.location.hash = view;
    }else if (view === 'results') {
      const resultsView = document.createElement('h1');
      resultsView.innerHTML = 'To be implemented';
      this.#mainViewElm.appendChild(resultsView);
      window.location.hash = view;
    }else {
      window.location.hash = 'profile';
    }
  }  
}

