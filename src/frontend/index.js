import { App } from './app.js'

async function preloadBackgroundImage() {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = 'https://media.gettyimages.com/id/171249150/photo/chess.jpg?s=612x612&w=0&k=20&c=VIJuXyYmabrrzBItMMIa70GMn778qIKjL_FK3uDK7tE='; // Use the direct URL to the image file
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Background image failed to load.'));
    });
  }
  
  
  try {
    await preloadBackgroundImage(); // Wait until the background image is loaded
  } catch (error) {
    console.error(error.message);
  }

  // Mount the application to the root element.
  const app = new App();
  await app.render('root');

  const resetState = () => {
    localStorage.clear();
    const app = new App();
    app.render('root');
  };  
  
  document.getElementById('reset-state').addEventListener('click', resetState);