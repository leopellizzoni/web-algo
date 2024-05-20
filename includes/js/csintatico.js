lista_backtracking = []

dic_backtracking = {
    posicao: 0,
    caracter: '',
    lexico: '',
    token: 0
}

// identificador da variável no momento
identificador = ''
dimensao = 0;


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
        return true
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
        return false
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
    if (tk === TKs['TKAbreColchete']){
        getToken();
        if (Expressao()){
            if (tk === TKs['TKFechaColchete']){
                getToken();
                dimensao += 1;
                if (ExpressaoPosRestante(lado_atribuicao)){
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
    } else {
        return true;
    }
}


function ExpressaoPrima(lado_atribuicao) {
    if (tk === TKs['TKId']) {
        identificador = lexico.toString().replace(/\x00/g, '');
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


function ExpressMultiplRestante(){
    if (tk === TKs['TKMult']){
        getToken();
        if (ExpressUnaria()){
            if (ExpressMultiplRestante()){
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    } else if (tk === TKs['TKDiv']){
        getToken();
        if (ExpressUnaria()){
            if (ExpressMultiplRestante()){
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    } else if (tk === TKs['TKResto']){
        getToken();
        if (ExpressUnaria()){
            if (ExpressMultiplRestante()){
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


function ExpressMultipl(){
    if (ExpressUnaria()){
        if (ExpressMultiplRestante()){
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}


function ExpressAddRestante(){
    if (tk === TKs['TKMais']){
        getToken();
        if (ExpressMultipl()){
            if (ExpressAddRestante()){
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    } else if (tk === TKs['TKMenos']) {
        getToken();
        if (ExpressMultipl()) {
            if (ExpressAddRestante()) {
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


function ExpressAdd(){
    if (ExpressMultipl()){
        if (ExpressAddRestante()){
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}


function ExpressRelacionalRestante(){
    if (tk === TKs['TKMenor']){
        getToken();
        if (ExpressAdd()){
            if (ExpressRelacionalRestante()){
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    } else if (tk === TKs['TKMaior']){
        getToken();
        if (ExpressAdd()){
            if (ExpressRelacionalRestante()){
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    } else if (tk === TKs['TKMenorIgual']){
        getToken();
        if (ExpressAdd()){
            if (ExpressRelacionalRestante()){
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    } else if (tk === TKs['TKMaiorIgual']){
        getToken();
        if (ExpressAdd()){
            if (ExpressRelacionalRestante()){
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


function ExpressRelacional() {
    if (ExpressAdd()){
        if (ExpressRelacionalRestante()){
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}


function ExpressIgualRestante(){
    if (tk === TKs['TKCompare']) {
        getToken();
        if (ExpressRelacional()) {
            if (ExpressIgualRestante()) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    } else if (tk === TKs['TKDiferent']) {
        getToken();
        if (ExpressRelacional()) {
            if (ExpressIgualRestante()) {
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


function ExpressIgual(){
    if (ExpressRelacional()){
        if (ExpressIgualRestante()){
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}


function ExpressLogicAndRestante(){
    if (tk === TKs['TKLogicalAnd']){
        getToken();
        if (ExpressIgual()){
            if (ExpressLogicAndRestante()){
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


function ExpressLogicAnd(){
    if (ExpressIgual()){
        if (ExpressLogicAndRestante()){
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}


function ExpressLogicOrRestante(){
    if (tk === TKs['TKLogicalOr']){
        getToken();
        if (ExpressLogicAnd()){
            if (ExpressLogicOrRestante()){
                return true;
            }
        } else {
            return false;
        }
    } else {
        return true;
    }
}


function ExpressLogicOr(){
    if (ExpressLogicAnd()){
        if (ExpressLogicOrRestante()){
            return true;
        }
    } else {
        return false;
    }
}


function ExpressCondic(){
    if (ExpressLogicOr()){
        return true;
    } else {
        return false;
    }
}


function ExpressAtrib(lado_atribuicao){
    console.log('passou aqui');
    backtracking('push');
    if (ExpressUnaria(lado_atribuicao)){
        if (OperadorAtrib()){
            debugger;
            if (lado_atribuicao === 'esquerdo' && verifica_variavel_declarada(identificador, dimensao)){
                if (ExpressAtrib()){
                    return true;
                }
            } else {
                return false;
            }
        }
    }
    backtracking('pop');
    return ExpressCondic();
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
    if (ExpressAtrib(lado_atribuicao)){
        if (ExpressaoRestante(lado_atribuicao)){
            return true;
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
    } else if (tk !== TKs['TKFechaChaves'] && Expressao(lado_atribuicao)){
        dic_control['encontrou_expressao'] = true;
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
        return false;
    }
}


function InstrCondicional(){
    if (tk === TKs['TKIf']){
        getToken();
        if (tk === TKs['TKAbreParenteses']){
            getToken();
            if (Expressao()){
                if (tk === TKs['TKFechaParenteses']) {
                    getToken();
                    if (Instr()) {
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
        getToken();
        if (tk === TKs['TKAbreParenteses']){
            getToken();
            if (Expressao()){
                if (tk === TKs['TKFechaParenteses']){
                    getToken();
                    if (Instr()) {
                        return true;
                    }
                }
            }
        }
    } else if (tk === TKs['TKDo']){
        getToken();
        if (Instr()) {
            if (tk === TKs['TKWhile']){
                if (tk === TKs['TKAbreParenteses']){
                    getToken();
                    if (Expressao()) {
                        if (tk === TKs['TKFechaParenteses']){
                            getToken();
                            if (tk === TKs['TKPontoEVirgula']){
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
        getToken();
        if (tk === TKs['TKAbreParenteses']){
            getToken();
            if (InstrExpress()){
                if (InstrExpress()){
                    if (tk === TKs['TKFechaParenteses']){
                        getToken();
                        if (Instr()){
                            return true;
                        } else {
                            return false
                        }
                    } else {
                        if (dic_control['msg_erro'] === '') {
                            dic_control['msg_erro'] += "não encontrou o caracter ')' " + ' (' + count_line + ', ' + count_column + ')' + '\n';
                        }
                        return false
                    }
                } else {
                    return false;
                }
            } else {
                return false
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
            return false
        }
    } else if (tk === TKs['TKBreak']){
        getToken();
        if (tk === TKs['TKPontoEVirgula']){
            getToken();
            return true;
        } else {
            return false
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
            return false
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
    var variavel = lexico.toString().replace(/\x00/g, '');
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
        return false
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
    return ListaDec2();
}