
var pessoa = {
  nome: ['Bob', 'Smith'],
  idade: 32,
  sexo: 'masculino',
  interesses: ['música', 'esquiar'],
  bio: function() {
    alert(this.nome[0] + ' ' + this.nome[1] + ' tem ' + this.idade + ' anos de idade. Ele gosta de ' + this.interesses[0] + ' e ' + this.interesses[1] + '.');
  },
  saudacao: function() {
    alert('Oi! Eu sou ' + this.nome[0] + '.');
  }
};

pessoa.idade = 45;
pessoa['nome']['ultimo'] = 'Cratchit';

var name = "kittens";
if (name == "puppies") {
  name += "!";
} else if (name == "kittens") {
  name += "!!";
} else {
  name = "!" + name;
}
name == "kittens!!";

var allowed = (age > 18) ? "yes" : "no";

switch(action) {
    case 'draw':
        drawit();
        break;
    case 'eat':
        eatit();
        break;
    default:
        donothing();
}

var obj = new Object();

var obj2 = {};


obj.name = "Simon";
var name = obj.name;

obj2["name"] = "Will";
var name2 = obj2["name"];

var obj = {
    name: "Carrot",
    "for": "Max",
    details: {
        color: "orange",
        size: 12
    }
}

obj.details.color
orange
obj["details"]["size"]
12


var a = new Array();
 a[0] = "dog";
 a[1] = "cat";
 a[2] = "hen";
 a.length
3


/*
arrays....
Nome do método	Descrição
a.toString()	Retorna uma string com o toString()de cada elemento separado por vírgulas.
a.toLocaleString()	Retorna uma string com o toLocaleString()de cada elemento separado por vírgulas.
a.concat(item[, itemN])	Retorna um novo vetor com os itens adicionados nele.
a.join(sep)	Converte um vetor em uma string com os valores do vetor separados pelo valor do parâmetro sep
a.pop()	Remove e retorna o último item.
a.push(item[, itemN])	Push adiciona um ou mais itens ao final.
a.reverse()	Reverte o vetor
a.shift()	Remove e retorna o primeiro item
a.slice(start, end)	Retorna um sub-vetor.
a.sort([cmpfn])	Prover uma função opcional para fazer a comparação.
a.splice(start, delcount[, itemN])	Permite que você modifique um vetor por apagar uma seção e substituí-lo com mais itens.
a.unshift([item])	Acrescenta itens ao começo do vetor.
*/


function add(x, y) {
    var total = x + y;
    return total;
}

// ou

var avg = function() {
    var sum = 0;
    for (var i = 0, j = arguments.length; i < j; i++) {
        sum += arguments[i];
    }
    return sum / arguments.length;
}

function countChars(elm) {
    if (elm.nodeType == 3) { // TEXT_NODE
        return elm.nodeValue.length;
    }
    var count = 0;
    for (var i = 0, child; child = elm.childNodes[i]; i++) {
        count += countChars(child);
    }
    return count;
}

// ou

var charsInBody = (function counter(elm) {
    if (elm.nodeType == 3) { // TEXT_NODE
        return elm.nodeValue.length;
    }
    var count = 0;
    for (var i = 0, child; child = elm.childNodes[i]; i++) {
        count += counter(child);
    }
    return count;
})(document.body);

// ***********************

function makePerson(first, last) {
    return {
        first: first,
        last: last
    }
}
function personFullName(person) {
    return person.first + ' ' + person.last;
}
function personFullNameReversed(person) {
    return person.last + ', ' + person.first
}
s = makePerson("Simon", "Willison");
 personFullName(s)
//Simon Willison
 personFullNameReversed(s)
//Willison, Simon

var convenio = (function gritar(){
        alert('oi');
});


//********************

var s = "Simon";
 s.reversed()
//TypeError on line 1: s.reversed is not a function
String.prototype.reversed = function() {
    var r = "";
    for (var i = this.length - 1; i >= 0; i--) {
        r += this[i];
    }
    return r;
}
> s.reversed()
//nomiS*/


"This can now be reversed".reversed()
// desrever eb won nac sihT




