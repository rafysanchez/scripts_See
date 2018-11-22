"use strict";

$.ajaxSetup({
	cache: false
});

$(document).ajaxStart(function () {
	if (!Mensagem.ObtendoMensagensAutomaticas)
		AbrirMensagemCarregandoPagina();
});

$(document).ajaxStop(function () {
	if (Mensagem.ObtendoMensagensAutomaticas)
		return;
	if (!Mensagem.IgnorarMensagensAutomaticas)
		Mensagem.CarregarMensagens();
	else if (Mensagem.ExibindoCarregandoPagina)
		FecharMensagemCarregandoPagina();
});

function cancelEvent(e) {
	if ("isCancelled" in e)
		e.isCancelled = true;
	if ("preventDefault" in e)
		e.preventDefault();
	if ("stopPropagation" in e)
		e.stopPropagation();
	return false;
}

function resetForm(f) {
	var $form = $(f), i, form, validator;
	if (!$form || !$form.length)
		return;
	for (i = $form.length - 1; i >= 0; i--)
		$form[i].reset();
	$form.find("label.error").remove();
	$form.find(".error").removeClass("error");
	$form.find(".valid").removeClass("valid");
	validator = $form.validate();
	if (validator) {
		validator.resetForm();
		validator.formSubmitted = false;
	}
}

window.isIE = function () {
	// Para executar a consulta apenas uma vez! :)
	window.isIE = ((navigator.appName == 'Microsoft Internet Explorer' || !!(navigator.userAgent.match(/Trident/) || navigator.userAgent.match(/rv:11/))) ?
		function () { return true; } :
		function () { return false; });
	return window.isIE();
}

window.trim = (function () {
	var brancos = /^\s+|\s+$/g;
	return function (x) {
		return x.replace(brancos, "");
	}
})();

function gerarEndereco(rua, numero, bairro, cep, cidade, uf) {
	var endereco = trim(rua), temp;

	if (numero) {
		temp = trim(numero);
		if (temp && endereco)
			endereco += ", " + temp;
	}

	if (bairro) {
		temp = trim(bairro);
		if (temp)
			endereco = (endereco ? (endereco + ", " + temp) : temp);
	}

	if (cep) {
		temp = trim(cep);
		if (temp)
			endereco = (endereco ? (endereco + ", " + temp) : temp);
	}

	if (cidade) {
		temp = trim(cidade);
		if (temp)
			endereco = (endereco ? (endereco + ", " + temp) : temp);
	}

	if (uf) {
		temp = trim(uf);
		if (temp)
			endereco = (endereco ? (endereco + ", " + temp) : temp);
	}

	return endereco;
}

$.datepicker.regional["pt-BR"] = {
	closeText: "Fechar",
	prevText: "Anterior",
	nextText: "Próximo",
	currentText: "Hoje",
	monthNames: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"],
	monthNamesShort: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
	dayNames: ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"],
	dayNamesShort: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"],
	dayNamesMin: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"],
	weekHeader: "Sm",
	dateFormat: "dd/mm/yy", // *DEVE* ser yy (coisa do datepicker... mesmo assim, ele irá mostrar 4 dígitos)
	firstDay: 0,
	isRTL: false,
	showMonthAfterYear: false,
	yearSuffix: ""
};

$.datepicker.setDefaults($.datepicker.regional["pt-BR"]);

function datepickerIntervalo(dtInicio, dtFim, options) {
	if (!dtInicio || !dtFim) return;
	var $dtInicio = $(dtInicio), $dtFim = $(dtFim);
	if (!$dtInicio.length || !$dtFim.length) return;
	$dtInicio.mask("99/99/9999").datepicker(options || {}).on("change", function () {
		$dtFim.datepicker("option", "minDate", parseDate(this.value));
	});
	$dtFim.mask("99/99/9999").datepicker(options || {}).on("change", function () {
		$dtInicio.datepicker("option", "maxDate", parseDate(this.value));
	});
}

$.validator.addMethod("dataValida", function (value, element) {
	return (!value.length || (parseDate(value) !== null));
}, "Data inválida");

$.validator.addMethod("dataNascimento", function (value, element) {
	var data, hoje;
	if (!value.length)
		return true;
	if (!(data = parseDate(value)))
		return false;
	hoje = new Date();
	hoje = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
	return (data.getTime() < hoje.getTime());
}, "Data inválida");

$.validator.addMethod("validarDataInicio", function (valor, dataInicio, dataFimInput) {
	if (!value.length || $(dataFimInput).val() == "") return true;
	var dtIniVigencia = valor.substring(6) + valor.substring(3, 5) + valor.substring(0, 2),
		dtFimVigencia = $(dataFimInput).val().substring(6) + $(dataFimInput).val().substring(3, 5) + $(dataFimInput).val().substring(0, 2);
	return (dtFimVigencia > dtIniVigencia);
}, "Data início não pode ser maior que data fim");

$.validator.addMethod("nome", function (value, element) {
	return (!value.length || value.match(/^[ a-zA-Z ÁáÉéÍíÓóÃãÂâÊêÔôÚúç]*$/gi));
}, "Caractere inválido");

$.validator.addMethod("letras", function (value, element) {
	return (!value.length || value.match(/^[a-zA-Z]*$/gi));
}, "Informe apenas letras");

$.validator.addMethod("numeros", function (value, element) {
	return (!value.length || value.match(/^[0-9]*$/gi));
}, "Informe apenas números");

$.validator.addMethod("maiorQue", function (value, element, param) {
	return (!value.length || value > parseFloat(param[0]));
}, $.validator.format("Valor deve ser maior que {0}"));

$.validator.addMethod("RG", function (value, element) {
	return (!value.length || value.match(/^[A-Za-z]?[A-Za-z]?[0]*[1-9][0-9][0-9][0-9]+$/gi));
}, "Caractere inválido");

$.validator.addMethod("RA", function (value, element) {
	return (!value.length || value.match(/^[0]*[A-Za-z]?[A-Za-z]?[0-9][0-9][0-9]+$/gi)); //return (!value.length || value.match(/^[0-9]*$/gi));
}, "Caractere inválido");

$.validator.addMethod("digRG", function (value, element) {
	return (!value.length || value.match(/^[0-9xX]*$/gi));
}, "Dígito inválido");

$.validator.addMethod("digRA", function (value, element) {
	return (!value.length || value.match(/^[0-9xX]*$/gi));
}, "Dígito inválido");

$.validator.addMethod("ano", function (value, element) {
	var ano = parseInt(value);
	return (!value.length || (ano >= 1000 && ano <= 9999));
}, "Ano inválido");

$.validator.addMethod("anoAtual", function (value, element) {
	return (!value.length || value == (new Date()).getFullYear());
}, "Ano inválido");

$.validator.addMethod("anoAtualOuPosterior", function (value, element) {
	var anoAtual = (new Date()).getFullYear();
	return (!value.length || (value == anoAtual || value == (anoAtual + 1)));
}, "Ano inválido");

$.validator.addMethod("cep", function (value, element) {
	return (!value.length || value.match(/^\d{5}\-?\d{3}$/gi));
}, "CEP inválido");

$.validator.addMethod("endereco", function (value, element) {
	return (!value.length || value.match(/^[ a-zA-Z ÁáÉéÍíÓóÃãÂâÊêÔôÚúç 0-9]*$/gi));
}, "Endereço inválido");

$.validator.addMethod("numEndereco", function (value, element) {
	return (!value.length || value.match(/^[ a-zA-Z0-9]*$/gi));
}, "Número de endereço inválido");

$.validator.addMethod("url", function (value, element) {
	return (!value.length || value.match(/^(http:\/\/www.|https:\/\/www.|ftp:\/\/www.){1}([0-9A-Za-z]+\.)/gi));
}, "URL inválida");

$.validator.addMethod("cpf", function (value, element) {
	if (value.length == 0)
		return true;

	var cpf = value, add, rev, i;

	cpf = cpf.replace(/[^\d]+/g, "");

	if (cpf == "") return false;

	// Elimina CPFs invalidos conhecidos
	if (cpf.length != 11 ||
		cpf == "00000000000" ||
		cpf == "11111111111" ||
		cpf == "22222222222" ||
		cpf == "33333333333" ||
		cpf == "44444444444" ||
		cpf == "55555555555" ||
		cpf == "66666666666" ||
		cpf == "77777777777" ||
		cpf == "88888888888" ||
		cpf == "99999999999")
		return false;

	// Valida 1o digito
	add = 0;
	for (i = 0; i < 9; i++)
		add += parseInt(cpf.charAt(i)) * (10 - i);
	rev = 11 - (add % 11);
	if (rev == 10 || rev == 11)
		rev = 0;
	if (rev != parseInt(cpf.charAt(9)))
		return false;

	// Valida 2o digito
	add = 0;
	for (i = 0; i < 10; i++)
		add += parseInt(cpf.charAt(i)) * (11 - i);
	rev = 11 - (add % 11);
	if (rev == 10 || rev == 11)
		rev = 0;
	if (rev != parseInt(cpf.charAt(10)))
		return false;

	return true;
}, "CPF inválido");

$.validator.addMethod("horaValida", function (value, element) {
	return (!value.length || value.match(/^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/gi));
}, "Hora inválida");

$.validator.addMethod("horaValidaDe5Em5Minutos", function (value, element) {
	return (!value.length || value.match(/^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0,5]$/gi));
}, "Hora inválida");

$.validator.addMethod("VerificaQuantidadeLetraRG", function (value, element) {
	return !(valor.match(/([0-9]*[A-Za-z][0-9]*){4}$/));
}, "RG inválido");

(function () {
	function extrairData(x) {
		if (typeof x === "string") return parseDate(x);
		else if (Date == x.constructor) return x;
		return parseDate($(x).val());
	}
	function validarData(a, b, comp) {
		var da, db;
		if (a && b) {
			db = extrairData(b);
			return ((da = parseDate(a)) && db && comp(da.getTime(), db.getTime()));
		}
		return true;
	}
	function exibirMsgData(msg) {
		return function (x) {
			var dt = extrairData(x);
			if (!dt)
				return msg;
			return msg + (dt.getDate() + "/" + (dt.getMonth() + 1) + "/" + dt.getFullYear());
		};
	}
	$.validator.addMethod("dataMaiorQue", function (value, element, param) {
		return validarData(value, param, function (a, b) { return (a > b); });
	}, exibirMsgData("Data deve ser maior que "));

	$.validator.addMethod("dataMenorQue", function (value, element, param) {
		return validarData(value, param, function (a, b) { return (a < b); });
	}, exibirMsgData("Data deve ser menor que "));

	$.validator.addMethod("dataMaiorOuIgual", function (value, element, param) {
		return validarData(value, param, function (a, b) { return (a >= b); });
	}, exibirMsgData("Data deve ser maior ou igual a "));

	$.validator.addMethod("dataMenorOuIgual", function (value, element, param) {
		return validarData(value, param, function (a, b) { return (a <= b); });
	}, exibirMsgData("Data deve ser menor ou igual a "));
})();

$.extend($.validator.messages, {
	required: "Obrigatório",
	remote: "Corrija o valor do campo",
	email: "E-mail inválido",
	url: "URL inválida",
	date: "Data inválida",
	dateISO: "Data inválida (aaaa-mm-dd)",
	number: "Número inválido",
	digits: "Apenas dígitos",
	creditcard: "Cartão de crédito inválido",
	equalTo: "Valor não confere",
	accept: "Valor inválido",
	maxlength: $.validator.format("No máximo {0} caracteres"),
	minlength: $.validator.format("Pelo menos {0} caracteres"),
	rangelength: $.validator.format("Valor deve conter entre {0} e {1} caracteres"),
	range: $.validator.format("Entre {0} e {1}"),
	max: $.validator.format("Menor ou igual a {0}"),
	min: $.validator.format("Maior ou igual a {0}")
});

function ValidaData(element) {
	return (!element.value || element.value.match(/^(((0[1-9]|[12]\d|3[01])\/(0[13578]|1[02])\/((19|[2-9]\d)\d{2}))|((0[1-9]|[12]\d|30)\/(0[13456789]|1[012])\/((19|[2-9]\d)\d{2}))|((0[1-9]|1\d|2[0-8])\/02\/((19|[2-9]\d)\d{2}))|(29\/02\/((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))))$/));
}

function parseDate(txtData) {
	if (!txtData)
		return null;

	var dtArray = txtData.match(/^(\d{1,2})(\/|-)(\d{1,2})(\/|-)(\d{4})$/), dtMonth, dtDay, dtYear, isleap;

	if (!dtArray || !dtArray.length)
		return null;

	// Verifica formato dd/mm/yyyy
	dtDay = parseInt(dtArray[1]);
	dtMonth = parseInt(dtArray[3]);
	dtYear = parseInt(dtArray[5]);

	if (isNaN(dtDay) || isNaN(dtMonth) || isNaN(dtYear)) {
		return null;
	} else if (dtMonth < 1 || dtMonth > 12) {
		return null;
	} else if (dtDay < 1 || dtDay > 31) {
		return null;
	} else if ((dtMonth === 4 || dtMonth === 6 || dtMonth === 9 || dtMonth === 11) && dtDay === 31) {
		return null;
	} else if (dtMonth === 2) {
		isleap = (dtYear % 4 === 0 && (dtYear % 100 !== 0 || dtYear % 400 === 0));
		if (dtDay > 29 || (dtDay === 29 && !isleap))
			return null;
	}
	return new Date(dtYear, dtMonth - 1, dtDay);
}

