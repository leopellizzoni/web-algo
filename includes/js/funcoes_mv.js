function inicializa_escopos(qtd_escopos){
    while(qtd_escopos >= 0){
        variaveis_vm.push({'variaveis': {}, 'escopo_pai': 0});
        qtd_escopos--;
    }
}

function modifica_historico_variavel(variavel, valor){
    console.log(variavel);
    if (!(vm_funcoes.includes(variavel))){
        if (variavel in historico_variaveis){
            historico_variaveis[variavel].push(valor);
        } else {
            historico_variaveis[variavel] = [valor];
        }
        atualiza_tabela_variaveis(historico_variaveis);
    }
}

function altera_escopo_pai(){
    variaveis_vm[vm_escopo]['escopo_pai'] = vm_escopo_pai;
}

function verifica_existencia_variavel_escopo(variavel){

    for (let index=vm_escopo; index>=0;index = variaveis_vm[index]['escopo_pai']){
        if (variavel in variaveis_vm[index]['variaveis']){
            return index;
        }
        if (index === 0){
            return vm_escopo;
        }
    }
}

function inicializa_matriz(variavel, tam_vetor, tam_matriz) {
    let vetor = [];
    for (let i = 0; i < tam_vetor; i++) {
        vetor.push([]);
        for (let j = 0; j < tam_matriz; j++) {
            vetor[i].push(0);
        }
    }
    variaveis_vm[vm_escopo]['variaveis'][variavel] = {'valor': vetor};
    modifica_historico_variavel(variavel, variaveis_vm[vm_escopo]['variaveis'][variavel]["valor"]);
    return vetor;
}

function inicializa_vetor(variavel, tam_vetor) {
    let vetor = [];
    for (let i = 0; i < tam_vetor; i++) {
        vetor.push(0);
    }
    variaveis_vm[vm_escopo]['variaveis'][variavel] = {'valor': vetor};
    modifica_historico_variavel(variavel, variaveis_vm[vm_escopo]['variaveis'][variavel]["valor"]);
    return vetor;
}

function realiza_atribuicao_parametros(parametros, dados, parametros_tipos){
    for (let i=0; i<parametros.length; i++){
        setValue(dados[i], parametros[i], true, parametros_tipos[parametros[i]]['tipo']);
    }
}

function indexa_linhas(codigo_c3e) {
    let c3e;
    for (let i = 0; i < codigo_c3e.length; i++) {
        c3e = codigo_c3e[i];
        if (c3e.label) {
            index_goto[c3e.result] = i;
        }
    }
}

function getUserInput() {
    return new Promise((resolve) => {
        const inputElement = document.getElementById('inputText');
        // signal.addEventListener('abort', () => {
        //     reject(new Error('Task was aborted'));
        // });

        // Adiciona um event listener para a tecla "Enter"
        inputElement.addEventListener('keydown', function onEnter(event) {
            if (event.key === 'Enter') {
                // Resolve a Promise com o valor do input
                resolve(inputElement.value);
                textareaElement.value += inputElement.value + '\n';
                textareaElement.scrollTop = textareaElement.scrollHeight;

                // Remove o event listener após a resolução
                inputElement.removeEventListener('keydown', onEnter);

                // Limpa o campo de input para a próxima entrada
                inputElement.value = '';
            }
        });
    });
}

function getUserDebug() {
    return new Promise((resolve) => {
        // Adiciona um event listener para o botão "Próximo passo"
        const buttonProximoPasso = document.getElementById('button5');

        // Adiciona um event listener ao botão
        buttonProximoPasso.addEventListener('click', function onProximoPasso() {
            // Emite um console log quando o botão é pressionado
            resolve(inputElement.value);
            buttonProximoPasso.removeEventListener('click', onProximoPasso);
        });

        const buttonExecutar = document.getElementById('button6');
        // Adiciona um event listener ao botão
        buttonExecutar.addEventListener('click', function onExecutar() {
            // Emite um console log quando o botão é pressionado
            resolve(inputElement.value);
            buttonExecutar.removeEventListener('click', onExecutar);
        });
    });
}

