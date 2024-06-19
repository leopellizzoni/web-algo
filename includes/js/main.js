var code = '';
// Contadores de linha e coluna para alertar erros léxicos ou sintáticos.
var count_column = 0;
var count_line = 1;
// Caracter utilizado para obter o token
var caracter = null;
// Variável indica a posição na variável de leitura do código digitado pelo aluno
var code_position = -1;
// Variável utilizada para montar token
var lexico = '';
// Indica Erro léxico
var erro_lexico = false;
// Dicionário de controle
var dic_control = {
    encontrou_main: false,
    encontrou_expressao: false,
    msg_erro: '',
    printf: '',
    c3e: '',
    bibliotecas: {}
};
var vai_ler = false
var tabela_de_simbolos;
let currentController = null;

TKs = {
    "TKId": 1,
    "TKVoid": 2,
    "TKInt": 3,
    "TKFloat": 4,
    "TKDouble": 5,
    "TKIf": 6,
    "TKElse": 7,
    "TKDo": 8,
    "TKWhile": 9,
    "TKFor": 10,
    "TKBreak": 11,
    "TKReturn": 12,
    "TKCteDouble": 13,
    "TKCteInt": 14,
    "TKVirgula": 15,
    "TKPonto": 16,
    "TKDoisPontos": 17,
    "TKPontoEVirgula": 18,
    "TKAbreParenteses": 19,
    "TKFechaParenteses": 20,
    "TKAbreColchete": 21,
    "TKFechaColchete": 22,
    "TKAbreChaves": 23,
    "TKFechaChaves": 24,
    "TKDuploMais": 25,
    "TKMaisIgual": 26,
    "TKMais": 27,
    "TKDuploMenos": 28,
    "TKMenosIgual": 29,
    "TKMenos": 30,
    "TKMultIgual": 31,
    "TKMult": 32,
    "TKDivIgual": 33,
    "TKDiv": 34,
    "TKRestoIgual": 35,
    "TKResto": 36,
    "TKCompare": 37,
    "TKIgual": 38,
    "TKDiferent": 39,
    "TKLogicalNot": 40,
    "TKMenorIgual": 41,
    "TKMenor": 42,
    "TKMaiorIgual": 43,
    "TKMaior": 44,
    "TKLogicalAnd": 45,
    "TKLogicalOr": 46,
    "TKContinue": 47,
    "TKPrintf": 48,
    "TKScanf": 49,
    "TKString": 50,
    "TKEnderecoVariavel": 51,
    "TKDefine": 52,
    "TKStdioh": 53,
    "TKInclude": 54
}

// Palavras reservadas da linguagem
reserved_words = {
    "void": TKs['TKVoid'],
    "int": TKs['TKInt'],
    "float": TKs['TKFloat'],
    "double": TKs['TKDouble'],
    "if": TKs['TKIf'],
    "else": TKs['TKElse'],
    "do": TKs['TKDo'],
    "while": TKs['TKWhile'],
    "for": TKs['TKFor'],
    "break": TKs['TKBreak'],
    "return": TKs['TKReturn'],
    "continue": TKs['TKContinue'],
    "printf": TKs["TKPrintf"],
    "scanf": TKs["TKScanf"],
    "end_reserved_words": TKs['TKId']
}


function verifica_variavel_declarada(identificador, dimensao=0){
    if (identificador in tabela_de_simbolos){
        if (dimensao > 0){
            // verifica dimensao do vetor da atribuição e compara com o que foi declarado
            if (dimensao === Object.keys(tabela_de_simbolos[identificador]['dimensao']).length){
                return true;
            } else {
                if (dic_control['msg_erro'] === '') {
                    dic_control['msg_erro'] += "dimensão do vetor '" + identificador + "' diferente do especificado" + ' (' + count_line + ', ' + count_column + ')' + '\n';
                }
                return false;
            }
        }
        return true;
    } else {
        dic_control['msg_erro'] = "variável '" + identificador + "' não declarada" + ' (' + count_line + ', ' + count_column + ')' + '\n';
        return false;
    }
}


