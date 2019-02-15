$(function () {
    
    dialog2 = $("#modalEditarUsuarioBody").dialog({
        autoOpen: false,
        height: 500,
        width: 600,
        modal: true,
        buttons: {
            "Editar Usuario": salvarUsuario,
            Cancel: function () {
                dialog2.dialog("close");
            }
        },
        close: function () {
            form[0].reset();
            allFields.removeClass("ui-state-error");
        }
    });





    dialog = $("#modalNovoUsuarioBody").dialog({
        autoOpen: false,
        height: 500,
        width: 600,
        modal: true ,
        buttons: {
            "Criar Usuario": salvarNovoUsuario,
            Cancel: function () {
                dialog.dialog("close");
            }
        },
        close: function () {
            form[0].reset();
            allFields.removeClass("ui-state-error");
        }
    });


    // botao salvar na tela de edicao de turma vv
    $('#btnSalvarNovoUsuario').live("click", salvarNovoUsuario);
    function salvarNovoUsuario() {
        var idUsuario = $("#frmUsuarioNovo #IdUsuario").val();
        var login = $("#frmUsuarioNovo #Login").val();
        var senha = $("#frmUsuarioNovo #Senha").val();
        var nome = $("#frmUsuarioNovo #Nome").val();
        var email = $("#frmUsuarioNovo #Email").val();
        var matricula = $("#frmUsuarioNovo #Matricula").val();
        var idTipoSituacao = $("#frmUsuarioNovo #IdTipoSituacao").val();
        var idPerfil = $("#frmUsuarioNovo #IdPerfil").val();

        $.ajax({
            url: appPath + 'Usuarios/Editar',
            type: 'POST',
            data: JSON.stringify({
                IdUsuario: idUsuario,
                Login: login,
                Senha: senha,
                Nome: nome,
                Email: email,
                IdTipoSituacao: idTipoSituacao,
                IdPerfil: idPerfil,
                Matricula: matricula,
                UltimoLogin: '',
                DataCadastro: ''
            }),
            contentType: 'application/json; charset=utf-8',
            success: function (result) {
                if (result.Success) {
                    $("#modal_usuario_novo").modal('hide');
                    $(this).showMessage("Sucesso", result.Message);
                }
            },
            error: function (xhr, ajaxOptions, thrownError) { //error: function (result) {
                $("#modal_usuario_novo").modal('hide');
                console.log("Erro: " + xhr.responseText);
                $(this).showMessage("Erro", "Erro: " + xhr.responseText);
            }
        });
    }

    $('#btnNovoUsuario').live("click", abrirNovoUsuario);
    function abrirNovoUsuario()
    {
        startPageLoading();
        $("#modalNovoUsuarioBody").html('');
        $.ajax({
            type: 'GET',
            cache: false,
            url: appPath + '/Usuarios/Editar',
            dataType: "html",
            data: { id: 0 },
            success: function (res) {
                $("#modalNovoUsuarioBody").html(res);
                stopPageLoading();
                dialog.dialog("open");
                //$("#modal_usuario_novo").modal('show');
            },
            error: function (xhr, ajaxOptions, thrownError) {
                stopPageLoading();
            }
        });
    }

    $('#btnSalvarUsuario').live("click", salvarUsuario);
    function salvarUsuario() {
        var idUsuario = $("#frmUsuarioNovo #IdUsuario").val();
        var login = $("#frmUsuarioNovo #Login").val();
        var senha = $("#frmUsuarioNovo #Senha").val();
        var nome = $("#frmUsuarioNovo #Nome").val();
        var email = $("#frmUsuarioNovo #Email").val();
        var matricula = $("#frmUsuarioNovo #Matricula").val();
        var idTipoSituacao = $("#frmUsuarioNovo #IdTipoSituacao").val();
        var idPerfil = $("#frmUsuarioNovo #IdPerfil").val();

        $.ajax({
            url: appPath + 'Usuarios/Editar',
            type: 'POST',
            data: JSON.stringify({
                IdUsuario: idUsuario,
                Login: login,
                Senha: senha,
                Nome: nome,
                Email: email,
                IdTipoSituacao: idTipoSituacao,
                IdPerfil: idPerfil,
                Matricula: matricula,
                UltimoLogin: '',
                DataCadastro: ''
            }),
            contentType: 'application/json; charset=utf-8',
            success: function (result) {
                if (result.Success) {
                    $("#modalEditarUsuarioBody").modal('hide');
                    $(this).showMessage("Sucesso", result.Message);
                    window.location = '/Usuarios/Index';
                }
            },
            error: function (xhr, ajaxOptions, thrownError) { //error: function (result) {
                $("#modalEditarUsuarioBody").modal('hide');
                console.log("Erro: " + xhr.responseText);
                $(this).showMessage("Erro", "Erro: " + xhr.responseText);
            }
        });
    }
    
});

function EditarLinhaUsuario(id)
{
    startPageLoading();
    $("#modalEditarUsuarioBody").html('');
    $.ajax({
        type: 'GET',
        cache: false,
        url: appPath + '/Usuarios/Editar',
        data: { id: id },
        dataType: "html",
        success: function (res) {
            $("#modalEditarUsuarioBody").html(res);
            dialog2.dialog("open");
            stopPageLoading();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            stopPageLoading();
        }
    });
}