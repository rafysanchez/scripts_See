$(function () {
    // botao salvar na tela de edicao de turma
    $('#btnSalvarPresenca').on("click", salvarPresenca);
    function salvarPresenca() {       

        var vTurma = $("#IdTurma").val();
        var tamTabela = $("#tb_PresencaParticipantes tbody tr").length;
        var dataPresenca = $("#DataPresenca").val();
        var data = $("#DataPresenca option:selected").text();

        if (vTurma == null || vTurma == undefined) {
            $(this).showMessage("Alerta", "Turma não encontrado.");
            return;
        }

        if (dataPresenca == null || dataPresenca == undefined) {
            $(this).showMessage("Alerta", "Necessário ter uma data selecionada.");
            return;
        }

        if (tamTabela == null || tamTabela == undefined) {
            $(this).showMessage("Alerta", "Não existem participantes para esta turma.");
            return;
        }

        var parameters = [];
        var i = 0;
        $('#tb_PresencaParticipantes tbody tr').each(function () {
            var idNome = "#PresencaParticipantes_" + i + "__Nome";
            var vNome = $(idNome).val();
            var idPresencaParticipante = "#PresencaParticipantes_" + i + "__IdPresencaParticipante";
            var vPresencaParticipante = $(idPresencaParticipante).val();
            var idTurmaOferta = "#PresencaParticipantes_" + i + "__IdTurmaOferta";
            var vTurmaOferta = $(idTurmaOferta).val();
            var idParticipante = "#PresencaParticipantes_" + i + "__IdParticipante";
            var vParticipante = $(idParticipante).val();
            var idEstaPresente = "PresencaParticipantes_" + i + "__EstaPresente";
            var vEstaPresente = document.getElementById(idEstaPresente);
            parameters.push({
                IdPresencaParticipante: vPresencaParticipante,
                IdTurmaOferta: vTurmaOferta,
                IdTurma: vTurma,
                IdParticipante: vParticipante,
                IdTurmaData: dataPresenca,
                EstaPresente: vEstaPresente.checked,
                Nome: vNome,
                Data: data
            });
            i++;            
        });
        
        $.ajax({
            url: appPath + 'RegistroNota/SalvarPresencaParticipante',
                    type: 'POST',
                    data: JSON.stringify(parameters) ,
                    contentType: 'application/json; charset=utf-8',
                    success: function (result) {
                        if (result.Success) {
                            $(this).showMessage("Sucesso", result.Message);
                        }
                        else {
                            $(this).showMessage("Erro", result.Message);
                        }
                    },
                    error: function (xhr, ajaxOptions, thrownError) { //error: function (result) {
                        console.log("Erro: " + xhr.responseText);
                        $(this).showMessage("Erro", "Erro: " + xhr.responseText);
                    }

                });
    }
});

function AtualizarParticipantes() {
    startPageLoading();
    //alert("AtualizarParticipantes");
    var dataPresenca = $("#DataPresenca").val();
    var idTurma = $("#IdTurma").val();
   // alert('asasas');
    
    $.ajax({
        type: 'POST',
        url: appPath + 'RegistroNota/GetPresencaParticipante',
        dataType: 'json',
        data: { IdTurma: idTurma, IdTurmaData: dataPresenca },
        cache: false,
        success: function (res) {
            if (res.Success) {
                $('#tb_PresencaParticipantes').find('tbody').html('');
                var html = '';
                var i = 0;
                $.each(res.data, function (k, v) {
                    var classeChecked = '';
                    if (v.EstaPresente) {
                                classeChecked = 'checked="checked"';
                    }
                   // alert('asasas');
                    var indexCol = 1;
                    html += '<tr id="trPresencaParticipantes_' + i.toString() + '"><td><b>' + indexCol.toString() + '</b>' +
                        '<input type="hidden" value="' + v.IdPresencaParticipante + '" name="PresencaParticipantes[' + i.toString() + '].IdPresencaParticipante" id="PresencaParticipantes_' + i.toString() + '__IdPresencaParticipante" />' +
                        '<input type="hidden" value="' + v.IdTurma + '" name="PresencaParticipantes[' + i.toString() + '].IdTurma" id="PresencaParticipantes_' + i.toString() + '__IdTurma" />' +
                        '<input type="hidden" value="' + v.IdTurmaOferta + '" name="PresencaParticipantes[' + i.toString() + '].IdTurmaOferta" id="PresencaParticipantes_' + i.toString() + '__IdTurmaOferta" />' +
                        '<input type="hidden" value="' + v.IdParticipante + '" name="PresencaParticipantes[' + i.toString() + '].IdParticipante" id="PresencaParticipantes_' + i.toString() + '__IdParticipante" />' +
                        '<input type="hidden" value="' + v.IdTurmaData + '" name="PresencaParticipantes[' + i.toString() + '].IdTurmaData" id="PresencaParticipantes_' + i.toString() + '__IdTurmaData" />' +
                        '<input type="hidden" value="' + v.Nome + '" name="PresencaParticipantes[' + i.toString() + '].Nome" id="PresencaParticipantes_' + i.toString() + '__Nome" /></td>'
                        + '<td>' + v.CodigoPedidoVenda + '</td>' + '<td>' + v.NomeCliente + '</td>' + '<td>' + v.TipoSituacao + '</td><td>' +
                        v.Nome + '</td><td><input type="checkbox" style="opacity:1" name="PresencaParticipantes[' + i.toString() + '].EstaPresente" id="PresencaParticipantes_' + i.toString() + '__EstaPresente"' + classeChecked + '/> Presente</td></tr>';
                    i++;
                    indexCol++;
                });
                
                $('#tb_PresencaParticipantes').find('tbody').html(html);
               // alert('asasas');
                stopPageLoading();
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log("Erro: " + xhr.responseText);
            $(this).showMessage("Erro", "Erro: " + xhr.responseText);
            stopPageLoading();
        }
    });
    
}