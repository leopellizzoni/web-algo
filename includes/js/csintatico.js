function Tipo(){
    debugger;
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
            return false;
        }
    } else {
        return false;
    }
}


function ListaParam(){
    if (Param()){
        return true;
    } else if (ListaParam()){
        if (tk === TKs['TKVirgula']){
            if (Param()){
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


function Instr(){
    return true;
}


function ListaInstr(){
    if (Instr()){
        if (ListaInstr()){
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
        if (ListaDec()){
            if (ListaInstr()){
                if (tk === TKs['TKFechaChaves']){
                    getToken();
                    return true;
                }
            } else {
                return false;
            }
        } else {
            return false
        }
    } else {
        return false;
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
                return false;
            }
        } else {
            return false;
        }
    } else {
        return false;
    }
}


function Dec(){
    if (DecVariavel()){
        return true;
    } else return !!DecFunc();
}


function ListaDec(){
    if (Dec()){
        if (ListaDec()){
            return true;
        }
    } else {
        return true;
    }
}


function Programa(){
    return ListaDec();
}