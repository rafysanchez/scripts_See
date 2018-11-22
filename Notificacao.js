function NovaNotificacao(codigoNotificacao) {
    if (codigoNotificacao == undefined) {
        codigoNotificacao = 0;
    }

    $.ajax({
        type: 'GET',
        async: true,
        cache: false,
        dataType: 'html',
        data: { codigoNotificacao: codigoNotificacao },
        url: '/Notificacao/Inserir',
        success: function (data, textStatus, jqXHR) {
            $('#NovaNotificacao').empty().html(data);
            $('textarea').css("resize", "none");



            jQuery("#CodigoDiretoria").val(jQuery("#CodigoDiretoriaHidden").val());

            //jQuery('#CodigoEscola').val(jQuery('#CodigoEscolaHidden').val());

            AplicarMascaras();

            $("#frmInserir").validate({
                rules: {
                    Remetente: { required: true },
                    Assunto: { required: true },
                    Descricao: { required: true },
                    CodigoAluno: { number: true },
                    Cpf: { cpf: true }
                },
                messages: {
                    Remetente: { required: "Obrigatório" },
                    Assunto: { required: "Obrigatório" },
                    Descricao: { required: "Obrigatório" },
                    CodigoAluno: { number: "Campo numérico" },
                    Cpf: { cpf: "CPF inválido" }
                }
            });

            $('#btnSalvar').click(function (e) {
                e.preventDefault();
                if ($("#frmInserir").valid()) {
                    ValidarAbrangencia();
                }
                else {
                    return false;
                }
            });

            $('#NovaNotificacao').dialog({
                width: 825,
                draggable: false,
                modal: true,
                resizable: false,
                position: "top",
                title: "Cadastro de Notificação"
            });
        },
        error: function (jqXHR, textStatus, errorThrown) {
        }
    });
}

function ValidarAbrangencia() {
    var codigoDiretoria;
    if ($('#CodigoDiretoria').val() == null || $('#CodigoDiretoria').val().length == 0) {
        codigoDiretoria = 0;
    }
    else {
        codigoDiretoria = parseInt($('#CodigoDiretoria').val());
    }

    var codigoEscola;
    if ($('#CodigoEscola').val() == null || $('#CodigoEscola').val().length == 0) {
        codigoEscola = 0;
    }
    else {
        codigoEscola = parseInt($('#CodigoEscola').val());
    }

    var codigoPerfil;
    if ($('#CodigoPerfil').val() == null || $('#CodigoPerfil').val().length == 0) {
        codigoPerfil = 0;
    }
    else {
        codigoPerfil = parseInt($('#CodigoPerfil').val());
    }

    var codigoAluno = $('#CodigoAluno').val() == "" ? 0 : parseInt($('#CodigoAluno').val());

    var cpf = $('input#Cpf').val();


    var comportamento = $('#hdnComportamento').val();
    var adm = $('#hdnAdm').val();
    var diretoria = $('#hdnDiretoria').val();

    if ((codigoPerfil > 0 && comportamento == adm) ||
        (codigoDiretoria > 0 && codigoPerfil > 0 && comportamento == diretoria) ||
        (codigoDiretoria > 0 && codigoEscola > 0 && codigoPerfil > 0) ||
         codigoAluno > 0 ||
         cpf.length > 0) {
        Salvar();
    }
    else {
        if (codigoPerfil > 0) {
            if (codigoDiretoria == 0) {
                $("<label class='error'>Obrigatório</label>").appendTo("#Diretoria");
            }
            if (codigoEscola == 0 && comportamento != diretoria) {
                $("<label class='error'>Obrigatório</label>").appendTo("#Escola");
            }
        }
        if (codigoDiretoria == 0 &&
            codigoEscola == 0 &&
            codigoPerfil == 0 &&
            codigoAluno == 0 &&
            cpf.length == 0) {
            $("<label class='error'>Obrigatório</label>").appendTo("#Diretoria");
            $("<label class='error'>Obrigatório</label>").appendTo("#Escola");
            $("<label class='error'>Obrigatório</label>").appendTo("#Perfil");
            $("<label class='error'>Obrigatório</label>").appendTo("#Aluno");
            $("<label class='error'>Obrigatório</label>").appendTo("p#Cpf");
        }
    }
}

function Salvar() {
    //if ($('#Codigo').val() == 0) {
    //    _remetente = $('#Remetente_Inserir').val();
    //    _assunto = $('#Assunto_Inserir').val();
    //    _descricao = $('#Descricao_Inserir').val();
    //}
    //else {
    //    _remetente = $('#Remetente').val();
    //    _assunto = $('#Assunto').val();
    //    _descricao = $('#Descricao').val();
    //}

    $.ajax({
        type: 'POST',
        async: true,
        cache: false,
        data: {
            Remetente: $('#Remetente_Inserir').val(),
            Assunto: $('#Assunto_Inserir').val(),
            Descricao: $('#Descricao_Inserir').val(),
            CodigoDiretoria: $('#CodigoDiretoria').val(),
            CodigoEscola: $('#CodigoEscola').val(),
            CodigoPerfil: $('#CodigoPerfil').val(),
            CodigoAluno: $('#CodigoAluno').val(),
            Codigo: jQuery("#Codigo").val(),
            Cpf: $('input#Cpf').val().replace('.', '').replace('.', '').replace('-', '')
        },
        url: '/Notificacao/Inserir',
        success: function (data, textStatus, jqXHR) {
            $('#NovaNotificacao').dialog('close');
            CarregarNotificacoes();
        },
        error: function (jqXHR, textStatus, errorThrown) {

        }
    });
}

