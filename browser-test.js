import { Edge } from './index.js';

const edge = new Edge();
edge.registerTemplate('test', {
  template: '<div>Test Template</div>',
});
console.log(await edge.render('test'));