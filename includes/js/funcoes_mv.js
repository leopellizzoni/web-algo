function criaDicVariaveis(){
    if (!variaveis_vm[vm_escopo]){
        variaveis_vm.push({'variaveis': {}, 'escopo_pai': vm_escopo_pai});
    }
}

function verifica_existencia_variavel_escopo(variavel, tipo){
    if (!variaveis_vm[vm_escopo]){
        criaDicVariaveis();
    }

    for (let index=vm_escopo; index>=0;index = variaveis_vm[index]['escopo_pai']){
        if (variavel in variaveis_vm[index]['variaveis']){
            return index;
        }
        if (index === 0){
            return vm_escopo;
        }
    }
}

function inicializa_matriz(tam_vetor, tam_matriz) {
    let vetor = [];
    for (let i = 0; i < tam_vetor; i++) {
        vetor.push([]);
        for (let j = 0; j < tam_matriz; j++) {
            vetor[i].push('');
        }
    }
    return vetor;
}

function inicializa_vetor(variavel, tam_vetor) {
    let vetor = [];
    for (let i = 0; i < tam_vetor; i++) {
        vetor.push(NaN);
    }
    variaveis_vm[vm_escopo]['variaveis'][variavel] = {'valor': vetor};
    return vetor;
}

function inicializa_vetores_e_matrizes(key){
    let tam_vetor;
    let var_vetor;
    if (regexNumero.test(tabela_de_simbolos[key].dimensao[1])) {
        tam_vetor = Number(tabela_de_simbolos[key].dimensao[1]);
    } else {
        tam_vetor = Number(variaveis_vm[tabela_de_simbolos[key].dimensao[1]]['valor']);
    }
    if (tabela_de_simbolos[key].matriz_vetor === 'vetor') {
        var_vetor = inicializa_vetor(tam_vetor);
        variaveis_vm[key] = {'valor': var_vetor};
    } else {
        let tam_matriz;
        if (regexNumero.test(tabela_de_simbolos[key].dimensao[2])) {
            tam_matriz = Number(tabela_de_simbolos[key].dimensao[2]);
        } else {
            tam_matriz = Number(variaveis_vm[tabela_de_simbolos[key].dimensao[2]]['valor']);
        }
        var_vetor = inicializa_matriz(tam_vetor, tam_matriz);
        variaveis_vm[key] = {'valor': var_vetor};
    }
}

