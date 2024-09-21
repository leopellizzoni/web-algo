/* jshint esversion: 6 */
import { compiler } from './compiler.js';
import { executaC3E2 } from './maquina_virtual_2.js';

self.onmessage = function(event) {
  const { code } = event.data;
  const { debug } = event.data;
  console.log('vai chamar compiler');
  let c3e = compiler(debug, code, self);
  debugger;
  executaC3E2(c3e.instrucoes, self);
  try {
    self.postMessage({'finalizou_execucao': true, 'c3e': c3e.c3e});
  } catch (error) {
    self.postMessage(`Erro: ${error.message}`);
  }
};