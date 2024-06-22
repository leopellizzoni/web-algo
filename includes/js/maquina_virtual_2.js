var index_goto = {};
var vm_escopo = '';
var vm_escopo_pai = '';
var variaveis_vm = {};
var vm_escopos = {}

async function executaC3E2(codigo_c3e) {
    let c3e;
    let result;
    let arg1;
    let arg2;
    let qtd_escopos = codigo_c3e.shift();
    let returns = [];
    variaveis_vm = [];
    vm_escopos = []
    inicializa_escopos(qtd_escopos.result);
    indexa_linhas(codigo_c3e);
    inicializa_variaveis_globais(codigo_c3e);
    for (let i = 0; i < codigo_c3e.length; i++) {
        c3e = codigo_c3e[i];
        if (c3e.result === '@t12'){
            debugger;
        }
        if (c3e.result) {
            // DEPURADOR
            if (debug_compiler) {
                if (linha_anterior !== c3e.linha && (!c3e.label && !c3e.salto)) {
                    vai_ler = true;
                    modifica_cor_linhas_editor_texto();
                    await getUserDebug();
                    vai_ler = false;
                    linha_anterior = c3e.linha;
                }
            }
            if (c3e.escopo){
                if (Number(c3e.result.substring(1)) === 0) {
                    vm_escopo_pai = 0;
                    vm_escopo = 0;
                } else {
                    let escopo_atual = Number(c3e.result.substring(1));
                    if (Number(c3e.result.substring(1)) in vm_escopos){
                        vm_escopo_pai = vm_escopos[escopo_atual]['escopo_pai'];
                        vm_escopo = escopo_atual
                    } else {
                        vm_escopo_pai = vm_escopo;
                        vm_escopo = Number(c3e.result.substring(1));
                        vm_escopos[escopo_atual] = {'escopo_pai': vm_escopo_pai}
                        altera_escopo_pai();
                    }
                }
                continue;
            // INICIO EXECUÇÃO C3E
            } else if (c3e.label) {
                continue;
            } else if (c3e.salto) {
                // SALTO INCODICIONAL
                if (c3e.result == 'goto') {
                    if (verifica_se_eh_chamada_de_funcao(c3e.arg1)) {
                        debugger;
                        if (!(Number(codigo_c3e[index_goto[c3e.arg1]+1].result.substring(1)) in vm_escopos)){
                            vm_escopo_pai = 0;
                            vm_escopo = Number(codigo_c3e[index_goto[c3e.arg1]+1].result.substring(1));
                            vm_escopos[vm_escopo] = {'escopo_pai': vm_escopo_pai}
                            altera_escopo_pai();
                        }
                        returns.push({'index': i, 'identificador': c3e.arg1.substring(1)});
                    }
                    i = index_goto[c3e.arg1] - 1;
                    continue;
                } else if (verifica_se_eh_return(c3e.result)) {
                    // RETURN
                    debugger;
                    vm_escopo = variaveis_vm[vm_escopo]['escopo_pai'];
                    vm_escopo_pai = variaveis_vm[vm_escopo]['escopo_pai'];
                    if (c3e.arg1) {
                        let dados = returns.pop();
                        arg1 = getValue(c3e.arg1);
                        result = arg1;
                        setValue(result, dados['identificador']);
                        if (dados['identificador'] != 'main'){
                            i = dados['index'];
                        }
                    }
                    continue;
                } else {
                    // SALTO CONDICIONAL
                    let condicional = getValue(c3e.arg1);
                    if (!condicional) {
                        i = index_goto[c3e.arg2] - 1;
                        continue;
                    }
                }
            } else if (c3e.escrita) {
                let quebra_printf = parsePrintf(c3e.result);
                let parametros = quebra_printf.params.slice(1)
                let formatarString = formataStringInt(quebra_printf.formattedString, parametros);
                formatarString = formataStringFloat(formatarString, parametros);
                formatarString = formataStringQuebraLinha(formatarString);
                textareaElement.value += formatarString.replace(/"/g, '');
                textareaElement.scrollTop = inputElement.scrollHeight;
            } else if (c3e.leitura) {
                let quebra_scanf = parseScanf(c3e.result);
                let values = quebra_scanf.params;
                for (let i = 0; i < values.length; i++) {
                    configura_leitura(true);
                    userInput = await getUserInput();
                    configura_leitura(false);
                    setValue(userInput, values[i]);
                }
            } else {
                if (!c3e.arg1) {
                    if (verifica_se_eh_vetor(c3e.result)) {
                        let dados = extrai_variavel_e_posicao_vetor(c3e.result);
                        let posicao = getValue(dados["posicao"]);
                        variaveis_vm[vm_escopo]['variaveis'][dados.variavel] = {'valor': inicializa_vetor(dados['variavel'], posicao)};
                    } else if (verifica_se_eh_matriz(c3e.result)){
                        let dados = extrai_variavel_e_posicao_matriz(c3e.result);
                        let posicao1 = getValue(dados["posicoes"][0]);
                        let posicao2 = getValue(dados["posicoes"][0]);
                        variaveis_vm[vm_escopo]['variaveis'][dados.variavel] = {'valor': inicializa_matriz(dados['variavel'], posicao1, posicao2)};
                    } else {
                        setValue(NaN, c3e.result, false);
                    }
                } else {
                    arg1 = getValue(c3e.arg1);
                    arg2 = '';
                    if (c3e.arg2) {
                        arg2 = getValue(c3e.arg2);
                    }
                    if (c3e.op) {
                        result = calcula_argumentos(arg1, arg2, c3e.op);
                    } else {
                        result = arg1;
                    }
                    setValue(result, c3e.result);
                }
            }
        }
    }
    $("#button4")[0].hidden = false;
    $("#button5")[0].hidden = true;
    $("#button2")[0].hidden = false;
    $("#button3")[0].hidden = true;
    $("#inputText")[0].disabled = true;
    editor.setOption("readOnly", false);
    textareaElement.value += '\n\nPrograma compilado e executado com sucesso.';
    textareaElement.scrollTop = textareaElement.scrollHeight;
}