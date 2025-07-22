const mfe = document.body.getAttribute('data-mfe');

if(mfe) {
  const component = document.createElement(mfe);
  component.setAttribute('locale', 'en_GB');

  const container = document.getElementById('playground-content');
  container.innerHTML = '';
  container.appendChild(component);
} else {
  console.error('Missing MFE name');
}