function tabela_simbolos(acao, tipo, variavel, tamanho, dimensao_vetor, define=false){
    if (acao === 'grava'){
        tabela_de_simbolos[variavel.toString()] = {
            'tipo': tipo,
            'valor': null,
            'dimensao': {},
            'matriz_vetor': '',
            'define': define};
    }
    if (acao === 'tamanho'){
        if (dimensao_vetor === 1){
            tabela_de_simbolos[variavel.toString()]['matriz_vetor'] = 'vetor';
            tabela_de_simbolos[variavel.toString()]['dimensao'][dimensao_vetor] = tamanho;
        } else {
            tabela_de_simbolos[variavel.toString()]['matriz_vetor'] = 'matriz';
            tabela_de_simbolos[variavel.toString()]['dimensao'][dimensao_vetor] = tamanho;
        }
    }
    if (acao === 'verifica_define'){
        if (variavel.toString() in tabela_de_simbolos){
            if (tabela_de_simbolos[variavel.toString()]['define']){
                // tem macro no define declarado
                return false;
            } else {
                // não tem macro no define declarado
                return true;
            }
        } else {
            return true;
        }
    }
}


// Função que busca o próximo caractér do código digitado pelo usuário
function proxC(){
    count_column += 1;
    if (caracter === '\n'){
        count_column = 0;
        count_line += 1;
    }
    // Pegue o próximo caractere
    caracter = code.charAt(code_position + 1);
    code_position += 1;
}


function inicializa_compilacao(){
    code_position = -1;
    erro_lexico = false;
    // Limpa console
    textareaElement.value = "";
    count_column = 0;
    count_line = 1;
    dic_control['msg_erro'] = '';
    dic_control['printf'] = '';
    dic_control['encontrou_expressao'] = false;
    dic_control["encontrou_main"] = false;
    dic_control["bibliotecas"] = {};
    tabela_de_simbolos = new Object();
    instrucoes = [];
    tempCount = 0;
    labelCount = 0;
    identificador = '';
    lista_param_printf = [];
    variaveis = {};
    historico_variaveis = {};
    index_goto = {};
    flag_saida_escrita = true;
    cancelarExecucao = false;
}

function backtracking(funcao){
    if (funcao === 'push'){
        dic = {};
        dic["caracter"] = caracter;
        dic["lexema"] = lexico;
        dic["posicao"] = code_position;
        dic["token"] = tk;
        dic["count_column"] = count_column;
        dic["count_line"] = count_line;
        dic["instrucoes_c3e"] = instrucoes.slice();
        dic["msg_erro"] = dic_control['msg_erro'];
        dic["tabela_de_simbolos"] = tabela_de_simbolos;
        lista_backtracking.push(dic);
    } else {
        ultima_posicao = lista_backtracking.pop();
        caracter = ultima_posicao["caracter"];
        lexico = ultima_posicao["lexema"];
        code_position = ultima_posicao["posicao"];
        tk = ultima_posicao["token"];
        count_column = ultima_posicao["count_column"];
        count_line = ultima_posicao["count_line"];
        instrucoes = ultima_posicao['instrucoes_c3e'];
        dic_control['msg_erro'] = ultima_posicao['msg_erro'];
        tabela_de_simbolos = ultima_posicao['tabela_de_simbolos'];
    }
}