window.parseData = parseDate;

function eData(txtData) {
	return (parseDate(txtData) !== null);
}

$.fn.VerificaNumero = function () {
	$(this).keypress(function (e) {
		if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57))
			return false;
	});

	return $(this);
}

function AplicarMascaras() {
	// É melhor passar uma única vez pela estrutura do DOM,
	// e varrer as classes, do que varrer a estrutura do DOM
	// várias vezes, procurando por uma única classe!
	var i, j, inputs, input, maxlength, mask, raBlur = function () {
		var v = $(this).val();
		if (v && v.length) {
			v = "000000000000" + v;
			$(this).val(v.substr(v.length - 12));
		}
	}, raOptions = {
		translation: {
			'z': { pattern: /0/, optional: true },
			'L': { pattern: /[a-zA-Z]/, optional: true }
		}
	};
	inputs = document.getElementsByTagName("INPUT");
	if (!inputs || !inputs.length)
		return;
	for (i = inputs.length - 1; i >= 0; i--) {
		input = $(inputs[i]);
		if (input.hasClass("anoLetivo")) {
			input.mask("9999");
		} else if (input.hasClass("notaPremio")) {
			input.mask("99");
		} else if (input.hasClass("numero")) {
			mask = "9";
			maxlength = parseInt(inputs[i].getAttribute("maxlength"));
			if (maxlength && !isNaN(maxlength)) {
				for (j = 1; j < maxlength; j++)
					mask += "9";
			}
			input.mask(mask);
		} else if (input.hasClass("data")) {
			input.mask("99/99/9999").datepicker();
		} else if (input.hasClass("hora")) {
			input.mask("99:99");
		} else if (input.hasClass("cpf")) {
			input.mask("000.000.000-00");
		} else if (input.hasClass("cep")) {
			input.mask("99999-999");
		} else if (input.hasClass("dinheiro")) {
			input.mask("#.##0,00", { reverse: true });
		} else if (input.hasClass("telefone")) {
			input.mask("(99) 9999-9999?9").one("keypress", MascaraTelefone);
		} else if (input.hasClass("ra")) {
			//input.mask("999999999999").bind("blur", raBlur);
			input.mask("zzzzzzzzzzzzLL999999999999", raOptions).bind("blur", raBlur);
		}
	}
	/*$(".anoLetivo").mask("9999");
	$(".notaPremio").mask("99");
	$(".data")
		.mask("99/99/9999")
		.datepicker();
	$(".hora").mask("99:99");
	$(".cpf").mask("000.000.000-00");
	$(".cep").mask("99999-999");
	$(".dinheiro").mask("#,##0.00", { reverse: true });
	$(".telefone")
		.mask("(99) 9999-9999?9")
		.one("keypress", MascaraTelefone);
	$(".ra").mask("999999999999").bind("blur", function () {
		var v = $(this).val();
		if (v && v.length) {
			v = "000000000000" + v;
			$(this).val(v.substr(v.length - 12));
		}
	});*/
}

function MascaraTelefone(telefone, e, currentField, options) {
	telefone = $(this).val().replace("(", "").replace(")", "").replace(" ", "").replace("-", "");
	$(this).unmask();
	$(this).val(telefone);
	$(this)
		.mask((telefone.length < 10) ? "(99) 9999-9999?9" : "(99) 99999-9999")
		.one("keypress", MascaraTelefone);
}

window.NormalizarString = (function () {
	var regSlash = /[\/\\]/g, regTrim = /^\s+|\s+$/g, regA = /[ÁÀÃÂÄ]/g, regE = /[ÉÈÊË]/g, regI = /[ÍÌÎ]/g, regO = /[ÓÒÕÔ]/g, regU = /[ÚÙÛ]/g, regC = /[Ç]/g;
	return function (x) {
		return x.toUpperCase().replace(regSlash, " ").replace(regTrim, "").replace(regA, "A").replace(regE, "E").replace(regI, "I").replace(regO, "O").replace(regU, "U").replace(regC, "C");
	};
})();

function AbrirMensagemCarregandoPagina(msgExtra) {
	try {
		var i, divCentralMensagem, divAviso, divCorpo, divTexto, divWin8, img, divMsg, ball, innerBall;

		divCentralMensagem = document.createElement("div");
		divCentralMensagem.className = "msg-central-mensagem";

		divAviso = document.createElement("div");
		divAviso.className = "msg-mensagem msg-tipo-aviso";

		divCorpo = document.createElement("div");
		divCorpo.className = "msg-corpo";

		if (navigator.userAgent.toLowerCase().match("msie") && (!navigator.userAgent.toLowerCase().match("trident/6") || !navigator.userAgent.toLowerCase().match("msie 10"))) {
			// IE antigo
			divTexto = document.createElement("div");
			divTexto.className = "msg-texto msg-texto-carregando";

			divWin8 = document.createElement("div");
			divWin8.className = "msg-windows8 msg-windows8-internal";

			img = document.createElement("img");
			img.setAttribute("src", "//sedseecdn.azureedge.net/images/loadWindows8.gif");

			divWin8.appendChild(img);
		} else {
			divTexto = document.createElement("div");
			divTexto.className = "msg-texto msg-texto-carregando msg-texto-deslisando-esquerda";

			divWin8 = document.createElement("div");
			divWin8.className = "msg-windows8 msg-windows8-internal";

			for (i = 1; i <= 5; i++) {
				ball = document.createElement("div");
				ball.className = "msg-wBall msg-wBall" + i;

				innerBall = document.createElement("div");
				innerBall.className = "msg-wInnerBall";

				ball.appendChild(innerBall);

				divWin8.appendChild(ball);
			}
		}

		divTexto.appendChild(divWin8);

		divMsg = document.createElement("div");
		divMsg.style.verticalAlign = "middle";
		divMsg.style.margin = "20px 0 0";
		divMsg.appendChild(document.createTextNode(msgExtra || Mensagem.MensagemCarregando || "Processo em Andamento..."));

		divTexto.appendChild(divMsg);

		divCorpo.appendChild(divTexto);
		divAviso.appendChild(divCorpo);
		divCentralMensagem.appendChild(divAviso);

		Mensagem.ChamarBlockUI({
			message: divCentralMensagem,
			overlayCSS: {
				cursor: "wait"
			},
			css: {
				cursor: "wait"
			}
		}, true);
	} catch (e) {
		alert(e.message);
	}
}

function FecharMensagemCarregandoPagina() {
	Mensagem.Fechar();
	Mensagem.MensagemCarregando = null;
}

function PersonalizarMensagemCarregando(mensagem) {
	Mensagem.MensagemCarregando = mensagem;
}

/*
obj = {
	titulo: 'titulo da mensagem', //obrigatório
	mensagem: 'texto da mensagem', //obrigatório
	escondido: "texto escondido na mensagem. Pode ser visualizado ao expandir a mensagem",
	tipo: 'tipo da mensagem (aviso, erro, sucesso, alerta)',
	botao: 'texto do botão (quando for um único botao)',
	callback: function executada ao clicar no botão, quando não definida, executa-se $.unblockUI();
	botoes: [ // só exibe caso [botao] esteja nulo (ou não seja passado nada)
		{botao: 'nome', callback: function}
		{botao: 'nome', callback: function}
		{botao: 'nome', callback: function}
		{botao: 'nome', callback: function}
		{botao: 'nome', callback: function}
	]
	duracao: milisgundos para mostrar a imagem
}
Exemplo de Chamada:
	Mensagem.Alert({
		titulo: "Ola",
		mensagem: "Mundo",
		escondido: "Texto Escondido"
		tipo: "aviso",
		//botao: "Fechar",
		//callback: function(){
		//	alert('ola mundo');
		//	$.unblockUI();
		//}
		botoes: [
			{
				botao: "Sim",
				callback: function(){
					alert('ola mundo bonito');
				}
			},
			{
				botao: "Não",
				callback: function(){
					$.unblockUI();
				}
			}
		]
	});
*/
window.Mensagem = {
	ProximasMensagens: [],
	IgnorarMensagensAutomaticas: false,
	ObtendoMensagensAutomaticas: false,
	ExibindoCarregandoPagina: false,
	UltimoTimeoutHandler: 0,
	CriadoresDeTratadorDeClique: [],
	MensagemCarregando: null,
	Contexto: null,
	ChamarBlockUI: function (options, exibindoCarregandoPagina) {
		Mensagem.ExibindoCarregandoPagina = !!exibindoCarregandoPagina;

		if (Mensagem.UltimoTimeoutHandler) {
			clearTimeout(Mensagem.UltimoTimeoutHandler);
			Mensagem.UltimoTimeoutHandler = 0;
		}

		if (!("overlayCSS" in options))
			options.overlayCSS = {};

		if (!("cursor" in options.overlayCSS))
			options.overlayCSS.cursor = "default";

		if (!("css" in options))
			options.css = {};

		if (!options.baseZ)
			options.baseZ = 110000; // para ficar compatível com o widget jquery multi-select

		options.css.border = "none";
		options.css.width = "100%";
		options.css.margin = 0;
		options.css.left = 0;
		options.css.top = ""; // para remover o top do $.blockUI, e forçar a utilizar o do css
		if (!("cursor" in options.css))
			options.css.cursor = "default";

		$.blockUI(options);
	},
	Fechar: function () {
		Mensagem.ExibindoCarregandoPagina = false;

		if (Mensagem.UltimoTimeoutHandler) {
			clearTimeout(Mensagem.UltimoTimeoutHandler);
			Mensagem.UltimoTimeoutHandler = 0;
		}

		$.unblockUI();
	},
	Alert: function (obj) {
		if (!obj.tipo)
			obj.tipo = "msg-tipo-aviso";
		else
			obj.tipo = "msg-tipo-" + escape(obj.tipo).toLowerCase();

		if (!obj.botao && (!obj.duracao || obj.duracao < 0) && (!obj.botoes || !obj.botoes.length))
			obj.duracao = 4000;
		else if (!obj.duracao)
			obj.duracao = 0;

		var i, section, divMensagem, divCorpo, divTitulo, divTexto, divEscondido, pTextoEscondido, divMensagemBotao, button;

		section = document.createElement("section");
		section.className = "msg-central-mensagem";

		divMensagem = document.createElement("div");
		divMensagem.className = "msg-mensagem " + obj.tipo;

		divCorpo = document.createElement("div");
		divCorpo.className = "msg-corpo";

		divTitulo = document.createElement("div");
		divTitulo.className = "msg-titulo";
		divTitulo.appendChild(document.createTextNode(obj.titulo));

		divCorpo.appendChild(divTitulo);

		divTexto = document.createElement("div");
		divTexto.className = "msg-texto msg-texto-deslisando-esquerda";
		try {
			divTexto.appendChild(!obj.mensagem ? document.createTextNode("") : ((typeof obj.mensagem === "string") ? document.createTextNode(obj.mensagem) : obj.mensagem));
		} catch (ex) {
			divTexto.appendChild(document.createTextNode("[Erro ao criar a mensagem do alerta: " + ((ex && ex.message) ? ex.message : (ex || "Erro desconhecido")) + "]"));
		}

		if (obj.escondido && ((typeof obj.mensagem !== "string") || obj.escondido.length)) {
			divEscondido = document.createElement("div");
			divEscondido.className = "msg-escondida";

			button = document.createElement("button");
			button.setAttribute("type", "button");
			button.className = "msg-button";
			button.appendChild(document.createTextNode("Mais informações..."));

			pTextoEscondido = document.createElement("p");
			pTextoEscondido.className = "msg-texto-escondido";
			pTextoEscondido.appendChild((typeof obj.escondido === "string") ? document.createTextNode(obj.escondido) : obj.escondido);

			divEscondido.appendChild(button);
			divEscondido.appendChild(pTextoEscondido);

			divTexto.appendChild(divEscondido);

			button.onclick = function () {
				$(pTextoEscondido).toggle(200);
			}
		}

		divCorpo.appendChild(divTexto);

		divMensagem.appendChild(divCorpo);

		divMensagemBotao = document.createElement("div");
		divMensagemBotao.className = "msg-mensagem-botao";

		if (obj.botao) {
			button = document.createElement("button");
			button.setAttribute("type", "button");
			button.className = "msg-button";
			button.appendChild(document.createTextNode(obj.botao));
			button.onclick = (obj.callback || Mensagem.Fechar);

			divMensagemBotao.appendChild(button);
		} else if (obj.botoes && obj.botoes.length) {
			for (i = 0; i < obj.botoes.length; i++) {
				button = document.createElement("button");
				button.setAttribute("type", "button");
				button.className = "msg-button msg-button-margin";
				button.appendChild(document.createTextNode(obj.botoes[i].botao));
				button.onclick = (obj.botoes[i].callback || Mensagem.Fechar);

				divMensagemBotao.appendChild(button);
			}
		}

		divMensagem.appendChild(divMensagemBotao);

		section.appendChild(divMensagem);

		// Não adicionar o elemento ao body antes de utilizar o plugin,
		// caso contrário ele irá devolver o elemento ao pai quando fechar
		//document.body.appendChild(section);

		Mensagem.ChamarBlockUI({
			message: section
		}, false);

		for (var f in Mensagem.CriadoresDeTratadorDeClique)
			Mensagem.CriadoresDeTratadorDeClique[f]($(section));

		if (obj.duracao > 0)
			Mensagem.UltimoTimeoutHandler = setTimeout(Mensagem.ExibirProximaMensagem, obj.duracao);
	},
	CarregarMensagens: function () {
		Mensagem.ObtendoMensagensAutomaticas = true;
		$.ajax({
			url: (Mensagem.Contexto || "/Mensagem/Exibir"),
			global: false,
			cache: false,
			async: true,
			type: "GET",
			success: function (data) {
				Mensagem.ObtendoMensagensAutomaticas = false;
				Mensagem.ProximasMensagens = data;
				Mensagem.ExibirProximaMensagem();
			},
			error: function () {
				Mensagem.ObtendoMensagensAutomaticas = false;
				FecharMensagemCarregandoPagina();
			}
		});
	},
	AdicionarCallback: function (f) {
		Mensagem.CriadoresDeTratadorDeClique.push(f);
	},
	RemoverCallbacks: function (f) {
		Mensagem.CriadoresDeTratadorDeClique = [];
	},
	ExibirProximaMensagem: function () {
		if (!Mensagem.ProximasMensagens || !Mensagem.ProximasMensagens.length) {
			FecharMensagemCarregandoPagina();
			return;
		}

		var msg = Mensagem.ProximasMensagens[0];
		Mensagem.ProximasMensagens.splice(0, 1);

		msg.callback = Mensagem.ExibirProximaMensagem;
		msg.botoes = null;

		Mensagem.Alert(msg);
	}
}

