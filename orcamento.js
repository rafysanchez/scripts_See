$(function () {

    $('#btnCreate').on("click", criarCustoDespesa);
    $('#novoCustoDespesa').on("click", showModalCustoDespesa);
    $('#btnSave').on("click", atribuiCustoDespesa); // realizado 
    $('#btnSaveRealizado').on("click", atribuiCustoDespesaRealizado);
    
    function showModalCustoDespesa() {
        $('#custoDespesaModal').modal('show');
    }


    function atribuiCustoDespesa() {
        var object = {
            Valor: $("#Valor").val(),
            Quantidade: $("#Quantidade").val(),
            IdCustoDespesa: $.trim($('#ddlCustoDespesa option:selected').val()),
            "OrcamentoTurma": {
                IdTurma: $("#IdTurma").val(),
                IdOrcamentoTurma: $("#IdOrcamentoTurma").val()
            }
        };

        $.ajax({
            url: appPath + 'Orcamento/AtribuiCustoDespesa',
            data: JSON.stringify(object),
            type: 'POST',
            contentType: 'application/json; charset=utf-8',
            success: function (result) {
                $("#custoDespesaModal").modal("hide");
                $('#msgError').fadeOut("slow");
                window.location.reload(true);
            },
            error: function (xhr, ajaxOptions, thrownError) { //error: function (result) {
                console.log("Erro: " + xhr.responseText);
                $(this).showMessage("Erro", "Erro.");
            }

        }).done(function (result) {
        });
    }

    function atribuiCustoDespesaRealizado() {
        var object = {
            ValorRealizado: $("#Valor").val(),
            QuantidadeRealizado: $("#Quantidade").val(),
            IdCustoDespesa: $.trim($('#ddlCustoDespesa option:selected').val()),
            "OrcamentoTurma": {
                IdTurma: $("#IdTurma").val(),
                IdOrcamentoTurma: $("#IdOrcamentoTurma").val()
            }
        };

        $.ajax({
            url: appPath + 'Orcamento/AtribuiCustoDespesaRealizado',
            data: JSON.stringify(object),
            type: 'POST',
            contentType: 'application/json; charset=utf-8',
            success: function (result) {
                $("#custoDespesaModal").modal("hide");
                $('#msgError').fadeOut("slow");
                window.location.reload(true);
            },
            error: function (xhr, ajaxOptions, thrownError) { //error: function (result) {
                console.log("Erro: " + xhr.responseText);
                $(this).showMessage("Erro", "Erro.");
            }

        }).done(function (result) {
        });
    }




    function criarCustoDespesa() {
        $.ajax({
            url: appPath + 'Turma/EditarTurmaInstrutor',
            data: JSON.stringify(getGridItens()),
            type: 'POST',
            contentType: 'application/json; charset=utf-8',
            success: function (result) {
                //$(this).showMessage("Sucesso", "Sucesso");
            },
            error: function (xhr, ajaxOptions, thrownError) { //error: function (result) {
                console.log("Erro: " + xhr.responseText);
                $(this).showMessage("Erro", "Erro.");
            }

        }).done(function (result) {

        });
    }

    function getGridItens() {
       
        var object = {
            Valor: $("#Valor").val(),
            Quantidade: $("#Quantidade").val(),
            IdCategoria: $.trim($('#ddlCategoria option:selected').val()),
            IdServico: $.trim($('#ddlServico option:selected').val()),
            IdTurma: $("#IdTurma").val()
        };
        return object;
    }


    $('#CustoRealizacao').val($('.tdTotal').html().toString().trim());
    $('#Participante').on('blur', calculaFaturamento);
    function calculaFaturamento() {
        var participante = $('#Participante').val();
        var valorUn = $('#ValorUnitario').val().replace('.', '').replace(',', '.');
        var valorFaturamento = participante * valorUn;
        $('#valorFaturamento').val(formatReal(valorFaturamento));
    }

    $('#ValorImposto').on('blur', calculaImposto);
    function calculaImposto() {
        var faturamento = $('#valorFaturamento').val().replace('.', '').replace(',', '.');
        var taxaImposto = $('#ValorImposto').val().replace('.', '').replace(',', '.');
        var receita = faturamento - (faturamento * (taxaImposto / 100));
        var valorCalculado = faturamento - receita;
        $('#ValorImpostoCalculado').val(formatReal(valorCalculado));
        $("#ValorReceita").val(formatReal(receita));
    }

    $('#PercentualEquipeVenda').on('blur', calculaComissao);

    function calculaComissao() {
        var receita = $("#ValorReceita").val().replace('.', '').replace(',', '.');
        var taxaComissao = $('#PercentualEquipeVenda').val().replace('.', '').replace(',', '.');
        var valorComissao =   receita * (taxaComissao / 100);
        var custoRealizacao = $('#CustoRealizacao').val().replace('.', '').replace(',', '.');
        var totalCusto =  valorComissao + (custoRealizacao * 1);
        var total = (receita - valorComissao) - (custoRealizacao * 1);
        var margem = receita - totalCusto;
        $('#CustoEquipeVenda').val(formatReal(valorComissao));
        $('#ValorTotalCusto').val(formatReal(totalCusto));
        $('#Margem').val(formatReal(margem));
        //$('#ValorUnitario').val($('#ValorUnitario').val().replace('.', ''));

    }


    function formatReal(mixed) {
        var int = parseInt(mixed.toFixed(2).toString().replace(/[^\d]+/g, ''));
        var tmp = int + '';
        tmp = tmp.replace(/([0-9]{2})$/g, ",$1");
        if (tmp.length > 6)
            tmp = tmp.replace(/([0-9]{3}),([0-9]{2}$)/g, ".$1,$2");

        return tmp.replace('.', '');
    }


    $('#Update').on('click', function () {
        calculaFaturamento();
        calculaImposto();
        calculaComissao();
        return false;
    });
});