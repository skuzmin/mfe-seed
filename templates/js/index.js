const mfe = document.body.getAttribute('data-mfe');
const { manifest } = window.PLAYGROUND;

injectMFE();

function injectMFE() {
  const component = document.createElement(mfe);
  const attributes = generateAttributesForMFE();
  for (const key in attributes) {
    component.setAttribute(key, attributes[key]);
  }

  const container = document.getElementById('playground-content');
  container.innerHTML = '';
  container.appendChild(component);
}

///////
function generateAttributesForMFE() {
  const hasQueryParams = window.location.search.length > 1;
  if (hasQueryParams) {
    const params = new URLSearchParams(window.location.search);
    return Object.fromEntries(params.entries());
  } else {
    generateQueryParams(manifest.example.attributes);
    return manifest.example.attributes;
  }
}

//////////////
generateControls();

function generateControls() {
  const elements = [];
  const controlsContainerEl = document.getElementById('playground-controls');
  manifest.attributes.forEach((control) => {
    elements.push(generateControlItem(control));
  });
  elements.push(
    '<div class="item"><button class="apply-btn" id="playground-controls-btn">Apply</button></div>',
  );
  controlsContainerEl.innerHTML = elements.join('');
  setControlValues();
  document
    .getElementById('playground-controls-btn')
    .addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      const attributes = {};
      manifest.attributes.forEach((attribute) => {
        const el = document.getElementById(attribute.name);
        attributes[attribute.name] = el.type === 'checkbox' ? el.checked : el.value;
      });
      generateQueryParams(attributes);
      window.location.reload();
    });
}

function generateControlItem(control) {
  let template = '';
  if (!!control.schema.enum) {
    const options = control.schema.enum
      .map((val) => `<option value="${val}">${val}</option>`)
      .join('');
    template = `
      <select id="${control.name}" required="${control.required}">
        ${options}
      </select>
    `;
  } else {
    const type = control.schema.type === 'boolean' ? 'checkbox' : 'text';
    template = `
      <input id="${control.name}" type="${type}" required="${control.required}"/>
    `;
  }
  return `
    <div class="item">
        <label for="${control.name}">${control.name}:</label>
        ${template}
    </div>
  `;
}

/////////
function setControlValues() {
  const params = new URLSearchParams(window.location.search);
  const data = Object.fromEntries(params.entries());
  for (const key in data) {
    const el = document.getElementById(key);
    if (el.type === 'checkbox') {
      el.checked = data[key];
    } else {
      el.value = data[key];
    }
  }
}

/////////
function generateQueryParams(data) {
  const queryString = new URLSearchParams(data).toString();
  const url = new URL(window.location.href);
  url.search = queryString;
  window.history.replaceState({}, '', url);
}
