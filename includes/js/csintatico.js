lista_backtracking = []

dic_backtracking = {
    posicao: 0,
    caracter: '',
    lexico: '',
    token: 0
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


function ExpressaoPosRestante(){
    if (tk === TKs['TKAbreColchete']){
        getToken();
        if (Expressao()){
            if (tk === TKs['TKFechaColchete']){
                getToken();
                if (ExpressaoPosRestante()){
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
    } else {
        return true;
    }
}


function ExpressaoPrima() {
    if (tk === TKs['TKId']) {
        getToken();
        return true;
    } else if (tk === TKs['TKCteInt'] || tk === TKs['TKCteDouble']){
        getToken();
        return true;
    } else {
        return false;
    }
}


function ExpressPos(){
    if (ExpressaoPrima()){
        return true;
    } else if (ExpressaoPosRestante()){
        return true;
    } else {
        return false;
    }
}


function ExpressUnaria(){
    if (ExpressPos()){
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


function ExpressAtrib(){
    backtracking('push');
    if (ExpressUnaria()){
        if (OperadorAtrib()){
            if (ExpressAtrib()){
                return true;
            }
        }
    }
    backtracking('pop');
    return ExpressCondic();
}


function ExpressaoRestante(){
    if (tk === TKs['TKVirgula']){
        getToken();
        if (ExpressAtrib()){
            if (ExpressaoRestante()){
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


function Expressao(){
    if (ExpressAtrib()){
        if (ExpressaoRestante()){
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}


function InstrExpress(){
    dic_control['encontrou_expressao'] = false;
    if (tk === TKs['TKPontoEVirgula']){
        getToken();
        return true;
    } else if (tk !== TKs['TKFechaChaves'] && Expressao()){
        dic_control['encontrou_expressao'] = true;
        if (tk === TKs['TKPontoEVirgula']){
            getToken();
            return true;
        } else {
            dic_control['msg_erro'] += "Não encontrou o caracter ';' " + ' (' + count_line + ', ' + count_column + ')' + '\n';
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
                                dic_control['msg_erro'] += "Não encontrou o caracter ';' " + ' (' + count_line + ', ' + count_column + ')' + '\n';
                                return false;
                            }
                        } else {
                            dic_control['msg_erro'] += "Não encontrou o caracter ')' " + ' (' + count_line + ', ' + count_column + ')' + '\n';
                            return false;
                        }
                    }
                } else {
                    dic_control['msg_erro'] += "Não encontrou o caracter '(' " + ' (' + count_line + ', ' + count_column + ')' + '\n';
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
                        dic_control['msg_erro'] += "Não encontrou o caracter ')' " + ' (' + count_line + ', ' + count_column + ')' + '\n';
                        return false
                    }
                } else {
                    return false;
                }
            } else {
                return false
            }
        } else {
            dic_control['msg_erro'] += "Não encontrou o caracter '(' " + ' (' + count_line + ', ' + count_column + ')' + '\n';
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
            dic_control['msg_erro'] += "Não encontrou o caracter ';' " + ' (' + count_line + ', ' + count_column + ')' + '\n';
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
                 dic_control['msg_erro'] += "Não encontrou o caracter ';' " + ' (' + count_line + ', ' + count_column + ')' + '\n';
                 return false;
             }
        } else {
             dic_control['msg_erro'] += "Não encontrou o caracter ';' " + ' (' + count_line + ', ' + count_column + ')' + '\n';
             return false;
        }
    } else {
        return false;
    }
}


function Instr() {
    if (CorpoFunc()){
        return true;
    } else if (InstrCondicional()) {
        return true;
    } else if (InstrIteracao()) {
        return true;
    } else if (InstrSalto()){
        return true;
    } else if (ListaDec()){
        return true;
    } else if (InstrExpress()) {
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

function Dec(){
    if (tk === TKs['TKId']){
        getToken();
        return true;
    } else {
        return false;
    }
}


function DecInicial(){
    if (Dec()){
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


function ListaDecInicialRestante(){
    if (tk === TKs['TKVirgula']){
        getToken();
        if (DecInicial()){
            if (ListaDecInicialRestante()){
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


function ListaDecInicial(){
    if (DecInicial()){
        if (ListaDecInicialRestante()){
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}


function Declaracao(){
    if (Tipo()){
        if (tk === TKs['TKPontoEVirgula']){
            getToken();
            return true;
        } else if (ListaDecInicial()){
            if (tk === TKs['TKPontoEVirgula']){
                getToken();
                return true;
            } else {
                dic_control['msg_erro'] += "Não encontrou o caracter ';' " + ' (' + count_line + ', ' + count_column + ')' + '\n';
            }
        } else {
            dic_control['msg_erro'] += "Não encontrou o caracter ';' " + ' (' + count_line + ', ' + count_column + ')' + '\n';
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
                dic_control['msg_erro'] += "Não encontrou o caracter '}' " + ' (' + count_line + ', ' + count_column + ')' + '\n';
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
            dic_control['msg_erro'] += "Não encontrou o caracter '}' " + ' (' + count_line + ', ' + count_column + ')' + '\n';
            return false;
        }
    } else {
        dic_control['msg_erro'] += "Não encontrou o caracter '{' " + ' (' + count_line + ', ' + count_column + ')' + '\n';
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