function inicializa_vetores_e_matrizes(key) {
    let tam_vetor;
    let var_vetor;
    if (regexNumero.test(tabela_de_simbolos[key].dimensao[1])) {
        tam_vetor = Number(tabela_de_simbolos[key].dimensao[1]);
    } else {
        tam_vetor = Number(variaveis_vm[tabela_de_simbolos[key].dimensao[1]]['valor']);
    }
    if (tabela_de_simbolos[key].matriz_vetor === 'vetor') {
        var_vetor = inicializa_vetor(tam_vetor);
        variaveis_vm[key] = {'valor': var_vetor};
    } else {
        let tam_matriz;
        if (regexNumero.test(tabela_de_simbolos[key].dimensao[2])) {
            tam_matriz = Number(tabela_de_simbolos[key].dimensao[2]);
        } else {
            tam_matriz = Number(variaveis_vm[tabela_de_simbolos[key].dimensao[2]]['valor']);
        }
        var_vetor = inicializa_matriz(tam_vetor, tam_matriz);
        variaveis_vm[key] = {'valor': var_vetor};
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

function verifica_constante(valor) {
    return regexNumeroInteiro.test(String(valor));
}

function verifica_temporaria(valor) {
    return String(valor)[0] === '@';
}

function verifica_se_eh_vetor(valor) {
    let arrayNotationRegex = /^[a-zA-Z_]\w*\[\d+\]$/;
    return arrayNotationRegex.test(valor);
}

function verifica_se_eh_matriz(valor) {
    let matrixNotationRegex = /^[a-zA-Z_]\w*(\[\d+\])+$/;
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
    // Regex para capturar a variável e a posição
    const regex = /^([a-zA-Z_$][a-zA-Z_$0-9]*)\[(\d+)\]$/;

    // Executa o regex na expressão fornecida
    const match = valor.match(regex);

    // Verifica se a expressão corresponde ao padrão esperado
    if (match) {
        return {
            variavel: match[1],
            posicao: parseInt(match[2], 10)
        };
    } else {
        return null; // Retorna null se a expressão não corresponder ao padrão esperado
    }
}

function extrai_variavel_e_posicao_matriz(valor) {
    // Regex para capturar a variável e as posições
    const regex = /^([a-zA-Z_$][a-zA-Z_$0-9]*)\[(\d+)\](\[(\d+)\])*$/;

    // Executa o regex na expressão fornecida
    const match = valor.match(regex);

    // Verifica se a expressão corresponde ao padrão esperado
    if (match) {
        // Captura a variável
        const variavel = match[1];

        // Captura todas as posições
        const posicoes = [];
        const regexPosicoes = /\[(\d+)\]/g;
        let posicaoMatch;
        while ((posicaoMatch = regexPosicoes.exec(valor)) !== null) {
            posicoes.push(parseInt(posicaoMatch[1], 10));
        }

        return {
            variavel: variavel,
            posicoes: posicoes
        };
    } else {
        return null; // Retorna null se a expressão não corresponder ao padrão esperado
    }
}

function getValue(expressao) {
    let resultado;
    let operador = false;
    if (verifica_operador_unario(expressao)) {
        operador = String(expressao)[0];
        expressao = expressao.substring(1);
    }

    let eh_matriz;
    let eh_vetor;
    // VERIFICA SE EXPRESSÃO CONDICIONAL NÃO É NUMÉRICO
    if (verifica_constante(expressao)) {
        resultado = expressao;
    } else if (verifica_temporaria(expressao)) {
        resultado = Number(variaveis_vm[expressao]['valor']);
    } else {
        eh_vetor = verifica_se_eh_vetor(expressao);
        eh_matriz = verifica_se_eh_matriz(expressao);
        let dados;
        if (eh_vetor) {
            dados = extrai_variavel_e_posicao_vetor(expressao);
            let escopo_real = verifica_existencia_variavel_escopo(dados.variavel);
            resultado = Number(variaveis_vm[escopo_real]['variaveis'][dados.variavel]['valor'][dados.posicao]);
        } else if (eh_matriz){
            dados = extrai_variavel_e_posicao_matriz(expressao);
            let escopo_real = verifica_existencia_variavel_escopo(dados.variavel);
            resultado = Number(variaveis_vm[escopo_real]['variaveis'][dados.variavel]['valor'][dados.posicoes[0]][dados.posicoes[1]]);
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
            return !Number(resultado);
        case '+':
            return +Number(resultado);
        case '-':
            return -Number(resultado);
        default:
            return Number(resultado);
    }
}

function setValue(valor, variavel, verifica_existencia_de_variavel=true){
    let eh_vetor = verifica_se_eh_vetor(variavel);
    let eh_matriz = verifica_se_eh_matriz(variavel);
    let dados;
    let escopo_real;
    if (eh_vetor) {
        dados = extrai_variavel_e_posicao_vetor(variavel);
        if (verifica_existencia_de_variavel){
            escopo_real = verifica_existencia_variavel_escopo(dados.variavel, 'vetor');
        } else {
            escopo_real = vm_escopo;
        }
        variaveis_vm[escopo_real]['variaveis'][dados.variavel]['valor'][dados.posicao] = Number(valor);
        modifica_historico_variavel(dados.variavel, variaveis_vm[escopo_real]['variaveis'][dados.variavel]['valor']);
    } else if (eh_matriz){
        dados = extrai_variavel_e_posicao_matriz(variavel);
        if (verifica_existencia_de_variavel){
            escopo_real = verifica_existencia_variavel_escopo(variavel, 'vetor');
        } else {
            escopo_real = vm_escopo;
        }
        variaveis_vm[escopo_real][dados.variavel]['valor'][dados.posicoes[0]][dados.posicoes[1]] = Number(valor);
        modifica_historico_variavel(dados.variavel, variaveis_vm[escopo_real][dados.variavel]['valor']);
    } else {
        if (verifica_existencia_de_variavel){
            escopo_real = verifica_existencia_variavel_escopo(variavel);
        } else {
            escopo_real = vm_escopo;
        }
        variaveis_vm[escopo_real]['variaveis'][variavel] = {'valor': Number(valor)};
        if (!verifica_temporaria(variavel)){
            modifica_historico_variavel(variavel, valor);
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
    return template.replace(/%f/g, () => {
        arg = getValue(values[index]);
        index++;
        return Math.floor(arg);
    });
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
        return Number(arg1) / Number(arg2);
    }
    if (op === '*') {
        return Number(arg1) * Number(arg2);
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

function inicializa_variaveis_globais(codigo_c3e){
    let esta_em_funcao = false;
    let c3e;
    vm_escopo = 0;  // variavel global
    vm_escopo_pai = 0;
    criaDicVariaveis();
    for (let i = 0; i < codigo_c3e.length; i++) {
        c3e = codigo_c3e[i];
        if (c3e.result === 'goto' && verifica_se_eh_chamada_de_funcao(c3e.arg1)){
            continue;
        }
        if (!c3e.salto && verifica_se_eh_chamada_de_funcao(c3e.result) && esta_em_funcao == false) {
            esta_em_funcao = true;
            continue;
        }
        if (verifica_se_eh_return(c3e.result)){
            esta_em_funcao = false;
            continue;
        }
        if (!esta_em_funcao){
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
                    setValue(NaN, c3e.result, false);
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
            }

        }
    }
}