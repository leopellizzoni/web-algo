var lista_backtracking = [];

// identificador da variável no momento
var identificador = '';
var dimensao = 0;
var tempCount = 0;
var labelCount = 0;

var instrucoes = [];

var index_escopo = 0;
var index_escopo_pai = 0;

function newTemp() {
    return "@t" + tempCount++;
}

function newLabel() {
    return "L" + labelCount++;
}

function geraInstrucaoInicial(op, arg1, arg2, result, linha, salto=false, escrita=false, label=false, leitura=false, escopo=false){
    instrucoes.unshift({ op, arg1, arg2, result, salto, escrita, label, leitura, linha, escopo });
}

function geraInstrucao(op, arg1, arg2, result, linha, salto=false, escrita=false, label=false, leitura=false, escopo=false, parametros=false, tipo_variavel=false) {
    instrucoes.push({ op, arg1, arg2, result, salto, escrita, label, leitura, linha, escopo, parametros, tipo_variavel });
}

function OperadorUnario(){
    if (tk === TKs['TKMais']){
        getToken();
        return true;
    } else if (tk === TKs['TKMenos']){
        getToken();
        return true;
    } else if (tk === TKs['TKLogicalNot']){
        getToken();
        return true;
    } else {
        return false;
    }
}

function OperadorAtrib(){
    if (tk === TKs['TKIgual']){
        getToken();
        return true;
    } else if (tk === TKs['TKMultIgual']){
        getToken();
        return true;
    } else if (tk === TKs['TKDivIgual']){
        getToken();
        return true;
    } else if (tk === TKs['TKRestoIgual']){
        getToken();
        return true;
    } else if (tk === TKs['TKMaisIgual']){
        getToken();
        return true;
    } else if (tk === TKs['TKMenosIgual']){
        getToken();
        return true;
    } else {
        return false;
    }
}


function Tipo(){
    if (tk === TKs['TKInt'] || tk === TKs['TKVoid'] || tk === TKs['TKFloat'] || tk === TKs['TKDouble']){
        getToken();
        return true;
    } else {
        return false;
    }
}

function NomeFunc(tipo){
    let variavel = lexico.toString().replace(/\x00/g, '');
    if (tk === TKs['TKId']){
        let labelFunc = '$' + variavel;
        geraInstrucao('', '', '', labelFunc, count_line, false, false, true);
        tabela_simbolos(index_escopo, 'grava', tipo, variavel, false, false, false, true);
        getToken();
        return true;
    } else {
        return false;
    }
}


function Param(){
    var tipo = {'tk': tk,
                                 'tipo': lexico.toString().replace(/\x00/g, '')};
    if (Tipo()){
        let variavel = lexico.toString().replace(/\x00/g, '');
        if (tk === TKs['TKId']){
            if (tabela_simbolos(index_escopo, 'verifica_define', tipo, variavel) && verifica_variavel_declarada_em_escopos(index_escopo, variavel)) {
                tabela_simbolos(index_escopo, 'grava', tipo, variavel);
                getToken();
                let result = DecRestante(tipo, variavel, 1);
                if (result) {
                    if (typeof result === 'string') {
                         return variavel+result;
                    } else {
                        return variavel;
                    }
                }
                return true;
            } else {
                return false;
            }
        } else {
            backtracking('pop');
            return false;
        }
    } else {
        backtracking('pop');
        return false;
    }
}


function ListaParamRestantes(){
    if (tk === TKs['TKVirgula']){
        getToken();
        let result = Param();
        if (result){
            let temp2 = ListaParamRestantes();
            if (typeof temp2 === 'string') {
                return result + ',' + temp2;
            } else {
                return result;
            }
        } else {
            return false;
        }
    } else {
        return true;
    }
}

function ListaParam(){
    backtracking('push');
    let result = Param();
    if (result){
        let temp2 = ListaParamRestantes();
        if (typeof temp2 === 'string') {
            lista_parametros_func.push(result + ',' +temp2);
            return true;
        } else {
            lista_parametros_func.push(result);
            return true;
        }
    } else {
        console.log('chegou aqui');
        return true;
    }
}


function ExpressaoPosRestante(lado_atribuicao, arg1) {
    if (tk !== TKs['TKAbreParenteses'] && ExpressaoPrima(lado_atribuicao)) {
        return true;
    } else if (tk === TKs['TKAbreColchete']) {
        if (arg1 && !verifica_variavel_declarada(index_escopo, arg1, 0, false, true)){
            dic_control['msg_erro'] = " variável '" + arg1 + "' não é vetor " + ' (' + count_line + ', ' + count_column + ')' + '\n';
            return false;
        }
        getToken();
        dimensao += 1;
        let result = Expressao();
        if (result) {
            if (tk === TKs['TKFechaColchete']) {
                getToken();
                let temp2 = ExpressaoPosRestante(lado_atribuicao);
                if (arg1){
                    if (typeof temp2 === 'string') {
                        return arg1 + "[" + result + "]" + temp2;
                    } else {
                        if (!verifica_variavel_declarada(index_escopo, arg1, dimensao, false, false, true)){
                            return false;
                        }
                        return arg1 + "[" + result + "]";
                    }
                } else {
                    if (typeof temp2 === 'string') {
                        return "[" + result + "]" + temp2;
                    } else {
                        return "[" + result + "]";
                    }
                }

            } else {
                return false;
            }
        } else {
            return false;
        }
    } else if (tk === TKs['TKAbreParenteses']){
        getToken();
        if (tk === TKs['TKFechaParenteses']) {
            let label = '$' + arg1;
            geraInstrucao('', label, '', 'goto', count_line, true, false, false, false, false, false, busca_tipo_variavel(arg1));
            getToken();
            return true;
            // if (ExpressaoPosRestante()){
            //     return true;
            // } else {
            //     return false;
            // }
        } else {
            if (Expressao()){
                let parametros_funcao = lista_parametros_func.pop();
                if (tk === TKs['TKFechaParenteses']) {
                    let label = '$' + arg1;
                    let parametros = '';
                    if (parametros_funcao){
                        parametros = parametros_funcao;
                    }
                    if (tabela_de_simbolos[0]['variaveis'][arg1]['qtd_parametros_func'] !== parametros_funcao.split(',').length){
                        dic_control['msg_erro'] = "Quantidade de parâmetros da chamada de função '" + arg1  + "' difere do esperado (" + count_line + ', ' + count_column + ')' + '\n';
                    }
                    geraInstrucao('', label, parametros, 'goto', count_line, true, false, false, false, false, false, busca_tipo_variavel(arg1));
                    getToken();
                    return true;
                } else {
                    if (dic_control['msg_erro'] === ''){
                        dic_control['msg_erro'] = "não encontrou o caracter ')' na chamada da função " + ' (' + count_line + ', ' + count_column + ')' + '\n';
                    }
                    return false;
                }
            } else {
                return false;
            }
        }
    } else if (tk === TKs['TKDuploMais']){
        getToken();
        if (empilha_operacao_aritmetica.length > 0){
            dic_control['msg_erro'] = `Comportamento indefinido em ${empilha_operacao_aritmetica[0]}${identificador}++. Não é permitido usar operadores pré e pós na mesma variável em uma única expressão (${count_line}, ${count_column}).`;
            return false;
        }
        let temp = newTemp();
        geraInstrucao('', identificador, '', temp, count_line);
        geraInstrucao('+', identificador, 1, identificador, count_line);
        if (ExpressaoPosRestante(lado_atribuicao)) {
            return temp;
        } else {
            return false;
        }
    } else if (tk === TKs['TKDuploMenos']){
        if (empilha_operacao_aritmetica.length > 0){
            dic_control['msg_erro'] = `Comportamento indefinido em ${empilha_operacao_aritmetica[0]}${identificador}--. Não é permitido usar operadores pré e pós na mesma variável em uma única expressão (${count_line}, ${count_column}).`;
            return false;
        }
        getToken();
        let temp = newTemp();
        geraInstrucao('', identificador, '', temp, count_line);
        geraInstrucao('-', identificador, 1, identificador, count_line);
        if (ExpressaoPosRestante(lado_atribuicao)) {
            return temp;
        } else {
            return false;
        }
    } else {
        return true;
    }
}

