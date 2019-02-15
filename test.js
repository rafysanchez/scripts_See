$(function () {

    initMunicipioEvent();
    initEvents();

    function initMunicipioEvent() {
        for (var i = 0; i < 2; i++) {

            $("#ddlEstado_" + i).change(function () {
                var selected = $(this).find(":selected").val();

                var index = $(this).attr("id").split("_")[1];
                var ddlMunicipio = $("#ddlMunicipio_" + index);

                preencheMunicipio(selected, ddlMunicipio);
            });
        }
    };

    function initEvents() {

        $(document).on('click', ".remove", removeRow);
        $('#addDependente').on('click', addRow);
        $('#addPF').on("click", addPF);
        $('#updatePF').on("click", updatePF);
        $("#txtCep_0").blur(function () { buscaEndereco($(this), 0) });
        $("#txtCep_1").blur(function () { buscaEndereco($(this), 1) });

        $('#btnBuscaInstrutor').on("click", buscaInstrutor);

        $('#modalInstrutor').delegate('#grid_modal tbody tr', 'click', function () { selecionaInstrutor($(this)) });

    }

    function selecionaInstrutor(tr) {
        $("#IdInstrutor").val(tr.find("td:eq(0)").text());
        $("#txtInstrutor").val(tr.find("td:eq(3)").text());
        $("#NomeInstrutor").val(tr.find("td:eq(3)").text());

        $('#modalInstrutor').modal('hide');
    }

    function buscaInstrutor(e) {
        e.preventDefault();
        e.stopPropagation();

        var _nome = $.trim($("#txtInstrutor").val());

        if (!_nome) {
            $(this).showMessage("Alerta", "Favor informar o nome do instrutor.");
            return;
        }

        $.getJSON(appPath + "Instrutor/ListInstrutor", { nome: _nome }, function (data) {

            if (data == null) {
                $(this).showMessage("Alerta", "Instrutor não encontrado.");
                return;
            }

            $('#grid_modal tbody').empty();

            $.each(data, function (i, item) {

                $('#grid_modal tbody').append('<tr class = "tbRow">' +
                 '<td style="display:none;" >' + item.IdInstrutor + '</td>' +
                 '<td >' + item.RG + '</td>' +
                 '<td >' + item.CPF + '</td>' +
                 '<td >' + item.NomeCompleto + '</td>' +
                 '</tr>');
            });

            $('#modalInstrutor').modal('show');
        });
    }


    function preencheMunicipio(_idEstado, ddlMunicipio) {

        ddlMunicipio.html("");
        ddlMunicipio.append($("<option>").text("").attr("value", ""));

        $.getJSON(appPath + "Fornecedor/ListMunicipio", { idEstado: _idEstado }, function (data) {
            $.each(data, function (i, item) {
                ddlMunicipio.append($("<option>").text(item.Text).attr("value", item.Value));
            });
        });
    }

    function addRow(e) {
        e.preventDefault();

        var nome = $.trim($("#txtNome").val());
        var dataNascimento = $.trim($("#txtDataNascimento").val());
        var idParentesco = $.trim($('#ddlParentesco option:selected').val());
        var parentesco = $.trim($('#ddlParentesco option:selected').text());

        if (nome != "" && dataNascimento != "" && parentesco != "") {

            $('#gridDependentes tbody').append('<tr>' +
                   '<td style="display:none;">0</td>' +
                   '<td style="display:none;">' + idParentesco + '</td>' +
                   '<td>' + nome + '</td>' +
                   '<td>' + dataNascimento + '</td>' +
                   '<td>' + parentesco + '</td>' +
                   '<td><button class="remove"><i class="glyphicon glyphicon-close"></i></button></td>' +
                   '</tr>');
        }
        else {
            $(this).showMessage("Erro", "Campo Obrigatórios!");
        }
    }

    function removeRow(e) {
        e.preventDefault();
        var row = $(this).closest('tr');
        row.remove();
    };

    function getGridItens() {
        var trs = $("#gridDependentes tbody tr");
        var obj = [];

        trs.each(function () {
            var id = $(this).find("td:eq(0)").text();
            var idParentesco = $(this).find("td:eq(1)").text();
            var nome = $(this).find("td:eq(2)").text();
            var dataNascimento = $(this).find("td:eq(3)").text();
            obj.push({ IdFornecedorPFDependente: id, Nome: nome, DataNascimento: dataNascimento, IdParentesco: idParentesco });
        });

        return obj;
    }

    function addPF() {

        var form = $("#form");

        //if (form.valid()) {

            var fornecedor = serializaForm(form);
            fornecedor["FornecedorPFDependentes"] = getGridItens();

            $.ajax({
                url: appPath + 'Fornecedor/CadastroPF',
                data: JSON.stringify(fornecedor),
                type: 'POST',
                contentType: 'application/json; charset=utf-8',
                success: function (result) {
                    //$(this).showMessage("Sucesso", "Sucesso");
                    if (result.id !=null)
                       window.location.href = appPath + 'Fornecedor/EditarPF/' + result.id + "#tabContatos";
                   // { window.location.href = appPath + 'Fornecedor/Index/' + result.id; }

                    $("#erro").html(result.Mensagem);
                    console.log(result);
                },
                error: function (xhr, ajaxOptions, thrownError) { //error: function (result) {
                    console.log("Erro: " + xhr.responseText);
                    $(this).showMessage("Erro", "Erro Ajax addPF.");
                }

            }).done(function (result) {

            });
        //}
    }

    function updatePF() {
        
        var form = $("#form");
        
        //if (form.valid()) {
 
            var fornecedor = serializaForm(form);
            fornecedor["FornecedorPFDependentes"] = getGridItens();
           
            $.ajax({
                url: appPath + 'Fornecedor/EditarPF',
                data: JSON.stringify(fornecedor),
                type: 'POST',
                contentType: 'application/json; charset=utf-8',
                success: function (result) {
                    //$(this).showMessage("Sucesso", "Sucesso");
                    window.location.href = appPath + 'Fornecedor/Index/';
                    
                },
                error: function (xhr, ajaxOptions, thrownError) { //error: function (result) {
                    console.log("Erro: " + xhr.responseText);
                  
                    $(this).showMessage("Erro", "Erro Ajax updatePF.");
                }

            }).done(function (result) {
                //if (result.success)

            });
       // }
    }

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

    function buscaEndereco(cep, index) {
 
        var _cep = cep.val().replace(/\D/g, '');

        if (_cep != "") {

            var validacep = /^[0-9]{8}$/;

            if (validacep.test(_cep)) {

                $.getJSON("//viacep.com.br/ws/" + _cep + "/json/?callback=?", function (dados) {

                    if (!("erro" in dados)) {
                        $("#txtLogradouro_" + index).val(dados.logradouro);
                        $("#txtBairro_" + index).val(dados.bairro);
                        //dados.complemento//dados.localidade //dados.uf // dados.ibge
                    }
                    else {
                        $(this).showMessage("Alerta", "CEP não encontrado!");
                    }
                });
            }
            else {
                $(this).showMessage("Erro", "CEP inválido!");
            }
        }
    }
});