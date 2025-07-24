(function () {
  const { manifest } = window.PLAYGROUND;

  const EXAMPLE_CONTAINER_ID = 'example-container';
  const ATTRIBUTES_SECTION_ID = 'attributes-section';
  const ATTRIBUTES_TABLE_CONTAINER_ID = 'attributes-table-container';
  const EVENTS_SECTION_ID = 'events-section';
  const EVENTS_TABLE_CONTAINER_ID = 'events-table-container';
  const FUNCTIONS_SECTION_ID = 'functions-section';
  const FUNCTIONS_TABLE_CONTAINER_ID = 'functions-table-container';

  function contentGenerator(sectionId, contentId, data, callback) {
    if (sectionId && (!data || !data.length)) {
      const el = document.getElementById(sectionId);
      el.style.display = 'none';
    } else {
      const el = document.getElementById(contentId);
      el.innerHTML = callback(data);
    }
  }

  function generateExampleTemplate(data) {
    let template = '<span class="hljs-comment">&lt;!-- Load the frontend bundle --&gt;</span>';
    template += `<span class="hljs-tag">&lt;<span class="hljs-name">script</span> <span class="hljs-attr">type</span>=<span class="hljs-string">"module"</span> <span class="hljs-attr">src</span>=<span class="hljs-string">"path/to/index.js"</span>&gt;<span class="hljs-tag">&lt;/<span class="hljs-name">script</span>&gt;</span></span>`
    template += '<span>&nbsp;</span>';
    template += `<span class="hljs-comment">&lt;!-- Use the MFE's tag --&gt;</span>`
    template += `<span class="hljs-tag">&lt;<span class="hljs-name">${manifest.tag}</span> \n`;
    for (const key in data) {
      template += `  <span class="hljs-attr">${key}</span>=<span class="hljs-string">${data[key]}</span> \n`;
    }
    template += `<span class="hljs-tag">&lt;/<span class="hljs-name">${manifest.tag}</span>&gt;</span>`;
    return template;
  }

  function generateAttributesTable(data) {
    return data
      .map(
        (attribute) => `
          <tr>
              <td><span>${attribute.name}${attribute.required ? ' * ' : ''}</span></td>
              <td><span>${attribute.schema.type}</span></td>
              <td>${attribute.schema.enum ? attribute.schema.enum.map((item) => `<span>${item}</span>`).join(' ') : ''}</td>
              <td>${attribute.description}</td>
          </tr>
        `,
      )
      .join(' ');
  }

  function generateEventsTable(data) {
    return data
      .map(
        (event) => `
          <tr>
              <td><span>${event.name}</span></td>
              <td class="collapsed">
                <button class="payload-btn close">Payload <img src="assets/chevron.svg" alt="arrow"/></button>
                ${schemaToJsonConverted(event)}
              </td>
              <td>${event.description}</td>
          </tr>
        `,
      )
      .join(' ');
  }

  function generateFunctionsTable(data) {
    return data
      .map(
        (func) => `
          <tr>
              <td><span>${func.name}</span></td>
              <td class="collapsed">
                <button class="payload-btn close">Payload <img src="assets/chevron.svg" alt="arrow"/></button>
                ${schemaToJsonConverted(func)}
              </td>
              <td>${func.description}</td>
          </tr>
        `,
      )
      .join(' ');
  }

  function schemaToJsonConverted(data) {
    if(data.parameters) {
      return `
        <pre class="collapsed"><code>${JSON.stringify(data.parameters, null, 2)}</code></pre>`;
    } else if(data.schema) {
      return `<pre class="collapsed"><code>${JSON.stringify(data.schema.properties, null, 2)}</code></pre>`;
    } else {
      return `<pre class="collapsed"><code>${JSON.stringify(data.schema, null, 2)}</code></pre>`;
    }
  }

  function initEventListeners() {
    document.addEventListener('click', function (event) {
      const button = event.target.closest('button');
      if (!button) {
        return;
      }

      const table = button.closest('table');
      if (!table) {
        return;
      }

      const td = button.parentElement.closest('td');
      td.classList.toggle('collapsed');
    });
  }

  contentGenerator(null, EXAMPLE_CONTAINER_ID, manifest.example.attributes, generateExampleTemplate);
  contentGenerator(ATTRIBUTES_SECTION_ID, ATTRIBUTES_TABLE_CONTAINER_ID, manifest.attributes, generateAttributesTable);
  contentGenerator(EVENTS_SECTION_ID, EVENTS_TABLE_CONTAINER_ID, manifest.events, generateEventsTable);
  contentGenerator(FUNCTIONS_SECTION_ID, FUNCTIONS_TABLE_CONTAINER_ID, manifest.functions, generateFunctionsTable);
  initEventListeners();
})();
