import { Edge } from './index.js';
import * as monaco from 'monaco-editor';
import { shikiToMonaco } from '@shikijs/monaco'
import { createHighlighter } from 'shiki/bundle/full'
import JSON5 from 'json5';
import './browser-test.css';

const initialData = `
// The data to render

{
  title: "Hello World",
  description: "This is a simple Edge.js template example.",
  items: [
    { name: "Item 1", value: 10 },
    { name: "Item 2", value: 20 },
    { name: "Item 3", value: 30 },
  ],
}
`;

const initialTemplate = `
<h1>{{ title }}</h1>
<p>{{ description }}</p>

<ul>
  @each(item in items)
    <li>{{ item.name }}: {{ item.value }}</li>
  @end
</ul>

<h2>Summary</h2>
<p>Total Items: {{ items.length }}</p>
<p>
  Sum of Values: 
  {{
    (() => {
      let total = 0;
      items.forEach(item => total += item.value);
      return total;
    })()
  }}
</p>
`;

// const edge = new Edge();
// edge.registerTemplate('test', {
//   template: '<div>Test Template</div>',
// });
// console.log(await edge.render('test'));

// Create the highlighter, it can be reused
const highlighter = await createHighlighter({
  themes: [
    'vitesse-dark',
  ],
  langs: [
    'json5',
    'edge',
    'html'
  ],
})

monaco.languages.register({ id: 'json5' })
monaco.languages.register({ id: 'edge' })
monaco.languages.register({ id: 'html' })

shikiToMonaco(highlighter, monaco)

const dataEditor = monaco.editor.create(
	document.querySelector(".layout-data"),
	{
		value: initialData,
		language: 'json5',
		automaticLayout: true,
    theme: 'vitesse-dark',
	}
);

const templateEditor = monaco.editor.create(
	document.querySelector(".layout-template"),
	{
		value: initialTemplate,
		language: 'edge',
		automaticLayout: true,
    theme: 'vitesse-dark',
	}
);

const outputEditor = monaco.editor.create(
	document.querySelector(".layout-output"),
	{
		value: '',
		language: 'html',
		automaticLayout: true,
    theme: 'vitesse-dark',
    readOnly: true,
	}
);

const render = async () => {
  const data = dataEditor.getValue();
  const template = templateEditor.getValue();

  try {
    const edge = new Edge();
    edge.registerTemplate('main', {
      template: template,
    });

    const parsedData = JSON5.parse(data);
    const result = await edge.render('main', parsedData);
    outputEditor.setValue(result);
    outputEditor.updateOptions({ language: 'html' });
  } catch (error) {
    console.error('Rendering error:', error);
    outputEditor.setValue(`Error: ${error}`);
    outputEditor.updateOptions({ language: 'plaintext' });
  }
};

render();

const debouncedRender = (() => {
  let timeout;
  return () => {
    clearTimeout(timeout);
    timeout = setTimeout(render, 300);
  };
})();

dataEditor.onDidChangeModelContent(debouncedRender);
templateEditor.onDidChangeModelContent(debouncedRender);