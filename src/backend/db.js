import PouchDB from "pouchdb";

// Initialize the databases for members, events, and results
let membersDB = new PouchDB("members");
let eventsDB = new PouchDB("events");

// MEMBERS

export async function saveMember(id, memberData) {
  await membersDB.put({ _id: id, memberData });
}

export async function modifyMember(doc) {
  await membersDB.put(doc);
}

export async function loadMember(id) {
  const member = await membersDB.get(id);
  return member;
}

export async function removeMember(id) {
  await membersDB.remove(id);
}

export async function loadAllMembers() {
  const result = await membersDB.allDocs({ include_docs: true });
  return result.rows.map((row) => row.doc);
}

// EVENTS

export async function saveEvent(id, eventData) {
  await eventsDB.put({ _id: id, eventData });
}

export async function modifyEvent(doc) {
  await eventsDB.put(doc);
}

export async function loadEvent(id) {
  const event = await eventsDB.get(id);
  return event;
}

export async function removeEvent(id) {
  await eventsDB.remove(id);
}

export async function loadAllEvents() {
  const result = await eventsDB.allDocs({ include_docs: true });
  return result.rows.map((row) => row.doc);
}

export async function destroy() {
    try {
      await membersDB.destroy();
      await eventsDB.destroy();
      console.log("Databases destroyed successfully.");
      // Reinitialize databases if needed
      membersDB = new PouchDB("members");
      eventsDB = new PouchDB("events");
    } catch (err) {
      console.error("Error destroying databases:", err);
    }
  }
  