// ----------------------------------------------------------------------------
// Função para auxiliar na manipulação da query string da página
//
// Exemplo de utilização, supondo a seguinte URL:
// Teste.html?id=123&nome=Carlos%20Rafael
//
// var minhaQueryString = parseQueryString();
// var a = minhaQueryString.id;
// var b = minhaQueryString.nome;
//
// ou
//
// var a = minhaQueryString["id"];
// var b = minhaQueryString["nome"];
// ----------------------------------------------------------------------------
window.parseQueryString = function () {
	var i, pair, assoc = {}, keyValues = location.search.substring(1).split("&");
	for (i in keyValues) {
		pair = keyValues[i].split("=");
		if (pair.length > 1) {
			assoc[decodeURIComponent(pair[0].replace(/\+/g, " "))] = decodeURIComponent(pair[1].replace(/\+/g, " "));
		}
	}
	window.queryString = assoc;
	return assoc;
}

// ----------------------------------------------------------------------------
// https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie
// :: cookies.js ::
//
// A complete cookies reader/writer framework with full unicode support.
//
// Revision #1 - September 4, 2014
//
// https://developer.mozilla.org/en-US/docs/Web/API/document.cookie
// https://developer.mozilla.org/User:fusionchess
//
// This framework is released under the GNU Public License, version 3 or later.
// http://www.gnu.org/licenses/gpl-3.0-standalone.html
//
// Modificado por Carlos Rafael Gimenes das Neves
//
// Criando um cookie com validade até o fim da sessão
// Cookies.create("nome", "valor");
//
// Criando um cookie com validade eterna
// Cookies.create("nome", "valor", Infinity);
//
// Criando um cookie com validade de 48 horas
// Cookies.create("nome", "valor", 48);
//
// Criando um cookie com validade até uma data específica
// var dataLimite = new Date(...);
// Cookies.create("nome", "valor", dataLimite);
//
// Obtendo o valor de um cookie (se não existir, retorna null)
// var valor = Cookies.get("nome");
//
// Removendo um cookie
// Cookies.remove("nome");
//
// Verificando se um cookie existe
// if (Cookies.exists("nome")) {
//   ...
// }
//
// Obtendo um array com os nomes de todos os cookies existentes
// var nomes = Cookies.names();
// ----------------------------------------------------------------------------
window.Cookies = {
	create: function (name, value, expires, path, domain, secure) {
		if (!name || /^(?:expires|max\-age|path|domain|secure)$/i.test(name)) return false;
		var exp = "";
		if (expires) {
			switch (expires.constructor) {
				case Number:
					if (expires === Infinity) {
						exp = "; expires=Fri, 31 Dec 9999 23:59:59 GMT";
					} else {
						exp = new Date();
						exp.setTime(exp.getTime() + (expires * 60 * 60 * 1000));
						exp = "; expires=" + exp.toUTCString();
					}
					break;
				case Date:
					exp = "; expires=" + expires.toUTCString();
					break;
				case String:
					exp = "; expires=" + expires;
					break;
			}
		}
		document.cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value) + exp + (path ? "; path=" + path : "") + (domain ? "; domain=" + domain : "") + (secure ? "; secure" : "");
		return true;
	},
	get: function (name) {
		return (!name ? null : (decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(name).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null));
	},
	remove: function (name, path, domain) {
		if (!Cookies.exists(name)) return false;
		document.cookie = encodeURIComponent(name) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (path ? "; path=" + path : "") + (domain ? "; domain=" + domain : "");
		return true;
	},
	exists: function (name) {
		if (!name) return false;
		return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(name).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
	},
	names: function () {
		var idx, len, ns = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
		for (len = ns.length, idx = 0; idx < len; idx++) ns[idx] = decodeURIComponent(ns[idx]);
		return ns;
	},
	deleteLegacy: function () {
		var i, idx, names = Cookies.names();
		for (i = names.length - 1; i >= 0; i--) {
			if (names[i] !== "contraste") {
				idx = names[i].lastIndexOf("font-size");
				if (idx < 0 || idx !== (names[i].length - 9))
					continue;
			}
			Cookies.remove(names[i]);
		}
	}
};

function GerarIndice() {
	return Math.random().toString(36).substring(10);
}

function Exportar(url, worksheetName, fileName) {
	//Chama a View
	$.get(url, null,
		function (data) {
			if (data == undefined || data == "") return;
			ExportarGLS(data, worksheetName, fileName);
		}, "html");
}

window.DefaultIE8 = function (e) {
	var agent = navigator.userAgent;
	var expr = /(MSIE 8.0)/i;
	if (agent.match(expr) != null) {
		e.returnValue = false;
	}
}

if (!("URL" in window))
	window.URL = window.webkitURL;

window.BlobDownloader = {
	blobURL: null,

	saveAs: (window.saveAs || window.webkitSaveAs || window.mozSaveAs || window.msSaveAs || window.navigator.saveBlob || window.navigator.webkitSaveBlob || window.navigator.mozSaveBlob || window.navigator.msSaveBlob),

	supported: (("Blob" in window) && ("URL" in window) && ("createObjectURL" in window.URL) && ("revokeObjectURL" in window.URL)),

	download: function (filename, blob) {
		if (!BlobDownloader.supported)
			return false;
		if (BlobDownloader.blobURL) {
			URL.revokeObjectURL(BlobDownloader.blobURL);
			BlobDownloader.blobURL = null;
		}

		if (BlobDownloader.saveAs) {
			try {
				BlobDownloader.saveAs.call(window.navigator, blob, filename);
				return;
			} catch (ex) {
			}
		}

		var a = document.createElement("a"), evt;
		BlobDownloader.blobURL = URL.createObjectURL(blob);
		a.href = BlobDownloader.blobURL;
		a.download = filename;
		if (document.createEvent && (window.MouseEvent || window.MouseEvents)) {
			try {
				evt = document.createEvent("MouseEvents");
				evt.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
				a.dispatchEvent(evt);
				return;
			} catch (ex) {
			}
		}
		a.click(); // Funciona no Chrome, mas não no Firefox...
		return true;
	}
};

window.ExportarGLS = (function () {
	if (!BlobDownloader.suportado) {
		var uri = 'data:application/vnd.ms-excel;base64,',
			template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"/><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body>{table}</body></html>',
			base64 = function (s) { return window.btoa(unescape(encodeURIComponent(s))) },
			format = function (s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; }) }
		return function (html, name, filename) {
			var ctx = { worksheet: name || 'Worksheet', table: html }, exp = document.getElementById("export"), evt;
			if (!exp)
				exp = document.createElement("a");
			exp.href = uri + base64(format(template, ctx));
			exp.download = filename;
			if (document.createEvent && (window.MouseEvent || window.MouseEvents)) {
				try {
					evt = document.createEvent("MouseEvents");
					evt.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
					exp.dispatchEvent(evt);
					return;
				} catch (ex) {
				}
			}
			exp.click(); // Funciona no Chrome, mas não no Firefox...
		}
	} else {
		return function (html, name, filename) {
			BlobDownloader.download(filename, new Blob([
				'<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"/><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>',
				(name || 'Worksheet'),
				'</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body>',
				html,
				'</body></html>'],
				{ type: 'application/vnd.ms-excel' }));
		}
	}
})();

window.tratadorJSONException = function (jqXHR, textStatus, errorThrown) {
	try {
		var obj = JSON.parse(jqXHR.responseText);
		Mensagem.Alert({
			titulo: (obj.titulo || obj.Title || "Erro"),
			mensagem: (obj.mensagem || obj.Message || "Ocorreu um erro no servidor!"),
			tipo: (obj.tipo || obj.TipoException || "erro"),
			escondido: (obj.escondido ? obj.escondido : null),
			botao: "Fechar"
		});
	} catch (e) {
		Mensagem.Alert({
			titulo: "Erro",
			mensagem: "Ocorreu um erro desconhecido!",
			tipo: "erro",
			botao: "Fechar"
		});
		return;
	}
}

function gerarLocalStoreServiceToken() {
	window.localStorage.setItem('_SEDSERVICE', Cookies.get('_SEDSERVICE'));
}

function removeLocalStoreServiceToken() {
	window.localStorage.removeItem('_SEDSERVICE');
}

function PostLogin(id) {
	PostUrl("/Inicio/AlterarPerfil", "id", id);
}

function PostUrl(url, name, value) {
	var form, input, i;
	form = document.createElement("form");
	form.setAttribute("id", "DecorPostUrlForm");
	form.setAttribute("method", "POST");
	form.setAttribute("action", url);
	for (i = 1; i < arguments.length; i += 2) {
		if (!arguments[i])
			continue;
		input = document.createElement("input");
		input.setAttribute("type", "hidden");
		input.setAttribute("name", arguments[i]);
		input.setAttribute("value", arguments[i + 1]);
		form.appendChild(input);
	}
	document.body.appendChild(form);
	form.submit();
	AbrirMensagemCarregandoPagina();
}

function multiSelectTextoPadrao(numChecked, numTotal, checkedItems) {
	// Função que retorna o texto a ser exibido quando existirem alguns items selecionados
	var i, descricao = numChecked + "/" + numTotal + ": " + checkedItems[0].parentNode.textContent;
	for (i = 1; i < checkedItems.length; i++)
		descricao += "; " + checkedItems[i].parentNode.textContent;
	return descricao;
}

/*!
Math.uuid.js (v1.4)
http://www.broofa.com
mailto:robert@broofa.com

Copyright (c) 2010 Robert Kieffer
Dual licensed under the MIT and GPL licenses.
*/

/*
 * Generate a random uuid.
 *
 * USAGE: Math.uuid(length, radix)
 *   length - the desired number of characters
 *   radix  - the number of allowable values for each character.
 *
 * EXAMPLES:
 *   // No arguments  - returns RFC4122, version 4 ID
 *   >>> Math.uuid()
 *   "92329D39-6F5C-4520-ABFC-AAB64544E172"
 *
 *   // One argument - returns ID of the specified length
 *   >>> Math.uuid(15)    // 15 character ID (default base=62)
 *   "VcydxgltxrVZSTV"
 *
 *   // Two arguments - returns ID of the specified length, and radix. (Radix must be <= 62)
 *   >>> Math.uuid(8, 2)  // 8 character ID (base=2)
 *   "01001010"
 *   >>> Math.uuid(8, 10) // 8 character ID (base=10)
 *   "47473046"
 *   >>> Math.uuid(8, 16) // 8 character ID (base=16)
 *   "098F4D35"
 */
(function () {
	// Private array of chars to use
	var CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');

	Math.uuid = function (len, radix) {
		var chars = CHARS, uuid = [], i;
		radix = radix || chars.length;

		if (len) {
			// Compact form
			for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
		} else {
			// rfc4122, version 4 form
			var r;

			// rfc4122 requires these characters
			uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
			uuid[14] = '4';

			// Fill in random data.  At i==19 set the high bits of clock sequence as
			// per rfc4122, sec. 4.1.5
			for (i = 0; i < 36; i++) {
				if (!uuid[i]) {
					r = 0 | Math.random() * 16;
					uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
				}
			}
		}

		return uuid.join('');
	};

	// A more performant, but slightly bulkier, RFC4122v4 solution.  We boost performance
	// by minimizing calls to random()
	Math.uuidFast = function () {
		var chars = CHARS, uuid = new Array(36), rnd = 0, r;
		for (var i = 0; i < 36; i++) {
			if (i == 8 || i == 13 || i == 18 || i == 23) {
				uuid[i] = '-';
			} else if (i == 14) {
				uuid[i] = '4';
			} else {
				if (rnd <= 0x02) rnd = 0x2000000 + (Math.random() * 0x1000000) | 0;
				r = rnd & 0xf;
				rnd = rnd >> 4;
				uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
			}
		}
		return uuid.join('');
	};

	// A more compact, but less performant, RFC4122v4 solution:
	Math.uuidCompact = function () {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
			var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
			return v.toString(16);
		});
	};
})();

