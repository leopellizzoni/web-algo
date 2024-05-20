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
    msg_erro: ''
}
var tabela_de_simbolos = {};

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
    "TKContinue": 47
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
        if (dic_control['msg_erro'] === '') {
            dic_control['msg_erro'] += "variável '" + identificador + "' não declarada" + ' (' + count_line + ', ' + count_column + ')' + '\n';
        }
        return false;
    }
}


function tabela_simbolos(acao, tipo, variavel, tamanho, dimensao_vetor){
    if (acao === 'grava'){
        tabela_de_simbolos[variavel.toString()] = {
            'tipo': tipo,
            'valor': null,
            'dimensao': {},
            'matriz_vetor': ''};
    }
    if (acao === 'tamanho'){
        if (dimensao_vetor === 1){
            tabela_de_simbolos[variavel.toString()]['matriz_vetor'] = 'vetor';
            tabela_de_simbolos[variavel.toString()]['dimensao'][dimensao_vetor] = tamanho
        } else {
            tabela_de_simbolos[variavel.toString()]['matriz_vetor'] = 'matriz';
            tabela_de_simbolos[variavel.toString()]['dimensao'][dimensao_vetor] = tamanho
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
    dic_control['msg_erro'] = ''
}

function backtracking(funcao){
    var dic = dic_backtracking;
    if (funcao === 'push'){
        dic["caracter"] = caracter;
        dic["lexema"] = lexico;
        dic["posicao"] = code_position;
        dic["token"] = tk;
        dic["count_column"] = count_column;
        dic["count_line"] = count_line;
        // dic["msg_erro"] = dic_control["msg_erro"];
        lista_backtracking.push(dic);
    } else {
        ultima_posicao = lista_backtracking.pop();
        caracter = ultima_posicao["caracter"];
        lexico = ultima_posicao["lexema"];
        code_position = ultima_posicao["posicao"];
        tk = ultima_posicao["token"];
        count_column = ultima_posicao["count_column"];
        count_line = ultima_posicao["count_line"];
        // dic_control["msg_erro"] = ultima_posicao["msg_erro"];
    }
}


function compiler(){
    // Pega código digitado pelo usuário
    inicializa_compilacao();
    code = editor.getValue();
    console.log(code);
    proxC();
    // Teste analisador léxico somente
    // while(code.length > code_position && !erro_lexico){
    //     lexico = '';
    //     getToken();
    //     console.log(lexico);
    // }

    // Teste analisador léxico e sintático
    getToken();
    if (Programa()){
        textareaElement.value += 'Reconheceu OK' + '\n';
    } else {
        textareaElement.value += 'erro: ' + dic_control['msg_erro']
    }
}