function ExpressaoPrima(lado_atribuicao) {
    if (tk === TKs['TKId']) {
        identificador = lexico.toString().replace(/\x00/g, '');
        // if (!identificador || identificador !== lexico.toString().replace(/\x00/g, '')){
        //     if (!verifica_variavel_declarada(lexico.toString().replace(/\x00/g, ''))){
        //         return false;
        //     }
        // }
        if (verifica_variavel_declarada(index_escopo, lexico.toString().replace(/\x00/g, ''))){
            getToken();
            return identificador;
        } else {
            throw 'Variável não declarada';
            return false;
        }
    } else if (tk === TKs['TKCteInt'] || tk === TKs['TKCteDouble']) {
        if (lado_atribuicao !== 'esquerdo') {
            let arg1 = lexico.toString().replace(/\x00/g, '');
            getToken();
            return arg1;
        } else {
            if (dic_control['msg_erro'] === '') {
                dic_control['msg_erro'] += "operador do lado esquerdo de uma atribuição requere um identificador válido " + ' (' + count_line + ', ' + count_column + ')' + '\n';
            }
            return false;
        }
    } else if(tk === TKs['TKAbreParenteses']){
        getToken();
        let result = Expressao();
        if (result){
            if (tk === TKs['TKFechaParenteses']){
                getToken();
                return result;
            } else {
                return false;
            }
        } else {
            return false;
        }
    } else {
        return false;
    }
}


function ExpressPos(lado_atribuicao){
    let arg1 = lexico.toString().replace(/\x00/g, '');
    let result = ExpressaoPrima(lado_atribuicao);
    if (result){
        if (typeof result !== 'string'){
            let temp = newTemp();
            result = ExpressaoPosRestante(lado_atribuicao, arg1);
            if (result){
                return result;
            } else {
                return false;
            }
        } else {
            let temp2 = ExpressaoPosRestante(lado_atribuicao, arg1);
            if (temp2){
                if (typeof temp2 === 'string'){
                    return temp2;
                } else {
                    // tempCount--;
                    return result;
                }
            } else {
                return false;
            }
        }
    } else {
        return false;
    }
}

let empilha_operacao_aritmetica = [];
function ExpressUnaria(lado_atribuicao){
    let arg1 = lexico.toString().replace(/\x00/g, '');
    let result = ExpressPos(lado_atribuicao);
    if (result){
        return result;
    } else if (tk === TKs['TKDuploMais']){
        empilha_operacao_aritmetica.push('++');
        getToken();
        if (tk === TKs['TKCteInt'] || tk === TKs['TKCteDouble']){
            if (dic_control['msg_erro'] === ''){
                dic_control['msg_erro'] = `Operação inválida ++${lexico}. O operador de incremento não pode ser aplicado a uma constante. `  + ' (' + count_line + ', ' + count_column + ')' + '\n';
            }
            return false;
        }
        if (ExpressUnaria()){
            empilha_operacao_aritmetica.pop();
            geraInstrucao('+', identificador, '1', identificador, count_line);
            return identificador;
        } else {
            return false;
        }
    } else if (tk === TKs['TKDuploMenos']){
        empilha_operacao_aritmetica.push('--');
        getToken();
        if (tk === TKs['TKCteInt'] || tk === TKs['TKCteDouble']){
            if (dic_control['msg_erro'] === ''){
                dic_control['msg_erro'] = `Operação inválida --${lexico}. O operador de decremento não pode ser aplicado a uma constante. `  + ' (' + count_line + ', ' + count_column + ')' + '\n';
            }
            return false;
        }
        if (ExpressUnaria()){
            geraInstrucao('-', identificador, '1', identificador, count_line);
            return identificador;
        } else {
            return false;
        }
    } else if (OperadorUnario()){
        let arg2 = ExpressUnaria();
        if (arg2){
            return arg1 + arg2;
        } else {
            return false;
        }
    } else {
        return false;
    }
}


function ExpressMultiplRestante(temp, arg1){
    if (tk === TKs['TKDiv']){
        getToken();
        let arg2 = lexico.toString().replace(/\x00/g, '');
        let result = ExpressUnaria();
        if (result) {
            if (typeof result !== 'string') {
                geraInstrucao('/', arg1, arg2, temp, count_line);
            } else {
                geraInstrucao('/', arg1, result, temp, count_line);
            }
            let temp2 = ExpressMultiplRestante(newTemp(), temp);
            if (typeof temp2 === 'string'){
                return temp2;
            } else {
                // tempCount--;
                return temp;
            }
        } else {
            if (dic_control['msg_erro'] === ''){
                dic_control['msg_erro'] = "Não encontrou expressão após '/' " + ' (' + count_line + ', ' + count_column + ')' + '\n';
            }
            return false;
        }
    } else if (tk === TKs['TKMult']){
        getToken();
        let arg2 = lexico.toString().replace(/\x00/g, '');
        let result = ExpressUnaria();
        if (result) {
            if (typeof result !== 'string') {
                geraInstrucao('*', arg1, arg2, temp, count_line);
            } else {
                geraInstrucao('*', arg1, result, temp, count_line);
            }
            let temp2 = ExpressMultiplRestante(newTemp(), temp);
            if (typeof temp2 === 'string'){
                return temp2;
            } else {
                // tempCount--;
                return temp;
            }
        } else {
            if (dic_control['msg_erro'] === ''){
                dic_control['msg_erro'] = "Não encontrou expressão após '*' " + ' (' + count_line + ', ' + count_column + ')' + '\n';
            }
            return false;
        }
    } else if (tk === TKs['TKResto']){
        getToken();
        let arg2 = lexico.toString().replace(/\x00/g, '');
        let result = ExpressUnaria();
        if (result) {
            if (typeof result !== 'string') {
                geraInstrucao('%', arg1, arg2, temp, count_line);
            } else {
                geraInstrucao('%', arg1, result, temp, count_line);
            }
            let temp2 = ExpressMultiplRestante(newTemp(), temp);
            if (typeof temp2 === 'string'){
                return temp2;
            } else {
                // tempCount--;
                return temp;
            }
        } else {
            if (dic_control['msg_erro'] === ''){
                dic_control['msg_erro'] = "Não encontrou expressão após '%' " + ' (' + count_line + ', ' + count_column + ')' + '\n';
            }
            return false;
        }
    } else {
        return true;
    }
}


function ExpressMultipl() {
    let temp = newTemp();
    var arg1 = lexico.toString().replace(/\x00/g, '');
    let result = ExpressUnaria();
    if (result) {
        if (typeof result !== 'string'){
            let temp = newTemp();
            result = ExpressMultiplRestante(temp, arg1);
            if (result){
                return result;
            } else {
                return false;
            }
        } else {
            let temp2 = ExpressMultiplRestante(newTemp(), result);
            if (typeof temp2 === 'string'){
                return temp2;
            } else {
                // tempCount--;
                return result;
            }
        }
    } else {
        return false;
    }
}