function modifica_cor_linhas_editor_texto(linha_atual, linha_anterior) {
    addLineDecoration(linha_atual - 1, 'line-decoration');
    editor.removeLineClass(linha_anterior - 1, 'wrap', 'line-decoration');
}

function verifica_operador_unario(valor) {
    return ['!', '+', '-'].includes(String(valor)[0]);
}

const regex = /^[+-]?\d+(\.\d+)?$/;
function verifica_constante(valor) {
    return regex.test(String(valor));
}

function verifica_temporaria(valor) {
    return String(valor)[0] === '@';
}

function verifica_se_eh_vetor(valor) {
    // Regex para variável ou constante: [a-zA-Z_]\w*
    // Regex para expressão dentro dos colchetes: aceita variáveis, números, operadores, e parênteses
    //const arrayNotationRegex = /^[a-zA-Z_]\w*(\[\s*([a-zA-Z_]\w*|\d+|@\w+|\[[a-zA-Z_]\w*|\d+|@\w+\])\s*\])+$/;
    //const arrayNotationRegex = /^[a-zA-Z_]\w*(\[(?:[a-zA-Z_]\w*|\d+|@\d+|[+\-*/()]|\[(?:[a-zA-Z_]\w*|\d+|@\d+|[+\-*/()]|\[(?:[a-zA-Z_]\w*|\d+|@\d+|[+\-*/()])*\])*\])*\])$/;
    // const arrayNotationRegex = /^[a-zA-Z_]\w*(\[(?:[a-zA-Z_]\w*|\d+|@t\d+|[+\-*/()]|\[(?:[a-zA-Z_]\w*|\d+|@t\d+|[+\-*/()]|\[(?:[a-zA-Z_]\w*|\d+|@t\d+|[+\-*/()])*\])*\])*\])$/;
    // 7 aninhações
    const arrayNotationRegex = /^[a-zA-Z_]\w*(\[(?:[a-zA-Z_]\w*|\d+|@t\d+|[+\-*/()]|\[(?:[a-zA-Z_]\w*|\d+|@t\d+|[+\-*/()]|\[(?:[a-zA-Z_]\w*|\d+|@t\d+|[+\-*/()]|\[(?:[a-zA-Z_]\w*|\d+|@t\d+|[+\-*/()]|\[(?:[a-zA-Z_]\w*|\d+|@t\d+|[+\-*/()]|\[(?:[a-zA-Z_]\w*|\d+|@t\d+|[+\-*/()]|\[(?:[a-zA-Z_]\w*|\d+|@t\d+|[+\-*/()])*\])*\])*\])*\])*\])*\])*\])$/;
    return arrayNotationRegex.test(valor);
}

function verifica_se_eh_matriz(valor) {
    // Regex para variável ou constante: [a-zA-Z_]\w*
    // Regex para expressões dentro dos colchetes: [a-zA-Z0-9_+\-*/()@ ]
    let matrixNotationRegex = /^[a-zA-Z_]\w*(\[(?:[a-zA-Z_]\w*|\d+|@t\d+|[+\-*/()]|\[(?:[a-zA-Z_]\w*|\d+|@t\d+|[+\-*/()]|\[(?:[a-zA-Z_]\w*|\d+|@t\d+|[+\-*/()])*\])*\])*\]?)\[(?:[a-zA-Z_]\w*|\d+|@t\d+|[+\-*/()]|\[(?:[a-zA-Z_]\w*|\d+|@t\d+|[+\-*/()]|\[(?:[a-zA-Z_]\w*|\d+|@t\d+|[+\-*/()])*\])*\])*\]?$/;
    return matrixNotationRegex.test(valor);
}

function verifica_se_eh_chamada_de_funcao(valor){
    // Regex para verificar se a string começa com $ seguido por uma letra e depois qualquer combinação de letras, números ou sublinhados
    const functionRegex = /^\$[a-zA-Z][a-zA-Z0-9_]*$/;
    return functionRegex.test(valor);
}

function verifica_se_eh_return(valor){
    return valor === 'return';
}