(function () {
	var encoder, decoder, nativeDecoder;
	String.prototype.toUTF8 = function () {
		if (encoder)
			return encoder.encode(this);
		if ("TextEncoder" in window) {
			encoder = new TextEncoder();
		} else {
			encoder = {
				encode: function (text) {
					if (typeof text === "undefined") return new Uint8Array();
					if (text === null) return new Uint8Array([110, 117, 108, 108]);

					var i, c, txt = unescape(encodeURIComponent(text.toString())), tot = txt.length, array;

					if (!tot) return new Uint8Array();

					array = new Uint8Array(tot);

					for (i = tot - 1; i >= 0; i--)
						array[i] = txt.charCodeAt(i);

					return array;
				}
			}
		}
		return encoder.encode(this);
	}
	String.fromUTF8 = function (array) {
		if (decoder)
			return decoder.decode(array);
		if (!("TextDecoder" in window)) {
			nativeDecoder = new TextDecoder();
			decoder = {
				decode: function (array) {
					return ((array && array.length) ?
						nativeDecoder.decode((array instanceof Uint8Array || array instanceof Int8Array) ? array : new Uint8Array(array)) :
						"");
				}
			};
		} else {
			decoder = {
				decode: function (array) {
					if (!array || !array.length) return "";

					var i, tot = array.length, c, s = "";

					for (i = 0; i < tot; i++)
						s += String.fromCharCode(array[i]);

					return decodeURIComponent(escape(s));
				}
			};
		}
		return decoder.decode(array);
	}
})();

/*
Description: $.fn.dialog
Author: Kris Zhang
http://bootstrap.ourjs.com/

O código abaixo não é a versão do link acima! Ele foi ***ALTAMENTE***, ***ABSURDAMENTE***
personalizado por mim para corrigir *MUITOS* bugs, permitir responsividade, fazer os eventos
funcionarem corretamente, além de permitir múltiplos modals (um sobre o outro)!!!
Ou seja, nem perca tempo baixando aquele arquivo para outro projeto... use esse ;)

Ou... um dia, utilizar a ideia desse modal aqui: https://github.com/jschr/bootstrap-modal/

NÃO UTILIZAR O MÉTODO DO JQUERY .REMOVE() PARA REMOVER OS ELEMENTOS DENTRO DO DIALOG
PORQUE ESSE MÉTODO LIMPA OS ATRIBUTOS "data" DO ELEMENTO, FAZENDO COM QUE OS FORMS
COM VALIDATE PAREM DE FUNCIONAR
*/
; (function ($) {

	var $currentModal = null, currentModalId = 0, openRunning = false, closeRunning = false, closeAllRequested = false, pendingDialogs = [];

	$.fn.dialog = function (options) {
		if (this.length !== 1) {
			if (this.length)
				alert("Você não pode utilizar a função dialog() com uma query que retorna mais de um elemento por vez.");
			return this;
		}
		var self = this,
			$body = $(document.body),
			arg1 = arguments[1],
			arg2 = arguments[2],
			_element = self[0],
			$msgbox = _element.dlgWrapperMsgBox,

			createButton = function (options) {
				var btnObj, text, click, button, $button, idx, arrButton, icon,
					buttons = ((options || {}).buttons || []),
					$btnrow = $msgbox.find(".modal-footer-placeholder");

				// clear old buttons
				$btnrow.empty();

				for (button in buttons) {
					btnObj = buttons[button];

					if (!btnObj)
						continue;

					text = null;
					click = null;

					if (buttons.constructor == Array) {
						for (arrButton in btnObj) {
							text = arrButton;
							click = btnObj[arrButton];
							break;
						}
					} else if (btnObj.constructor == Object) {
						for (arrButton in btnObj) {
							text = (arrButton || button);
							click = btnObj[arrButton];
							break;
						}
					} else if (btnObj.constructor == Function) {
						text = button;
						click = btnObj;
					}

					if (!text || !click || click.constructor != Function)
						continue;

					$button = $('<button type="button"></button>');
					$button[0].className = "btn btn-info";
					if (text && text.charAt(0) == "." && (idx = text.indexOf(".", 1)) > 1) {
						icon = document.createElement("i");
						icon.className = text.substring(1, idx);
						$button[0].appendChild(icon);
						$button[0].appendChild(document.createTextNode(" " + text.substr(idx + 1)));
					} else {
						$button[0].appendChild(document.createTextNode(text));
					}

					(function (click) {
						$button.click(function () {
							click.call(self);
						});
					})(click);

					$btnrow.append($button);
				}

				$btnrow.data("buttons", buttons);

				if (!$btnrow.children() || !$btnrow.children().length) {
					if ($btnrow[0])
						$btnrow[0].parentNode.removeChild($btnrow[0]);
				} else {
					$btnrow.removeClass("modal-footer-placeholder").addClass("modal-footer");
				}
			},

			doShow = function ($dlg) {
				if (openRunning) {
					if ($dlg.dlgWrapperElement)
						pendingDialogs.push($dlg.dlgWrapperElement);
					return;
				}
				if (closeRunning) {
					var msg = "Erro: Você está tentando abrir um novo dialog durante o fechamento de outro dialog. Por favor, utilize o callback close do dialog para determinar quando ele foi fechado, e então abra o novo dialog.";
					alert(msg);
					if (console) {
						if ("error" in console)
							console.error(msg);
						else if ("log" in console)
							console.log(msg);
					}
					return;
				}

				$dlg.removeClass("hidden");

				openRunning = true;
				$dlg.modal({
					keyboard: false,
					show: true,
					backdrop: "static"
				});
			},

			doCreate = function (options) {
				var size = "", maxWidth = 0, modalId = "sedUiModalWrapper_" + (++currentModalId), dlgbody, dlgfooter, i;

				if (!options)
					options = {};

				if (!$msgbox) {
					// Cria o modal pela primeira vez

					_element.dlgWrapperOriginalParent = _element.parentNode;
					_element.dlgWrapperModalId = modalId;
					_element.dlgWrapperFocusElement = ((options && options.focusElement) ? options.focusElement.toString() : "");

					size = (options.size || options.width);
					switch (size) {
						case "lg":
						case "LG":
							size = " modal-lg";
							break;
						case "sm":
						case "SM":
							size = " modal-sm";
							break;
						default:
							size = parseInt(size);
							if (isNaN(size) || size <= 0) {
								size = "";
							} else {
								maxWidth = size + 20; // para compensar o padding
								size = " modal-custom";
							}
							break;
					}

					$msgbox = $('<div class="modal fade hidden" id="' + modalId + '" role="dialog" tabindex="-1" aria-labelledby="' + modalId + 'title">' +
								'<div class="modal-dialog' + (options.dialogClass ? (" " + options.dialogClass) : "") + size + (maxWidth ? ('" role="document" style="max-width: ' + maxWidth + 'px">') : '" role="document">') +
								'<div class="modal-content"><div class="modal-header"><button type="button" class="close" id="' + modalId + 'close">&times;</button>' +
								'<h4 class="modal-title" id="' + modalId + 'title">' + (options.title || "") + '</h4></div>' +
								'<div class="modal-body" id="' + modalId + 'body" ' + (options.height ? 'style="height: ' + options.height + '"' : '') + '></div><div class="modal-footer-placeholder"></div></div></div></div>');

					$(document.body).append($msgbox);
					self.show();
					$("#" + modalId + "body").append(self);

					$msgbox.dlgWrapperElement = _element;

					_element.dlgWrapperMsgBox = $msgbox;
					_element.dlgWrapperIsOpen = false;
					_element.dlgWrapperDestroy = (options.destroy === true);

					$("#" + modalId + "close").click(close);

					$msgbox.on("shown.bs.modal", function () {
						_element.dlgWrapperIsOpen = true;
						$currentModal = $msgbox;

						var nextDlg, focusOk = false, tryToFocusChild = function (child) {
							if (!child ||
								child.getAttribute("type") == "hidden" ||
								child.getAttribute("disabled") ||
								child.getAttribute("readonly"))
								return false;
							try {
								child.focus();
								try {
									if (child.setSelectionRange)
										child.setSelectionRange(0, child.value.length);
									else if (child.select)
										child.select();
								} catch (ex) {
								}
								return true;
							} catch (ex) {
							}
							return false;
						}, scanChildren = function (parent) {
							for (var i = 0; i < parent.childNodes.length; i++) {
								switch (parent.childNodes[i].tagName) {
									case "INPUT":
									case "SELECT":
										if (tryToFocusChild(parent.childNodes[i]))
											return true;
										break;
									default:
										if (scanChildren(parent.childNodes[i]))
											return true;
										break;
								}
							}
							return false;
						};

						if (_element.dlgWrapperFocusElement == "-1") {
						} else {
							if ((!_element.dlgWrapperFocusElement ||
								!tryToFocusChild(document.getElementById(_element.dlgWrapperFocusElement.charAt(0) == "#" ? _element.dlgWrapperFocusElement.substr(1) : _element.dlgWrapperFocusElement))) &&
								$msgbox[0])
								scanChildren($msgbox[0]);
						}

						if (options && options.visibilityChanged)
							options.visibilityChanged.call(self, true);

						if (_element.dlgWrapperDoNotCallOpenCallbackNextTime) {
							// Veja explicação abaixo
							_element.dlgWrapperDoNotCallOpenCallbackNextTime = false;
						} else {
							if (options) {
								if (options.open) options.open.call(self)
								else if (options.onOpen) options.onOpen.call(self);
							}
						}

						// Deixa aqui, depois de todos os callbacks, para caso o usuário tente
						// abrir um novo dialog durante alguma das execuções dos callbacks
						openRunning = false;

						// Mostra o próximo dialog pendente, caso exista
						if (pendingDialogs.length) {
							nextDlg = pendingDialogs[0];
							pendingDialogs.splice(0, 1);
							$(nextDlg).dialog("open");
						}
					});

					$msgbox.on("hidden.bs.modal", function () {
						if (options && options.visibilityChanged)
							options.visibilityChanged.call(self, false);

						// Deixa aqui, depois da chamada visibilityChanged(), para alertar caso o
						// usuário tente abrir um novo dialog durante a execução do callback
						closeRunning = false;

						var callCloseCallback = false, tmpdlg, prevdlg, tmpelement;

						// Não chamará o callback se o modal estiver
						// sendo escondido para mostrar outro
						if (!$msgbox.dlgWrapperNextModal) {
							_element.dlgWrapperDoNotCallOpenCallbackNextTime = false;
							if ($msgbox[0])
								$msgbox[0].parentNode.removeChild($msgbox[0]);
							if (_element)
								_element.parentNode.removeChild(_element);
							if (!_element.dlgWrapperDestroy &&
								_element.dlgWrapperOriginalParent &&
								_element.dlgWrapperOriginalParent.tagName) {
								self.hide();
								$(_element.dlgWrapperOriginalParent).append(self);
							}
							_element.dlgWrapperOriginalParent = null;
							_element.dlgWrapperModalId = null;
							_element.dlgWrapperMsgBox = null;
							$msgbox.dlgWrapperElement = null;
							if (closeAllRequested && $msgbox.dlgWrapperCloseHandler)
								$msgbox.dlgWrapperCloseHandler.call($msgbox.dlgWrapperSelf);
							$msgbox.dlgWrapperSelf = null;

							callCloseCallback = true;
						} else {
							// Se esse modal foi escondido para mostrar outro, não
							// chama o callback open na próxima vez que for mostrado
							// (visto que aqui o callback de close não foi chamado)
							_element.dlgWrapperDoNotCallOpenCallbackNextTime = true;
						}
						_element.dlgWrapperIsOpen = false;
						if ($currentModal === $msgbox)
							$currentModal = null;
						if ($msgbox.dlgWrapperNextModal) {
							if (closeAllRequested) {
								var msg = "Erro: Você está tentando abrir um novo dialog durante o processo de closeAll.";
								alert(msg);
								if (console) {
									if ("error" in console)
										console.error(msg);
									else if ("log" in console)
										console.log(msg);
								}
								return;
							}
							doShow($msgbox.dlgWrapperNextModal);
							$msgbox.dlgWrapperNextModal = null;
						} else if ($msgbox.dlgWrapperPreviousModal) {
							if (closeAllRequested) {
								// Chama todos os callback de close em sequencia, fechando todos
								// os dialogs e limpando tudo manualmente aqui!
								tmpdlg = $msgbox;
								closeRunning = true;
								while (tmpdlg) {
									prevdlg = tmpdlg.dlgWrapperPreviousModal;
									tmpelement = tmpdlg.dlgWrapperElement;
									if (tmpdlg[0] && tmpdlg[0].parentNode)
										tmpdlg[0].parentNode.removeChild(tmpdlg[0]);
									if (tmpelement) {
										if (!tmpelement.dlgWrapperDestroy &&
											tmpelement.dlgWrapperOriginalParent &&
											tmpelement.dlgWrapperOriginalParent.tagName) {
											tmpdlg.dlgWrapperSelf.hide();
											$(tmpelement.dlgWrapperOriginalParent).append(tmpdlg.dlgWrapperSelf);
										}
										tmpelement.dlgWrapperOriginalParent = null;
										tmpelement.dlgWrapperModalId = null;
										tmpelement.dlgWrapperMsgBox = null;
										tmpdlg.dlgWrapperElement = null;
										if (tmpdlg.dlgWrapperCloseHandler)
											tmpdlg.dlgWrapperCloseHandler.call(tmpdlg.dlgWrapperSelf);
									}
									tmpdlg.dlgWrapperSelf = null;
									tmpdlg.dlgWrapperPreviousModal = null;
									tmpdlg = prevdlg;
								}
								closeRunning = false;
								closeAllRequested = false;
								$currentModal = null;
								return;
							} else {
								doShow($msgbox.dlgWrapperPreviousModal);
							}
							$msgbox.dlgWrapperPreviousModal = null;
						} else {
							closeAllRequested = false;
						}

						// Chama o callback de close só depois de ter removido tudo da tela, e depois
						// de ter iniciado a exibir algum possível dialog anterior/posterior
						if (callCloseCallback && $msgbox.dlgWrapperCloseHandler)
							$msgbox.dlgWrapperCloseHandler.call(self);
					});

					$msgbox.dlgWrapperCloseHandler = (options.close || options.onClose || options.onclose);
					$msgbox.dlgWrapperSelf = self;
				}

				createButton(options);

				dlgbody = $("#" + _element.dlgWrapperModalId + "body");
				dlgfooter = $(".modal-footer", $msgbox);

				// Remove os espaços em branco no rodapé (para manter os botões juntos)
				if (dlgfooter[0]) {
					for (i = dlgfooter[0].childNodes.length - 1; i >= 0; i--) {
						if (dlgfooter[0].childNodes[i].nodeType === 3)
							dlgfooter[0].removeChild(dlgfooter[0].childNodes[i]);
					}
				}

				if (dlgfooter.hasClass("embutido") || !dlgfooter.length)
					dlgbody.addClass("embutido");
				else
					dlgbody.removeClass("embutido");

				if (options["class"])
					$msgbox.addClass(options["class"]);
				else if (options.classes)
					$msgbox.addClass(options.classes);
				if (options.autoOpen !== false)
					show();
			},

			show = function () {
				if (_element.dlgWrapperIsOpen) {
					var msg = "Erro: Você está tentando mostrar um dialog que já está visível.";
					alert(msg);
					if (console) {
						if ("error" in console)
							console.error(msg);
						else if ("log" in console)
							console.log(msg);
					}
					return;
				}
				// armazena o modal anterior, caso exista...
				$msgbox.dlgWrapperPreviousModal = $currentModal;
				if ($currentModal) {
					$currentModal.dlgWrapperNextModal = $msgbox;
					closeRunning = true;
					$currentModal.modal("hide");
				} else {
					doShow($msgbox);
				}
			},

			close = function (destroy, closeAll) {
				// call the bootstrap modal to handle the hide events and remove msgbox after the modal is hidden
				if ($currentModal && $currentModal !== $msgbox) {
					var msg = "Erro: Você fechou um dialog que não era o superior (top-most), colocando o sistema em um estado instável.";
					alert(msg);
					if (console) {
						if ("error" in console)
							console.error(msg);
						else if ("log" in console)
							console.log(msg);
					}
				}
				if (closeAll === true) {
					closeAllRequested = true;
				} else {
					closeAllRequested = false;
					if (destroy === true)
						_element.dlgWrapperDestroy = true;
				}
				closeRunning = true;
				$msgbox.modal("hide");
			},

			msg;

		switch (options) {
			case "open":
				if (!$msgbox) {
					msg = "Aviso: esse dialog não foi criado corretamente, pois o método \"open\" foi chamado diretamente. Por favor, exiba o dialog utilizando a forma $(\"...\").dialog({ opções }).";
					alert(msg);
					if (console) {
						if ("warn" in console)
							console.warn(msg);
						else if ("log" in console)
							console.log(msg);
					}
					doCreate({ title: "" });
				} else {
					show();
				}
				break;

			case "destroy":
				close(true);
				break;

			case "close":
				close();
				break;

			case "closeAll":
			case "closeall":
				close(true, true);
				break;

			case "isOpen":
			case "isopen":
				return !!_element.dlgWrapperIsOpen;

			case "title":
				if (arguments.length === 1)
					return (($msgbox && $msgbox[0] && $msgbox[0].id) ? document.getElementById($msgbox[0].id + "title").textContent : "");
				else if ($msgbox && $msgbox[0] && $msgbox[0].id && arguments[1] !== null && arguments[1] !== undefined)
					document.getElementById($msgbox[0].id + "title").textContent = arguments[1].toString();
				break;

			case "focusElement":
			case "focuselement":
				if (arguments.length === 1)
					return _element.dlgWrapperFocusElement;
				else if (arguments[1] !== null && arguments[1] !== undefined)
					_element.dlgWrapperFocusElement = arguments[1].toString();
				break;

			default:
				if (!options)
					doCreate({ autoOpen: false });
				else if (options.constructor == Object)
					doCreate(options);
				break;
		}

		return self;
	};

})(jQuery);