function ExpressAddRestante(temp, arg1) {
    if (tk === TKs['TKMais']) {
        getToken();
        let arg2 = lexico.toString().replace(/\x00/g, '');
        let result = ExpressMultipl();
        if (result) {
            if (typeof result !== 'string'){
                geraInstrucao('+', arg1, arg2, temp, count_line);
            } else {
                geraInstrucao('+', arg1, result, temp, count_line);
            }
            let temp2 = ExpressAddRestante(newTemp(), temp);
            if (typeof temp2 === 'string'){
                return temp2;
            } else {
                // tempCount--;
                return temp;
            }
        } else {
            if (dic_control['msg_erro'] === ''){
                dic_control['msg_erro'] = "Não encontrou expressão após '+' " + ' (' + count_line + ', ' + count_column + ')' + '\n';
            }
            return false;
        }
    } else if (tk === TKs['TKMenos']) {
        getToken();
        let arg2 = lexico.toString().replace(/\x00/g, '');
        let result = ExpressMultipl();
        if (result) {
            if (typeof result !== 'string'){
                geraInstrucao('-', arg1, arg2, temp, count_line);
            } else {
                geraInstrucao('-', arg1, result, temp, count_line);
            }
            let temp2 = ExpressAddRestante(newTemp(), temp);
            if (typeof temp2 === 'string'){
                return temp2;
            } else {
                // tempCount--;
                return temp;
            }
        } else {
            if (dic_control['msg_erro'] === ''){
                dic_control['msg_erro'] = "Não encontrou expressão após '-' " + ' (' + count_line + ', ' + count_column + ')' + '\n';
            }
            return false;
        }
    } else if (tk === TKs['TKLogicalNot']) {
        getToken();
        let arg2 = lexico.toString().replace(/\x00/g, '');
        let result = ExpressMultipl();
        if (result) {
            if (typeof result !== 'string'){
                geraInstrucao('!', arg1, arg2, temp, count_line);
            } else {
                geraInstrucao('!', arg1, result, temp, count_line);
            }
            let temp2 = ExpressAddRestante(newTemp(), temp);
            if (typeof temp2 === 'string'){
                return temp2;
            } else {
                // tempCount--;
                return temp;
            }
        } else {
            if (dic_control['msg_erro'] === ''){
                dic_control['msg_erro'] = "Não encontrou expressão após '!' " + ' (' + count_line + ', ' + count_column + ')' + '\n';
            }
            return false;
        }
    } else {
        return true;
    }
}


function ExpressAdd() {
    let arg1 = lexico.toString().replace(/\x00/g, '');
    let result = ExpressMultipl();
    if (result) {
        if (typeof result !== 'string'){
            let temp = newTemp();
            result = ExpressAddRestante(temp, arg1);
            if (result){
                return result;
            } else {
                return false;
            }
        } else {
            let temp2 = ExpressAddRestante(newTemp(), result);
            if (typeof temp2 === 'string'){
                return temp2;
            } else {
                // tempCount--;
                return result;
            }
        }
    } else {
        return false;
    }
}


function ExpressRelacionalRestante(temp, arg1){
    if (tk === TKs['TKMenor']){
        getToken();
        let arg2 = lexico.toString().replace(/\x00/g, '');
        let result = ExpressAdd();
        if (result){
            if (typeof result !== 'string'){
                geraInstrucao('<', arg1, arg2, temp, count_line);
            } else {
                geraInstrucao('<', arg1, result, temp, count_line);
            }
            let temp2 = ExpressRelacionalRestante(newTemp(), temp);
            if (typeof temp2 === 'string'){
                return temp2;
            } else {
                // tempCount--;
                return temp;
            }
        } else {
            if (dic_control['msg_erro'] === ''){
                dic_control['msg_erro'] = "Não encontrou expressão após '<' " + ' (' + count_line + ', ' + count_column + ')' + '\n';
            }
            return false;
        }
    } else if (tk === TKs['TKMaior']){
        getToken();
        let arg2 = lexico.toString().replace(/\x00/g, '');
        let result = ExpressAdd();
        if (result){
            if (typeof result !== 'string'){
                geraInstrucao('>', arg1, arg2, temp, count_line);
            } else {
                geraInstrucao('>', arg1, result, temp, count_line);
            }
            let temp2 = ExpressRelacionalRestante(newTemp(), temp);
            if (typeof temp2 === 'string'){
                return temp2;
            } else {
                // tempCount--;
                return temp;
            }
        } else {
            if (dic_control['msg_erro'] === ''){
                dic_control['msg_erro'] = "Não encontrou expressão após '>' " + ' (' + count_line + ', ' + count_column + ')' + '\n';
            }
            return false;
        }
    } else if (tk === TKs['TKMenorIgual']){
        getToken();
        let arg2 = lexico.toString().replace(/\x00/g, '');
        let result = ExpressAdd();
        if (result){
            if (typeof result !== 'string'){
                geraInstrucao('<=', arg1, arg2, temp, count_line);
            } else {
                geraInstrucao('<=', arg1, result, temp, count_line);
            }
            let temp2 = ExpressRelacionalRestante(newTemp(), temp);
            if (typeof temp2 === 'string'){
                return temp2;
            } else {
                // tempCount--;
                return temp;
            }
        } else {
            if (dic_control['msg_erro'] === ''){
                dic_control['msg_erro'] = "Não encontrou expressão após '<=' " + ' (' + count_line + ', ' + count_column + ')' + '\n';
            }
            return false;
        }
    } else if (tk === TKs['TKMaiorIgual']){
        getToken();
        let arg2 = lexico.toString().replace(/\x00/g, '');
        let result = ExpressAdd();
        if (result){
            if (typeof result !== 'string'){
                geraInstrucao('>=', arg1, arg2, temp, count_line);
            } else {
                geraInstrucao('>=', arg1, result, temp, count_line);
            }
            let temp2 = ExpressRelacionalRestante(newTemp(), temp);
            if (typeof temp2 === 'string'){
                return temp2;
            } else {
                // tempCount--;
                return temp;
            }
        } else {
            if (dic_control['msg_erro'] === ''){
                dic_control['msg_erro'] = "Não encontrou expressão após '>=' " + ' (' + count_line + ', ' + count_column + ')' + '\n';
            }
            return false;
        }
    } else {
        return true;
    }
}


function ExpressRelacional() {
    let arg1 = lexico.toString().replace(/\x00/g, '');
    let result = ExpressAdd();
    if (result){
        if (typeof result !== 'string'){
            let temp = newTemp();
            result = ExpressRelacionalRestante(temp, arg1);
            if (result){
                return result;
            } else {
                return false;
            }
        } else {
            let temp2 = ExpressRelacionalRestante(newTemp(), result);
            if (typeof temp2 === 'string'){
                return temp2;
            } else {
                // tempCount--;
                return result;
            }
        }
    } else {
        return false;
    }
}


