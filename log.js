$(function () {
    //logistica
    $(".incluirAtividade").on("click", incluirAtividade);

    //atividade material
    $(".incluirAtividadeMaterial").on("click", incluirAtividadeMaterial);


    function incluirAtividade() {

        var tr = $(this).closest('tr');


        var object = {
            IdAtividade: tr.children()[0].innerText,
            Descricao: tr.children()[1].innerText,
            DataLimite: tr.children().find('.dataLimite').val(),
            DataConclusao: tr.children().find('.dataConclusao').val(),
            IdTurma: $("#IdTurma").val(),
            IdTipoSituacao : tr.children().find('#IdTipoSituacao option:selected').val()
        };  
        startPageLoading();
        $.ajax({
            url: appPath + '/LogisticaMaterial/IncluirAtividade',
            data: JSON.stringify(object),
            type: 'POST',
            contentType: 'application/json; charset=utf-8',
            success: function (result) {
                if (result != null)
                    stopPageLoading();
                    $("#myModal").modal("hide");
                $('#msgError').fadeOut("slow");
                window.location.reload(true);
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log("Erro: " + xhr.responseText);
                $(this).showMessage("Erro", "Erro.");
            }
        });

       
    }

    function incluirAtividadeMaterial() {

        var tr = $(this).closest('tr');


        var object = {
            IdAtividade: tr.children()[0].innerText,
            Descricao: tr.children()[1].innerText,
            DataLimite: tr.children().find('.dataLimite').val(),
            DataConclusao: tr.children().find('.dataConclusao').val(),
            IdTurma: $("#IdTurma").val(),
            IdTipoSituacao: tr.children().find('#IdTipoSituacao option:selected').val()
        };

        startPageLoading();

        $.ajax({
            url: appPath + '/LogisticaMaterial/IncluirAtividadeMaterial',
            data: JSON.stringify(object),
            type: 'POST',
            contentType: 'application/json; charset=utf-8',
            success: function (result) {
                if (result != null)
                    stopPageLoading();
                    $("#myModal").modal("hide");
                $('#msgError').fadeOut("slow");
                window.location.reload(true);
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log("Erro: " + xhr.responseText);
                $(this).showMessage("Erro", "Erro.");
            }
        });


    }
});