window.sedDataTableLastPdfConfig = 0;

// Algumas opções válidas para a função sedDataTable():
// - embutida (true/false)
// - nomeExportacao (padrão "Dados") (string)
// - colunasIguais (padrão false) (true/false)
// - tamanhoPagina (padrão A4) (string - "4A0", "2A0", "A0", "A1", "A2", "A3", "A4", "A5", "A6", "A7", "A8", "A9", "A10", "B0", "B1", "B2", "B3", "B4", "B5", "B6", "B7", "B8", "B9", "B10", "C0", "C1", "C2", "C3", "C4", "C5", "C6", "C7", "C8", "C9", "C10", "RA0", "RA1", "RA2", "RA3", "RA4", "SRA0", "SRA1", "SRA2", "SRA3", "SRA4", "EXECUTIVE", "FOLIO", "LEGAL", "LETTER", "TABLOID")
// - paisagem (padrão true) (true/false)
// (Para mais opções, veja os arquivos Ex11 e Ex12 de See.Sed.UI.Template)
$.fn.sedDataTable = function (obj) {
	try {
		if (("localStorage" in window))
			sedDataTableLastPdfConfig = parseInt(window.localStorage.getItem("sedDataTableLastPdfConfig"));
	} catch (ex) {
		sedDataTableLastPdfConfig = 0;
	}

	if (!sedDataTableLastPdfConfig || isNaN(sedDataTableLastPdfConfig) || sedDataTableLastPdfConfig < 0)
		sedDataTableLastPdfConfig = 0x27; // 0x27 = 010 01 11

	for (var i = 0; i < this.length; i++) {
		(function (elemento) {
			var dt, div, row, btn, icon, linhaComBotoes, btnFull, btnOutros, config = {
				bJQueryUI: true,
				bRetrieve: true,
				oClasses: {
					sTable: "tabela tabela-full tabela-listrada",
					sNoFooter: "",
					sWrapper: ((obj && (obj.embutida || obj.embutido)) ? (obj.semMargem ? "dataTables_wrapper form-inline" : "dataTables_wrapper margem-superior form-inline") : "dataTables_wrapper panel panel-default panel-body form-inline"),
					sFilterInput: "form-control input-sm",
					sLengthSelect: "form-control input-sm",
					sProcessing: "dataTables_processing panel panel-default"
				},
				oLanguage: {
					sProcessing: "Processando...",
					sLengthMenu: "Mostrar_MENU_registros",
					sZeroRecords: "Nenhum registro encontrado!",
					sInfo: "Registros _START_ a _END_ de _TOTAL_",
					sInfoEmpty: "Nada para mostrar",
					sInfoFiltered: "(filtrados de _MAX_)",
					sInfoPostFix: "",
					sSearch: "Filtro",
					sUrl: "",
					oPaginate: {
						sFirst: "Primeiro",
						sPrevious: "Anterior",
						sNext: "Seguinte",
						sLast: "Último"
					}
				}
			};

			if (obj) {
				for (var item in obj) {
					if (item == "oClasses") {
						for (var c in obj.oClasses) {
							if (config.oClasses[c])
								config.oClasses[c] += " " + obj.oClasses[c];
							else
								config.oClasses[c] = obj.oClasses[c];
						}
					} else if (item != "bJQueryUI" && item != "bRetrieve" && item != "oLanguage") {
						config[item] = obj[item];
					}
				}
			}

			// Se estivermos gerando a tabela com base em dados dinâmicos, e essa já não é a primeira vez,
			// precisaremos destruir a tabela e gerar outra nova
			if (elemento.sedDataTableDecorationGenerated && (("data" in config) || ("aaData" in config))) {
				elemento.sedDataTableDecorationGenerated = false;
				$(elemento).dataTable().fnDestroy();
			}

			try {
				dt = $(elemento).dataTable(config).DataTable();
			} catch (ex) {
				alert("Ocorreu um erro ao criar a tabela: " + (ex.message || ex.name || ex) + " (Não é certeza, mas esse tipo de erro costuma ocorrer quando a quantidade de colunas do corpo difere entre linhas, ou é diferente da quantidade de colunas do cabeçalho)");
			}

			elemento.sedDataTableObj = (obj || {});
			if (elemento && elemento.parentNode && !elemento.sedDataTableDecorationGenerated) {
				elemento.sedDataTableDecorationGenerated = true;
				div = document.createElement("div");
				div.className = "tabela-responsiva";
				elemento.parentNode.appendChild(div);
				elemento.parentNode.removeChild(elemento);
				div.appendChild(elemento);
				if (div.parentNode && div.parentNode.parentNode && div.parentNode.parentNode.parentNode) {
					row = document.createElement("div");
					row.className = "decor-datatable-button-container";

					linhaComBotoes = false;

					btnFull = null;
					btnOutros = false;

					if (!obj || obj.botaoTelaCheia !== false) {
						linhaComBotoes = true;
						icon = document.createElement("i");
						icon.className = "glyphicon glyphicon-fullscreen icone-glyphicon";
						btn = document.createElement("button");
						btn.setAttribute("type", "button");
						btn.className = "btn btn-default";
						btn.style.display = "inline-block";
						btn.style.width = "auto";
						btn.style.marginLeft = "0";
						btn.title = "Tela Cheia";
						btn.appendChild(icon);
						btnFull = btn;
						icon = document.createElement("span");
						icon.className = "sr-only";
						icon.appendChild(document.createTextNode("Tela Cheia"));
						btn.appendChild(icon);
						btn.onclick = function () {
							sedPrintExporter.generate(dt, {
								doNotPrint: true,
								header: false,
								footer: false,
								title: (elemento.sedDataTableObj.nomeExportacao || "Dados"),
								filterTitle: (elemento.sedDataTableObj.tituloFiltro || "Filtros"),
								filters: (elemento.sedDataTableObj.filtros || []),
								includeNonSortableColumns: (elemento.sedDataTableObj.incluirColunasNaoOrdenaveis === true)
							});
						};
						row.appendChild(btn);
					}

					if (!obj || obj.botaoSelecionarColunas !== false) {
						linhaComBotoes = true;
						btnOutros = true;
						icon = document.createElement("i");
						icon.className = "glyphicon glyphicon-list icone-glyphicon";
						btn = document.createElement("button");
						btn.setAttribute("type", "button");
						btn.className = "btn btn-info";
						btn.appendChild(icon);
						btn.appendChild(document.createTextNode(" Escolher Colunas"));
						btn.onclick = function () {
							var i, colunas = [], total = dt.columns().indexes().length, colsettings = dt.settings()[0].aoColumns, title, lt;
							for (i = 0; i < total; i++) {
								title = colsettings[i].sTitle;
								if ((lt = title.indexOf("<")) > 0)
									title = title.substr(0, lt);
								colunas.push({ titulo: title, selecionada: dt.column(i).visible() });
							}
							MostrarOpcoesMultiplas([{ opcoes: colunas }], function (grupos) {
								if (!grupos)
									return;
								// Duas passadas para garanti que o usuário selecionou ao menos uma coluna
								var i, ok = false;
								for (i = 0; i < grupos[0].opcoes.length; i++) {
									if (grupos[0].opcoes[i].selecionada) {
										ok = true;
										break;
									}
								}
								if (!ok)
									return;
								for (i = 0; i < grupos[0].opcoes.length; i++)
									dt.column(i).visible(grupos[0].opcoes[i].selecionada);
							}, "Escolher Colunas", "400", 1, null, true);
						};
						row.appendChild(btn);
					}

					if (!obj || obj.botaoImprimir !== false) {
						linhaComBotoes = true;
						btnOutros = true;
						icon = document.createElement("i");
						icon.className = "glyphicon glyphicon-print icone-glyphicon";
						btn = document.createElement("button");
						btn.setAttribute("type", "button");
						btn.className = "btn btn-info";
						btn.appendChild(icon);
						btn.appendChild(document.createTextNode(" Imprimir"));
						btn.onclick = function () {
							sedPrintExporter.generate(dt, {
								header: ((elemento.sedDataTableObj.cabecalho === false) ? false : true),
								footer: ((elemento.sedDataTableObj.rodape === false) ? false : true),
								title: (elemento.sedDataTableObj.nomeExportacao || "Dados"),
								filterTitle: (elemento.sedDataTableObj.tituloFiltro || "Filtros"),
								filters: (elemento.sedDataTableObj.filtros || []),
								includeNonSortableColumns: (elemento.sedDataTableObj.incluirColunasNaoOrdenaveis === true)
							});
						};
						row.appendChild(btn);
					}

					if (!obj || obj.botaoGerarCSV !== false) {
						linhaComBotoes = true;
						btnOutros = true;
						icon = document.createElement("i");
						icon.className = "glyphicon glyphicon-th icone-glyphicon";
						btn = document.createElement("button");
						btn.setAttribute("type", "button");
						btn.className = "btn btn-info";
						btn.appendChild(icon);
						btn.appendChild(document.createTextNode(" Gerar Excel"));
						btn.onclick = function () {
							MostrarOpcoes([
									"Arquivo CSV sem formatação",
									"Arquivo HTM com formatação (Deve ser aberto a partir do menu \"Abrir\" do próprio Excel)"
							], function (valor, indice) {
								if (indice < 0)
									return;

								(indice ? sedPrintExporter : sedCsvExporter).generate(dt, {
									title: (elemento.sedDataTableObj.nomeExportacao || "Dados"),
									filterTitle: (elemento.sedDataTableObj.tituloFiltro || "Filtros"),
									filters: (elemento.sedDataTableObj.filtros || []),
									includeNonSortableColumns: (elemento.sedDataTableObj.incluirColunasNaoOrdenaveis === true),
									exportExcel: true
								});
							},
								"Gerar Excel",
								null,
								"sm"
							);
						};
						row.appendChild(btn);
					}

					if (!obj || obj.botaoGerarPDF !== false) {
						linhaComBotoes = true;
						btnOutros = true;
						icon = document.createElement("i");
						icon.className = "glyphicon glyphicon-file icone-glyphicon";
						btn = document.createElement("button");
						btn.setAttribute("type", "button");
						btn.className = "btn btn-info";
						btn.appendChild(icon);
						btn.appendChild(document.createTextNode(" Gerar PDF"));
						btn.onclick = function () {
							var grupos = [
								{
									titulo: "Geral",
									opcoes: [
										{ titulo: "Incluir cabeçalho", selecionada: !!(sedDataTableLastPdfConfig & 0x01) },
										{ titulo: "Incluir rodapé", selecionada: !!(sedDataTableLastPdfConfig & 0x02) }
									]
								},
								(("paisagem" in elemento.sedDataTableObj) ? null : {
									titulo: "Orientação",
									exclusiva: true,
									opcoes: [
										{ titulo: "Paisagem", selecionada: !!(sedDataTableLastPdfConfig & 0x04) },
										{ titulo: "Retrato", selecionada: !!(sedDataTableLastPdfConfig & 0x08) }
									]
								}),
								((("colunasIguais" in elemento.sedDataTableObj) || ("colunasAutomaticas" in elemento.sedDataTableObj)) ? null : {
									titulo: "Colunas",
									exclusiva: true,
									opcoes: [
										{ titulo: "Iguais", selecionada: !!(sedDataTableLastPdfConfig & 0x10) },
										{ titulo: "Automáticas", selecionada: !!(sedDataTableLastPdfConfig & 0x20) },
										{ titulo: "Proporcionais", selecionada: !!(sedDataTableLastPdfConfig & 0x40) }
									]
								})
							];
							MostrarOpcoesMultiplas(grupos, function (grupos) {
								if (!grupos)
									return;

								// Salva os bits selecionados
								sedDataTableLastPdfConfig = (sedDataTableLastPdfConfig & ~0x03) | (grupos[0].opcoes[0].selecionada ? 0x01 : 0) | (grupos[0].opcoes[1].selecionada ? 0x02 : 0);
								if (grupos[1])
									sedDataTableLastPdfConfig = (sedDataTableLastPdfConfig & ~0x0C) | (grupos[1].opcoes[0].selecionada ? 0x04 : 0) | (grupos[1].opcoes[1].selecionada ? 0x08 : 0);
								if (grupos[2])
									sedDataTableLastPdfConfig = (sedDataTableLastPdfConfig & ~0x70) | (grupos[2].opcoes[0].selecionada ? 0x10 : 0) | (grupos[2].opcoes[1].selecionada ? 0x20 : 0) | (grupos[2].opcoes[2].selecionada ? 0x40 : 0);

								try {
									if (("localStorage" in window))
										window.localStorage.setItem("sedDataTableLastPdfConfig", sedDataTableLastPdfConfig);
								} catch (ex) {
								}

								var title = (elemento.sedDataTableObj.nomeExportacao || "Dados");
								sedPdfExporter.generate(dt, {
									exportOptions: {},
									header: grupos[0].opcoes[0].selecionada,
									footer: grupos[0].opcoes[1].selecionada,
									evenColumns: (!grupos[2] ? (elemento.sedDataTableObj.colunasIguais === true && elemento.sedDataTableObj.colunasAutomaticas !== true) : grupos[2].opcoes[0].selecionada),
									autoColumns: (!grupos[2] ? (elemento.sedDataTableObj.colunasAutomaticas === true) : grupos[2].opcoes[1].selecionada),
									title: title,
									filename: title,
									pageSize: (elemento.sedDataTableObj.tamanhoPagina || "A4"),
									pageOrientation: ((!grupos[1] ? elemento.sedDataTableObj.paisagem : grupos[1].opcoes[0].selecionada) ? "landscape" : "portrait"),
									filterTitle: (elemento.sedDataTableObj.tituloFiltro || "Filtros"),
									filters: (elemento.sedDataTableObj.filtros || []),
									includeNonSortableColumns: (elemento.sedDataTableObj.incluirColunasNaoOrdenaveis === true),
									extraInitialContent: (obj && obj.conteudoInicial ? obj.conteudoInicial : []),
									extraBodyContent: (obj && obj.conteudoExtra ? obj.conteudoExtra : []),
									extraBodyStyle: (obj && obj.estiloExtra ? obj.estiloExtra : {}),
									maxRowsPerPage: (obj && obj.maximoDeLinhasPorPagina > 0 ? obj.maximoDeLinhasPorPagina : 0)
								});
							}, "Gerar PDF", "sm", 1, "Gerar");
						};
						row.appendChild(btn);
					}

					if (linhaComBotoes) {
						if (btnFull) {
							// Para evitar corromper os controles abaixo, caso só exista o botaoTelaCheia
							if (btnOutros)
								btnFull.style.cssFloat = "left";
							else
								row.style.textAlign = "left";
						}
						div.parentNode.parentNode.parentNode.insertBefore(row, div.parentNode.parentNode.parentNode.firstChild);
					}
				}
			}
		})(this[i]);
	}

	this.show();

	return this;
};

