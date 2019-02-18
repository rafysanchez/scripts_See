$(function () {
    // botao salvar na tela de edicao de turma
    $('#btnSalvarNota').on("click", salvarNota);
    
    
    function salvarNota() {
        var vTurma = $("#IdTurma").val();
        var tamTabela = $("#tb_NotasParticipantes tbody tr").length;
        
        if (vTurma == null || vTurma == undefined) {
            $(this).showMessage("Alerta", "Turma não encontrado.");
            return;
        }


        var parameters = [];
        var i = 0;
        $('#tb_NotasParticipantes tbody tr').each(function () {
            var idNome = "#NotasParticipantes_" + i + "__Nome";
            var vNome = $(idNome).val();
            var idRegistroNota = "#NotasParticipantes_" + i + "__IdRegistroNota";
            var vRegistroNota = $(idRegistroNota).val();
            var idTurmaOferta = "#NotasParticipantes_" + i + "__IdTurmaOferta";
            var vTurmaOferta = $(idTurmaOferta).val();
            var idParticipante = "#NotasParticipantes_" + i + "__IdParticipante";
            var vParticipante = $(idParticipante).val();
            var idNota = "#NotasParticipantes_" + i + "__Nota";
            var vNota = $(idNota).val();
            parameters.push({
                IdRegistroNota: vRegistroNota,
                IdTurmaOferta: vTurmaOferta,
                IdTurma: vTurma,
                IdParticipante: vParticipante,
                Nota: parseFloat(vNota),
                Nome: vNome
            });
            i++;
        });

        $.ajax({
            url: appPath + 'RegistroNota/SalvarNotaParticipante',
            type: 'POST',
            data: JSON.stringify(parameters),
            contentType: 'application/json; charset=utf-8',
            success: function (result) {
                if (result.Success) {
                    $(this).showMessage("Sucesso", result.Message);
                }
            },
            error: function (xhr, ajaxOptions, thrownError) { //error: function (result) {
                console.log("Erro: " + xhr.responseText);
                $(this).showMessage("Erro", "Erro: " + xhr.responseText);
            }

        });
    }
});
