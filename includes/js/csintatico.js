var lista_backtracking = [];

// identificador da variável no momento
var identificador = '';
var dimensao = 0;
var tempCount = 0;
var labelCount = 0;

var instrucoes = [];

function newTemp() {
    return "@t" + tempCount++;
}

function newLabel() {
    return "L" + labelCount++;
}

function geraInstrucao(op, arg1, arg2, result, salto=false, escrita=false, label=false, leitura=false) {
    instrucoes.push({ op, arg1, arg2, result, salto, escrita, label, leitura });
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
    if (tk === TKs['TKInt'] || tk === TKs['TKVoid'] || tk === TKs['TKFloat']){
        getToken();
        return true;
    } else {
        return false;
    }
}

function NomeFunc(){
    if (tk === TKs['TKId']){
        getToken();
        return true;
    } else {
        return false;
    }
}


function Param(){
    if (Tipo()){
        if (tk === TKs['TKId']){
            getToken();
            return true;
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
        if (Param()){
            return ListaParamRestantes();
        } else {
            return false;
        }
    } else {
        return true;
    }
}


function ListaParam(){
    backtracking('push');
    if (Param()){
        return !!ListaParamRestantes();
    } else {
        console.log('chegou aqui');
        return true;
    }
}


function ExpressaoPosRestante(lado_atribuicao, arg1){
    if (tk === TKs['TKAbreColchete']) {
        if (arg1 && tabela_de_simbolos[arg1].matriz_vetor === ''){
            dic_control['msg_erro'] = " variável '" + arg1 + "' não é vetor " + ' (' + count_line + ', ' + count_column + ')' + '\n';
            return false;
        }
        getToken();
        let result = Expressao();
        if (result) {
            if (tk === TKs['TKFechaColchete']) {
                getToken();
                dimensao += 1;
                let temp2 = ExpressaoPosRestante(lado_atribuicao);
                if (arg1){
                    if (typeof temp2 === 'string') {
                        return arg1 + "[" + result + "]" + temp2;
                    } else {
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
        if (tk === TKs['TKFechaParenteses']){
            getToken();
            if (ExpressaoPosRestante()){
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    } else if (tk === TKs['TKDuploMais']){
        getToken();
        geraInstrucao('+', identificador, 1, identificador);
        if (ExpressaoPosRestante(lado_atribuicao)) {
            return true;
        } else {
            return false;
        }
    } else if (tk === TKs['TKDuploMenos']){
        getToken();
        geraInstrucao('-', identificador, 1, identificador);
        if (ExpressaoPosRestante(lado_atribuicao)) {
            return true;
        } else {
            return false;
        }
    } else {
        return true;
    }
}


function ExpressaoPrima(lado_atribuicao) {
    if (tk === TKs['TKId']) {
        if (lado_atribuicao === 'esquerdo'){
            identificador = lexico.toString().replace(/\x00/g, '');
        }
        // if (!identificador || identificador !== lexico.toString().replace(/\x00/g, '')){
        //     if (!verifica_variavel_declarada(lexico.toString().replace(/\x00/g, ''))){
        //         return false;
        //     }
        // }
        if (verifica_variavel_declarada(lexico.toString().replace(/\x00/g, ''))){
            getToken();
            return true;
        } else {
            return false;
        }
    } else if (tk === TKs['TKCteInt'] || tk === TKs['TKCteDouble']) {
        if (lado_atribuicao !== 'esquerdo') {
            getToken();
            return true;
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
            if (typeof temp2 === 'string'){
                return temp2;
            } else {
                tempCount--;
                return result;
            }
        }
    } else {
        return false;
    }
}


function ExpressUnaria(lado_atribuicao){
    let result = ExpressPos(lado_atribuicao);
    if (result){
        return result;
    } else if (tk === TKs['TKDuploMais']){
        getToken();
        if (ExpressUnaria()){
            geraInstrucao('+', identificador, '1', identificador);
            return true;
        } else {
            return false;
        }
    } else if (tk === TKs['TKDuploMenos']){
        getToken();
        if (ExpressUnaria()){
            geraInstrucao('-', identificador, '1', identificador);
            return true;
        } else {
            return false;
        }
    // } else if (OperadorUnario()){
    //     if (ExpressUnaria()){
    //         return true;
    //     } else {
    //         return false;
    //     }
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
                geraInstrucao('/', arg1, arg2, temp);
            } else {
                geraInstrucao('/', arg1, result, temp);
            }
            let temp2 = ExpressMultiplRestante(newTemp(), temp);
            if (typeof temp2 === 'string'){
                return temp2;
            } else {
                tempCount--;
                return temp;
            }
        } else {
            return false;
        }
    } else if (tk === TKs['TKMult']){
        getToken();
        let arg2 = lexico.toString().replace(/\x00/g, '');
        let result = ExpressUnaria();
        if (result) {
            if (typeof result !== 'string') {
                geraInstrucao('*', arg1, arg2, temp);
            } else {
                geraInstrucao('*', arg1, result, temp);
            }
            let temp2 = ExpressMultiplRestante(newTemp(), temp);
            if (typeof temp2 === 'string'){
                return temp2;
            } else {
                tempCount--;
                return temp;
            }
        } else {
            return false;
        }
    } else if (tk === TKs['TKResto']){
        getToken();
        let arg2 = lexico.toString().replace(/\x00/g, '');
        let result = ExpressUnaria();
        if (result) {
            if (typeof result !== 'string') {
                geraInstrucao('%', arg1, arg2, temp);
            } else {
                geraInstrucao('%', arg1, result, temp);
            }
            let temp2 = ExpressMultiplRestante(newTemp(), temp);
            if (typeof temp2 === 'string'){
                return temp2;
            } else {
                tempCount--;
                return temp;
            }
        } else {
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
                tempCount--;
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
                geraInstrucao('+', arg1, arg2, temp);
            } else {
                geraInstrucao('+', arg1, result, temp);
            }
            let temp2 = ExpressAddRestante(newTemp(), temp);
            if (typeof temp2 === 'string'){
                return temp2;
            } else {
                tempCount--;
                return temp;
            }
        } else {
            return false;
        }
    } else if (tk === TKs['TKMenos']) {
        getToken();
        let arg2 = lexico.toString().replace(/\x00/g, '');
        let result = ExpressMultipl();
        if (result) {
            if (typeof result !== 'string'){
                geraInstrucao('-', arg1, arg2, temp);
            } else {
                geraInstrucao('-', arg1, result, temp);
            }
            let temp2 = ExpressAddRestante(newTemp(), temp);
            if (typeof temp2 === 'string'){
                return temp2;
            } else {
                tempCount--;
                return temp;
            }
        } else {
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
                tempCount--;
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
                geraInstrucao('<', arg1, arg2, temp);
            } else {
                geraInstrucao('<', arg1, result, temp);
            }
            let temp2 = ExpressRelacionalRestante(newTemp(), temp);
            if (typeof temp2 === 'string'){
                return temp2;
            } else {
                tempCount--;
                return temp;
            }
        } else {
            return false;
        }
    } else if (tk === TKs['TKMaior']){
        getToken();
        let arg2 = lexico.toString().replace(/\x00/g, '');
        let result = ExpressAdd();
        if (result){
            if (typeof result !== 'string'){
                geraInstrucao('>', arg1, arg2, temp);
            } else {
                geraInstrucao('>', arg1, result, temp);
            }
            let temp2 = ExpressRelacionalRestante(newTemp(), temp);
            if (typeof temp2 === 'string'){
                return temp2;
            } else {
                tempCount--;
                return temp;
            }
        } else {
            return false;
        }
    } else if (tk === TKs['TKMenorIgual']){
        getToken();
        let arg2 = lexico.toString().replace(/\x00/g, '');
        let result = ExpressAdd();
        if (result){
            if (typeof result !== 'string'){
                geraInstrucao('<=', arg1, arg2, temp);
            } else {
                geraInstrucao('<=', arg1, result, temp);
            }
            let temp2 = ExpressRelacionalRestante(newTemp(), temp);
            if (typeof temp2 === 'string'){
                return temp2;
            } else {
                tempCount--;
                return temp;
            }
        } else {
            return false;
        }
    } else if (tk === TKs['TKMaiorIgual']){
        getToken();
        let arg2 = lexico.toString().replace(/\x00/g, '');
        let result = ExpressAdd();
        if (result){
            if (typeof result !== 'string'){
                geraInstrucao('>=', arg1, arg2, temp);
            } else {
                geraInstrucao('>=', arg1, result, temp);
            }
            let temp2 = ExpressRelacionalRestante(newTemp(), temp);
            if (typeof temp2 === 'string'){
                return temp2;
            } else {
                tempCount--;
                return temp;
            }
        } else {
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
                tempCount--;
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
                geraInstrucao('==', arg1, arg2, temp);
            } else {
                geraInstrucao('==', arg1, result, temp);
            }
            let temp2 = ExpressIgualRestante(newTemp(), temp);
            if (typeof temp2 === 'string'){
                return temp2;
            } else {
                tempCount--;
                return temp;
            }
        } else {
            return false;
        }
    } else if (tk === TKs['TKDiferent']) {
        getToken();
        let arg2 = lexico.toString().replace(/\x00/g, '');
        let result = ExpressRelacional();
        if (result){
            if (typeof result !== 'string'){
                geraInstrucao('!=', arg1, arg2, temp);
            } else {
                geraInstrucao('!=', arg1, result, temp);
            }
            let temp2 = ExpressIgualRestante(newTemp(), temp);
            if (typeof temp2 === 'string'){
                return temp2;
            } else {
                tempCount--;
                return temp;
            }
        } else {
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
                tempCount--;
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
                geraInstrucao('&&', arg1, arg2, temp);
            } else {
                geraInstrucao('&&', arg1, result, temp);
            }
            let temp2 = ExpressLogicAndRestante(newTemp(), temp);
            if (typeof temp2 === 'string'){
                return temp2;
            } else {
                tempCount--;
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
                tempCount--;
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
                geraInstrucao('||', arg1, arg2, temp);
            } else {
                geraInstrucao('||', arg1, result, temp);
            }
            let temp2 = ExpressLogicOrRestante(newTemp(), temp);
            if (typeof temp2 === 'string'){
                return temp2;
            } else {
                tempCount--;
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
                tempCount--;
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
        let operador = lexico.toString().replace(/\x00/g, '');
        if (OperadorAtrib()){
            if (lado_atribuicao === 'esquerdo' && verifica_variavel_declarada(identificador, dimensao)){
                var arg1 = lexico.toString().replace(/\x00/g, '');
                let result = ExpressAtrib();
                if (result){
                    if (typeof result !== 'string'){
                        if (operador !== '='){
                            geraInstrucao(operador[0], id, arg1, id);
                        } else {
                            geraInstrucao('', arg1, '', id);
                        }
                    } else {
                        if (operador !== '='){
                            geraInstrucao(operador[0], id, result, id);
                        } else {
                            geraInstrucao('', result, '', id);
                        }
                    }
                    return id;
                }
            }
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
                    geraInstrucao('', arg1, '', identificador);
                }
                return arg1;
            } else {
                geraInstrucao('', result, '', identificador);
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
                    return true;
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


function Expressao(lado_atribuicao){
    let result = ExpressAtrib(lado_atribuicao);
    if (result){
        if (ExpressaoRestante(lado_atribuicao)){
            return result;
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
            let result = Expressao(lado_atribuicao);
            if (result){
                if (tk === TKs['TKPontoEVirgula']){
                    getToken();
                    return result;
                } else {
                    if (dic_control['msg_erro'] === '') {
                        dic_control['msg_erro'] = "não encontrou o caracter ';' " + ' (' + count_line + ', ' + count_column + ')' + '\n';
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
        debugger;
        getToken();
        if (tk === TKs['TKAbreParenteses']){
            getToken();
            dimensao = 0;
            let result = Expressao('esquerdo');
            if (result){
                if (tk === TKs['TKFechaParenteses']) {
                    getToken();
                    let labelElse = newLabel();
                    geraInstrucao('goto', result, labelElse, 'ifFalse', true);
                    if (Instr(esta_em_laco)) {
                        if (tk === TKs['TKElse']){
                            let labelSaidaElse = newLabel();
                            geraInstrucao('', labelSaidaElse, '', 'goto', true);
                            geraInstrucao('', '', '', labelElse, false, false, true);
                            getToken();
                            if (Instr()){
                                geraInstrucao('', '', '', labelSaidaElse, false, false, true);
                                return true;
                            }
                        } else {
                            geraInstrucao('', '', '', labelElse, false, false, true);
                            return true;
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
            return false;
        }
    }
}


function InstrIteracao(){
    if (tk === TKs['TKWhile']){
        let labelInicio = newLabel();
        geraInstrucao('', '', '', labelInicio, false, false, true);
        getToken();
        if (tk === TKs['TKAbreParenteses']){
            getToken();
            dimensao = 0;
            let result = Expressao('esquerdo');
            if (result){
                let labelFim = newLabel();
                geraInstrucao('goto', result, labelFim, 'ifFalse', true);
                if (tk === TKs['TKFechaParenteses']){
                    getToken();
                    if (Instr({'labelInicio': labelInicio, 'labelFim': labelFim})) {
                        geraInstrucao('', labelInicio, '', 'goto', true);
                        geraInstrucao('', '', '', labelFim, false, false, true);
                        return true;
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
    } else if (tk === TKs['TKDo']){
        let labelInicio = newLabel();
        let labelFim = newLabel();
        geraInstrucao('', '', '', labelInicio, false, false, true);
        getToken();
        if (Instr({'labelInicio': labelInicio, 'labelFim': labelFim})) {
            if (tk === TKs['TKWhile']){
                getToken();
                if (tk === TKs['TKAbreParenteses']){
                    getToken();
                    let result = Expressao();
                    if (result){
                        geraInstrucao('goto', result, labelFim, 'ifFalse', true);
                        geraInstrucao('', labelInicio, '', 'goto', true);
                        geraInstrucao('', '', '', labelFim, false, false, true);
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
        } else {
            return false;
        }
    } else if (tk === TKs['TKFor']){
        let labelInicio = newLabel();
        getToken();
        if (tk === TKs['TKAbreParenteses']){
            getToken();
            if (InstrExpress('esquerdo')){
                geraInstrucao('', '', '', labelInicio, false, false, true);
                let result = InstrExpress();
                if (result){
                    let labelFim = newLabel();
                    geraInstrucao('goto', result, labelFim, 'ifFalse', true);
                    let labelInstr = newLabel();
                    geraInstrucao('', labelInstr, '', 'goto', true);
                    let labelIncremento = newLabel();
                    geraInstrucao('', '', '', labelIncremento, false, false, true);
                    if(Expressao('esquerdo')){
                        geraInstrucao('', labelInicio, '', 'goto', true);
                        if (tk === TKs['TKFechaParenteses']){
                            getToken();
                            geraInstrucao('', '', '', labelInstr, false, false, true);
                            if (Instr({'labelInicio': labelIncremento, 'labelFim': labelFim})){
                                geraInstrucao('', labelIncremento, '', 'goto', true);
                                geraInstrucao('', '', '', labelFim, false, false, true);
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
            geraInstrucao('', esta_no_laco['labelInicio'], '', 'goto', true);
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
            geraInstrucao('', esta_no_laco['labelFim'], '', 'goto', true);
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
        getToken();
         if (tk === TKs['TKPontoEVirgula']){
            getToken();
            return true;
        } else if (Expressao()) {
             if (tk === TKs['TKPontoEVirgula']) {
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
                                    geraInstrucao('', '', '', "scanf(" + scanf + "," + result + ")", false, false, false, true);
                                    return true;
                                } else {
                                    dic_control['msg_erro'] = "Número de argumentos difere do número de parâmetros" + ' (' + count_line + ', ' + count_column + ')' + '\n';
                                    return false;
                                }
                            } else {
                                geraInstrucao('', '', '', "scanf(" + printf + ")", false, false, false, true);
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
                                    geraInstrucao('', '', '', "printf(" + printf + "," + result + ")", false, true);
                                    return true;
                                } else {
                                    dic_control['msg_erro'] = "Número de argumentos difere do número de parâmetros no comando printf" + ' (' + count_line + ', ' + count_column + ')' + '\n';
                                    return false;
                                }
                            } else {
                                geraInstrucao('', '', '', "printf(" + printf + ")", false, true);
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
        if (ExpressCondic()){
            if (tk === TKs['TKFechaColchete']){
                getToken();
                tabela_simbolos('tamanho', tipo, variavel, tam_vetor, vetor_matriz);
                if (DecRestante(tipo, variavel, vetor_matriz + 1)){
                    return true;
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
        return true;
    }
}

function Dec(tipo, variavel) {
    if (tk === TKs['TKId']) {
        tabela_simbolos('grava', tipo, variavel);
        getToken();
        if (DecRestante(tipo, variavel, 1)){
            return true;
        }
        return true;
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
                geraInstrucao('', result, '', variavel);
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
    if (Tipo()){
        if (NomeFunc()){
            if (tk === TKs['TKAbreParenteses']){
                getToken();
                if (ListaParam()){
                    if (tk === TKs['TKFechaParenteses']){
                        getToken();
                        return !!CorpoFunc();
                    } else {
                        return false
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
        return false;
    }
}


function DecVariavel(){
    if (Tipo()){
        if (tk === TKs['TKId']){
            getToken();
            if (tk === TKs['TKPontoEVirgula']){
                getToken();
                return true;
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


function Dec2(){
    backtracking('push');
    if (Declaracao()){
        return true;
    }
    backtracking('pop');
    if (DecFunc()){
        dic_control["encontrou_main"] = true;
        return true;
    } else {
        return false;
    }

}


function ListaDec2(){
    if (Dec2()){
        if (dic_control['encontrou_main']){
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
    return ListaDec2();
}