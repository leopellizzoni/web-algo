// Executa código intermediário de três endereços gerado pelo compilador

var historico_variaveis = {};
var variaveis = {};
var flag_saida_escrita = true;
let cancelarExecucao = false;

function getUserInput(signal) {
    return new Promise((resolve, reject) => {
        const inputElement = document.getElementById('inputText');
        signal.addEventListener('abort', () => {
            reject(new Error('Task was aborted'));
        });

        // Adiciona um event listener para a tecla "Enter"
        inputElement.addEventListener('keydown', function onEnter(event) {
            if (event.key === 'Enter') {
                // Resolve a Promise com o valor do input
                resolve(inputElement.value);
                textareaElement.value += inputElement.value + '\n';
                textareaElement.scrollTop = textareaElement.scrollHeight;

                // Remove o event listener após a resolução
                inputElement.removeEventListener('keydown', onEnter);

                // Limpa o campo de input para a próxima entrada
                inputElement.value = '';
            }
        });
    });
}

function calcula_argumentos(c3e) {
    let arg1;
    let arg2;
    // if (c3e.result === '@t159'){
    //     debugger;
    // }
    // TESTA ARGUMENTO 1
    if (regexNumero.test(String(c3e.arg1)[0])) {
        arg1 = c3e.arg1;
    } else {
        if (c3e.arg1.split('[')[0][0] !== '@') {
            let var_tabela_simbolos = tabela_de_simbolos[c3e.arg1.split('[')[0]];
            if (['vetor', 'matriz'].includes(var_tabela_simbolos['matriz_vetor'])) {
                let primeira_dimensao = c3e.arg1.split('[')[1].replace(']', '');
                let posicao_vetor;
                if (regexNumero.test(String(primeira_dimensao)[0])) {
                    posicao_vetor = primeira_dimensao;
                } else {
                    if (!(primeira_dimensao in variaveis)) {
                        variaveis[primeira_dimensao] = {'valor': 0};
                    }
                    posicao_vetor = variaveis[primeira_dimensao]['valor'];
                }
                let vetor = c3e.arg1.split('[')[0];
                if (var_tabela_simbolos['matriz_vetor'] === 'matriz') {
                    let segunda_dimensao = c3e.arg1.split('[')[2].replace(']', '');
                    let posicao_matriz;
                    if (regexNumero.test(String(segunda_dimensao)[0])) {
                        posicao_matriz = segunda_dimensao;
                    } else {
                        if (!(segunda_dimensao in variaveis)) {
                            variaveis[primeira_dimensao] = {'valor': 0};
                        }
                        posicao_matriz = variaveis[segunda_dimensao]['valor'];
                    }
                    arg1 = variaveis[vetor]['valor'][posicao_vetor][posicao_matriz];
                } else {
                    arg1 = variaveis[vetor]['valor'][posicao_vetor];
                }
            } else {
                if (!(c3e.arg1 in variaveis)) {
                    variaveis[c3e.arg1] = {'valor': 0};
                }
                arg1 = variaveis[c3e.arg1]['valor'];
            }
        } else {
            if (!(c3e.arg1 in variaveis)) {
                variaveis[c3e.arg1] = {'valor': 0};
            }
            arg1 = variaveis[c3e.arg1]['valor'];
        }
    }
    // TESTA ARGUMENTO 2
    if (regexNumero.test(String(c3e.arg2)[0])) {
        arg2 = c3e.arg2;
    } else {
        if (c3e.arg2.split('[')[0][0] !== '@') {
            let var_tabela_simbolos = tabela_de_simbolos[c3e.arg2.split('[')[0]];
            if (['vetor', 'matriz'].includes(var_tabela_simbolos['matriz_vetor'])) {
                let primeira_dimensao = c3e.arg2.split('[')[1].replace(']', '');
                let posicao_vetor;
                if (regexNumero.test(String(primeira_dimensao)[0])) {
                    posicao_vetor = primeira_dimensao;
                } else {
                    if (!(primeira_dimensao in variaveis)) {
                        variaveis[primeira_dimensao] = {'valor': 0};
                    }
                    posicao_vetor = variaveis[primeira_dimensao]['valor'];
                }
                let vetor = c3e.arg2.split('[')[0];
                if (var_tabela_simbolos['matriz_vetor'] === 'matriz') {
                    let segunda_dimensao = c3e.arg2.split('[')[2].replace(']', '');
                    let posicao_matriz;
                    if (regexNumero.test(String(segunda_dimensao)[0])) {
                        posicao_matriz = segunda_dimensao;
                    } else {
                        if (!(segunda_dimensao in variaveis)) {
                            variaveis[primeira_dimensao] = {'valor': 0};
                        }
                        posicao_matriz = variaveis[segunda_dimensao]['valor'];
                    }
                    arg2 = variaveis[vetor]['valor'][posicao_vetor][posicao_matriz];
                } else {
                    arg2 = variaveis[vetor]['valor'][posicao_vetor];
                }
            } else {
                arg2 = variaveis[c3e.arg2]['valor'];
            }
        } else {
            arg2 = variaveis[c3e.arg2]['valor'];
        }
    }
    if (c3e.op === '+') {
        return Number(arg1) + Number(arg2);
    }
    if (c3e.op === '-') {
        return Number(arg1) - Number(arg2);
    }
    if (c3e.op === '/') {
        return Number(arg1) / Number(arg2);
    }
    if (c3e.op === '*') {
        return Number(arg1) * Number(arg2);
    }
    if (c3e.op === '%') {
        return Number(arg1) % Number(arg2);
    }
    if (c3e.op === '>') {
        return Number(arg1) > Number(arg2) ? 1 : 0;
    }
    if (c3e.op === '>=') {
        return Number(arg1) >= Number(arg2) ? 1 : 0;
    }
    if (c3e.op === '<') {
        return Number(arg1) < Number(arg2) ? 1 : 0;
    }
    if (c3e.op === '<=') {
        return Number(arg1) <= Number(arg2) ? 1 : 0;
    }
    if (c3e.op === '==') {
        return Number(arg1) == Number(arg2) ? 1 : 0;
    }
    if (c3e.op === '!=') {
        return Number(arg1) != Number(arg2) ? 1 : 0;
    }
    if (c3e.op === '&&') {
        return Number(arg1) && Number(arg2) ? 1 : 0;
    }
    if (c3e.op === '||') {
        return Number(arg1) || Number(arg2) ? 1 : 0;
    }

}