function ExpressIgualRestante(temp, arg1){
    if (tk === TKs['TKCompare']) {
        getToken();
        let arg2 = lexico.toString().replace(/\x00/g, '');
        let result = ExpressRelacional();
        if (result){
            if (typeof result !== 'string'){
                geraInstrucao('==', arg1, arg2, temp, count_line);
            } else {
                geraInstrucao('==', arg1, result, temp, count_line);
            }
            let temp2 = ExpressIgualRestante(newTemp(), temp);
            if (typeof temp2 === 'string'){
                return temp2;
            } else {
                // tempCount--;
                return temp;
            }
        } else {
            if (dic_control['msg_erro'] === ''){
                dic_control['msg_erro'] = "Não encontrou expressão após '==' " + ' (' + count_line + ', ' + count_column + ')' + '\n';
            }
            return false;
        }
    } else if (tk === TKs['TKDiferent']) {
        getToken();
        let arg2 = lexico.toString().replace(/\x00/g, '');
        let result = ExpressRelacional();
        if (result){
            if (typeof result !== 'string'){
                geraInstrucao('!=', arg1, arg2, temp, count_line);
            } else {
                geraInstrucao('!=', arg1, result, temp, count_line);
            }
            let temp2 = ExpressIgualRestante(newTemp(), temp);
            if (typeof temp2 === 'string'){
                return temp2;
            } else {
                // tempCount--;
                return temp;
            }
        } else {
            if (dic_control['msg_erro'] === ''){
                dic_control['msg_erro'] = "Não encontrou expressão após '!=' " + ' (' + count_line + ', ' + count_column + ')' + '\n';
            }
            return false;
        }
    } else {
        return true;
    }
}


function ExpressIgual(){
    let arg1 = lexico.toString().replace(/\x00/g, '');
    let result = ExpressRelacional();
    if (result){
        if (typeof result !== 'string'){
            let temp = newTemp();
            result = ExpressIgualRestante(temp, arg1);
            if (result){
                return result;
            } else {
                return false;
            }
        } else {
            let temp2 = ExpressIgualRestante(newTemp(), result);
            if (typeof temp2 === 'string'){
                return temp2;
            } else {
                // tempCount--;
                return result;
            }
        }
    } else {
        return false;
    }
}


function ExpressLogicAndRestante(temp, arg1){
    if (tk === TKs['TKLogicalAnd']){
        getToken();
        let arg2 = lexico.toString().replace(/\x00/g, '');
        let result = ExpressIgual();
        if (result){
            if (typeof result !== 'string'){
                geraInstrucao('&&', arg1, arg2, temp, count_line);
            } else {
                geraInstrucao('&&', arg1, result, temp, count_line);
            }
            let temp2 = ExpressLogicAndRestante(newTemp(), temp);
            if (typeof temp2 === 'string'){
                return temp2;
            } else {
                // tempCount--;
                return temp;
            }
        } else {
            return false;
        }
    } else {
        return true;
    }
}


function ExpressLogicAnd(){
    let arg1 = lexico.toString().replace(/\x00/g, '');
    let result = ExpressIgual();
    if (result){
        if (typeof result !== 'string'){
            let temp = newTemp();
            result = ExpressLogicAndRestante(temp, arg1);
            if (result){
                return result;
            } else {
                return false;
            }
        } else {
            let temp2 = ExpressLogicAndRestante(newTemp(), result);
            if (typeof temp2 === 'string'){
                return temp2;
            } else {
                // tempCount--;
                return result;
            }
        }
    } else {
        return false;
    }
}


function ExpressLogicOrRestante(temp, arg1){
    if (tk === TKs['TKLogicalOr']){
        getToken();
        let arg2 = lexico.toString().replace(/\x00/g, '');
        let result = ExpressLogicAnd();
        if (result){
            if (typeof result !== 'string'){
                geraInstrucao('||', arg1, arg2, temp, count_line);
            } else {
                geraInstrucao('||', arg1, result, temp, count_line);
            }
            let temp2 = ExpressLogicOrRestante(newTemp(), temp);
            if (typeof temp2 === 'string'){
                return temp2;
            } else {
                // tempCount--;
                return temp;
            }
        } else {
            return false;
        }
    } else {
        return true;
    }
}


function ExpressLogicOr(){
    let arg1 = lexico.toString().replace(/\x00/g, '');
    let result = ExpressLogicAnd();
    if (result){
        if (typeof result !== 'string'){
            let temp = newTemp();
            result = ExpressLogicOrRestante(temp, arg1);
            if (result){
                return result;
            } else {
                return false;
            }
        } else {
            let temp2 = ExpressLogicOrRestante(newTemp(), result);
            if (typeof temp2 === 'string'){
                return temp2;
            } else {
                // tempCount--;
                return result;
            }
        }
    } else {
        return false;
    }
}


function ExpressCondic(){
    let result = ExpressLogicOr();
    if (result){
        return result;
    } else {
        return false;
    }
}


function ExpressAtrib(lado_atribuicao){
    backtracking('push');
    let id = ExpressUnaria(lado_atribuicao);
    if (id){
        if (typeof id !== 'string'){
            id = identificador;
        }
        // if (isNaN(parseFloat(id))){
        //     if (!verifica_variavel_declarada(index_escopo, identificador, dimensao, false, false, true)){
        //         throw 'Erro sintático';
        //     }
        // }
        let operador = lexico.toString().replace(/\x00/g, '');
        if (OperadorAtrib()){
            // if (verifica_variavel_declarada(identificador, dimensao)){
                dimensao = 0;
                var arg1 = lexico.toString().replace(/\x00/g, '');
                let result = ExpressAtrib();
                if (result){
                    if (typeof result !== 'string'){
                        if (operador !== '='){
                            geraInstrucao(operador[0], id, arg1, id, count_line);
                        } else {
                            geraInstrucao('', arg1, '', id, count_line);
                        }
                    } else {
                        if (operador !== '='){
                            geraInstrucao(operador[0], id, result, id, count_line);
                        } else {
                            geraInstrucao('', result, '', id, count_line);
                        }
                    }
                    return id;
                }
            // }
        } else {
            lado_atribuicao = undefined;
        }
    }
    backtracking('pop');
    var arg1 = lexico.toString().replace(/\x00/g, '');
    let result = ExpressCondic();
    if (result){
        if (lado_atribuicao === 'esquerdo'){
            if (typeof result !== 'string'){
                if (identificador){
                    geraInstrucao('', arg1, '', identificador, count_line);
                }
                return arg1;
            } else {
                geraInstrucao('', result, '', identificador, count_line);
                return result;
            }
        } else {
            if (typeof result !== 'string'){
                return arg1;
            } else {
                return result;
            }
        }

    } else {
        return false;
    }
}


function ExpressaoRestante(lado_atribuicao, printf){
    if (tk === TKs['TKVirgula']){
        getToken();
        dimensao = 0;
        let result = ExpressAtrib(lado_atribuicao);
        if (result){
            let temp2 = ExpressaoRestante(lado_atribuicao, printf);
            if (temp2){
                if (printf){
                    if (typeof temp2 === 'string') {
                        return result + ',' + temp2;
                    } else {
                        return result;
                    }
                } else {
                    if (typeof temp2 === 'string') {
                        return result + ',' + temp2;
                    } else {
                        return result;
                    }
                }
            } else {
                return false;
            }
        } else {
            return false;
        }
    } else {
        return true;
    }
}


function Expressao(lado_atribuicao, empilha_parametros=true){
    let result = ExpressAtrib(lado_atribuicao);
    if (result){
        let temp2 = ExpressaoRestante(lado_atribuicao);
        if (temp2){
            if (typeof temp2 === 'string') {
                if (empilha_parametros){
                    lista_parametros_func.push(result + ',' +temp2);
                }
                return temp2;
            } else {
                if (empilha_parametros){
                    lista_parametros_func.push(result);
                }
                return result;
            }
        } else {
            return false;
        }
    } else {
        return false;
    }
}


