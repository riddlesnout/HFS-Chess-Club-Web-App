import { Events } from './Events.js';
const URL = "http://localhost:3260"; // URL of our server

export class EventsView {
  #events = null;
  #eventList = null;

  constructor() {
    this.#events = Events.events();
  }

  async render() {
    // Create the root element
    const eventsViewElm = document.createElement('div');
    eventsViewElm.id = 'events-view';

    const titleElm = document.createElement('h1');
    titleElm.innerText = 'Events';

    // Create and render the event list and add event form
    const eventList = new EventList();
    const addEventForm = new AddEventForm();

    eventsViewElm.appendChild(titleElm);
    eventsViewElm.appendChild(await eventList.render());
    eventsViewElm.appendChild(addEventForm.render());

    return eventsViewElm;
  }
}

class EventList {
  #events = null;
  #list = null;

  constructor() {
    this.#events = Events.events();
  }

  async render() {
    const eventListElm = document.createElement('div');
    eventListElm.className = 'event-list';

    const events = await this.#getEvents();
    const sortedEvents = events.sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`));
    
    this.#list = document.createElement('ul');

    sortedEvents.forEach(event => {
      const listItem = this.#makeEventItem(event);
      this.#list.appendChild(listItem);
    });

    eventListElm.appendChild(this.#list);

    this.#events.subscribe('event-update', async () => {
      const events = await this.#getEvents();
      const sortedEvents = events.sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`));
      this.#list.innerHTML = ''; // Clear existing list
      sortedEvents.forEach(event => {
        const listItem = this.#makeEventItem(event);
        this.#list.appendChild(listItem);
      });
    });

    return eventListElm;
  }

  #makeEventItem(event) {
    const li = document.createElement('li');
    li.className = 'event-item';

    const eventDetails = document.createElement('div');
    eventDetails.className = 'event-details';
    eventDetails.innerHTML = `
      <span><strong>Name:</strong> ${event.name}</span>
      <span><strong>Date:</strong> ${event.date}</span>
      <span><strong>Time:</strong> ${event.time}</span>
      <span><strong>Location:</strong> ${event.location}</span>
    `;

    const editButton = document.createElement('button');
    editButton.className = 'edit-button';
    editButton.innerText = 'Edit';
    editButton.addEventListener('click', () => this.#handleEditEvent(event, li));

    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete-button';
    deleteButton.innerText = 'Delete';
    deleteButton.addEventListener('click', () => this.#handleDeleteEvent(event.id, li));

    li.appendChild(eventDetails);
    li.appendChild(editButton);
    li.appendChild(deleteButton);

    return li;
  }

  async #getEvents() {
    const response = await fetch(`${URL}/events`, {
      method: 'GET'
    });
    if (response.ok) {
      return response.json();
    }
    return [];
  }

  async #updateEvent(event) {
    const response = await fetch(`${URL}/events`, {
      method: 'PUT',
      body: JSON.stringify(event),
    });

    if (!response.ok) {
      alert('Failed to update event.');
    }
  }

  async #handleEditEvent(event, listItem) {
    const eventDetails = listItem.querySelector('.event-details');

    // Create input fields for editing
    const inputs = `
      <input type="text" id="edit-name" value="${event.name}" placeholder="Event Name"/>
      <input type="date" id="edit-date" value="${event.date}" />
      <input type="time" id="edit-time" value="${event.time}" />
      <input type="text" id="edit-location" value="${event.location}" placeholder="Location"/>
    `;

    eventDetails.innerHTML = inputs;

    const saveButton = document.createElement('button');
    saveButton.className = 'save-button';
    saveButton.innerText = 'Save';
    saveButton.addEventListener('click', async () => {
      const updatedEvent = {
        id: event.id,
        name: document.getElementById('edit-name').value,
        date: document.getElementById('edit-date').value,
        time: document.getElementById('edit-time').value,
        location: document.getElementById('edit-location').value,
      };
      
      await this.#updateEvent(updatedEvent);

      // Re-render the event list after saving
      const updatedListItem = this.#makeEventItem(updatedEvent);
      listItem.replaceWith(updatedListItem);

      alert('Event successfully updated!');
    });

    listItem.replaceChild(saveButton, listItem.querySelector('.edit-button'));
  }

  async #handleDeleteEvent(eventId, listItem) {
    const confirmation = confirm('Are you sure you want to delete this event?');
    if (confirmation) {
      const response = await fetch(`${URL}/events`, {
        method: 'DELETE',
        body: JSON.stringify({ id: eventId }),
      });

      if (response.ok) {
        // Remove the event item from the list
        listItem.remove();
        alert('Event successfully deleted!');
      } else {
        alert('Failed to delete event.');
      }
    }
  }
}

class AddEventForm {
    #events = null;

    constructor() {
        this.#events = Events.events();
        }

  render() {
    const form = document.createElement('form');
    form.className = 'add-event-form';
    form.innerHTML = `
      <input type="text" id="event-name" placeholder="Event Name" required />
      <input type="date" id="event-date" required />
      <input type="time" id="event-time" required />
      <input type="text" id="event-location" placeholder="Location" required />
      <button type="submit">Add Event</button>
    `;

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const newEvent = {
        id: Date.now(),
        name: document.getElementById('event-name').value,
        date: document.getElementById('event-date').value,
        time: document.getElementById('event-time').value,
        location: document.getElementById('event-location').value,
      };

      const response = await fetch(`${URL}/events`, {
        method: 'POST',
        body: JSON.stringify(newEvent),
      });

      if (response.ok) {
        form.reset();

        alert('Event successfully added!');

        // Reload the page or refresh the event list
        this.#events.publish('navigateTo', 'events');
      } else {
        alert('Failed to add event.');
      }
    });

    return form;
  }
}
