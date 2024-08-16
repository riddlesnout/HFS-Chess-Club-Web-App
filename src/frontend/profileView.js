import { Events } from './Events.js';
import { fetch } from './Server.js';

export class ProfileView {
    #events = null;

    constructor() {
        this.#events = Events.events();
    }

    async renderProfile() {
        const profileDiv = document.createElement('div');
        profileDiv.id = 'profile';
        profileDiv.className = 'section active';

        const title = document.createElement('h2');
        title.textContent = 'Profile';
        profileDiv.appendChild(title);

        const profileForm = document.createElement('form');
        profileForm.id = 'profile-form';

        const profileInfoDiv = document.createElement('div');
        profileInfoDiv.className = 'profile-info';

        const fields = [
            { id: 'username', label: 'Username:', type: 'text', readonly: true },
            { id: 'name', label: 'Name:', type: 'text', readonly: true },
            { id: 'email', label: 'Email:', type: 'email', readonly: true },
            { id: 'phone', label: 'Phone:', type: 'tel', readonly: true },
            { id: 'dob', label: 'Date of Birth:', type: 'date', readonly: true },
            { id: 'address', label: 'Address:', type: 'text', readonly: true },
            { id: 'password', label: 'Password:', type: 'password', readonly: true }
        ];

        const profileData = await this.#loadProfileData();
        fields.forEach(field => {
            const label = document.createElement('label');
            label.htmlFor = field.id;
            label.textContent = field.label;
            profileInfoDiv.appendChild(label);

            const input = document.createElement('input');
            input.type = field.type;
            input.id = field.id;
            input.value = profileData[field.id] || '';
            input.readOnly = field.readonly;
            profileInfoDiv.appendChild(input);
        });

        profileForm.appendChild(profileInfoDiv);

        const editButton = document.createElement('button');
        editButton.type = 'button';
        editButton.id = 'edit-profile';
        editButton.className = 'edit-profile';
        editButton.textContent = 'Edit Profile';
        profileForm.appendChild(editButton);

        const saveButton = document.createElement('button');
        saveButton.type = 'submit';
        saveButton.id = 'save-profile';
        saveButton.className = 'save-profile';
        saveButton.style.display = 'none';
        saveButton.textContent = 'Save Changes';
        profileForm.appendChild(saveButton);

        const showPasswordButton = document.createElement('button');
        showPasswordButton.type = 'button';
        showPasswordButton.id = 'show-password';
        showPasswordButton.textContent = 'Show Password';
        profileForm.appendChild(showPasswordButton);

        profileDiv.appendChild(profileForm);

        editButton.addEventListener('click', () => this.#toggleEdit(true));
        saveButton.addEventListener('click', (event) => this.#handleProfileFormSubmit(event));
        showPasswordButton.addEventListener('click', () => this.#togglePasswordVisibility());

        return profileDiv;
    }

    async #loadProfileData() {
        const response = await fetch('/profile');
        if (response.status === 200 && response.body) {
            return JSON.parse(response.body);
        }
        return {};
    }

    async #handleProfileFormSubmit(event) {
        event.preventDefault();

        const profileForm = document.querySelector('#profile-form');
        const inputs = profileForm.querySelectorAll('input');

        const profileData = {};
        inputs.forEach(input => {
            profileData[input.id] = input.value;
        });

        await fetch('/profile', {
            method: 'POST',
            body: JSON.stringify(profileData),
        });

        this.#toggleEdit(false);
        alert('Profile updated successfully!');
    }

    #toggleEdit(editable) {
        const inputs = document.querySelectorAll('.profile-info input');
        const saveButton = document.querySelector('#save-profile');
        const editButton = document.querySelector('#edit-profile');

        inputs.forEach(input => input.readOnly = !editable);
        saveButton.style.display = editable ? 'block' : 'none';
        editButton.style.display = editable ? 'none' : 'block';
    }

    #togglePasswordVisibility() {
        const passwordInput = document.querySelector('#password');
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
        } else {
            passwordInput.type = 'password';
        }
    }
}