$.fn.sedDataTableFilter = function (obj) {
	if (this.length !== 1) {
		if (this.length)
			alert("Você não pode utilizar a função sedDataTableFilter() com uma query que retorna mais de um elemento por vez.");
		return [];
	}

	var i, j, label, input, multiple, filtros = [], div, divs = $("div.form-group", this);

	for (i = 0; i < divs.length; i++) {
		div = divs[i];

		label = div.getElementsByTagName("LABEL")[0];
		if (!label)
			continue;
		label = trim(label.textContent);
		if (!label)
			continue;
		if (label.charAt(label.length - 1) == ":")
			label = trim(label.substr(0, label.length - 1));
		if (!label)
			continue;

		input = div.getElementsByTagName("INPUT")[0];
		if (input && input.getAttribute("type") != "hidden") {
			// Tenta extrair o valor do input
			switch (input.getAttribute("type")) {
				case "checkbox":
				case "radio":
					input = (input.checked ? "Sim" : "Não");
					break;
				default:
					input = trim(input.value.toString());
					break;
			}
		} else {
			input = div.getElementsByTagName("SELECT")[0];
			if (!input)
				continue;

			// Tenta extrair o valor do select (seja ele multiple ou não)
			if (input.getAttribute("multiple")) {
				multiple = "";

				for (j = 0; j < input.options.length; j++) {
					if (!input.options[j].selected)
						continue;

					if (multiple)
						multiple += "; ";

					multiple += trim(input.options[j].text);
				}

				input = multiple;
			} else {
				if (input.selectedIndex < 0 || !input.value)
					continue;

				input = trim(input.options[input.selectedIndex].text);
			}
		}

		if (!input)
			continue;

		filtros.push({ nome: label, valor: input });
	}

	if (obj && obj.length) {
		// Adiciona os filtros personalizados
		for (i = 0; i < obj.length; i++)
			filtros.push(obj[i]);
	}

	return filtros;
};

$.fn.sedTabControl = function (obj) {
	if (this.length !== 1) {
		if (this.length)
			alert("Você não pode utilizar a função sedTabControl() com uma query que retorna mais de um elemento por vez.");
		return this;
	}

	var elemento = this[0], ul, li, a, i, div, href, id, callback;

	if (obj === "atual") {
		if (arguments.length > 1) {
			if (arguments[1]) {
				id = arguments[1].toString();
				a = $("ul.nav>li>a", this);
				if (a) {
					for (i = a.length - 1; i >= 0; i--) {
						if (a[i].sedTabControlCurrentTabId === id) {
							a[i].click();
							break;
						}
					}
				}
			}
			return this;
		} else {
			return elemento.sedTabControlCurrentTabId;
		}
	}

	callback = ((obj && obj.callback) ? obj.callback : null);

	elemento.sedTabControlCurrentTabId = "";

	this.addClass((obj && (obj.embutida || obj.embutido)) ? "tab-control embutido" : "tab-control");

	ul = $("ul.nav", this);

	if (!ul || !ul.length)
		return this;

	ul = ul[0];
	ul.setAttribute("role", "tablist");
	ul.className = "nav nav-pills";

	li = $("li", $(ul));
	if (li) {
		for (i = li.length - 1; i >= 0; i--)
			li[i].setAttribute("role", "presentation");
	}

	a = $("li>a", $(ul));
	if (a) {
		for (i = a.length - 1; i >= 0; i--) {
			a[i].setAttribute("role", "tab");
			href = a[i].href.lastIndexOf("#");
			if (href >= 0)
				a[i].setAttribute("aria-controls", id = a[i].href.substr(href + 1));
			else
				id = "";
			a[i].sedTabControlCurrentTabId = id;
			if (a[i].parentNode.className.indexOf("active") >= 0 && id)
				elemento.sedTabControlCurrentTabId = id;
		}
		a.click(function (e) {
			var old = elemento.sedTabControlCurrentTabId;
			elemento.sedTabControlCurrentTabId = this.sedTabControlCurrentTabId;
			cancelEvent(e);
			$(this).tab("show");
			if (callback)
				callback(old, this.sedTabControlCurrentTabId);
			return false;
		});
	}

	if (obj && (obj.embutida || obj.embutido))
		$("div.tab-content", this).addClass("embutido");

	div = $("div.tab-content>div", this);
	if (div) {
		for (i = div.length - 1; i >= 0; i--) {
			div[i].setAttribute("role", "tabpanel");
			if (div[i].className.indexOf("tab-pane") < 0)
				div[i].className = "tab-pane " + div[i].className;
		}
	}

	this.show();

	return this;
};

$.fn.sedLoading = function (obj) {
	this.html("<div class=\"msg-windows8\"><div class=\"msg-wBall msg-wBall1\"><div class=\"msg-wInnerBall msg-wInnerBall-blue\"></div></div><div class=\"msg-wBall msg-wBall2\"><div class=\"msg-wInnerBall msg-wInnerBall-blue\"></div></div><div class=\"msg-wBall msg-wBall3\"><div class=\"msg-wInnerBall msg-wInnerBall-blue\"></div></div><div class=\"msg-wBall msg-wBall4\"><div class=\"msg-wInnerBall msg-wInnerBall-blue\"></div></div><div class=\"msg-wBall msg-wBall5\"><div class=\"msg-wInnerBall msg-wInnerBall-blue\"></div></div></div>");
	return this;
};

