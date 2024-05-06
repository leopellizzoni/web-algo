// Identificadores começam com uma letra ou sublinhado, seguido de letras, números ou sublinhados
var regexIdentificador = /[a-zA-Z_]\w*/;
// Expressão regular para identificar identificadores e números inteiros
var regexIdentificadorNumero = /[a-zA-Z_]\w*|\d+/;
// Números inteiros
var regexNumero = /\d+/;

function getToken(){
    var fim = false;
    var estado = 0;
	lexico = '';
    while (!fim){
		lexico += caracter;
        switch (estado){
            case 0:
                if (regexIdentificador.test(caracter)){
                    proxC();
                    estado = 1;
                    break;
                }
                if (regexNumero.test(caracter)) { // verifica numero
                    proxC();
                    while (regexNumero.test(caracter)){
                        lexico += caracter;
	                	proxC();
                    }
                    if (caracter === '.'){ // double / float
						lexico += caracter;
						proxC();
						while (regexNumero.test(caracter)){
							lexico += caracter;
							proxC();
						}
						lexico += '\0';
						tk = TKs['TKCteDouble'];
						return;
					} else { // inteiro
						lexico += '\0';
						tk = TKs['TKCteInt'];
						return;
					}
                }
                if (caracter === ','){ // verifica ','
					lexico += '\0';
					proxC();
					tk = TKs['TKVirgula'];
					return;
				}
				if (caracter === '.'){ // verifica '.'
					lexico += '\0';
					proxC();
					tk = TKs['TKPonto'];
					return;
				}
				if (caracter === ':'){ // verifica ':'
					lexico += '\0';
					proxC();
					tk = TKs['TKDoisPontos'];
					return;
				}
				if (caracter === ';'){ // verifica ';'
					lexico += '\0';
					proxC();
					tk = TKs['TKPontoEVirgula'];
					return;
				}
				if (caracter === '('){ // verifica '('
					lexico += '\0';
					proxC();
					tk = TKs['TKAbreParenteses'];
					return;
				}
				if (caracter === ')'){ // verifica ')'
					lexico += '\0';
					proxC();
					tk = TKs['TKFechaParenteses'];
					return;
				}
				if (caracter === '['){ // verifica '['
					lexico += '\0';
					proxC();
					tk = TKs['TKAbreColchete'];
					return;
				}
				if (caracter === ']'){ // verifica ']'
					lexico += '\0';
					proxC();
					tk = TKs['TKFechaColchete'];
					return;
				}
				if (caracter === '{'){ // verifica '{'
					lexico += '\0';
					proxC();
					tk = TKs['TKAbreChaves'];
					return;
				}
				if (caracter === '}'){ // verifica '}'
					lexico += '\0';
					proxC();
					tk = TKs['TKFechaChaves'];
					return;
				}
                if (caracter === '+'){ // verifica '+' '+=' '++'
				    proxC();
					if (caracter === '+'){ // '++'
					   lexico += '+';
	     			   lexico += '\0';
					   proxC();
					   tk = TKs['TKDuploMais'];
					   return;
					} else if (caracter === '='){ // '+='
					   lexico += '=';
	     			   lexico += '\0';
					   proxC();
					   tk = TKs['TKMaisIgual'];
					   return;
					} else { // '+'
		               lexico += '\0';
					   tk = TKs['TKMais'];
					   return;
					}
				}
                if (caracter === '-'){ // verifica '-' '-=' '--'
					proxC();
					if (caracter === '-'){ // '--'
						lexico += '-';
						lexico += '\0';
						proxC();
						tk = TKs['TKDuploMenos'];
						return;
					} else if (caracter === '='){ // '-='
						lexico += '=';
						lexico += '\0';
						proxC();
						tk = TKs['TKMenosIgual'];
						return;
					} else { // '-'
						lexico += '\0';
						tk = TKs['TKMenos'];
						return;
					}
				}
                if (caracter === '*') { // verifica '*' '*='
				 	proxC();
	             	if (caracter === '='){ // '*='
	             		lexico += '=';
	     			    lexico += '\0';
				 		proxC();
				 		tk = TKs['TKMultIgual'];
				 		return;
					} else { // '*'
						lexico += '\0';
				 		tk = TKs['TKMult'];
				 		return;
					}
				}
                if (caracter === '/') { // verifica '/' '/='
				 	proxC();
	             	if (caracter === '='){ // '/='
	             		lexico += '=';
	     			    lexico += '\0';
				 		proxC();
				 		tk = TKs['TKDivIgual'];
				 		return;
					} else { // '/'
						lexico += '\0';
				 		tk = TKs['TKDiv'];
				 		return;
					}
				}
                if (caracter === '%') { // verifica '%' '%='
				 	proxC();
	             	if (caracter === '='){ // '%='
	             		lexico += '=';
	     			    lexico += '\0';
				 		proxC();
				 		tk = TKs['TKRestoIgual'];
				 		return;
					} else { // '%'
						lexico += '\0';
				 		tk = TKs['TKResto'];
				 		return;
					}
				}
                if (caracter === '='){ // verifica '=' '=='
					proxC();
					if (caracter === '='){ // '=='
						lexico += '=';
						proxC();
						tk = TKs['TKCompare'];
						return;
					} else { // '='
						lexico += '\0';
						tk = TKs['TKIgual'];
						return;
					}
				}
				if (caracter === '!'){ // verifica '!' '!='
					proxC();
				 	if (caracter === '='){ // '!='
						lexico += '=';
	     			    lexico += '\0';
					    proxC();
					    tk = TKs['TKDiferent'];
					    return;
					} else { // '!'
						lexico += '\0';
						tk = TKs['TKLogicalNot'];
					    return;
					}
				}
				if (caracter === '<'){ // verifica '<' '<='
				 	proxC();
					if (caracter === '='){ // '<='
						lexico += '=';
	     			    lexico += '\0';
					    proxC();
					    tk = TKs['TKMenorIgual'];
					    return;
					} else { // '<'
						lexico += '\0';
						tk = TKs['TKMenor'];
					    return;
					}
				}
				if (caracter === '>'){ // verifica '>' '>='
					proxC();
					if (caracter === '='){ // '>='
						lexico += '=';
	     			    lexico += '\0';
					    proxC();
					    tk = TKs['TKMaiorIgual'];
					    return;
					} else { // >
						lexico += '\0';
						tk = TKs['TKMaior'];
					    return;
					}
				}
				if (caracter === '&'){ // verifica '&&'
	             	proxC();
	             	if (caracter === '&'){ // '&&'
	             		lexico += '&';
	     			    lexico += '\0';
				 		proxC();
				 		tk = TKs['TKLogicalAnd'];
				 		return;
					}
				}
				if (caracter === '|'){ // verifica '||'
	             	proxC();
	             	if (caracter === '|'){ // ||
	             		lexico += '|';
	     			    lexico += '\0';
				 		proxC();
				 		tk = TKs['TKLogicalOr'];
				 		return;
					}
				}
				if (caracter === '"'){ // verifica '"'
					lexico += '"';
					lexico += '\0';
					proxC();
					tk = TKs['TKDoubleQuotes'];
					break;
				}
				if (caracter === '\n' || caracter === '\t' || caracter === ' '){
					lexico = lexico.slice(0, -1);
					proxC();
					break;
				}
				if (code.length === code_position){
					tk = -1;
					return true;
				}
				textareaElement.value += 'Erro léxico encontrado no caractere ' + lexico + ' (' + count_line + ', ' + count_column + ')' + '\n';
				erro_lexico = true;
				return;
            case 1:
                if (regexIdentificador.test(caracter)){
                    proxC();
					break;
                }
				if (caracter === '"') { // verifica '"'
					lexico += '"';
					lexico += '\0';
					proxC();
					tk = TKs['TKDoubleQuotes'];
					break;
				}

				lexico = lexico.slice(0, -1);
				tk = reserved_words[lexico.replace(/\s/g, '')];
				if (typeof tk === 'undefined') {
					tk = TKs['TKId'];
				}
				lexico += '\0';
				return;
        }
    }
}