function InstrExpress(lado_atribuicao){
    if (tk === TKs['TKPontoEVirgula']){
        getToken();
        return true;
    } else {
        if (tk !== TKs['TKFechaChaves']){
            dimensao = 0;
            let result = Expressao(lado_atribuicao);
            if (result){
                if (tk === TKs['TKPontoEVirgula']){
                    getToken();
                    return result;
                } else {
                    if (dic_control['msg_erro'] === '') {
                        dic_control['msg_erro'] = "não encontrou o caracter ';' ao final do comando " + ' (' + count_line + ', ' + count_column + ')' + '\n';
                    }
                    return false;
                }
            } else {
                return false;
            }
        } else {
            return false;
        }
    }
}


function InstrCondicional(esta_em_laco){
    if (tk === TKs['TKIf']){
        getToken();
        if (tk === TKs['TKAbreParenteses']){
            getToken();
            dimensao = 0;
            let result = Expressao('esquerdo');
            if (result){
                if (tk === TKs['TKFechaParenteses']) {
                    getToken();
                    let labelElse = newLabel();
                    geraInstrucao('goto', result, labelElse, 'ifFalse', count_line, true);
                    index_escopo_pai = index_escopo;
                    index_escopo = tabela_de_simbolos.length;
                    verifica_existencia_escopo_tabela_simbolos(index_escopo);
                    geraInstrucao('', '', '', '#' + index_escopo, count_line, false, false, true, false, true);
                    index_escopo -= 1;
                    if (Instr(esta_em_laco)) {
                        if (tk === TKs['TKElse']){
                            geraInstrucao('', '', '', '#' + index_escopo, count_line, false, false, true, false, true);
                            let labelSaidaElse = newLabel();
                            index_escopo_pai = index_escopo;
                            index_escopo = tabela_de_simbolos.length;
                            verifica_existencia_escopo_tabela_simbolos(index_escopo);
                            geraInstrucao('', labelSaidaElse, '', 'goto', count_line, true);
                            geraInstrucao('', '', '', labelElse, count_line, false, false, true);
                            geraInstrucao('', '', '', '#' + index_escopo, count_line, false, false, true, false, true);
                            getToken();
                            index_escopo -= 2;
                            if (Instr()){
                                geraInstrucao('', '', '', labelSaidaElse, count_line, false, false, true);
                                return true;
                            }
                        } else {
                            geraInstrucao('', '', '', labelElse, count_line, false, false, true);
                            index_escopo = index_escopo_pai;
                            index_escopo_pai = tabela_de_simbolos[index_escopo]['escopo_pai'];
                            geraInstrucao('', '', '', '#' + index_escopo, count_line, false, false, true, false, true);
                            return true;
                        }
                    } else {
                        if (dic_control['msg_erro'] === '') {
                            dic_control['msg_erro'] = "Instrução era esperada após ')' no comando if " + ' (' + count_line + ', ' + count_column + ')' + '\n';
                        }
                        return false;
                    }
                } else {
                    if (dic_control['msg_erro'] === '') {
                        dic_control['msg_erro'] = "não encontrou o caracter ')' ao final da expressão no comando if " + ' (' + count_line + ', ' + count_column + ')' + '\n';
                    }
                    return false;
                }
            } else {
                if (dic_control['msg_erro'] === '') {
                    dic_control['msg_erro'] = "não encontrou o expressão antes de ')' no comando if " + ' (' + count_line + ', ' + count_column + ')' + '\n';
                }
                return false;
            }
        } else {
            if (dic_control['msg_erro'] === '') {
                dic_control['msg_erro'] = "não encontrou o caracter '(' ao final da expressão no comando if " + ' (' + count_line + ', ' + count_column + ')' + '\n';
            }
            return false;
        }
    }
}


function InstrIteracao(){
    if (tk === TKs['TKWhile']){
        let labelInicio = newLabel();
        geraInstrucao('', '', '', labelInicio, count_line, false, false, true);
        getToken();
        if (tk === TKs['TKAbreParenteses']){
            getToken();
            dimensao = 0;
            let result = Expressao('esquerdo');
            if (result){
                let labelFim = newLabel();
                geraInstrucao('goto', result, labelFim, 'ifFalse', count_line, true);
                if (tk === TKs['TKFechaParenteses']){
                    getToken();
                    index_escopo_pai = index_escopo;
                    index_escopo = tabela_de_simbolos.length;
                    geraInstrucao('', '', '', '#' + index_escopo, count_line, false, false, true, false, true);
                    if (Instr({'labelInicio': labelInicio, 'labelFim': labelFim})) {
                        geraInstrucao('', labelInicio, '', 'goto', count_line, true);
                        geraInstrucao('', '', '', labelFim, count_line, false, false, true);
                        index_escopo = tabela_de_simbolos.length;
                        return true;
                    }
                } else {
                    if (dic_control['msg_erro'] === '') {
                        dic_control['msg_erro'] = "não encontrou o caracter ')' ao final da expressão no comando while  " + ' (' + count_line + ', ' + count_column + ')' + '\n';
                    }
                    return false;
                }
            } else {
                if (dic_control['msg_erro'] === '') {
                    dic_control['msg_erro'] = "não encontrou o expressão antes de ')' no comando while " + ' (' + count_line + ', ' + count_column + ')' + '\n';
                }
                return false;
            }
        } else {
            if (dic_control['msg_erro'] === '') {
                dic_control['msg_erro'] = "não encontrou o caracter ')' ao final da expressão no comando while  " + ' (' + count_line + ', ' + count_column + ')' + '\n';
            }
            return false;
        }
    } else if (tk === TKs['TKDo']){
        let labelInicio = newLabel();
        let labelFim = newLabel();
        geraInstrucao('', '', '', labelInicio, count_line, false, false, true);
        getToken();
        index_escopo_pai = index_escopo;
        index_escopo = tabela_de_simbolos.length;
        geraInstrucao('', '', '', '#' + index_escopo, count_line, false, false, true, false, true);
        if (Instr({'labelInicio': labelInicio, 'labelFim': labelFim})) {
            index_escopo = index_escopo_pai;
            index_escopo_pai = tabela_de_simbolos[index_escopo]['escopo_pai'];
            geraInstrucao('', '', '', '#' + index_escopo, count_line, false, false, true, false, true);
            if (tk === TKs['TKWhile']){
                getToken();
                if (tk === TKs['TKAbreParenteses']){
                    getToken();
                    let result = Expressao();
                    if (result){
                        geraInstrucao('goto', result, labelFim, 'ifFalse', count_line, true);
                        geraInstrucao('', labelInicio, '', 'goto', count_line, true);
                        geraInstrucao('', '', '', labelFim, count_line, false, false, true);
                        if (tk === TKs['TKFechaParenteses']){
                            getToken();
                            if (tk === TKs['TKPontoEVirgula']){
                                getToken();
                                return true;
                            } else {
                                if (dic_control['msg_erro'] === '') {
                                    dic_control['msg_erro'] += "não encontrou o caracter ';' " + ' (' + count_line + ', ' + count_column + ')' + '\n';
                                }
                                return false;
                            }
                        } else {
                            if (dic_control['msg_erro'] === ''){
                                dic_control['msg_erro'] += "não encontrou o caracter ')' " + ' (' + count_line + ', ' + count_column + ')' + '\n';
                            }
                            return false;
                        }
                    } else {
                        if (dic_control['msg_erro'] === '') {
                            dic_control['msg_erro'] = "não encontrou o expressão antes de ')' no comando while " + ' (' + count_line + ', ' + count_column + ')' + '\n';
                        }
                        return false;
                    }
                } else {
                    if (dic_control['msg_erro'] === '') {
                        dic_control['msg_erro'] += "não encontrou o caracter '(' " + ' (' + count_line + ', ' + count_column + ')' + '\n';
                    }
                    return false;
                }
            } else {
                if (dic_control['msg_erro'] === '') {
                    dic_control['msg_erro'] = "não encontrou o comando while em laço de repetição do" + ' (' + count_line + ', ' + count_column + ')' + '\n';
                }
                return false;
            }
        } else {
            return false;
        }
    } else if (tk === TKs['TKFor']){
        let labelInicio = newLabel();
        getToken();
        if (tk === TKs['TKAbreParenteses']){
            getToken();
            if (InstrExpress('esquerdo')){
                geraInstrucao('', '', '', labelInicio, count_line, false, false, true);
                let result = InstrExpress();
                if (result){
                    let labelFim = newLabel();
                    geraInstrucao('goto', result, labelFim, 'ifFalse', count_line, true);
                    let labelInstr = newLabel();
                    geraInstrucao('', labelInstr, '', 'goto', count_line, true);
                    let labelIncremento = newLabel();
                    geraInstrucao('', '', '', labelIncremento, count_line, false, false, true);
                    geraInstrucao('', '', '', '#' + index_escopo, count_line, false, false, true, false, true);
                    if(Expressao('esquerdo')){
                        geraInstrucao('', labelInicio, '', 'goto', count_line, true);
                        if (tk === TKs['TKFechaParenteses']){
                            getToken();
                            geraInstrucao('', '', '', labelInstr, count_line, false, false, true);
                            index_escopo_pai = index_escopo;
                            index_escopo = tabela_de_simbolos.length;
                            geraInstrucao('', '', '', '#' + index_escopo, count_line, false, false, true, false, true);
                            if (Instr({'labelInicio': labelIncremento, 'labelFim': labelFim})){
                                geraInstrucao('', labelIncremento, '', 'goto', count_line, true);
                                geraInstrucao('', '', '', labelFim, count_line, false, false, true);
                                index_escopo = index_escopo_pai;
                                index_escopo_pai = tabela_de_simbolos[index_escopo]['escopo_pai'];
                                geraInstrucao('', '', '', '#' + index_escopo, count_line, false, false, true, false, true);
                                return true;
                            } else {
                                return false;
                            }
                        } else {
                            if (dic_control['msg_erro'] === '') {
                                dic_control['msg_erro'] += "não encontrou o caracter ')' " + ' (' + count_line + ', ' + count_column + ')' + '\n';
                            }
                            return false;
                        }
                    } else {
                        return false;
                    }
                } else {
                    return false;
                }
            } else {
                return false;
            }
        } else {
            if (dic_control['msg_erro'] === '') {
                dic_control['msg_erro'] += "não encontrou o caracter '(' " + ' (' + count_line + ', ' + count_column + ')' + '\n';
            }
            return false;
        }
    } else {
        return false;
    }
}