function formataStringFloat(template, values) {
    let index = 0;
    return template.replace(/%f/g, () => {
        if (values[index].replace(')', '').split('[')[0] in variaveis) {
            if (values[index].replace(')', '').split('[')[0][0] !== '@') {
                let var_tabela_simbolos = tabela_de_simbolos[values[index].replace(')', '').split('[')[0]];
                if (['vetor', 'matriz'].includes(var_tabela_simbolos['matriz_vetor'])) {
                    let primeira_dimensao = values[index].replace(')', '').split('[')[1].replace(']', '');
                    let posicao_vetor;
                    if (regexNumero.test(String(primeira_dimensao)[0])) {
                        posicao_vetor = primeira_dimensao;
                    } else {
                        if (!(primeira_dimensao in variaveis)) {
                            console.log('não tem variavel no array');
                        }
                        posicao_vetor = variaveis[primeira_dimensao]['valor'];
                    }
                    let vetor = values[index].replace(')', '').split('[')[0];
                    if (var_tabela_simbolos['matriz_vetor'] === 'matriz') {
                        let segunda_dimensao = values[index].replace(')', '').split('[')[2].replace(']', '');
                        let posicao_matriz;
                        if (regexNumero.test(String(segunda_dimensao)[0])) {
                            posicao_matriz = segunda_dimensao;
                        } else {
                            if (!(segunda_dimensao in variaveis)) {
                                console.log('não tem variavel no array');
                            }
                            posicao_matriz = variaveis[segunda_dimensao]['valor'];
                        }
                        return Number(variaveis[vetor]['valor'][posicao_vetor][posicao_matriz]).toFixed(5);;
                    }
                    return Number(variaveis[vetor]['valor'][posicao_vetor]).toFixed(5);;
                } else {
                    return Number(variaveis[values[index++].replace(')', '')].valor).toFixed(5);;
                }
            } else {
                return Number(variaveis[values[index++].replace(')', '')].valor).toFixed(5);;
            }
        } else if (regexNumero.test(String(values[index][0]))) {
            return Number(values[index]).toFixed(5);
        } else {
            return '&falha';
        }
    });
}

