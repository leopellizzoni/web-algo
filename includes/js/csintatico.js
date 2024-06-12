lista_backtracking = [];

// identificador da variável no momento
var identificador = '';
var dimensao = 0;
var tempCount = 0;
var labelCount = 0;

var instrucoes = [];

function newTemp() {
    return "t" + tempCount++;
}

function newLabel() {
    return "L" + labelCount++;
}

function geraInstrucao(op, arg1, arg2, result, salto=false) {
    instrucoes.push({ op, arg1, arg2, result, salto });
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


function ExpressaoPosRestante(lado_atribuicao){
    if (tk === TKs['TKAbreColchete']) {
        getToken();
        if (Expressao()) {
            if (tk === TKs['TKFechaColchete']) {
                getToken();
                dimensao += 1;
                if (ExpressaoPosRestante(lado_atribuicao)) {
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
        // } else if (tk === TKs['TKAbreParenteses']){
        //     getToken();
        //     if (tk === TKs['TKFechaParenteses']){
        //         getToken();
        //         if (ExpressaoPosRestante()){
        //             return true;
        //         } else {
        //             return false;
        //         }
        //     } else {
        //         return false;
        //     }
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
        if (!identificador){
            identificador = lexico.toString().replace(/\x00/g, '');
        }
        if (verifica_variavel_declarada(identificador)){
            getToken();
            return true;
        } else {
            return false;
        }
    } else if (tk === TKs['TKCteInt'] || tk === TKs['TKCteDouble']){
        if (lado_atribuicao !== 'esquerdo'){
            getToken();
            return true;
        } else {
            if (dic_control['msg_erro'] === '') {
                dic_control['msg_erro'] += "operador do lado esquerdo de uma atribuição requere um identificador válido " + ' (' + count_line + ', ' + count_column + ')' + '\n';
            }
            return false;
        }

    } else {
        return false;
    }
}


function ExpressPos(lado_atribuicao){
    if (ExpressaoPrima(lado_atribuicao)){
        if (ExpressaoPosRestante(lado_atribuicao)){
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}


function ExpressUnaria(lado_atribuicao){
    if (ExpressPos(lado_atribuicao)){
        return true;
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
    } else if (OperadorUnario()){
        if (ExpressUnaria()){
            return true;
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
        if (ExpressUnaria()) {
            geraInstrucao('/', arg1, arg2, temp);
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
        if (ExpressUnaria()) {
            geraInstrucao('*', arg1, arg2, temp);
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
        if (ExpressUnaria()) {
            geraInstrucao('%', arg1, arg2, temp);
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
    if (ExpressUnaria()) {
        let result = ExpressMultiplRestante(temp, arg1);
        if (result){
            return result;
        } else {
            return false;
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
            result = ExpressAddRestante(newTemp(), result);
            if (result){
                return result;
            } else {
                return false;
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
        if (ExpressAdd()){
            geraInstrucao('<', arg1, arg2, temp);
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
        if (ExpressAdd()){
            geraInstrucao('>', arg1, arg2, temp);
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
        if (ExpressAdd()){
            geraInstrucao('<=', arg1, arg2, temp);
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
        if (ExpressAdd()){
            geraInstrucao('>=', arg1, arg2, temp);
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
    if (ExpressUnaria(lado_atribuicao)){
        let operador = lexico.toString().replace(/\x00/g, '');
        if (OperadorAtrib()){
            if (lado_atribuicao === 'esquerdo' && verifica_variavel_declarada(identificador, dimensao)){
                var arg1 = lexico.toString().replace(/\x00/g, '');
                let result = ExpressAtrib();
                if (result){
                    if (typeof result !== 'string'){
                        if (operador !== '='){
                            geraInstrucao(operador[0], identificador, arg1, identificador);
                        } else {
                            geraInstrucao('', arg1, '', identificador);
                        }
                    } else {
                        if (operador !== '='){
                            geraInstrucao(operador[0], identificador, result, identificador);
                        } else {
                            geraInstrucao('', result, '', identificador);
                        }
                    }
                    return true;
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
                geraInstrucao('', arg1, '', identificador);
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


function ExpressaoRestante(lado_atribuicao){
    if (tk === TKs['TKVirgula']){
        getToken();
        dimensao = 0;
        if (ExpressAtrib(lado_atribuicao)){
            if (ExpressaoRestante(lado_atribuicao)){
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
    dic_control['encontrou_expressao'] = false;
    if (tk === TKs['TKPontoEVirgula']){
        getToken();
        return true;
    } else {
        if (tk !== TKs['TKFechaChaves']){
            let result = Expressao(lado_atribuicao);
            if (result){
                dic_control['encontrou_expressao'] = true;
                if (tk === TKs['TKPontoEVirgula']){
                    getToken();
                    return result;
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


function InstrCondicional(){
    if (tk === TKs['TKIf']){
        getToken();
        if (tk === TKs['TKAbreParenteses']){
            getToken();
            dimensao = 0;
            let result = Expressao();
            if (result){
                if (tk === TKs['TKFechaParenteses']) {
                    getToken();
                    let labelElse = newLabel();
                    geraInstrucao('goto', result, labelElse, 'ifFalse', true);
                    if (Instr()) {
                        geraInstrucao('', '', '', labelElse, true);
                        if (tk === TKs['TKElse']){
                            getToken();
                            if (Instr()){
                                return true;
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
        geraInstrucao('', '', '', labelInicio, true);
        getToken();
        if (tk === TKs['TKAbreParenteses']){
            getToken();
            let result = Expressao();
            if (result){
                let labelFim = newLabel();
                geraInstrucao('goto', result, labelFim, 'ifFalse', true);
                if (tk === TKs['TKFechaParenteses']){
                    getToken();
                    if (Instr()) {
                        geraInstrucao('', labelInicio, '', 'goto', true);
                        geraInstrucao('', '', '', labelFim, true);
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
        geraInstrucao('', '', '', labelInicio, true);
        getToken();
        if (Instr()) {
            if (tk === TKs['TKWhile']){
                getToken();
                if (tk === TKs['TKAbreParenteses']){
                    getToken();
                    let result = Expressao();
                    if (result){
                        let labelFim = newLabel();
                        geraInstrucao('goto', result, labelFim, 'ifFalse', true);
                        geraInstrucao('', labelInicio, '', 'goto', true);
                        geraInstrucao('', '', '', labelFim, true);
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
                geraInstrucao('', '', '', labelInicio, true);
                let result = InstrExpress();
                if (result){
                    let labelFim = newLabel();
                    geraInstrucao('goto', result, labelFim, 'ifFalse', true);
                    let labelInstr = newLabel();
                    geraInstrucao('', labelInstr, '', 'goto', true);
                    let labelIncremento = newLabel();
                    geraInstrucao('', '', '', labelIncremento, true);
                    if(Expressao()){
                        geraInstrucao('', labelInicio, '', 'goto', true);
                        if (tk === TKs['TKFechaParenteses']){
                            getToken();
                            geraInstrucao('', '', '', labelInstr, true);
                            if (Instr()){
                                geraInstrucao('', labelIncremento, '', 'goto', true);
                                geraInstrucao('', '', '', labelFim, true);
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


function InstrSalto(){
    if (tk === TKs['TKContinue']){
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
    } else if (tk === TKs['TKBreak']){
        getToken();
        if (tk === TKs['TKPontoEVirgula']){
            getToken();
            return true;
        } else {
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
                     dic_control['msg_erro'] += "não encontrou o caracter ';' " + ' (' + count_line + ', ' + count_column + ')' + '\n';
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


function Instr() {
    if (InstrCondicional()) {
        return true;
    } else if (InstrIteracao()) {
        return true;
    } else if (InstrSalto()){
        return true;
    } else if (ListaDec()){
        return true;
    } else if (InstrExpress('esquerdo')) {
        return true;
    } else if (CorpoFunc()){
        return true;
    } else {
        return false;
    }
}


function ListaInstrRestante() {
    if (Instr()){
        if (ListaInstrRestante()){
            return true;
        } else {
            return false;
        }
    } else {
        if (dic_control['encontrou_expressao']){
            return false;
        }
        return true;
    }
}


function ListaInstr(){
    if (Instr()){
        if (ListaInstrRestante()){
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
            if (ExpressAtrib()){
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
    if (tk === TKs['TKVirgula']){
        getToken();
        if (DecInicial(tipo)){
            if (ListaDecInicialRestante(tipo)){
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
        if (tk === TKs['TKPontoEVirgula']){
            getToken();
            return true;
        } else if (ListaDecInicial(tipo)){
            if (tk === TKs['TKPontoEVirgula']){
                getToken();
                return true;
            } else {
                if (dic_control['msg_erro'] === '') {
                    dic_control['msg_erro'] += "não encontrou o caracter ';' " + ' (' + count_line + ', ' + count_column + ')' + '\n';
                }
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


function CorpoFunc(){
    if (tk === TKs['TKAbreChaves']) {
        getToken();
        if (tk === TKs['TKFechaChaves']) {
            getToken();
            return true;
        } else if (ListaInstr()) {
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
        if (dic_control['msg_erro'] === ''){
            dic_control['msg_erro'] += "não encontrou o caracter '{' " + ' (' + count_line + ', ' + count_column + ')' + '\n';
        }
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
    if (DecVariavel()){
        return true;
    } else {
        backtracking('pop');
        if (DecFunc()){
            dic_control["encontrou_main"] = true;
            return true;
        }
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
    console.log(tabela_de_simbolos);
    return ListaDec2();
}