function extrai_variavel_e_posicao_vetor(valor) {
    // Regex para capturar a variável e a posição, onde a posição pode incluir variáveis, constantes e expressões
    const regex = /^([a-zA-Z_$@][a-zA-Z_$@0-9]*)\[(.+)\]$/;

    // Executa o regex na expressão fornecida
    const match = valor.match(regex);

    // Verifica se a expressão corresponde ao padrão esperado
    if (match) {
        return {
            variavel: match[1],
            posicao: match[2].trim() // Mantém a expressão como string e remove espaços extras
        };
    } else {
        return null; // Retorna null se a expressão não corresponder ao padrão esperado
    }
}

function extrai_variavel_e_posicao_matriz(valor) {
    // Regex para capturar a variável e os colchetes
    const regex = /^([a-zA-Z_]\w*)(\[(.*)\])$/;

    // Executa o regex na expressão fornecida
    const match = valor.match(regex);

    if (match) {
        const variavel = match[1];
        const dimensoes = match[2];

        // Função para processar aninhamentos
        function processaDimensoes(dimensao) {
            let resultado = [];
            let nivel = 0;
            let inicio = 0;

            for (let i = 0; i < dimensao.length; i++) {
                if (dimensao[i] === '[') {
                    if (nivel === 0) {
                        inicio = i + 1;
                    }
                    nivel++;
                } else if (dimensao[i] === ']') {
                    nivel--;
                    if (nivel === 0) {
                        resultado.push(dimensao.substring(inicio, i).trim());
                    }
                }
            }

            return resultado;
        }

        // Processa as dimensões para cada nível
        let dimensaoAtual = dimensoes;
        let dimensoesSeparadas = [];

        while (dimensaoAtual) {
            const dimensoesNiveis = processaDimensoes(dimensaoAtual);
            dimensoesSeparadas = dimensoesSeparadas.concat(dimensoesNiveis);
            if (dimensoesNiveis.length > 1) {
                // Adiciona o próximo nível de dimensões
                dimensaoAtual = dimensoesNiveis.pop();
            } else {
                break;
            }
        }

        return {
            variavel: variavel,
            posicoes: dimensoesSeparadas
        };
    } else {
        return null; // Retorna null se a expressão não corresponder ao padrão esperado
    }
}


function formata_numero_conforme_tipo(arg, tipo){
    if (tipo === 'int'){
        return Math.floor(arg);
    } else {
        return arg;
    }

}

function empilha_variaveis_recursao(escopo){
    if ('recursao' in variaveis_vm[escopo]){
        variaveis_vm[escopo]['recursao'].push(JSON.parse(JSON.stringify(variaveis_vm[escopo]['variaveis'])));
    } else {
        variaveis_vm[escopo]['recursao'] = [JSON.parse(JSON.stringify(variaveis_vm[escopo]['variaveis']))];
    }

    for (let chave in variaveis_vm[escopo]['variaveis']) {
        if (variaveis_vm[escopo]['variaveis'].hasOwnProperty(chave)) {
            variaveis_vm[escopo]['variaveis'][chave] = {'valor': 0, 'tipo': variaveis_vm[escopo]['variaveis']['tipo']};
        }
    }
}

function verificarPosicaoExiste(array, posicao) {
    return posicao in array;
}