function formataStringInt(template, values) {
    let index = 0;
    return template.replace(/%d/g, () => {
        if (values[index].replace(')', '').split('[')[0] in variaveis) {
            if (values[index].replace(')', '').split('[')[0][0] !== '@') {
                let var_tabela_simbolos = tabela_de_simbolos[values[index].replace(')', '').split('[')[0]];
                if (['vetor', 'matriz'].includes(var_tabela_simbolos['matriz_vetor'])) {
                    let primeira_dimensao = values[index].replace(')', '').split('[')[1].replace(']', '');
                    let posicao_vetor;
                    if (regexNumero.test(String(primeira_dimensao)[0])) {
                        posicao_vetor = primeira_dimensao;
                    } else {
                        if (!(primeira_dimensao in variaveis)) {
                            console.log('não tem variavel no array');
                        }
                        posicao_vetor = variaveis[primeira_dimensao]['valor'];
                    }
                    let vetor = values[index].replace(')', '').split('[')[0];
                    if (var_tabela_simbolos['matriz_vetor'] === 'matriz') {
                        let segunda_dimensao = values[index].replace(')', '').split('[')[2].replace(']', '');
                        let posicao_matriz;
                        if (regexNumero.test(String(segunda_dimensao)[0])) {
                            posicao_matriz = segunda_dimensao;
                        } else {
                            if (!(segunda_dimensao in variaveis)) {
                                console.log('não tem variavel no array');
                            }
                            posicao_matriz = variaveis[segunda_dimensao]['valor'];
                        }
                        return Math.floor(variaveis[vetor]['valor'][posicao_vetor][posicao_matriz]);
                    }
                    return Math.floor(variaveis[vetor]['valor'][posicao_vetor]);
                } else {
                    return Math.floor(variaveis[values[index++].replace(')', '')].valor);
                }
            } else {
                return Math.floor(variaveis[values[index++].replace(')', '')].valor);
            }
        } else if (regexNumero.test(String(values[index][0]))) {
            return Math.floor(Number(values[index]));
        } else {
            return '&falha';
        }
    });
}

function formataStringQuebraLinha(template) {
    return template.replace(/\\n/g, '\n').replace(/\\t/g, '\t');
}

let index_goto = {};

function indexa_linhas(codigo_c3e) {
    let c3e;
    for (let i = 0; i < codigo_c3e.length; i++) {
        c3e = codigo_c3e[i];
        if (c3e.label) {
            index_goto[c3e.result] = i;
        }
    }
}


function inicializa_matriz(tam_vetor, tam_matriz){
    let vetor = [];
    for (let i = 0; i < tam_vetor; i++) {
        vetor.push([]);
        for (let j = 0; j < tam_matriz; j++) {
            vetor[i].push('');
        }
    }
    return vetor;
}


function inicializa_vetor(tam_vetor) {
    let vetor = [];
    for (let i = 0; i < tam_vetor; i++) {
        vetor.push('');
    }
    return vetor;
}