function InstrSalto(esta_no_laco){
    if (tk === TKs['TKContinue']){
        if (esta_no_laco){
            geraInstrucao('', esta_no_laco['labelInicio'], '', 'goto', count_line, true);
            getToken();
            if (tk === TKs['TKPontoEVirgula']){
                getToken();
                return true;
            } else {
                if (dic_control['msg_erro'] === '') {
                    dic_control['msg_erro'] += "não encontrou o caracter ';' " + ' (' + count_line + ', ' + count_column + ')' + '\n';
                }
                return false;
            }
        } else {
            dic_control['msg_erro'] = "Comando continue não está dentro de um laço" + '\n';
            return false;
        }
    } else if (tk === TKs['TKBreak']){
        if (esta_no_laco) {
            geraInstrucao('', esta_no_laco['labelFim'], '', 'goto', count_line, true);
            getToken();
            if (tk === TKs['TKPontoEVirgula']) {
                getToken();
                return true;
            } else {
                if (dic_control['msg_erro'] === '') {
                     dic_control['msg_erro'] += "não encontrou o caracter ';' no comando break " + ' (' + count_line + ', ' + count_column + ')' + '\n';
                 }
                return false;
            }
        } else {
            dic_control['msg_erro'] = "Comando break não está dentro de um laço" + '\n';
            return false;
        }
    } else if (tk === TKs['TKReturn']){
        achou_return = true;
        getToken();
        if (tk === TKs['TKPontoEVirgula']){
            getToken();
            return true;
        } else {
            let  result = Expressao();
            if (result) {
                if (tk === TKs['TKPontoEVirgula']) {
                    geraInstrucao('', '', '', '#' + index_escopo, count_line, false, false, true, true, true);
                    geraInstrucao('', result, '', 'return', count_line, true);
                    getToken();
                    return true;
                } else {
                    if (dic_control['msg_erro'] === '') {
                        dic_control['msg_erro'] += "não encontrou o caracter ';' no return " + ' (' + count_line + ', ' + count_column + ')' + '\n';
                    }
                    return false;
                }
            } else {
                if (dic_control['msg_erro'] === '') {
                    dic_control['msg_erro'] += "não encontrou o caracter ';' " + ' (' + count_line + ', ' + count_column + ')' + '\n';
                }
                return false;
            }
        }
    } else {
        return false;
    }
}


function LeituraRestante(){
    if (tk === TKs['TKVirgula']) {
        getToken();
        //dimensao = 0;
        if (tk === TKs['TKEnderecoVariavel']) {
            getToken();
            let arg1 = lexico.toString().replace(/\x00/g, '');
            let result = ExpressPos();
            if (result) {
                if (typeof result === 'string') {
                    arg1 = result;
                }
                let temp2 = LeituraRestante();
                if (temp2) {
                    if (typeof temp2 === 'string') {
                        return arg1 + ',' + temp2;
                    } else {
                        return arg1;
                    }
                } else {
                    return false;
                }
            } else {
                return false;
            }
        } else {
            dic_control['msg_erro'] = "Não encontrou o caracter '&' no scanf" + '\n';
        }
    } else {
        return true;
    }
}


function InstrLeitura(){
    if (tk === TKs["TKScanf"]){
        if (!dic_control['bibliotecas'].stdio){
            dic_control['msg_erro'] = "Biblioteca <stdio.h> deve ser declarada para utilização do printf" + ' (' + count_line + ', ' + count_column + ')' + '\n';
            return false;
        }
        getToken();
        if (tk === TKs["TKAbreParenteses"]){
            getToken();
            if (tk === TKs["TKString"]){
                let scanf = lexico.toString().replace(/\x00/g, '');
                getToken();
                let result = LeituraRestante();
                if(result){
                    if (tk === TKs["TKFechaParenteses"]){
                        getToken();
                        if (tk === TKs["TKPontoEVirgula"]){
                            getToken();
                            let qtd_args = 0;
                            if (typeof result === 'string'){
                                qtd_args = result.split(',').length;
                            }
                            if (scanf.toString().replace('"', '').replace(/\x00/g, '').split('%').length - 1 > 0 || qtd_args > 0) {
                                if (scanf.toString().replace('"', '').replace(/\x00/g, '').split('%').length - 1 === qtd_args) {
                                    geraInstrucao('', '', '', "scanf(" + scanf + "," + result + ")", count_line-1, false, false, false, true);
                                    return true;
                                } else {
                                    dic_control['msg_erro'] = "Número de argumentos difere do número de parâmetros" + ' (' + count_line + ', ' + count_column + ')' + '\n';
                                    return false;
                                }
                            } else {
                                geraInstrucao('', '', '', "scanf(" + printf + ")", count_line, false, false, false, true);
                                return true;
                            }
                        } else {
                            if (dic_control['msg_erro'] === '') {
                                dic_control['msg_erro'] += "não encontrou o caracter ';' " + ' (' + count_line + ', ' + count_column + ')' + '\n';
                            }
                            return false;
                        }
                    } else {
                        return false;
                    }
                } else {
                    return false;
                }
            }
        }
    }
}


