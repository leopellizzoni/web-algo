// Executa código intermediário de três endereços gerado pelo compilador

var historico_variaveis = [];
var variaveis = {};


function calcula_argumentos(c3e){
    let arg1;
    let arg2;
    // TESTA ARGUMENTO 1
    if (regexNumero.test(c3e.arg1[0])){
        arg1 = c3e.arg1;
    } else{
        if (!(c3e.arg1 in variaveis)){
            variaveis[c3e.arg1] = {'valor': 0};
        }
        arg1 = variaveis[c3e.arg1]['valor'];
    }
    // TESTA ARGUMENTO 2
    if (regexNumero.test(c3e.arg2[0])){
        arg2 = c3e.arg2;
    } else{
        arg2 = variaveis[c3e.arg2]['valor'];
    }
    if (c3e.op === '+'){
        return Number(arg1) + Number(arg2);
    }
    if (c3e.op === '-'){
        return Number(arg1) - Number(arg2);
    }
    if (c3e.op === '/'){
        return Number(arg1) / Number(arg2);
    }
    if (c3e.op === '*'){
        return Number(arg1) * Number(arg2);
    }
    if (c3e.op === '%'){
        return Number(arg1) % Number(arg2);
    }
    if (c3e.op === '>'){
        return Number(arg1) > Number(arg2) ? 1 : 0;
    }
    if (c3e.op === '>='){
        return Number(arg1) >= Number(arg2) ? 1 : 0;
    }
    if (c3e.op === '<'){
        return Number(arg1) < Number(arg2) ? 1 : 0;
    }
    if (c3e.op === '<='){
        return Number(arg1) <= Number(arg2) ? 1 : 0;
    }
    if (c3e.op === '=='){
        return Number(arg1) == Number(arg2) ? 1 : 0;
    }
    if (c3e.op === '!='){
        return Number(arg1) != Number(arg2) ? 1 : 0;
    }
    if (c3e.op === '&&'){
        debugger;
        return Number(arg1) && Number(arg2) ? 1 : 0;
    }
    if (c3e.op === '||'){
        return Number(arg1) || Number(arg2) ? 1 : 0;
    }

}

function formataString(template, values) {
  let index = 0;
  return template.replace(/%d/g, () => {
    if (values[index].replace(')', '') in variaveis) {
      return variaveis[values[index++].replace(')', '')].valor;
    } else {
      return '&falha';
    }
  });
}

let index_goto = {}
function indexa_linhas(codigo_c3e){
    let c3e;
    for (let i=0; i<codigo_c3e.length; i++){
        c3e = codigo_c3e[i];
        if (c3e.label){
            index_goto[c3e.result] = i;
        }
    }
}

function executaC3E(codigo_c3e){
    let c3e;
    let arg1;
    indexa_linhas(codigo_c3e);
    for (let i=0; i<codigo_c3e.length; i++) {
        c3e = codigo_c3e[i];
        if (c3e.label){
            continue;
        } else if (c3e.salto){
            debugger;
            if (!variaveis[c3e.arg1].valor){
                i = index_goto[c3e.arg2]-1;
                continue;
            }
        } else if (c3e.escrita){
            let quebra_printf = c3e.result.split(',');
            let string = quebra_printf[0].replace('printf(', '');
            let formatarString = formataString(string, quebra_printf.slice(1));
            dic_control["printf"] += formatarString.replace(/"/g, '');
        } else {
            // Verifica Identifcador
            if (c3e.result[0] == '@'){
                // Variável temporária
                variaveis[c3e.result] = {'valor': calcula_argumentos(c3e)};
            } else {
                if (c3e.arg2){
                    variaveis[c3e.result] = {'valor': calcula_argumentos(c3e)};
                } else {
                    if (regexNumero.test(c3e.arg1[0])){
                        arg1 = c3e.arg1;
                    } else{
                        arg1 = variaveis[c3e.arg1]['valor'];
                    }
                    variaveis[c3e.result] = {'valor': arg1};
                }
            }
        }
    }
}