async function executaC3E(codigo_c3e, signal) {
    if (signal.aborted) {
        throw new Error('Task was aborted before it started');
    }
    let c3e;
    let arg1;
    indexa_linhas(codigo_c3e);
    for (let i = 0; i < codigo_c3e.length; i++) {
        if (cancelarExecucao) {
            break;
        }
        c3e = codigo_c3e[i];
        if (c3e.label) {
            continue;
        } else if (c3e.salto) {
            if (c3e.result == 'goto') {
                i = index_goto[c3e.arg1] - 1;
                continue;
            } else {
                if (!variaveis[c3e.arg1].valor) {
                    i = index_goto[c3e.arg2] - 1;
                    continue;
                }
            }
        } else if (c3e.escrita) {
            let quebra_printf = c3e.result.split(',');
            let string = quebra_printf[0].split('"')[1];
            // Passo 1: Pegar todas as posições após a primeira posição
            let novoArrayQuebra_printf = quebra_printf.slice(1);

            // Passo 2: Remover o último caractere da última string do novo array
            if (novoArrayQuebra_printf.length > 0) {
                let ultimaString = novoArrayQuebra_printf[novoArrayQuebra_printf.length - 1];
                novoArrayQuebra_printf[novoArrayQuebra_printf.length - 1] = ultimaString.slice(0, -1);
            }
            let formatarString = formataStringInt(string, novoArrayQuebra_printf);
            formatarString = formataStringFloat(formatarString, novoArrayQuebra_printf);
            formatarString = formataStringQuebraLinha(formatarString);
            if (flag_saida_escrita) {
                textareaElement.value += 'Saída de escrita:' + '\n';
                flag_saida_escrita = false;
            }
            dic_control["printf"] += formatarString.replace(/"/g, '');
            textareaElement.value += formatarString.replace(/"/g, '');
            textareaElement.scrollTop = inputElement.scrollHeight;
        } else if (c3e.leitura) {
            let quebra_scanf = c3e.result.split(',');
            // Passo 1: Pegar todas as posições após a primeira posição
            let novoArrayQuebra_scanf = quebra_scanf.slice(1);
            // Passo 2: Remover o último caractere da última string do novo array
            if (novoArrayQuebra_scanf.length > 0) {
                let ultimaString = novoArrayQuebra_scanf[novoArrayQuebra_scanf.length - 1];
                novoArrayQuebra_scanf[novoArrayQuebra_scanf.length - 1] = ultimaString.slice(0, -1);
            }
            let values = novoArrayQuebra_scanf;
            for (let i = 0; i < values.length; i++) {
                $("#inputText").focus();
                textareaElement.value += 'Digite um valor para variável ' + values[i] + ': ';
                // Espera pela entrada do usuário
                userInput = await getUserInput(signal);
                let var_tabela_simbolos = tabela_de_simbolos[values[i].split('[')[0]];
                if (['vetor', 'matriz'].includes(var_tabela_simbolos['matriz_vetor'])) {
                    let var_vetor;
                    if (values[i].split('[')[0] in variaveis) {
                        var_vetor = variaveis[values[i].split('[')[0]]['valor'];
                    } else {
                        let tam_vetor;
                        if (regexNumero.test(String(var_tabela_simbolos['dimensao'][1])[0])) {
                            tam_vetor = Number(var_tabela_simbolos['dimensao'][1]);
                        } else {
                            tam_vetor = Number(variaveis[var_tabela_simbolos['dimensao'][1]]['valor']);
                        }
                        if (var_tabela_simbolos['matriz_vetor'] === 'vetor') {
                            var_vetor = inicializa_vetor(tam_vetor);
                        } else {
                            let tam_matriz;
                            if (regexNumero.test(String(var_tabela_simbolos['dimensao'][2])[0])) {
                                tam_matriz = Number(var_tabela_simbolos['dimensao'][2]);
                            } else {
                                tam_matriz = Number(variaveis[var_tabela_simbolos['dimensao'][2]]['valor']);
                            }
                            var_vetor = inicializa_matriz(tam_vetor, tam_matriz);
                        }

                    }
                    let primeira_dimensao = values[i].split('[')[1].replace(']', '');
                    if (var_tabela_simbolos['matriz_vetor'] === 'vetor') {
                        var_vetor[Number(variaveis[primeira_dimensao]['valor'])] = userInput;
                    } else {
                        let segunda_dimensao = values[i].split('[')[2].replace(']', '');
                        var_vetor[Number(variaveis[primeira_dimensao]['valor'])][Number(variaveis[segunda_dimensao]['valor'])] = userInput;
                    }

                    variaveis[values[i].split('[')[0]] = {'valor': var_vetor};
                    //historico de variavel
                    if (values[i].split('[')[0] in historico_variaveis){
                        historico_variaveis[values[i].split('[')[0]].push(variaveis[values[i].split('[')[0]].valor);
                    } else {
                        historico_variaveis[values[i].split('[')[0]] = [variaveis[values[i].split('[')[0]].valor];
                    }
                } else {
                    variaveis[values[i]] = {'valor': userInput};
                    //historico de variavel
                    if (values[i] in historico_variaveis){
                        historico_variaveis[values[i]].push(variaveis[values[i]].valor);
                    } else {
                        historico_variaveis[values[i]] = [variaveis[values[i]].valor];
                    }
                }
            }
        } else {
            // Verifica Identifcador
            if (c3e.result[0] == '@') {
                // Variável temporária
                variaveis[c3e.result] = {'valor': calcula_argumentos(c3e)};
            } else {
                if (c3e.arg2) {
                    variaveis[c3e.result] = {'valor': calcula_argumentos(c3e)};
                    //historico de variavel
                    if (c3e.result in historico_variaveis){
                        historico_variaveis[c3e.result].push(variaveis[c3e.result].valor);
                    } else {
                        historico_variaveis[c3e.result] = [variaveis[c3e.result].valor];
                    }
                } else {
                    if (regexNumero.test(c3e.arg1[0])) {
                        arg1 = c3e.arg1;
                    } else {

                        if (c3e.arg1.split('[')[0][0] !== '@') {
                            let var_tabela_simbolos = tabela_de_simbolos[c3e.arg1.split('[')[0]];
                            if (['vetor', 'matriz'].includes(var_tabela_simbolos['matriz_vetor'])) {
                                let primeira_dimensao = c3e.arg1.split('[')[1].replace(']', '');
                                let posicao_vetor;
                                if (regexNumero.test(String(primeira_dimensao)[0])) {
                                    posicao_vetor = primeira_dimensao;
                                } else {
                                    if (!(primeira_dimensao in variaveis)) {
                                        variaveis[primeira_dimensao] = {'valor': 0};
                                        console.log('não tem variavel no array');
                                    }
                                    posicao_vetor = variaveis[primeira_dimensao]['valor'];
                                }
                                let vetor = c3e.arg1.split('[')[0];
                                if (var_tabela_simbolos['matriz_vetor'] === 'matriz') {
                                    let segunda_dimensao = c3e.arg1.split('[')[2].replace(']', '');
                                    let posicao_matriz;
                                    if (regexNumero.test(String(segunda_dimensao)[0])) {
                                        posicao_matriz = segunda_dimensao;
                                    } else {
                                        if (!(segunda_dimensao in variaveis)) {
                                            variaveis[segunda_dimensao] = {'valor': 0};
                                            console.log('não tem variavel no array');
                                        }
                                        posicao_matriz = variaveis[segunda_dimensao]['valor'];
                                    }
                                    arg1 = variaveis[vetor]['valor'][posicao_vetor][posicao_matriz];
                                } else {
                                    arg1 = variaveis[vetor]['valor'][posicao_vetor];
                                }
                            } else {
                                if (!(c3e.arg1 in variaveis)) {
                                    variaveis[c3e.arg1] = {'valor': 0};
                                }
                                arg1 = variaveis[c3e.arg1]['valor'];
                            }
                        } else {
                            arg1 = variaveis[c3e.arg1]['valor'];
                        }
                    }
                    if (c3e.result.split('[')[0][0] !== '@') {
                        let var_tabela_simbolos = tabela_de_simbolos[c3e.result.split('[')[0]];
                        if (['vetor', 'matriz'].includes(var_tabela_simbolos['matriz_vetor'])) {
                            let primeira_dimensao = c3e.result.split('[')[1].replace(']', '');
                            let posicao_vetor;
                            if (regexNumero.test(String(primeira_dimensao)[0])) {
                                posicao_vetor = primeira_dimensao;
                            } else {
                                if (!(primeira_dimensao in variaveis)) {
                                    variaveis[primeira_dimensao] = {'valor': 0};
                                    console.log('não tem variavel no array');
                                }
                                posicao_vetor = variaveis[primeira_dimensao]['valor'];
                            }
                            let vetor = c3e.result.split('[')[0];
                            if (var_tabela_simbolos['matriz_vetor'] === 'matriz') {
                                let segunda_dimensao = c3e.result.split('[')[2].replace(']', '');
                                let posicao_matriz;
                                if (regexNumero.test(String(segunda_dimensao)[0])) {
                                    posicao_matriz = segunda_dimensao;
                                } else {
                                    if (!(segunda_dimensao in variaveis)) {
                                        variaveis[segunda_dimensao] = {'valor': 0};
                                        console.log('não tem variavel no array');
                                    }
                                    posicao_matriz = variaveis[segunda_dimensao]['valor'];
                                }
                                variaveis[vetor]['valor'][posicao_vetor][posicao_matriz] = arg1;
                            } else {
                                variaveis[vetor]['valor'][posicao_vetor] = arg1;
                            }
                        } else {
                            variaveis[c3e.result] = {'valor': arg1};
                            //historico de variavel
                            if (c3e.result in historico_variaveis){
                                historico_variaveis[c3e.result].push(variaveis[c3e.result].valor);
                            } else {
                                historico_variaveis[c3e.result] = [variaveis[c3e.result].valor];
                            }
                        }
                    } else {
                        variaveis[c3e.result] = {'valor': arg1};
                        //historico de variavel
                        if (c3e.result in historico_variaveis){
                            historico_variaveis[c3e.result].push(variaveis[c3e.result].valor);
                        } else {
                            historico_variaveis[c3e.result] = [variaveis[c3e.result].valor];
                        }
                    }
                }
            }
        }
    }
}