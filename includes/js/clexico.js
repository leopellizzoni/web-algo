// Identificadores começam com uma letra ou sublinhado, seguido de letras, números ou sublinhados
var regexIdentificador = /[a-zA-Z_]\w*/;
// Expressão regular para identificar identificadores e números inteiros
var regexIdentificadorNumero = /[a-zA-Z_]\w*|\d+/;
// REGEX PRINTF
var regexPrintf = /%([+-]?(?:\d+|\*)?(?:\.\d+|\.\*)?(?:hh|h|l|ll|L|z|j|t)?[diuoxXfFeEgGaAcspn%])/g;
// Números inteiros
var regexNumero = /\d+/;
var regexNumeroInteiro = /^-?\d+$/;

function getToken(){
    var fim = false;
    var estado = 0;
	var loopInfinito = false;
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
					} else if (caracter === '=') { // '-='
						lexico += '=';
						lexico += '\0';
						proxC();
						tk = TKs['TKMenosIgual'];
						return;
					// } else if (regexNumero.test(caracter)){

						// lexico += caracter;
						// proxC();
						// while (regexNumero.test(caracter)){
						// 	lexico += caracter;
						// 	proxC();
						// }
						// if (caracter === '.'){ // double / float
						// 	lexico += caracter;
						// 	proxC();
						// 	while (regexNumero.test(caracter)){
						// 		lexico += caracter;
						// 		proxC();
						// 	}
						// 	lexico += '\0';
						// 	tk = TKs['TKCteDouble'];
						// 	return;
						// } else { // inteiro
						// 	lexico += '\0';
						// 	tk = TKs['TKCteInt'];
						// 	return;
						// }
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
	             	if (caracter === '=') { // '/='
						lexico += '=';
						lexico += '\0';
						proxC();
						tk = TKs['TKDivIgual'];
						return;
					} else if (caracter === '*') {
						lexico += '*';
						proxC();
						estado = 3;
						break;
					} else if (caracter === '/'){
						 lexico += '/';
						 proxC();
						 estado = 3;
						 break;
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
					if (caracter === '=') { // '<='
						lexico += '=';
						lexico += '\0';
						proxC();
						tk = TKs['TKMenorIgual'];
						return;
					} else if (regexIdentificador.test(caracter) && caracter === 's'){
						while (regexIdentificador.test(caracter)){
							lexico += caracter;
							proxC();
						}
						if (lexico === '<stdio'){
							if (caracter === '.'){
								lexico += caracter;
								proxC();
								if (caracter === 'h'){
									lexico += caracter;
									proxC();
									if (caracter === '>'){
										lexico += caracter;
										proxC();
										tk = TKs['TKStdioh'];
										return;
									}
								}
							}
						}
						dic_control['msg_erro'] = 'Erro léxico encontrado no caractere ' + lexico + ' (' + count_line + ', ' + count_column + ')' + '\n';
						erro_lexico = true;
						throw 'Erro léxico';

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
				if (caracter === '&'){ // verifica '&&' e '&'
	             	proxC();
	             	if (caracter === '&'){ // '&&'
	             		lexico += '&';
	     			    lexico += '\0';
				 		proxC();
				 		tk = TKs['TKLogicalAnd'];
				 		return;
					} else { // '&'
						lexico += '\0';
				 		tk = TKs['TKEnderecoVariavel'];
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
				if (caracter === '#'){ // verifica '#'
					proxC();
					while (regexIdentificador.test(caracter)){
                        lexico += caracter;
	                	proxC();
                    }
					if (lexico === '#define'){
						proxC();
						tk = TKs['TKDefine'];
						return;
					} else if (lexico === '#include'){
						proxC();
						tk = TKs['TKInclude'];
						return;
					} else {
						dic_control['msg_erro'] = 'Erro léxico encontrado no caractere ' + lexico + ' (' + count_line + ', ' + count_column + ')' + '\n';
						erro_lexico = true;
						throw 'Erro léxico';
					}
				}
				if (caracter === '"'){ // verifica '"'
					proxC();
					estado = 2;
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
				dic_control['msg_erro'] = 'Erro léxico encontrado no caractere ' + lexico + ' (' + count_line + ', ' + count_column + ')' + '\n';
				erro_lexico = true;
				throw 'Erro léxico';
			// Token
            case 1:
                if (regexIdentificadorNumero.test(caracter)){
                    proxC();
					break;
                }
				if (caracter === '"') { // verifica '"'
					lexico += '"';
					lexico += '\0';
					proxC();
					tk = TKs['TKString'];
					break;
				}

				lexico = lexico.slice(0, -1);
				tk = reserved_words[lexico.replace(/\s/g, '')];
				if (typeof tk === 'undefined') {
					tk = TKs['TKId'];
				}
				lexico += '\0';
				return;

			// String
			case 2:
				if (caracter === '%'){  // verifica parametro float, double ou int
					proxC();
					lexico += caracter;
					if (caracter === 'd'){  // integer
						lista_param_printf.push('int');
						proxC();
						break;
					}
					if (caracter === 'f'){  // float
						lista_param_printf.push('float');
						proxC();
						break;
					}
				}
				if (caracter === ' '){
					proxC();
					break;
				}
				if (caracter.includes("\\") ){
					proxC();
					lexico += caracter;
					if (caracter === 'n' || caracter === 't'){
						proxC();
						break;
					}
				}
				if (caracter === '"') { // verifica '"'
					lexico += '\0';
					tk = TKs['TKString'];
					proxC();
					return;
				}
				if (loopInfinito){
					return;
				}
				if (code.length === code_position){
					loopInfinito = true;
				}
				proxC();
				break;
			// Comentário
			case 3:
				if (caracter === '*') {
					proxC();
					if (caracter === '/') {
						proxC();
						return getToken();
					}
				} else if (caracter == '\n'){
					proxC();
					return getToken();
				} else if (caracter === ''){
					return getToken();
				} else {
					proxC();
					break;
				}
        }
    }
}