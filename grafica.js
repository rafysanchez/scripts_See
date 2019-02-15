$(function () {


// Na página de criação de materiais didáticos
    $('#btnBuscaModulo').on("click", buscaModulo);

    function buscaModulo(e) {
    e.preventDefault();
    e.stopPropagation();

    var _nome = $.trim($("#txtModulo").val());

    if (!_nome) {
        $(this).showMessage("Alerta", "Favor informar a descrição do módulo.");
        return;
    }

    $.getJSON(appPath + "Turma/ListaTurmaCursoModulo", { nome: _nome }, function (data) {

        if (data == null) {
            $(this).showMessage("Alerta", "Turma não encontrado.");
            return;
        }

        $('#grid_modal tbody').empty();

        $.each(data, function (i, item) {

            $('#grid_modal tbody').append('<tr class = "tbRow">' +
             '<td style="display:none;" >' + item.IdTurmaCursoModulo + '</td>' +
             '<td >' + item.Modulo + '</td>' +
             '<td >' + item.Curso + '</td>' +
             '<td >' + item.Subtitulo + '</td>' +
             '</tr>');
        });

        $('#modalTurmaCursoModulo').modal('show');
    });
}

$('#modalTurmaCursoModulo').delegate('#grid_modal tbody tr', 'click', function () { selecionaTurma($(this)); });
var titulo, subtitulo, observacao;

function selecionaTurma(tr) {
    $("#IdTurmaCursoModulo").val(tr.find("td:eq(0)").text());
    $("#txtModulo").val(tr.find("td:eq(1)").text());
    titulo = tr.find("td:eq(2)").text();
    subtitulo = tr.find("td:eq(3)").text();
    $('#modalTurmaCursoModulo').modal('hide');

    addTurmaRow();
}

function addTurmaRow(e) {
    // e.preventDefault();
    var idTurmaCursoModulo = $("#IdTurmaCursoModulo").val();
    var descricao = $("#txtModulo").val();


    $('.tbTurmaCursoModulo tbody').append('<tr>' +
        '<td style="display:none"><input type="hidden" name="IdTurmaCursoModulo" value="' + idTurmaCursoModulo + '" />' + idTurmaCursoModulo + '</td>' +
        '<td><input type="hidden" name="Curso.Titulo" value="' + descricao + '" />' + descricao + '</td>' +
        '<td><input type="hidden" name="Curso.Titulo" value="' + titulo + '" />' + titulo + '</td>' +
        '<td><input type="hidden" name="Curso.Subtitulo" value="' + subtitulo + '" />' + subtitulo + '</td>' +
        '<td><a href="#" class="removeTurma glyphicon glyphicon-quick-close"></button></td>' +
        '</tr>');

    $('.seachTurma').hide();
}

$(document).on('click', ".removeTurma", removeRow);
function removeRow(e) {
    e.preventDefault();
    var row = $(this).closest('tr');
    row.remove();
    $('.seachTurma').show();
};

$(document).on('click', ".removeAnexo", removeRowAnexo);
function removeRowAnexo(e) {
    e.preventDefault();
    var row = $(this).closest('tr');
    row.remove();
};

});