function compiler(){
    $("#inputText")[0].disabled = false;
    $("#inputText").addClass('input-insere-dados');
    debugger;
    if (vai_ler) {
        saveDataAndReload();
    } else {
        localStorage.setItem('compilar', false);
    }
    mostra_tela_aguarde('Compilando...');
    // $("#button2")[0].hidden = true;
    // $("#button3")[0].hidden = false;
    setTimeout(function (){
        cancelarExecucao = false;
        // Pega código digitado pelo usuário
        inicializa_compilacao();
        code = editor.getValue();
        console.log(code);
        proxC();
        let c3e = [];
        // Teste analisador léxico somente
        // while(code.length > code_position && !erro_lexico){
        //     lexico = '';
        //     getToken();
        //     console.log(lexico);
        // }

        // Teste analisador léxico e sintático
        getToken();
        if (Programa()){
            textareaElement.value += 'Compilação OK' + '\n';
            instrucoes.forEach(inst => {
                if (inst.salto || inst.label) {
                    console.log(`${inst.result} ${inst.arg1} ${inst.op} ${inst.arg2}`);
                    dic_control['c3e'] = `${inst.result} ${inst.arg1} ${inst.op} ${inst.arg2}\n`;
                } else if (inst.escrita || inst.leitura){
                    console.log(`${inst.result}`);
                    dic_control['c3e'] = `${inst.result}\n`;
                } else if (inst.result && inst.arg1) {
                    console.log(`${inst.result} = ${inst.arg1} ${inst.op} ${inst.arg2}`);
                    dic_control['c3e'] = `${inst.result} = ${inst.arg1} ${inst.op} ${inst.arg2}\n`;
                } else {
                    console.log(`${inst.result}`);
                    dic_control['c3e'] = `${inst.result}\n`;
                }

            });
            executaC3E(instrucoes);
            // if (dic_control["printf"] !== ''){
            //     textareaElement.value += 'Saída de escrita:' + '\n' + dic_control["printf"];
            // }
        } else {
            textareaElement.value += 'erro: ' + dic_control['msg_erro']
        }
        esconde_tela_aguarde();
    }, 0);
}

function atualiza_tabela_variaveis(data){
    let $table = $('#tabela_variaveis');
    let $tbody = $('<tbody></tbody>');
    let contador = 0;
    $.each(data, function(key, value) {
        let $row = $('<tr></tr>');
        let $contador = $('<td></td>').text(contador).css({'text-align':'center',  'font-weight': 'bold'});
        let $cellKey = $('<td></td>').text(key);
        let $cellValue = $('<td></td>').text(value[value.length - 1]).css({'text-align':'right', 'padding-right': '15px'});

        $row.append($contador);
        $row.append($cellKey);
        $row.append($cellValue);
        $tbody.append($row);
        contador += 1;
    });

    $table.find('tbody').remove();
    $table.append($tbody);
}

function carrega_historico_variaveis(){
    $("#modal_historico_variaveis").modal('show');

    let primeira_vez = true;
    let maior_colspan = 0;
    // verifica quantidade de colspans necessários
    $.each(historico_variaveis, function(key, value) {
        if (primeira_vez){
            maior_colspan = value.length;
            primeira_vez = false;
        }
        if (value.length > maior_colspan){
            maior_colspan = value.length;
        }
    });

    let $table = $('#tabela_historico_variaveis_modal');
    let $tbody = $('<tbody></tbody>');
    let contador = 0;
    $.each(historico_variaveis, function(key, value) {
        let conta_celulas_criadas = maior_colspan;
        let $row = $('<tr></tr>');
        let $contador = $('<td></td>').text(contador).css({'text-align':'center',  'font-weight': 'bold'});
        let $cellKey = $('<td></td>').text(key);
        $row.append($contador);
        $row.append($cellKey);
        for (let i=0;i<value.length;i++){
            let $cellValue = $('<td></td>').text(value[i]).css({'text-align':'right', 'padding-right': '15px'});
            $row.append($cellValue);
            conta_celulas_criadas--;
        }

        while (conta_celulas_criadas>0){
            let $cellValue = $('<td></td>');
            $row.append($cellValue);
            conta_celulas_criadas--;
        }

        $tbody.append($row);
        contador += 1;
    });

    $table.find('tbody').remove();
    $table.append($tbody);

    console.log(maior_colspan);
    // Retorna false pois é um hyperlink
    return false;
}