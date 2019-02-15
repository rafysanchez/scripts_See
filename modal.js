$(function () {
    showModuleTable();


    $('#ddlAreaTematica').select2({
        placeholder: "Área Temática"
    });

    /* Cadastro Tópico */
    // 
    $('#btnSave').click(function () {
        ChangeValueTopico($("#idKey").val());
        $('#myModal').modal('hide');
    });

    function ChangeValueTopico(num) {
        $('#tableTopico').each(function () {
            contador = -2;
            $(this).find('tr').each(function () {
                contador++;
                var cells = $(this).children(); //all cells
                if (cells[0].innerText == num) {
                    $('#tableTopico td:nth-child(3)').eq(contador).html($('#txtTitulo').val());
                    $('#tableTopico td:nth-child(4)').eq(contador).html(window.parent.tinymce.get('txtDescricao').getContent());
                    $('#tableTopico td:nth-child(3)').eq(contador).append('<input type="hidden" name="item.Titulo" id = "item_Titulo" value="' + $('#txtTitulo').val() + '" />');
                    $('#tableTopico td:nth-child(4)').eq(contador).append('<textarea style="display:none" name="item.Descricao" id = "item_Descricao" > ' + window.parent.tinymce.get('txtDescricao').getContent() + "</textarea>");
                    return;
                }
            });
        });
    }

    

   
    $('#tableTopico tr td a').on('click', function () {
        $("#campo").text($(this).closest('tr').children()[1].innerText);
        $("#txtTitulo").val($(this).closest('tr').children()[2].innerText);
        //window.parent.tinymce.get('txtDescricao').setContent($(this).closest('tr').find(".getDescricao").val(), { format: 'raw' });
        $("#idKey").val($(this).closest('tr').children()[0].innerText);
        $("#myModal").modal("show");
    });

    /* Fim cadastro Tópico */

    /* Edição Tópico */
    //btnEditTopicoSave >> http://localhost:55137/Curso/Editar/27#

    $('#btnEditTopicoSave').on("click", editCursoTopico);
    function editCursoTopico() {

        var cursoTopico =  getGridTopicoItens();

        $.ajax({
            url: appPath + '/Curso/EditarCursoTopico',
            data: JSON.stringify(cursoTopico),
            type: 'POST',
            contentType: 'application/json; charset=utf-8',
            success: function (result) {
                if (result != null)
                    $('#cursoTopicoEditModal').modal('hide');
                    window.location.href = appPath + '/Curso/Editar/' + result.IdCurso;
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log("Erro: " + xhr.responseText);
                $(this).showMessage("Erro", "Erro.");
            }

        }).done(function (result) {

        });
    }

    function getGridTopicoItens()
    {
        var idCursoTopico = parseInt($("#IdCursoTopico").val());
        var titulo = $('#txtTitulo').val();
        var descricao = window.parent.tinymce.get('txtDescricao').getContent();
        var exibir = $('#ExibirTopico').is(":checked");
        var idCurso = parseInt($("#IdCurso").val());
        var idTopico = parseInt($("#idKey").val()); 
        var ordenacao = parseInt($("#Ordenacao").val());
       


        var obj = { IdCursoTopico: idCursoTopico, IdTopico: idTopico, IdCurso: idCurso, Titulo: titulo, Descricao: descricao, Exibir: exibir, Ordenacao: ordenacao };
        return obj;
    }

    /* carga da modal cadastro de curso - _cursoTopicoEdit */
    $('#tableTopicoEdit tr td a').on('click', function () {
        $("#campo").text($(this).closest('tr').children()[0].innerText);
        var simple = $(this).closest('tr').children()[1].innerText;
        $("#Ordenacao").val($(this).closest('tr').children()[1].innerText);

        $("#txtTitulo").val($(this).closest('tr').children()[2].innerText);
        window.parent.tinymce.get('txtDescricao').setContent($(this).closest('tr').find(".getDescricao").val(), { format: 'raw' });
        $("#idKey").val($(this).closest('tr').children()[0].innerText);
        $('#cursoTopicoEditModal').modal('show');
    });

    /* Fim ediçãp Tópico */




    $('#Modular').change(function() {
        showModuleTable();
    });

    function showModuleTable(e) {

        if ($('#Modular').is(":checked")) {
            $('.modulos').fadeIn();
            scrollTo(this, '.modulos', 500);
            $('#divCargaHorariaGeral').hide();
            $('#divFormatoGeral').hide();
        }
        else {
            $('.modulos').fadeOut();
            $('#divCargaHorariaGeral').show();
            $('#divFormatoGeral').show();
        }
    }


    //Rolar página até tabela de módulos
    function scrollTo(sender, target, speed) {
        var _tgt = target;
        if (speed == null) speed = 500;
        var _offset = 0;
        jQuery('html, body').animate({
            scrollTop: jQuery(target).offset().top - _offset
        }, speed, "swing");
    }

 
    
    $('.addModalModulo').on('click', addRow);
    $(document).on('click', ".remove", removeRow);
    $('.cancelModal').on('click', closeModal);
    
    function addRow(e) {
        e.preventDefault();
        // pegando dados do formulario (Cadastro de Cursos - inclusão de módulos)
        var sequencia = $.trim($("#txtSequenciaModulo").val());
        var titulo = $.trim($("#txtTituloModulo").val());
        var conteudo = $.trim(window.parent.tinymce.get('txtConteudoModulo').getContent());
        var cargaHoraria = $.trim($('#txtCargaHorariaModulo').val());
        var cargaHorariaMin = $.trim($('#txtCargaHorariaModuloMin').val());
        if (cargaHorariaMin == "") {
            cargaHorariaMin = 0;
        }
        var crc = $.trim($('#PontuacaoCRC').val()); //ALTERADO AQUI POR RAFAEL REF 927 SPRINT 4

        
        if (sequencia != "" && titulo != "" && conteudo != "" && cargaHoraria != "") {

            if ($(this).hasClass('editModalModulo')) {

                $('.tbModulo tbody').append('<tr>' +
                    '<td> </td>' +
                    '<td><input type="hidden" name="CursoModulos.Titulo" value="' + titulo + '" />' + titulo + '</td>' +
                    '<td><textarea style="display:none" name="CursoModulos.Conteudo' + sequencia + '" id = "CursoModulos.Conteudo" > ' + conteudo + "</textarea>" + conteudo + "</td>" +
                    //'<td><input type="hidden" name="CursoModulos.Conteudo" value="' + conteudo + '" />' + conteudo + '</td>' +
                    '<td><input type="hidden" name="CursoModulos.Sequencia" value="' + sequencia + '" />' + sequencia + '</td>' +
                    '<td><input type="hidden" name="CursoModulos.CargaHorariaBase" value="' + cargaHoraria + '" />' + cargaHoraria + '</td>' +
                    '<td><input type="hidden" name="CursoModulos.CargaHorariaBase" value="' + cargaHorariaMin + '" />' + cargaHorariaMin + '</td>' +
                    '<td><a href="#" class="remove glyphicon glyphicon-quick-close"></button></td>' +
                    '</tr>');
            } else {
                //ALTERADO AQUI POR RAFAEL REF 927 SPRINT 4
                $('.tbModulo tbody').append('<tr>' + '<td>'+ crc+ '</td>' +
                    '<td><input type="hidden" name="CursoModulos.Titulo" value="' + titulo + '" />' + titulo + '</td>' +
                    '<td><textarea style="display:none" name="CursoModulos.Conteudo"'+sequencia+'" id = "CursoModulos.Conteudo" > ' + conteudo + "</textarea>" + conteudo + "</td>" +
                    //'<td><input type="hidden" name="CursoModulos.Conteudo" value="' + conteudo + '" />' + conteudo + '</td>' +
                    '<td><input type="hidden" name="CursoModulos.Sequencia" value="' + sequencia + '" />' + sequencia + '</td>' +
                    '<td><input type="hidden" name="CursoModulos.CargaHorariaBase" value="' + cargaHoraria + '" />' + cargaHoraria + '</td>' +

                    '<td><input type="hidden" name="CursoModulos.CargaHorariaBase" value="' + cargaHorariaMin + '" />' + cargaHorariaMin + '</td>' +
                    '<td> - </td>'+
                    '<td><a href="#" class="remove glyphicon glyphicon-quick-close"></button></td>' +
                    '</tr>');
            }
            $('#msgError').show();
            closeModal();
        }
        else {
            $('#msgError').show();
        }
    }

    function removeRow(e) {
        e.preventDefault();
        var row = $(this).closest('tr');
        row.remove();
    };

    function closeModal(e) {
        $('#cursoModuloModal').modal('hide');
        $('#cursoModuloModalEdit').modal('hide');
    }
    
    $('a.btn.btn-success.addModulo').click(function () {
         
        $("#txtCargaHorariaModulo").val('');
        $("#txtCargaHorariaModuloMin").val('');
          $("#txtSequenciaModulo").val('');
          $("#txtConteudoModulo").val('');
          tinymce.get('txtConteudoModulo').setContent(" ");
        $("#txtTituloModulo").val('');
        $('#cursoModuloModal').modal('show');// abre _CursoModuloEdit
    });

    //$('a.btn.btn-success.addModulo.edit').click(function () {
    //    $('#cursoModuloModalEdit').modal('show');
    //});

    $('#lblErro').ready(function () {
        var erro = $('#lblErro').text();
        if (erro != "")
            $('#msgError').show();
    });



// ABRE JANELA MODAL MODULO
    $('#tbModulo tr td a').on('click', function () {
        $("#idKey").val($(this).closest('tr').children()[0].innerText);
        $("#txtTituloModuloEdit").val($(this).closest('tr').children()[1].innerText);
        $("#txtConteudoModuloEdit").text($(this).closest('tr').children()[2].innerText);
        //$("#conteudo").text($(this).closest('tr').children()[2].innerText);
       

        tinymce.get('txtConteudoModuloEdit').setContent($(this).closest('tr').children()[2].innerText);


       // alert($(this).closest('tr').children()[2].innerText);
        //$("#conteudo").text($(this).closest('tr').children()[2].innerText);
        $("#txtSequenciaModuloEdit").val($(this).closest('tr').children()[3].innerText);
        $("#txtCargaHorariaModuloEdit").val($(this).closest('tr').children()[4].innerText);
        $("#txtCargaHorariaModuloEditMin").val($(this).closest('tr').children()[5].innerText);
        $("#cursoModuloModalEdit").modal("show");
        $("#myModal").modal("hide");
    });

 
    function serializaForm(form) {
        var Model = new Object();

        var _form = form.find("input[type='text'],input[type='hidden'],select,textarea,input[type='checkbox']:checked");

        $.each(_form, function (i, item) {

            var _campo = $(item);
            var _camponome = _campo.attr("name");
            var _campovalor = _campo.val();

            if (_campovalor == null) _campovalor = "";

            Model[_camponome] = _campovalor;
        });

        return Model;
    }

    function getGridItens() {

            var idCursoModulo = parseInt($("#idKey").val());
            var titulo = $("#txtTituloModuloEdit").val();
            var conteudo = window.parent.tinymce.get('txtConteudoModuloEdit').getContent(); // $("#txtConteudoModuloEdit").val();
            var sequencia = parseInt($("#txtSequenciaModuloEdit").val());
            var cargahoraria = $("#txtCargaHorariaModuloEdit").val();
            var cargahorariaMin = $("#txtCargaHorariaModuloEditMin").val();
            var objetivo = $('#txtObjetivoModuloEdit').val();
            var publicoAlvo = $('#txtPublicoAlvoModuloEdit').val();
            //var formato = $.trim($('#ddlFormatoEdit option:selected').val());
            var idCurso = parseInt($("#IdCurso").val());

            var obj = { IdCursoModulo: idCursoModulo, IdCurso: idCurso, Titulo: titulo, Conteudo: conteudo, Sequencia: sequencia, CargaHorariaBase: cargahoraria, CargaHorariaBaseMin: cargahorariaMin, Ativo:1 , Objetivo:objetivo, PublicoAlvo:publicoAlvo };//, IdFormato: formato };
      return obj;
    }


    $('#btnEditModal').on("click", editCursoModulo); // botao editar em partial view modal

    function editCursoModulo() {

        var form = $("#form");

        //if (form.valid()) {

            var cursoModulo = serializaForm(form);
            cursoModulo["CursoModuloViewModel"] = getGridItens();

            $.ajax({
                url: appPath + '/Curso/EditarCursoModulo',
                data: JSON.stringify(cursoModulo["CursoModuloViewModel"]),
                type: 'POST',
                contentType: 'application/json; charset=utf-8',
                success: function (result) {
                    if (result != null)
                        window.location.href = appPath + '/Curso/Editar/' + result.IdCurso;
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    console.log("Erro: " + xhr.responseText);
                    $(this).showMessage("Erro", "Erro.");
                }

            }).done(function (result) {

               


            });
        //}
    }

    //var text_max = 5000;
    //$('#charNum').html(text_max);
    //$('.textarea').keyup(function () {
    //    var text_length = $('.textarea').val().length;
    //    var text_remaining = text_max - text_length;

    //$('span#charNum').html(text_remaining);
    //});

    
    //// depois mudar para classe
    //$('#txtConteudoModulo').keyup(function () {
    //    var text_length = $('#txtConteudoModulo').val().length;
    //    var text_remaining = text_max - text_length;

    //    $('span#charNum').html(text_remaining);
    //});
});