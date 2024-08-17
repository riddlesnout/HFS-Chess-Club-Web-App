const URL = "http://localhost:3260"; // URL of our server

export class MembersView {
  #memberList = null;

  async render() {
    // Create the root element
    const membersViewElm = document.createElement('div');
    membersViewElm.id = 'members-view';

    const titleElm = document.createElement('h1');
    titleElm.innerText = 'Members';

    // Create and render the member list
    const memberList = await this.#renderMemberList();

    membersViewElm.appendChild(titleElm);
    membersViewElm.appendChild(memberList);

    return membersViewElm;
  }

  async #renderMemberList() {
    this.#memberList = document.createElement('div');
    this.#memberList.className = 'member-list';

    const members = await this.#getMembers();

    const list = document.createElement('ul');

    members.forEach(member => {
      const listItem = this.#makeMemberItem(member);
      list.appendChild(listItem);
    });

    this.#memberList.appendChild(list);
    return this.#memberList;
  }

  #makeMemberItem(member) {
    const li = document.createElement('li');
    li.className = 'member-item';

    const memberDetails = document.createElement('div');
    memberDetails.className = 'member-details';
    memberDetails.innerHTML = `
      <span><strong>Username:</strong> ${member.id}</span>
      <span><strong>Name:</strong> ${member.name}</span>
      <span><strong>Email:</strong> ${member.email}</span>
      <span><strong>Phone:</strong> ${member.phone}</span>
      <span><strong>Date of Birth:</strong> ${member.dob}</span>
    `;

    const editButton = document.createElement('button');
    editButton.className = 'edit-button';
    editButton.innerText = 'Edit';
    editButton.addEventListener('click', () => this.#handleEditMember(member, li));

    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete-button';
    deleteButton.innerText = 'Delete';
    deleteButton.addEventListener('click', () => this.#handleDeleteMember(member.id, li));

    li.appendChild(memberDetails);
    li.appendChild(editButton);
    li.appendChild(deleteButton);

    return li;
  }

  async #getMembers() {
    const response = await fetch(`${URL}/members`, {
      method: 'GET'
    });
    if (response.ok) {
      return response.json();
    }
    return [];
  }

  async #updateMember(member) {
    const response = await fetch(`${URL}/members`, {
      method: 'PUT',
      body: JSON.stringify(member),
    });

    if (!response.ok) {
      alert('Failed to update member.');
    }
  }

  async #handleEditMember(member, listItem) {
    const memberDetails = listItem.querySelector('.member-details');

    // Create input fields for editing
    const inputs = `
      <input type="text" id="edit-name" value="${member.name}" placeholder="Name"/>
      <input type="email" id="edit-email" value="${member.email}" placeholder="Email"/>
      <input type="text" id="edit-phone" value="${member.phone}" placeholder="Phone"/>
      <input type="date" id="edit-dob" value="${member.dob}" placeholder="Date of Birth"/>
    `;

    memberDetails.innerHTML = inputs;

    // Replace Edit button with Save button
    const saveButton = document.createElement('button');
    saveButton.className = 'save-button';
    saveButton.innerText = 'Save';
    saveButton.addEventListener('click', async () => {
      const updatedMember = {
        id: member.id,
        name: document.getElementById('edit-name').value,
        email: document.getElementById('edit-email').value,
        phone: document.getElementById('edit-phone').value,
        dob: document.getElementById('edit-dob').value,
      };

      await this.#updateMember(updatedMember);

      // Re-render the member list after saving
      const updatedListItem = this.#makeMemberItem(updatedMember);
      listItem.replaceWith(updatedListItem);

      alert('Member info successfully updated!')
    });

    listItem.replaceChild(saveButton, listItem.querySelector('.edit-button'));
  }

  async #handleDeleteMember(memberId, listItem) {
    const confirmation = confirm('Are you sure you want to delete this member?');
    if (confirmation) {
      const response = await fetch(`${URL}/members`, {
        method: 'DELETE',
        body: JSON.stringify({ id: memberId }),
      });

      if (response.ok) {
        // Remove the member item from the list
        listItem.remove();
        alert('Member successfully deleted!');
      } else {
        alert('Failed to delete member.');
      }
    }
  }
}