function Detalhe(id) {
    $.ajax({
        type: 'POST',
        async: true,
        cache: false,
        dataType: 'html',
        data: {
            id: id
        },
        url: '/Notificacao/Detalhe',
        success: function (data, textStatus, jqXHR) {
            $('#VisualizaNotificacao').empty().html(data);

            $('textarea').css("resize", "none");

            AplicarMascaras();

            $('#VisualizaNotificacao').dialog({
                //height: 400,
                width: 825,
                //draggable: false,
                //modal: true,
                //resizable: false,
                //show: {
                //    effect: "blind",
                //    duration: 1000
                //},
                //position: "top",
                title: "Notificação"
            });
        },
        error: function (jqXHR, textStatus, errorThrown) {
        }
    });
}

function MarcarVisualizacao(chkLido) {
    var lido = $(chkLido).prop("checked");
    var codNotificacao = $(chkLido).attr("codNotificacao");
    var dataVisualizacao = $(chkLido).attr("dataVisualizacao");
    if (codNotificacao > 0) {
        $.ajax({
            type: 'POST',
            async: true,
            cache: false,
            data: {
                CodigoNotificacao: codNotificacao,
                Lido: lido,
                DataVisualizacao: dataVisualizacao
            },
            url: '/Notificacao/MarcarVisualizacao',
            success: function (data, textStatus, jqXHR) {
            },
            error: function (jqXHR, textStatus, errorThrown) {
            }
        });
    }
}

function Excluir(id) {
    Mensagem.Alert({
        titulo: "Atenção!",
        mensagem: "Deseja realmente excluir a Notificação?",
        tipo: "aviso",
        botoes: [
            {
                botao: "Sim",
                callback: function () {
                    $.ajax({
                        type: 'POST',
                        async: true,
                        cache: false,
                        data: ({
                            id: id
                        }),
                        url: '/Notificacao/Excluir',
                        success: function (data, textStatus, jqXHR) {
                            $('#VisualizaNotificacao').dialog('close');
                            CarregarNotificacoes();
                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                        }
                    });
                }
            },
            {
                botao: "Não",
                callback: function () {
                    $.unblockUI();
                }
            }
        ]
    });
}

function RemoverNotificacao(notificacao) {
    //Remove da caixa de notificações da tela principal
    var obj = $(notificacao).parent();
    var id = obj.prop("id");

    if (id == 'englobaNotificacao') {
        $(obj).remove();
    }

    //Marca a notificação como lida no servidor
    var lido = true;
    var codNotificacao = $(notificacao).data("codnotificacao");
    var dataVisualizacao = $(notificacao).data("datavisualizacao");
    $.ajax({
        type: 'POST',
        async: true,
        cache: false,
        data: {
            CodigoNotificacao: codNotificacao,
            Lido: lido,
            DataVisualizacao: dataVisualizacao
        },
        url: '/Notificacao/MarcarVisualizacao',
        success: function (data, textStatus, jqXHR) {
        },
        error: function (jqXHR, textStatus, errorThrown) {
        }
    });
}

function CarregarNotificacoes() {
    //recebidas
    $.ajax({
        type: 'GET',
        async: true,
        cache: false,
        dataType: 'html',
        url: '/Notificacao/ListarNotificacoes',
        data: {
            anoLetivo: parseInt($('#txtAnoLetivo').val())
        },
        success: function (data, textStatus, jqXHR) {
            $('#listaNotificacoes').empty().html(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
        }
    });

    //enviadas
    $.ajax({
        type: 'GET',
        async: true,
        cache: false,
        dataType: 'html',
        url: '/Notificacao/ListarEnviadas',
        data: {
            anoLetivo: parseInt($('#txtAnoLetivo').val())
        },
        success: function (data, textStatus, jqXHR) {
            $('#listaEnviadas').empty().html(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
        }
    });
}

function AlteraVisualizacaoNotificacoes(sender) {
    if (sender.id == "radioEnviadas") {
        jQuery("#fieldsetNotificacoes").slideUp("fast", function () { jQuery("#fieldsetEnviadas").slideDown() });
    }
    else {
        jQuery("#fieldsetEnviadas").slideUp("fast", function () { jQuery("#fieldsetNotificacoes").slideDown() });
    }
}

//var mensagemManutencao = function () {
//    Mensagem.Alert({
//        titulo: "Aviso",
//        mensagem: "O Secretaria Escolar Digital está passando por melhorias e ajustes para servi-lo ainda melhor, e por conta dessa ação, instabilidades estão ocorrendo em algumas aplicações do sistema, como por exemplo, o GeekieLab.  Já estamos atuando para rapidamente solucionar os problemas que surgiram nas últimas semanas e, nesse sentido, agradecemos a sua compreensão. \n- Equipe SED",
//        tipo: "Aviso",
//        botoes: [
//            {
//                botao: "Não exibir novamente",
//                callback: function () {
//                    $.cookie("msgManutencao", false);
//                    $.unblockUI();
//                }
//            },
//            {
//                botao: "Fechar",
//                callback: function () {
//                    $.unblockUI();
//                }
//            }
//        ]
//    });
//}

//$().ready(function () {
//    Mensagem.CarregarMensagens(null, 2500);
//    //console.log($.cookie("msgManutencao"));
//    if ($.cookie("msgManutencao") == undefined || $.cookie("msgManutencao") == null)
//        $.cookie("msgManutencao", true);
//    if ($.cookie("msgManutencao") == "true")
//        mensagemManutencao();
//    //console.log($.cookie("msgManutencao"));
//});
