const hamMenu = document.querySelector('.ham-menu');
const offScreenMenu = document.querySelector('.off-screen-menu');
hamMenu.addEventListener('click', () => {
  offScreenMenu.classList.toggle('active');
  hamMenu.classList.toggle('active');
});