function getValue(expressao) {
    let resultado;
    let operador = false;
    if (verifica_operador_unario(expressao)) {
        operador = String(expressao)[0];
        expressao = expressao.toString().substring(1);
    }

    let eh_matriz;
    let eh_vetor;
    // VERIFICA SE EXPRESSÃO CONDICIONAL NÃO É NUMÉRICO
    if (verifica_constante(expressao)) {
        resultado = expressao;
    } else if (verifica_temporaria(expressao)) {
        let escopo_real = verifica_existencia_variavel_escopo(expressao);
        resultado = Number(variaveis_vm[escopo_real]['variaveis'][expressao]['valor']);
        while (verifica_temporaria(resultado)){
            resultado = Number(variaveis_vm[escopo_real]['variaveis'][expressao]['valor']);
        }
    } else {
        eh_vetor = verifica_se_eh_vetor(expressao);
        eh_matriz = verifica_se_eh_matriz(expressao);
        let dados;
        if (eh_vetor) {
            dados = extrai_variavel_e_posicao_vetor(expressao);
            let posicao = getValue(dados.posicao);
            let escopo_real = verifica_existencia_variavel_escopo(dados.variavel);
            if (verificarPosicaoExiste(variaveis_vm[escopo_real]["variaveis"][dados.variavel]['valor'], posicao)){
                resultado = Number(variaveis_vm[escopo_real]['variaveis'][dados.variavel]['valor'][posicao]);
            } else {
                throw `Erro: A posição ${posicao} não existe no vetor.`;
            }
        } else if (eh_matriz){
            dados = extrai_variavel_e_posicao_matriz(expressao);
            let posicao1 = getValue(dados["posicoes"][0]);
            let posicao2 = getValue(dados["posicoes"][1]);
            let escopo_real = verifica_existencia_variavel_escopo(dados.variavel);
            if (verificarPosicaoExiste(variaveis_vm[escopo_real]["variaveis"][dados.variavel]['valor'], posicao1)){
                if (verificarPosicaoExiste(variaveis_vm[escopo_real]["variaveis"][dados.variavel]['valor'][posicao1], posicao2)){
                    resultado = Number(variaveis_vm[escopo_real]['variaveis'][dados.variavel]['valor'][posicao1][posicao2]);
                } else {
                    throw `Erro: A posição ${posicao2} não existe no vetor.`;
                }
            } else {
                throw `Erro: A posição ${posicao1} não existe no vetor.`;
            }
        } else {
            let escopo_real = verifica_existencia_variavel_escopo(expressao);
            if (!(expressao in variaveis_vm[escopo_real]['variaveis'])){
                variaveis_vm[escopo_real]['variaveis'][expressao] = {'valor': Number(NaN)};
            }
            resultado = variaveis_vm[escopo_real]['variaveis'][expressao]['valor'];
        }
    }

    switch (operador) {
        case '!':
            let operacao = !Number(resultado);
            return operacao ? 1 : 0;
        case '+':
            return +Number(resultado);
        case '-':
            return -Number(resultado);
        default:
            return Number(resultado);
    }
}

function setValue(valor, variavel, verifica_existencia_de_variavel=true, tipo_variavel=false){
    let eh_vetor = verifica_se_eh_vetor(variavel);
    let eh_matriz = verifica_se_eh_matriz(variavel);
    let dados;
    let escopo_real;
    if (eh_vetor) {
        dados = extrai_variavel_e_posicao_vetor(variavel);
        if (verifica_existencia_de_variavel){
            escopo_real = verifica_existencia_variavel_escopo(dados.variavel);
        } else {
            escopo_real = vm_escopo;
        }
        let posicao = getValue(dados.posicao);
        // FAZER TESTE DE TAMANHO DO VETOR EM CASO DE ERRO ESTOURAR ERRO DE TAMANHO DE MATRIZ.
        if (verificarPosicaoExiste(variaveis_vm[escopo_real]["variaveis"][dados.variavel]['valor'], posicao)){
            variaveis_vm[escopo_real]['variaveis'][dados.variavel]['valor'][posicao] = Number(formata_numero_conforme_tipo(getValue(valor), variaveis_vm[escopo_real]['variaveis'][dados.variavel]['tipo']));
            modifica_historico_variavel(dados.variavel, variaveis_vm[escopo_real]['variaveis'][dados.variavel]['valor']);
        } else {
            throw `Erro: A posição ${posicao} não existe no vetor.`;
        }
    } else if (eh_matriz){
        dados = extrai_variavel_e_posicao_matriz(variavel);
        let posicao1 = getValue(dados["posicoes"][0]);
        let posicao2 = getValue(dados["posicoes"][1]);
        if (verifica_existencia_de_variavel){
            escopo_real = verifica_existencia_variavel_escopo(dados.variavel);
        } else {
            escopo_real = vm_escopo;
        }
        // FAZER TESTE DE TAMANHO DO VETOR EM CASO DE ERRO ESTOURAR ERRO DE TAMANHO.
        if (verificarPosicaoExiste(variaveis_vm[escopo_real]["variaveis"][dados.variavel]['valor'], posicao1)){
            if (verificarPosicaoExiste(variaveis_vm[escopo_real]["variaveis"][dados.variavel]['valor'][posicao1], posicao2)){
                variaveis_vm[escopo_real]["variaveis"][dados.variavel]['valor'][posicao1][posicao2] = Number(formata_numero_conforme_tipo(getValue(valor), variaveis_vm[escopo_real]["variaveis"][dados.variavel]['tipo']));
                modifica_historico_variavel(dados.variavel, variaveis_vm[escopo_real]["variaveis"][dados.variavel]['valor']);
            } else {
                throw `Erro: A posição ${posicao2} não existe no vetor.`;
            }
        } else {
            throw `Erro: A posição ${posicao1} não existe no vetor.`;
        }
    } else {
        if (verifica_existencia_de_variavel){
            escopo_real = verifica_existencia_variavel_escopo(variavel);
        } else {
            escopo_real = vm_escopo;
        }
        if (!(variavel in variaveis_vm[escopo_real]['variaveis'])) {
            variaveis_vm[escopo_real]['variaveis'][variavel] = {'valor': '',
                                                                'tipo': ''};
            if (tipo_variavel){
                variaveis_vm[escopo_real]['variaveis'][variavel]['tipo'] = tipo_variavel;
            }
        }
        variaveis_vm[escopo_real]['variaveis'][variavel]['valor'] = Number(formata_numero_conforme_tipo(getValue(valor), variaveis_vm[escopo_real]['variaveis'][variavel]['tipo']));
        if (!verifica_temporaria(variavel)){
            modifica_historico_variavel(variavel, variaveis_vm[escopo_real]['variaveis'][variavel]['valor']);
        }

    }
}

