import express, { json } from "express";
import logger from "morgan";
import * as db from "./db.js";

const headerFields = { "Content-Type": "text/html" };

let obj = {
    initProfile: [
    {
      id: 'admin',
      name: 'Chess Club Admin',
      email: 'admin@gmail.com',
      phone: '123-456-7890',
      dob: '2010-01-01',
      password: 'abcdef'
    },
    {
      id: 'user1',
      name: 'Chess Club Member 1',
      email: 'memberxyz@gmail.com',
      phone: '987-654-3210',
      dob: '2011-06-16',
      password: 'qwerty'
    }
  ],
  initEvents: [
    { id: '1', name: 'Chess Club Meeting', date: '2024-08-20', time: '14:30', location: 'HFS basement area' },
    { id: '2', name: 'Local Tournament', date: '2024-09-05', time: '10:00', location: 'Community Center' },
    { id: '3', name: 'Special Training Session', date: '2024-08-25', time: '16:00', location: 'HFS basement area' }
]
};

async function initializeDatabases() {
    try {
        await db.destroy();
      // Insert initial members
      for (const member of obj.initProfile) {
        await db.saveMember(member.id, member);
      }
  
      // Insert initial events
      for (const event of obj.initEvents) {
        await db.saveEvent(event.id, event);
      }
  
      console.log("Databases initialized with initial data.");
    } catch (err) {
      console.error("Error initializing databases:", err);
    }
  }

/**
 * Event Operations
 */

/**
 * Asynchronously creates a new event.
 */
async function createEvent(response, event) {
  if (!event.name || !event.date || !event.time || !event.location) {
    response.writeHead(400, headerFields);
    response.write("<h1>All Event Details Required</h1>");
    response.end();
  } else {
    try {
      await db.saveEvent(event.id, event);
      response.writeHead(200, headerFields);
      response.write(`<h1>Event ${event.name} Created</h1>`);
      response.end();
    } catch (err) {
      response.writeHead(500, headerFields);
      response.write("<h1>Internal Server Error</h1>");
      response.write("<p>Unable to create event</p>");
      response.end();
    }
  }
}

/**
 * Asynchronously reads all events.
 */
async function readEvents(response) {
  try {
    const events = await db.loadAllEvents();
    response.writeHead(200, headerFields);
    response.write("Events loaded successfully");
    response.json(events);
    response.end();
  } catch (err) {
    response.writeHead(500, headerFields);
    response.write("<h1>Internal Server Error</h1>");
    response.write("<p>Unable to load events</p>");
    response.end();
  }
}

/**
 * Asynchronously updates an event by its ID.
 */
async function updateEvent(response, eventId, updatedEvent) {
  try {
    await db.modifyEvent({_id: eventId, eventData: updatedEvent});
    response.writeHead(200, headerFields);
    response.write(`<h1>Event Updated</h1>`);
    response.end();
  } catch (err) {
    response.writeHead(404, headerFields);
    response.write(`<h1>Event Not Found</h1>`);
    response.end();
  }
}

/**
 * Asynchronously deletes an event by its ID.
 */
async function deleteEvent(response, eventId) {
  try {
    await db.removeEvent(eventId);
    response.writeHead(200, headerFields);
    response.write(`<h1>Event Deleted</h1>`);
    response.end();
  } catch (err) {
    response.writeHead(404, headerFields);
    response.write(`<h1>Event Not Found</h1>`);
    response.end();
  }
}

/**
 * Member Operations
 */

async function createMember(response, member) {
  if (!member.name || !member.email || !member.phone || !member.dob || !member.id || !member.password) {
    response.writeHead(400, headerFields);
    response.write("<h1>All Member Details Required</h1>");
    response.end();
  } else {
    try {
      await db.saveMember(member.id, member);
      response.writeHead(200, headerFields);
      response.write(`<h1>Member ${member.name} Created</h1>`);
      response.end();
    } catch (err) {
      response.writeHead(500, headerFields);
      response.write("<h1>Internal Server Error</h1>");
      response.write("<p>Unable to create member</p>");
      response.end();
    }
  }
}

async function readMembers(response) {
  try {
    const members = await db.loadAllMembers();
    response.writeHead(200, headerFields);
    response.write("Events loaded successfully");
    response.json(members);
    response.end();
  } catch (err) {
    response.writeHead(500, headerFields);
    response.write("<h1>Internal Server Error</h1>");
    response.write("<p>Unable to load members</p>");
    response.end();
  }
}

/**
 * Asynchronously updates a member by their ID.
 */
async function updateMember(response, memberId, updatedMember) {
  try {
    await db.modifyMember({_id: memberId, memberData: updatedMember});
    response.writeHead(200, headerFields);
    response.write(`<h1>Member Updated</h1>`);
    response.end();
  } catch (err) {
    response.writeHead(404, headerFields);
    response.write(`<h1>Member Not Found</h1>`);
    response.end();
  }
}

/**
 * Asynchronously deletes a member by their ID.
 */
async function deleteMember(response, memberId) {
  try {
    await db.removeMember(memberId);
    response.writeHead(200, headerFields);
    response.write(`<h1>Member Deleted</h1>`);
    response.end();
  } catch (err) {
    response.writeHead(404, headerFields);
    response.write(`<h1>Member Not Found</h1>`);
    response.end();
  }
}


const app = express();
const port = 3260;

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static("src/frontend"));

const MethodNotAllowedHandler = async (request, response) => {
  response.status(405);
  response.type("text/plain");
  response.send("Method Not Allowed");
};

// Event Routes
app
  .route("/events")
  .get(async (request, response) => {
    await readEvents(response);
  })
  .post(async (request, response) => {
    const event = request.body;
    await createEvent(response, JSON.parse(event));
  })
  .put(async (request, response) => {
    const updatedEvent = JSON.parse(request.body);
    await updateEvent(response, updatedEvent.id, updatedEvent);
  })
  .delete(async (request, response) => {
    const eventId = JSON.parse(request.body);
    await deleteEvent(response, eventId);
  })
  .all(MethodNotAllowedHandler);

// Member Routes
app
  .route("/members")
  .get(async (request, response) => {
    await readMembers(response);
  })
//   .post(async (request, response) => {
//     const member = request.body;
//     await createMember(response, member);
//   })
  .put(async (request, response) => {
    const updatedMember = JSON.parse(request.body);
    await updateMember(response, updatedMember.id, updatedMember);
  })
  .delete(async (request, response) => {
    const memberId = JSON.parse(request.body);
    await deleteMember(response, memberId);
  })
  .all(MethodNotAllowedHandler);

// Handle 404 for any other routes (always will be last route)
app.route("*").all((request, response) => {
  response.status(404).send(`Not found: ${request.path}`);
});


// initializeDatabases().then(() => {
//     app.listen(port, () => {
//       console.log(`Server started on port ${port}`);
//     });
// });

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});