// $.fn.sedAutoComplete
(function () {
	function sedAutoCompleteAClick(e) {
		var data = this.sedAutoCompleteData;
		if (data) {
			data.elemento.value = this.textContent;
			data.fechar();
			if (data.onblur)
				data.onblur.call(data.elemento);
			if (data.onselect)
				data.onselect.call(data.elemento);
		}
		return cancelEvent(e);
	}

	function sedAutoCompleteKeyDown(e) {
		var data = this.sedAutoCompleteData, code;
		if (!data)
			return;

		if (e.key) {
			switch (e.key) {
				case "ArrowUp":
					code = 38;
					break;
				case "ArrowDown":
					code = 40;
					break;
				case "ArrowLeft":
					code = 37;
					break;
				case "ArrowRight":
					code = 39;
					break;
				case "Enter":
					code = 13;
					break;
				case "Shift":
				case "ShiftLeft":
				case "ShiftRight":
					code = 16;
					break;
				case "Control":
				case "ControlLeft":
				case "ControlRight":
					code = 17;
					break;
				case "Tab":
					code = 9;
					break;
				default:
					code = 0;
					break;
			}
		} else {
			code = e.keyCode;
		}

		switch (code) {
			case 9: // tab
			case 16: // shift
			case 17: // ctrl
			case 37: // left
			case 39: // right
				return true;
			case 38: // up
				if (e.preventDefault)
					e.preventDefault();
				if (data.dropDown.className != "dropdown") {
					data.selecao--;
					data.atualizarSelecao();
				}
				return false;
			case 40: // down
				if (e.preventDefault)
					e.preventDefault();
				if (data.dropDown.className != "dropdown") {
					data.selecao++;
					data.atualizarSelecao();
				}
				return false;
			case 13: // enter
				if (e.preventDefault)
					e.preventDefault();
				return false;
		}
		return true;
	}

	function sedAutoCompleteKeyUp(e) {
		var data = this.sedAutoCompleteData, code;
		if (!data)
			return;

		if (e.key) {
			switch (e.key) {
				case "ArrowUp":
					code = 38;
					break;
				case "ArrowDown":
					code = 40;
					break;
				case "ArrowLeft":
					code = 37;
					break;
				case "ArrowRight":
					code = 39;
					break;
				case "Enter":
					code = 13;
					break;
				case "Shift":
				case "ShiftLeft":
				case "ShiftRight":
					code = 16;
					break;
				case "Control":
				case "ControlLeft":
				case "ControlRight":
					code = 17;
					break;
				case "Tab":
					code = 9;
					break;
				default:
					code = 0;
					break;
			}
		} else {
			code = e.keyCode;
		}

		switch (code) {
			case 9: // tab
			case 16: // shift
			case 17: // ctrl
			case 37: // left
			case 39: // right
				return true;
			case 38: // up
			case 40: // down
				if (e.preventDefault)
					e.preventDefault();
				if (data.dropDown.className != "dropdown")
					return false;
				data.ultimaBusca = null;
				break;
			case 13: // enter
				if (e.preventDefault)
					e.preventDefault();
				if (data.dropDown.className != "dropdown") {
					data.selecionar();
					return false;
				}
				data.ultimaBusca = null;
				break;
		}

		var normalizado = NormalizarString(this.value);
		if (data.ultimaBusca == normalizado)
			return;

		data.ultimaBusca = normalizado;

		if (data.onchange && data.onchange.call(data.elemento, normalizado) === false)
			return true;

		if (normalizado)
			data.abrir(normalizado);
		else
			data.fechar();

		return true;
	}

	function sedAutoCompleteBlur() {
		var data = this.sedAutoCompleteData;
		if (!data)
			return;

		if (data.timerID)
			clearTimeout(data.timerID);
		if (data.dropDown.className != "dropdown") {
			data.versao++;
			data.timerID = setTimeout(sedAutoCompleteBlurTimeout, 300, { data: data, versao: data.versao });
		} else if (data.onblur) {
			data.onblur.call(data.elemento);
		}
	}

	function sedAutoCompleteBlurTimeout(x) {
		if (!x || !x.data || x.data.versao !== x.versao)
			return;
		x.data.fechar();
		if (x.data.onblur)
			x.data.onblur.call(x.data.elemento);
	}

	function sedAutoCompleteSelecionar() {
		if (!this.menu || !this.menu.childNodes.length)
			return;
		if (this.selecao < 0)
			this.selecao = 0;
		else if (this.selecao >= this.menu.childNodes.length)
			this.selecao = this.menu.childNodes.length - 1;
		var li = this.menu.childNodes[this.selecao];
		this.elemento.value = li.textContent;
		this.fechar();
		if (this.controleOrigem)
			this.controleOrigem.value = li.sedAutoCompleteValOrigem;
		if (this.onselect)
			this.onselect.call(this.elemento);
	}

	function sedAutoCompleteAtualizarSelecao() {
		if (!this.menu || !this.menu.childNodes.length)
			return;
		if (this.selecao < 0)
			this.selecao = 0;
		else if (this.selecao >= this.menu.childNodes.length)
			this.selecao = this.menu.childNodes.length - 1;
		var i;
		for (i = this.menu.childNodes.length - 1; i >= 0; i--)
			this.menu.childNodes[i].style.background = "";
		this.menu.childNodes[this.selecao].style.background = "#9dd0f2";
	}

	function sedAutoCompleteAbrir(normalizado) {
		var i, li, a, ok = false, controleOrigem = this.controleOrigem, lista = (controleOrigem ? controleOrigem.getElementsByTagName("OPTION") : this.lista), menu = this.menu, txt, norm, valOrigem = null;

		while (this.menu.firstChild)
			this.menu.removeChild(this.menu.firstChild);

		for (i = 0; i < lista.length; i++) {
			li = lista[i];
			if (controleOrigem) {
				if (!(valOrigem = li.value))
					continue;
				txt = li.textContent;
				norm = li.sedAutoCompleteNorm;
				if (!norm) {
					norm = NormalizarString(txt);
					li.sedAutoCompleteNorm = norm;
				}
			} else {
				txt = li.texto;
				norm = li.normalizado;
			}
			if (!normalizado || norm.indexOf(normalizado) >= 0) {
				li = document.createElement("li");
				if (valOrigem)
					li.sedAutoCompleteValOrigem = valOrigem;
				if (!ok)
					li.style.background = "#9dd0f2";
				a = document.createElement("a");
				a.setAttribute("href", "#");
				a.sedAutoCompleteData = this;
				a.onclick = sedAutoCompleteAClick;
				a.appendChild(document.createTextNode(txt));
				li.appendChild(a);
				menu.appendChild(li);
				ok = true;
			}
		}

		this.versao++;

		if (this.timerID) {
			clearTimeout(this.timerID);
			this.timerID = null;
		}

		this.selecao = 0;

		if (ok)
			this.dropDown.className = "dropdown open";
		else
			this.dropDown.className = "dropdown";
	}

	function sedAutoCompleteFechar() {
		while (this.menu.firstChild)
			this.menu.removeChild(this.menu.firstChild);
		this.versao++;
		if (this.timerID) {
			clearTimeout(this.timerID);
			this.timerID = null;
		}
		this.ultimaBusca = null;
		this.selecao = -1;
		this.dropDown.className = "dropdown";
	}

	function sedAutoCompleteValor() {
		if (this.controleOrigem)
			return this.controleOrigem.value;
		var i, lista = this.lista, v = this.elemento.value;
		for (i = 0; i < lista.length; i++) {
			if (lista[i].texto == v)
				return lista[i].valor;
		}
		return null;
	}

	function sedAutoCompleteControleOrigem(id) {
		if (id) {
			if (typeof id === "string") {
				// id de um elemento
				if (id.charAt(0) === "#")
					return document.getElementById(id.substring(1));
				return document.getElementById(id);
			} else if (id.length === 1 && id[0] && id[0].tagName === "SELECT") {
				// jQuery
				return id[0];
			} else if (id.tagName === "SELECT") {
				// DOM normal
				return id;
			}
		}
		return null;
	}

	$.fn.sedAutoComplete = function (obj) {
		var i;

		if (!this.length)
			return this;

		if (obj === "abrir") {
			if (this.length !== 1) {
				alert("Você não pode utilizar a função sedAutoComplete(\"abrir\") com uma query que retorna mais de um elemento por vez.");
				return null;
			}
			// Mostra o menu completo, sem filtros
			if (this[0].sedAutoCompleteData)
				this[0].sedAutoCompleteData.abrir();
			return this;
		}

		if (obj === "fechar") {
			// Esconde o menu
			for (i = 0; i < this.length; i++) {
				if (this[i].sedAutoCompleteData)
					this[i].sedAutoCompleteData.fechar();
			}
			return this;
		}

		if (obj === "valor") {
			if (this.length !== 1) {
				alert("Você não pode utilizar a função sedAutoComplete(\"valor\") com uma query que retorna mais de um elemento por vez.");
				return null;
			}

			// Retorna o valor atualmente selecionado pelo controle
			// (quando os elementos da lista forem strings, o próprio
			// texto é retornado)
			// Se o texto atualmente digitado no input não fizer parte da
			// lista, retorna null
			return (this[0].sedAutoCompleteData ? this[0].sedAutoCompleteData.valor() : null);
		}

		if (!obj)
			obj = {};

		for (i = 0; i < this.length; i++) {
			(function (elemento) {
				var i, o, t, n, total = 0, data = elemento.sedAutoCompleteData, elementoReal, lista = obj.lista, atribTexto = obj.texto, atribValor = obj.valor;

				if (!data) {
					data = {
						lista: null,
						controleOrigem: null,
						selecao: -1,
						ultimaBusca: null,
						versao: 0,
						onblur: null,
						onchange: null,
						onselect: null,
						elemento: elemento,
						dropDown: document.createElement("div"),
						menu: document.createElement("ul"),
						selecionar: sedAutoCompleteSelecionar,
						atualizarSelecao: sedAutoCompleteAtualizarSelecao,
						abrir: sedAutoCompleteAbrir,
						fechar: sedAutoCompleteFechar,
						valor: sedAutoCompleteValor
					};

					// Cria um div ao redor do controle, para servir como dropdown,
					// e um ul para servir como menu suspenso
					data.dropDown.className = "dropdown";
					data.menu.className = "dropdown-menu";

					elemento.parentNode.insertBefore(data.dropDown, elemento);
					elemento.parentNode.removeChild(elemento);
					if (elemento.tagName == "SELECT") {
						atribTexto = "t";
						atribValor = "v";
						// No case do elemento select, remove o elemento todo,
						// coloca um input no lugar, e cria uma lista com o que for
						// encontrado nos options
						lista = [];
						while (elemento.firstChild) {
							if (elemento.firstChild.tagName == "OPTION") {
								t = elemento.firstChild.textContent;
								n = elemento.firstChild.getAttribute("value");
								if (!n)
									n = t;
								lista.push({ t: t, v: n });
							}
							elemento.removeChild(elemento.firstChild);
						}
						elementoReal = document.createElement("input");
						elementoReal.setAttribute("type", "text");
						elementoReal.setAttribute("id", elemento.getAttribute("id"));
						elementoReal.setAttribute("name", elemento.getAttribute("name"));
						elementoReal.className = elemento.className;
						data.elemento = elementoReal;
					} else {
						elementoReal = elemento;
						data.controleOrigem = sedAutoCompleteControleOrigem(obj.lista);
					}
					data.dropDown.appendChild(elementoReal);
					data.dropDown.appendChild(data.menu);

					elementoReal.sedAutoCompleteData = data;
					elementoReal.addEventListener("keydown", sedAutoCompleteKeyDown);
					elementoReal.addEventListener("keyup", sedAutoCompleteKeyUp);
					elementoReal.addEventListener("blur", sedAutoCompleteBlur);
				} else {
					// Verifica se está atualizando o controle de origem
					i = sedAutoCompleteControleOrigem(obj.lista);
					if (i)
						data.controleOrigem = i;
				}

				// Recria a lista interna, caso a origem de dados não seja
				// um select visível
				if (data.controleOrigem) {
					if (!data.lista)
						data.lista = [];
				} else {
					if (!lista)
						lista = [];
					data.lista = new Array(lista.length);
					data.selecao = 0;
					data.ultimaBusca = null;

					if (typeof lista[0] === "string" || !atribTexto) {
						for (i = 0; i < lista.length; i++) {
							if (!(t = lista[i]))
								continue;
							t = t.toString();
							if (!(n = NormalizarString(t)))
								continue;
							data.lista[total++] = {
								texto: t,
								valor: t,
								normalizado: n
							};
						}
					} else {
						for (i = 0; i < lista.length; i++) {
							if (!(o = lista[i]))
								continue;
							if (!(t = o[atribTexto].toString()))
								continue;
							if (!(n = NormalizarString(t)))
								continue;
							data.lista[total++] = {
								texto: t,
								valor: (atribValor ? o[atribValor] : t),
								normalizado: n
							};
						}
					}

					// Remove quem não foi utilizado
					if (data.lista.length !== total)
						data.lista.splice(total, data.lista.length - total);
				}

				if (("onblur" in obj))
					data.onblur = obj.onblur;

				if (("onchange" in obj))
					data.onchange = obj.onchange;

				if (("onselect" in obj))
					data.onselect = obj.onselect;
			})(this[i]);
		}

		this.show();

		return this;
	};
})();