function parsePrintf(valor) {
    // Regex para capturar a string formatada e os parâmetros
    const printfRegex = /printf\s*\(\s*"([^"]*)"\s*(?:,\s*([^()]*|\([^()]*\))*\s*)*\)/;

    // Executa a regex para capturar os grupos
    const matches = valor.match(printfRegex);

    if (!matches) {
        return null;
    }

    const formattedString = matches[1];
    const paramsString = valor.slice(valor.indexOf(formattedString) + formattedString.length + 1, valor.lastIndexOf(')')).trim();
    const params = paramsString.split(/\s*,\s*/);

    return {
        formattedString,
        params
    };
}

function formataStringInt(template, values) {
    let index = 0;
    let arg;
    return template.replace(/%d/g, () => {
        arg = getValue(values[index]);
        index++;
        return Math.floor(arg);
    });
}

function formataStringFloat(template, values) {
    let index = 0;
    let arg;
    return template.replace(/%(\.\d+)?f/g, (match, decimals) => {
        arg = getValue(values[index]);
        index++;

        if (decimals) {
            // Se o formato for do tipo %.nf, extrair o número de casas decimais
            let precision = parseInt(decimals.slice(1)); // Remove o ponto (.) e converte para inteiro
            return parseFloat(arg).toFixed(precision);
        } else {
            // Se for apenas %f, retorna o valor original como float
            return parseFloat(arg).toFixed(6);
        }
    });
}

function carrega_parametros(lista_param){
    let parametros = [];
    for (let i=0; i<=lista_param.length;i++){
        parametros.push(getValue(lista_param[i]));
    }
    return parametros;
}

function formataStringQuebraLinha(template) {
    return template.replace(/\\n/g, '\n').replace(/\\t/g, '\t');
}

function parseScanf(valor) {
    // Regex para capturar a string formatada e os parâmetros
    const scanfRegex = /scanf\s*\(\s*"([^"]*)"\s*(?:,\s*([^()]*|\([^()]*\))*\s*)*\)/;

    // Executa a regex para capturar os grupos
    const matches = valor.match(scanfRegex);

    if (!matches) {
        return null;
    }

    const formattedString = matches[1];
    const paramsString = valor.slice(valor.indexOf(formattedString) + formattedString.length + 2, valor.lastIndexOf(')')).trim(); // Adjust index to get correct parameters
    const params = paramsString.split(/\s*,\s*/).map(param => param.replace(/^&\s*/, ''));

    return {
        formattedString,
        params
    };
}

