TKs = {
    "TKId": 1,
    "TKVoid": 2,
    "TKInt": 3,
    "TKFloat": 4,
    "TKDouble": 5,
    "TKIf": 6,
    "TKElse": 7,
    "TKDo": 8,
    "TKWhile": 9,
    "TKFor": 10,
    "TKBreak": 11,
    "TKReturn": 12,
}


reserved_words = {
    "void": TKs['TKVoid'],
    "int": TKs['TKInt'],
    "float": TKs['TKFloat'],
    "double": TKs['TKDouble'],
    "if": TKs['TKIf'],
    "else": TKs['TKElse'],
    "do": TKs['TKDo'],
    "while": TKs['TKWhile'],
    "for": TKs['TKFor'],
    "break": TKs['TKBreak'],
    "return": TKs['TKReturn'],
    "end_reserved_words": TKs['TKId']
}



function compiler(){
    alert('oi');
    // Pega código digitado pelo usuário
    var code = editor.getValue();
    console.log(code);
}