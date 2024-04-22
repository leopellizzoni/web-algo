var code = '';
// Contadores de linha e coluna para alertar erros léxicos ou sintáticos.
var count_column = 0;
var count_line = 0;
// Caracter utilizado para obter o token
var caracter = null;
// Variável indica a posição na variável de leitura do código digitado pelo aluno
var code_position = 0;
// Variável utilizada para montar token
var lexico = '';

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
    "TKSoma": 27,
    "TKDuploMenos": 28,
    "TKMenosIgual": 29,
    "TKMenos": 30,
    "TKMultIgual": 31,
    "TKMult": 32,
    "TKDivIgual": 33,
    "TKDiv": 34,
    "TKRestoIgual": 35,
    "TKResto": 36,
    "": 37,
    "": 38,

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
    "end_reserved_words": TKs['TKId']
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



function compiler(){
    alert('oi');
    // Pega código digitado pelo usuário
    code = editor.getValue();
    console.log(code);
    proxC();
}