function configura_leitura(vai_ler){
    if (vai_ler){
        vai_ler = true;
        $("#inputText")[0].disabled = false;
        $("#inputText").addClass('input-insere-dados');
        $("#inputText")[0].placeholder = 'Digite um valor de entrada para variável ';
        $("#inputText").focus();
        textareaElement.scrollTop = textareaElement.scrollHeight;
    } else {
        $("#inputText")[0].placeholder = '';
        $("#inputText")[0].disabled = true;
        $("#inputText").removeClass('input-insere-dados');
        textareaElement.scrollTop = textareaElement.scrollHeight;
        vai_ler = false;
    }
}

function calcula_argumentos(arg1, arg2, op){
    if (op === '+') {
        return Number(arg1) + Number(arg2);
    }
    if (op === '-') {
        return Number(arg1) - Number(arg2);
    }
    if (op === '/') {
        if (Number(arg2) === 0){
            dic_control['msg_warning'] = `\nAtenção: divisão por 0 encontrada em ${arg1}/${arg2}`;
        }
        return parseInt(Number(arg1) / Number(arg2));
    }
    if (op === '*') {
        return parseFloat((Number(arg1) * Number(arg2)).toFixed(3));
    }
    if (op === '%') {
        return Number(arg1) % Number(arg2);
    }
    if (op === '>') {
        return Number(arg1) > Number(arg2) ? 1 : 0;
    }
    if (op === '>=') {
        return Number(arg1) >= Number(arg2) ? 1 : 0;
    }
    if (op === '<') {
        return Number(arg1) < Number(arg2) ? 1 : 0;
    }
    if (op === '<=') {
        return Number(arg1) <= Number(arg2) ? 1 : 0;
    }
    if (op === '==') {
        return Number(arg1) == Number(arg2) ? 1 : 0;
    }
    if (op === '!=') {
        return Number(arg1) != Number(arg2) ? 1 : 0;
    }
    if (op === '&&') {
        return Number(arg1) && Number(arg2) ? 1 : 0;
    }
    if (op === '||') {
        return Number(arg1) || Number(arg2) ? 1 : 0;
    }
}

function verifica_se_eh_escopo(label){
    if (label.startsWith("#") && /^\#\d+$/.test(label)) {
        return true;
    } else {
        return false;
    }
}

function inicializa_variaveis_globais(codigo_c3e){
    let esta_em_funcao = false;
    let c3e;
    vm_escopo = 0;  // variavel global
    vm_escopo_pai = 0;
    for (let i = 0; i < codigo_c3e.length; i++) {
        c3e = codigo_c3e[i];
        if (c3e.escopo && c3e.label){
            vm_escopo = parseInt(c3e.result.substring(1));
        }
        if (c3e.salto && c3e.result == 'goto' && verifica_se_eh_chamada_de_funcao(c3e.arg1)){
            vm_funcoes.push(c3e.arg1.substring(1));
        }
        if (vm_escopo === 0 && !c3e.escopo && !c3e.salto && !c3e.escrita && !c3e.label && !c3e.leitura){
            arg1 = getValue(c3e.arg1);
            if (!arg1){
                if (verifica_se_eh_vetor(c3e.result)) {
                    let dados = extrai_variavel_e_posicao_vetor(c3e.result);
                    inicializa_vetor(dados['variavel'], dados["posicao"]);
                    continue;
                } else if (verifica_se_eh_matriz(c3e.result)){
                    let dados = extrai_variavel_e_posicao_matriz(c3e.result);
                    inicializa_matriz(dados['variavel'], dados["posicoes"][0], dados["posicoes"][1]);
                } else {
                    setValue(0, c3e.result, false);
                    modifica_historico_variavel(c3e.result, 0);
                }
            } else {
                arg2 = '';
                if (c3e.arg2){
                    arg2 = getValue(c3e.arg2);
                }
                if (c3e.op){
                    result = calcula_argumentos(arg1, arg2, c3e.op);
                } else {
                    result = arg1;
                }

                setValue(result, c3e.result, false);
                debugger;
                modifica_historico_variavel(c3e.result, result);
            }

        }
    }
    vm_escopo = 0;
}