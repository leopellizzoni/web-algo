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


function ExpressaoPrima(){
    return false;
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


function ExpressCondic(){
    return false;
}


function ExpressAtrib(){
    if (ExpressCondic()){
        return true;
    } else if (ExpressUnaria()){
        if (OperadorAtrib()){
            if (ExpressAtrib()){
                return true
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
    if (tk === TKs['TKPontoEVirgula']){
        getToken();
        return true;
    } else if (Expressao()){
        if (tk === TKs['TKPontoEVirgula']){
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}


function Instr(){
    if (InstrExpress()){
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
        return true;
    }
}


function CorpoFunc(){
    if (tk === TKs['TKAbreChaves']){
        getToken();
        if (tk === TKs['TKFechaChaves']){
            debugger;
            getToken();
            return true;
        } else if (ListaInstr()){
            if (tk === TKs['TKFechaChaves']){
                getToken();
                return true;
            } else {
                textareaElement.value += "Não encontrou o caracter '}' " + ' (' + count_line + ', ' + count_column + ')' + '\n';
                return false;
            }
        } else {
            return false;
        }
    }
}


function DecFunc(){
    debugger;
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
                return true;
            } else {
                backtracking('pop');
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


function Dec(){
    debugger;
    backtracking('push');
    if (DecVariavel()){
        return true;
    } else if (DecFunc()){
        dic_control["encontrou_main"] = true;
        return true;
    }
}


function ListaDec(){
    if (Dec()){
        if (dic_control['encontrou_main']){
            return true;
        }
        if (ListaDec()){
            return true;
        }
    } else {
        return false;
    }
}


function Programa(){
    return ListaDec();
}