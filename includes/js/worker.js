/* jshint esversion: 6 */
import { compiler } from './compiler.js';
import { executaC3E2 } from './maquina_virtual_2.js';

self.onmessage = function(event) {
  const { code } = event.data;
  const { debug } = event.data;
  console.log('vai chamar compiler');
  let c3e = compiler(debug, code, self);
  if (c3e){
    executaC3E2(c3e.instrucoes, self);
    self.postMessage({'finalizou_execucao': true, 'c3e': c3e.c3e});
  }
  self.postMessage({'finalizou_execucao': true, 'c3e': []});
};