function MostrarOpcoes(itens, callback, titulo, mensagem, largura, texto, valor) {
	if (!itens || !itens.length)
		return;

	var i, div, ul, li, a, text, chosenValue = null, chosenIndex = -1, $dlg, itemClicked = function (e) {
		cancelEvent(e);
		chosenValue = this.getAttribute("data-value");
		chosenIndex = parseInt(this.getAttribute("data-index"));
		$dlg.dialog("destroy");
		return false;
	};

	div = document.createElement("div");
	if (mensagem) {
		i = document.createElement("p");
		i.appendChild(document.createTextNode(mensagem));
		div.appendChild(i);
	}

	ul = document.createElement("ul");
	ul.className = "decor-menu";

	for (i = 0; i < itens.length; i++) {
		text = (texto ? itens[i][texto] : itens[i].toString())
		li = document.createElement("li");
		a = document.createElement("a");
		a.className = "decor-menu-item decor-menu-item-child";
		a.setAttribute("href", "#");
		a.setAttribute("data-value", valor ? itens[i][valor] : text);
		a.setAttribute("data-index", i);
		a.appendChild(document.createTextNode(text));
		a.onclick = itemClicked;
		li.appendChild(a);
		ul.appendChild(li);
	}

	div.appendChild(ul);

	$dlg = $(div).dialog({
		title: (titulo || ""),
		width: (largura || ""),
		destroy: true,
		close: function () {
			if (callback)
				callback(chosenValue, chosenIndex);
		}
	});
}

function MostrarOpcoesMultiplas(grupos, callback, titulo, largura, tipoDeBotao, textoOK, busca) {
	if (!grupos || !grupos.length)
		return;

	var i, j, fieldset, h2, divForm, label, divInput, input, inputBusca, inputsParaBusca = null, name, id, op, valid = false, callbackCalled = false, $dlg, btnOK, buttons, itemClicked = function () {
		var i = this.sedMultiOpDlgI, j = this.sedMultiOpDlgJ, op;
		if (isNaN(i) || i < 0 || i >= grupos.length || isNaN(j) || j < 0 || j >= (op = grupos[i]).opcoes.length)
			return;
		if (this.getAttribute("type") === "radio") {
			for (i = op.opcoes.length - 1; i >= 0; i--)
				op.opcoes[i].selecionada = false;
			op.opcoes[j].selecionada = true;
		} else {
			op.opcoes[j].selecionada = this.checked;
		}
	};

	fieldset = document.createElement("fieldset");
	fieldset.className = "form-jagged";

	if (busca) {
		inputsParaBusca = [];
		inputBusca = document.createElement("input");
		inputBusca.setAttribute("type", "text");
		inputBusca.setAttribute("autocomplete", "off");
		inputBusca.setAttribute("aria-label", "Texto para buscar nas colunas");
		inputBusca.className = "decor-search-form-text decor-search-form-text-general margem-inferior-pequena";
		inputBusca.onkeyup = function (e) {
			if (e.keyCode === 13) { // enter
				if (e.preventDefault)
					e.preventDefault();
				return false;
			}
			var i, v = NormalizarString(inputBusca.value);
			if (!v) {
				for (i = inputsParaBusca.length - 1; i >= 0; i--)
					inputsParaBusca[i].divForm.style.display = "";
			} else {
				for (i = inputsParaBusca.length - 1; i >= 0; i--)
					inputsParaBusca[i].divForm.style.display = (inputsParaBusca[i].titulo.indexOf(v) >= 0 ? "" : "none");
			}
			return true;
		};
		fieldset.appendChild(inputBusca);
	}

	for (i = 0; i < grupos.length; i++) {
		op = grupos[i];
		if (!op || !op.opcoes || !op.opcoes.length)
			continue;

		valid = true;

		if (op.titulo) {
			h2 = document.createElement("h2");
			h2.appendChild(document.createTextNode(op.titulo.toString()));
			fieldset.appendChild(h2);
		}

		name = "sedMultiOpCtrl" + i;

		for (j = 0; j < op.opcoes.length; j++) {
			id = name + "_" + j;

			divForm = document.createElement("div");
			divForm.className = "form-group";

			label = document.createElement("label");
			label.style.width = "60%";
			label.setAttribute("for", id);
			label.appendChild(document.createTextNode(op.opcoes[j].titulo.toString()));

			divInput = document.createElement("div");
			divInput.style.width = "30%";

			input = document.createElement("input");
			input.sedMultiOpDlgI = i;
			input.sedMultiOpDlgJ = j;
			input.className = "form-control";
			input.setAttribute("id", id);
			input.checked = !!op.opcoes[j].selecionada;
			if (op.exclusiva) {
				input.setAttribute("type", "radio");
				input.setAttribute("name", name);
			} else {
				input.setAttribute("type", "checkbox");
			}
			input.onclick = itemClicked;

			divInput.appendChild(input);
			if (inputsParaBusca) {
				inputsParaBusca.push({
					titulo: NormalizarString(op.opcoes[j].titulo.toString()),
					divForm: divForm
				});
			}

			divForm.appendChild(label);
			divForm.appendChild(divInput);

			fieldset.appendChild(divForm);

			valid = true;
		}
	}

	if (!valid)
		return;

	switch (tipoDeBotao) {
		case 1:
			btnOK = {};

			btnOK[textoOK || "OK"] = function () {
				callbackCalled = true;
				if (callback)
					callback(grupos);
				$(this).dialog("destroy");
			};

			buttons = [
				btnOK,
				{
					"Voltar": function () {
						callbackCalled = true;
						if (callback)
							callback(null);
						$(this).dialog("destroy");
					}
				}
			];
			break;
		case 2:
			buttons = [
				{
					"Fechar": function () {
						callbackCalled = true;
						if (callback)
							callback(grupos);
						$(this).dialog("destroy");
					}
				}
			];
			break;
		default:
			buttons = [];
			break;
	}

	$dlg = $(fieldset).dialog({
		title: (titulo || ""),
		width: (largura || ""),
		destroy: true,
		buttons: buttons,
		close: function () {
			if (callback && !callbackCalled) {
				callbackCalled = true;
				callback((tipoDeBotao === 1) ? null : opcoes);
			}
		}
	});
}

// $.fn.autoPreencher
(function () {
	var optionValorPadrao = "SELECIONE...";
	var fundoDestaqueAmarelo = false;

	function PreencheDropDown(ddlAlvo, lista, selecionado) {
		if (lista.length > 0) {
			$.each(lista, function (contador, item) {
				if (item.value == selecionado)
					ddlAlvo.append("<option selected='selected' value ='" + item.Value + "'>" + item.Text + "</option>");
				else if (item.selected == true) {
					ddlAlvo.append("<option selected='selected' value ='" + item.Value + "'>" + item.Text + "</option>");

				}
				else
					ddlAlvo.append("<option value ='" + item.Value + "'>" + item.Text + "</option>");
			});
		}
		else if (ddlAlvo.val() != '') {
			ddlAlvo
				.empty()
				.append("<option value ='0'>Nenhum registro encontrado</option>");
		}
	}

	function autoPreencherCfg(opt) {
		if (opt.optionValorPadrao)
			optionValorPadrao = opt.optionValorPadrao;

		if (opt.fundoDestaqueAmarelo != null && opt.fundoDestaqueAmarelo)
			fundoDestaqueAmarelo = opt.fundoDestaqueAmarelo;
	};

	function autoPreencher(ddlAlvo, controller, action, obj, selecionado, container, async, callBackFimSuccessAjax, callBackInicio, method) {
		var json;

		function adicionarJson(jsonObejct) {
			json = jsonObejct;
		}

		if (selecionado == null)
			selecionado = -1;
		ddlAlvo.each(function () {
			$(this)
				.html('')
				.append("<option value =''>" + optionValorPadrao + "</option>");
		});
		if (!async && async !== false)
			async = true;

		$(this).on('change', function () {

			if (fundoDestaqueAmarelo)
				$(this).removeClass("fundoDestaqueAmarelo");

			if (typeof callBackInicio == 'function') {
				callBackInicio(ddlAlvo, adicionarJson);

			}

			ddlAlvo.each(function (i, elem) {
				$(elem)
					.html('')
					.append("<option value ='' selected='selected'>" + optionValorPadrao + "</option>");
				$(elem).trigger('change');
			});
			var data = {};
			if (obj == null && json == null)
				data.id = $(this).val();
			else if (json != null)
				data = json;

			else {
				for (var i in obj) {
					if (typeof obj[i] != 'object') {
						var seletor = "[name=" + obj[i] + "]";
						if (container != null)
							data[obj[i]] = container.find(seletor).val();
						else
							data[obj[i]] = $(seletor).val();
					}
					else {
						for (var param in obj[i]) {
							var seletor = "[name=" + obj[i][param] + "]";
							if (container != null)
								data[param] = container.find(seletor).val();
							else
								data[param] = $(seletor).val();
						}
					}
				}
			}
			if ($(this).val() != '' || ($(this).html() != '' && this.tagName != 'SELECT' && this.tagName != 'INPUT' && this.tagName != 'TEXTAREA')) {
				$.ajax({
					dataType: "json",
					method: (method || 'post'),
					async: async,
					url: "/" + controller + "/" + action,
					data: data,
					success: function (lista) {
						ddlAlvo.each(function (i, elem) {
							var itemAlvo = $(elem);
							PreencheDropDown(itemAlvo, lista, !itemAlvo.attr('selecionado') || selecionado > 0 ? selecionado : itemAlvo.attr('selecionado'));
							if (selecionado >= 0)
								itemAlvo.attr('selecionado', selecionado);

							var optionsAlvo = itemAlvo.children('option[value!=]');

							if (optionsAlvo.length == 1 && !itemAlvo.attr('selecionado')) {
								itemAlvo.trigger('change');
								optionsAlvo.prop('selected', true);
							} else if (itemAlvo.attr('selecionado') != null && itemAlvo.attr('selecionado') > 0) {
								optionsAlvo.each(function (j, opt) {
									if ($(opt).attr("value") == itemAlvo.attr('selecionado')) {
										$(opt).prop("selected", true);
										itemAlvo.trigger('change');
									}
								});
								itemAlvo.val(itemAlvo.attr('selecionado')).removeAttr('selecionado');
							} else {
								if (fundoDestaqueAmarelo) {
									itemAlvo.addClass("fundoDestaqueAmarelo").click(function () {
										$(this).removeClass("fundoDestaqueAmarelo");
									});
								}
							}
						});
						if (typeof callBackFimSuccessAjax == 'function') {
							callBackFimSuccessAjax(ddlAlvo);
						}
						selecionado = -1;
						ddlAlvo.trigger('change');
					},
					error: window.tratadorJSONException
				});
			} else {
				ddlAlvo.trigger('change');
				ddlAlvo.parent();
			}
		});

		var options = $(this).children('option[value!=]');
		if (options.length == 1 && !$(this).attr("selecionado")) {
			options.prop('selected', true);
			$(this).attr("selecionado", options.attr('value'));
		}

		if ($(this).attr("selecionado")) {
			$(this).val($(this).attr("selecionado"));
			$(this).trigger('change');
		}

		return $(this);
	};

	$.fn.autoPreencher = function (ddlAlvo, controller, action, obj, selecionado, container, async, callBackFimSuccessAjax, callBackInicio) {
		return autoPreencher.call(this, ddlAlvo, controller, action, obj, selecionado, container, async, callBackFimSuccessAjax, callBackInicio, "post");
	}

	$.fn.autoPreencherGet = function (ddlAlvo, controller, action, obj, selecionado, container, async, callBackFimSuccessAjax, callBackInicio) {
		return autoPreencher.call(this, ddlAlvo, controller, action, obj, selecionado, container, async, callBackFimSuccessAjax, callBackInicio, "get");
	}

	$.fn.autoPreencherCfg = function (opt) {
		return autoPreencherCfg.call(this, opt);
	}
})();

function mostrarBotChat() {
	var botchat = document.getElementById("botchat");
	var botchatLauncher = document.getElementById("wc-launcher-open");
	var botchatCSS = document.getElementById("botchat-css");
	var botchatJS = document.getElementById("botchat-js");
	var webchatContainer = document.querySelector('.wc-container');

	if (!botchat) {
		botchat = document.createElement("div");
		botchat.setAttribute("id", "botchat");
		document.body.appendChild(botchat);
	}

	if (!botchatCSS) {
		botchatCSS = document.createElement("link");
		botchatCSS.setAttribute("href", "https://sedseecdn.azureedge.net/styles/botchat-1.0.2.css");
		botchatCSS.setAttribute("rel", "stylesheet");
		botchatCSS.setAttribute("type", "text/css");
		botchatCSS.setAttribute("id", "botchat-css");
		document.head.appendChild(botchatCSS);
	}

	if (!botchatJS) {
		botchatJS = document.createElement("script");
		botchatJS.setAttribute("src", "https://sedseecdn.azureedge.net/scripts/botchat-1.0.2.js");
		botchatJS.setAttribute("type", "text/javascript");
		botchatJS.setAttribute("id", "botchat-js");
		botchatJS.onload = function () {
			BotChat.App({
				directLine: { secret: 'C_MWPUIXwl8.cwA.3Qo.K_lAdtJSFRhosOw6I16fFsQfRfJT-MGsqj_iEwjflqs' },
				user: { id: 'Você' },
				resize: 'detect'
			}, botchat);

			function esperarContainer() {
				webchatContainer = document.querySelector('.wc-container');
				if (!webchatContainer)
					setTimeout(esperarContainer, 50);
				else
					webchatContainer.classList.add('open');
			}

			setTimeout(esperarContainer, 50);
		}
		document.body.appendChild(botchatJS);
	}

	if (webchatContainer)
		webchatContainer.classList.add('open');
}