function InstrEscrita(){
    if (tk === TKs["TKPrintf"]){
        if (!dic_control['bibliotecas'].stdio){
            dic_control['msg_erro'] = "Biblioteca <stdio.h> deve ser declarada para utilização do printf" + ' (' + count_line + ', ' + count_column + ')' + '\n';
            return false;
        }
        getToken();
        if (tk === TKs["TKAbreParenteses"]){
            getToken();
            if (tk === TKs["TKString"]){
                printf = lexico.toString().replace(/\x00/g, '');
                getToken();
                let result = ExpressaoRestante('', true);
                if(result){
                    if (tk === TKs["TKFechaParenteses"]){
                        getToken();
                        if (tk === TKs["TKPontoEVirgula"]) {
                            getToken();
                            let qtd_args = 0;
                            if (typeof result === 'string') {
                                qtd_args = result.split(',').length;
                            }
                            if (printf.toString().replace('"', '').replace(/\x00/g, '').split('%').length - 1 > 0 || qtd_args > 0) {
                                if (printf.toString().replace('"', '').replace(/\x00/g, '').split('%').length - 1 === qtd_args) {
                                    geraInstrucao('', '', '', "printf(" + printf + "," + result + ")", count_line-1, false, true);
                                    return true;
                                } else {
                                    dic_control['msg_erro'] = "Número de argumentos difere do número de parâmetros no comando printf" + ' (' + count_line + ', ' + count_column + ')' + '\n';
                                    return false;
                                }
                            } else {
                                geraInstrucao('', '', '', "printf(" + printf + ")", count_line, false, true);
                                return true;
                            }
                        } else {
                            if (dic_control['msg_erro'] === '') {
                                dic_control['msg_erro'] += "não encontrou o caracter ';' no comando printf " + ' (' + count_line + ', ' + count_column + ')' + '\n';
                            }
                            return false;
                        }
                    } else {
                        if (dic_control['msg_erro'] === '') {
                            dic_control['msg_erro'] += "não encontrou o caracter ')' no comando printf " + ' (' + count_line + ', ' + count_column + ')' + '\n';
                        }
                        return false;
                    }
                } else {
                    return false;
                }
            } else {
                if (dic_control['msg_erro'] === '') {
                    dic_control['msg_erro'] += 'não encontrou o caracter " no printf ' + ' (' + count_line + ', ' + count_column + ')' + '\n';
                }
                return false;
            }
        } else {
            if (dic_control['msg_erro'] === '') {
                dic_control['msg_erro'] += "não encontrou o caracter '(' no printf " + ' (' + count_line + ', ' + count_column + ')' + '\n';
            }
            return false;
        }
    } else {
        return false;
    }
}


function Instr(esta_em_laco) {
    if (InstrCondicional(esta_em_laco)) {
        return true;
    } else if (InstrExpress('esquerdo')) {
        dic_control['encontrou_expressao'] = true;
        return true;
    } else if (InstrIteracao()) {
        dic_control['encontrou_expressao'] = true;
        return true;
    } else if (InstrSalto(esta_em_laco)){
        dic_control['encontrou_expressao'] = true;
        return true;
    } else if (ListaDec()){
        dic_control['encontrou_expressao'] = true;
        return true;
    } else if (InstrEscrita()){
        dic_control['encontrou_expressao'] = true;
        return true;}
    else if (InstrLeitura()){
        dic_control['encontrou_expressao'] = true;
        return true;
    } else if (CorpoFunc(esta_em_laco)){
        dic_control['encontrou_expressao'] = true;
        return true;
    } else {
        return false;
    }
}


function ListaInstrRestante(esta_no_laco) {
    let result = Instr(esta_no_laco);
    if (result) {
        if (ListaInstrRestante(esta_no_laco)) {
            return true;
        } else {
            return false;
        }
    } else {
        if (dic_control['msg_erro'] === ''){
            return true;
        } else {
            return false;
        }
    }
}


