$(function () {

    $.fn.showMessage = function (titulo, mensagem) {
        $("<div></div>")
    .html(mensagem)
    .dialog({
        autoOpen: true,
        modal: true,
        title: titulo,
        buttons: {
            "OK": function () {
                $(this).dialog("close");
                return true;
            }
        }
    });
    }

    $(".datepicker").mask("99/99/9999", { placeholder: " " });

    $(".datepicker").datepicker({

        dateFormat: 'dd/mm/yy',
        dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
        dayNamesMin: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S', 'D'],
        dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
        monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
        monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
        nextText: 'Próximo',
        prevText: 'Anterior'
    });

    $.validator.methods.date = function (value, element) {
        Globalize.culture("pt-BR");
        return this.optional(element) || Globalize.parseDate(value, "dd/MM/yyyy", "pt") !== null;
    }

    $.validator.methods.number = function (value, element) {
        return this.optional(element) || Globalize.parseFloat(value, "pt") !== null;
    }

    $('[type=time]').mask('00:00', { placeholder: "--:--" });

    $(".cpf").mask("999.999.999-99", { placeholder: " " });
    $(".cnpj").mask("99.999.999/9999-99", { placeholder: " " });
    //$(".cep").mask("?999999-999", { placeholder: " " });

    $('.valor').maskMoney({ symbol: 'R$ ', showSymbol: true, thousands: '', decimal: ',', symbolStay: true });

    $('.decimal').mask('00,000', { placeholder: "00.000" });
    $('.decimal2').mask('00', { placeholder: "00" });

    if ($('#alerta').val() === "True") {
        $('.alert-notification').show();
    } else {
        $('.alert-notification').hide();
    }

});