function ListaInstr(esta_no_laco){
    if (Instr(esta_no_laco)){
        if (ListaInstrRestante(esta_no_laco)){
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

function DecRestante(tipo, variavel, vetor_matriz){
    if (tk === TKs['TKAbreColchete']){
        getToken();
        var tam_vetor = lexico.toString().replace(/\x00/g, '');
        let result = ExpressCondic();
        if (result){
            if (typeof result === 'string') {
                tam_vetor = result;
            }
            if (tk === TKs['TKFechaColchete']){
                getToken();
                tabela_simbolos(index_escopo, 'tamanho', tipo, variavel, tam_vetor, vetor_matriz);
                let tam_vetor2 = DecRestante(tipo, variavel, vetor_matriz + 1);
                if (tam_vetor2){
                    if (typeof tam_vetor2 === 'string') {
                        return "[" + tam_vetor + "]" + tam_vetor2;
                    } else {
                        return "[" + tam_vetor + "]";
                    }
                    return true;
                } else {
                    return false;
                }
            } else {
                if (dic_control['msg_erro'] === '') {
                    dic_control['msg_erro'] += "não encontrou o caracter ']' na declaração da variável " + variavel + ' (' + count_line + ', ' + count_column + ')' + '\n';
                }
                 return false;
            }
        } else {
            dic_control['msg_erro'] += "não encontrou a declaração do tamanho do vetor na declaração da variável " + variavel + ' (' + count_line + ', ' + count_column + ')' + '\n';
            return false;
        }
    } else {
        return true;
    }
}

function Dec(tipo, variavel) {
    if (tk === TKs['TKId']) {
        if (tabela_simbolos(index_escopo, 'verifica_define', tipo, variavel) && verifica_variavel_declarada_em_escopos(index_escopo, variavel) && verifica_funcao_declarada(variavel)) {
            tabela_simbolos(index_escopo, 'grava', tipo, variavel);
            getToken();
            let result = DecRestante(tipo, variavel, 1);
            if (result) {
                if (typeof result === 'string') {
                    geraInstrucao('', '', '', variavel+result, count_line, false, false, false, false, false, false, tipo['tipo']);
                } else {
                    geraInstrucao('', '', '', variavel, count_line, false, false, false, false, false, false, tipo['tipo']);
                }
                return true;
            }
            return result;
        } else {
            if (dic_control['msg_erro'] === ''){
                dic_control['msg_erro'] = "variável " + variavel + ' não pode ser declarada devido a macro com o mesmo nome declarada (' + count_line + ', ' + count_column + ')' + '\n';
            }
            return false;
        }
    } else {
        return false;
    }
}


function DecInicial(tipo){
    let variavel = lexico.toString().replace(/\x00/g, '');
    if (Dec(tipo, variavel)){
        if (tk === TKs['TKIgual']){
            getToken();
            let result = ExpressAtrib();
            if (result){
                geraInstrucao('', result, '', variavel, count_line);
                return true;
            } else {
                return false;
            }
        }
        return true;
    } else {
        return false;
    }
}


function ListaDecInicialRestante(tipo){
    if (tk === TKs['TKVirgula']) {
        getToken();
        if (DecInicial(tipo)) {
            if (ListaDecInicialRestante(tipo)) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    } else {
        return true;
    }
}


function ListaDecInicial(tipo){
    if (DecInicial(tipo)){
        if (ListaDecInicialRestante(tipo)){
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}


function Declaracao(){
    dimensao = 0;
    var tipo = {'tk': tk,
                                   'tipo': lexico.toString().replace(/\x00/g, '')};
    if (Tipo()){
        if (ListaDecInicial(tipo)){
            if (tk === TKs['TKPontoEVirgula']){
                getToken();
                return true;
            } else {
                dic_control['encontrou_expressao'] = true;
                dic_control['msg_erro'] = "não encontrou o caracter ';' na declaração da variável " + ' (' + count_line + ', ' + count_column + ')' + '\n';
                return false;
            }
        } else {
            if (dic_control['msg_erro'] === '') {
                dic_control['msg_erro'] += "não encontrou o caracter ';' " + ' (' + count_line + ', ' + count_column + ')' + '\n';
            }
            return false;
        }
    } else {
        return false;
    }
}


function ListaDecRestante(){
    if (Declaracao()){
        if (ListaDecRestante()){
            return true;
        } else {
            return false;
        }
    } else {
        return true;
    }
}


function ListaDec(){
    if (Declaracao()){
        if (ListaDecRestante()){
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}


function CorpoFunc(esta_no_laco){
    if (tk === TKs['TKAbreChaves']) {
        getToken();
        if (tk === TKs['TKFechaChaves']) {
            getToken();
            return true;
        } else if (ListaInstr(esta_no_laco)) {
            if (tk === TKs['TKFechaChaves']) {
                getToken();
                return true;
            } else {
                if (dic_control['msg_erro'] === '') {
                    dic_control['msg_erro'] += "não encontrou o caracter '}' " + ' (' + count_line + ', ' + count_column + ')' + '\n';
                }
                return false;
            }
        // } else if (ListaDec()) {
        //     if (tk === TKs['TKFechaChaves']) {
        //         getToken();
        //         return true;
        //     } else if (ListaInstr()){
        //         if (tk === TKs['TKFechaChaves']){
        //             getToken();
        //             return true;
        //         } else {
        //             dic_control['msg_erro'] += "Não encontrou o caracter '}' " + ' (' + count_line + ', ' + count_column + ')' + '\n';
        //             return false;
        //         }
        //     } else {
        //         dic_control['msg_erro'] += "Não encontrou o caracter '}' " + ' (' + count_line + ', ' + count_column + ')' + '\n';
        //         return false;
        //     }
        } else {
            if (dic_control['msg_erro'] === ''){
                dic_control['msg_erro'] += "não encontrou o caracter '}' " + ' (' + count_line + ', ' + count_column + ')' + '\n';
            }
            return false;
        }
    } else {
        return false;
    }
}


function DecFunc(){
    lista_parametros_func = [];
    var tipo = {'tk': tk,
                     'tipo': lexico.toString().replace(/\x00/g, '')};
    if (Tipo()){
        let nome_func = lexico.toString().replace(/\x00/g, '');
        if (NomeFunc(tipo)){
            if (tk === TKs['TKAbreParenteses']){
                getToken();
                index_escopo_pai = index_escopo;
                index_escopo = tabela_de_simbolos.length;
                geraInstrucao('', '', '', '#' + index_escopo, count_line, false, false, true, false, true);
                if (ListaParam()){
                    let parametros = lista_parametros_func.pop()
                    let lista_parametros = {};
                    if (!parametros){
                        parametros = '';
                    } else {
                        for (let i in parametros.split(',')){
                            lista_parametros[parametros.split(',')[i]] = {'tipo': tabela_de_simbolos[index_escopo]['variaveis'][parametros.split(',')[i]]['tipo']['tipo']};
                        }
                    }
                    geraInstrucao('', '', '', parametros, count_line, false, false, true, false, false, lista_parametros);
                    tabela_de_simbolos[0]["variaveis"][nome_func]['qtd_parametros_func'] = parametros.split(',').length;
                    if (tk === TKs['TKFechaParenteses']){
                        getToken();
                        achou_return = false;
                        obriga_return = false;
                        if (tipo['tipo'] !== 'void'){
                            obriga_return = true;
                        }
                        if (CorpoFunc()){
                            index_escopo_pai = 0;
                            index_escopo = 0;
                            if (obriga_return){
                                if (achou_return){
                                    return true;
                                } else {
                                    if (dic_control['msg_erro'] === ''){
                                        dic_control['msg_erro'] += "não encontrou o return na função " + nome_func + ' (' + count_line + ', ' + count_column + ')' + '\n';
                                    }
                                    return false;
                                }
                            } else {
                                return true;
                            }
                        }
                    } else {
                        if (dic_control['msg_erro'] === ''){
                            dic_control['msg_erro'] += "não encontrou o caracter ')' na declaracao da função" + ' (' + count_line + ', ' + count_column + ')' + '\n';
                        }
                        return false;
                    }
                } else {
                    return false;
                }
            } else {
                if (dic_control['msg_erro'] === ''){
                    dic_control['msg_erro'] += "não encontrou o caracter '(' na declaracao da função" + ' (' + count_line + ', ' + count_column + ')' + '\n';
                }
                return false;
            }
        } else {
            return false;
        }
    } else {
        return false;
    }
}


function DecLibDefine(){
    if (tk === TKs['TKDefine']){
        getToken();
        let variavel = lexico.toString().replace(/\x00/g, '');
        if (tk === TKs['TKId']){
            getToken();
            let arg1 = lexico.toString().replace(/\x00/g, '');
            if (tk === TKs['TKCteInt']){
                tabela_simbolos(index_escopo, 'grava', 'int', variavel, 0, 0, true);
                geraInstrucao('', arg1, '', variavel, count_line);
                getToken();
                return true
            } else if (tk === TKs['TKCteDouble']){
                tabela_simbolos(index_escopo, 'grava', 'float', variavel, 0, 0, true);
                geraInstrucao('', arg1, '', variavel, count_line);
                getToken();
                return true;
            } else {
                dic_control['msg_erro'] += "não encontrou valor atribuído a #define " + variavel + ' (' + count_line + ', ' + count_column + ')' + '\n';
                return false
            }
        } else {
            dic_control['msg_erro'] += "não encontrou um macro declarado a #define " + ' (' + count_line + ', ' + count_column + ')' + '\n';
            return false
        }
    } else if (tk === TKs['TKInclude']){
        getToken();
        if (tk === TKs['TKStdioh']){
            getToken();
            dic_control["bibliotecas"]["stdio"] = true;
            return true;
        }
    } else {
        return false;
    }
}

function Dec2(){
    backtracking('push');
    if (Declaracao()){
        return true;
    }
    backtracking('pop');
    if (DecFunc()){
        geraInstrucao('', '', '', '#' + 0, count_line, false, false, true, false, true);
        if ('main' in tabela_de_simbolos[0]['variaveis']) {
            dic_control["encontrou_main"] = true;
        } else {
            if (!achou_return){
                geraInstrucao('', '', '', 'return', count_line, true);
            }
        }
        return true;
    } else if (DecLibDefine()){
        return true;
    } else {
        return false;
    }

}


function ListaDec2(){
    if (Dec2()){
        if (dic_control['encontrou_main']){
            geraInstrucaoInicial('', '$main', '', 'goto', count_line, true);
            return true;
        }
        if (ListaDec2()){
            return true;
        }
    } else {
        return false;
    }
}


function Programa(){
    index_escopo = 0;
    index_escopo_pai = 0;
    if (ListaDec2()){
        geraInstrucaoInicial('', '', '', '#' + 0, count_line, false, false, true, false, true);
        geraInstrucaoInicial('', '', '', tabela_de_simbolos.length, count_line, false, false, true, false, true);
        return true;
    }
    return false;
}