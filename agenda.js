$(function () {

   $('#calendar').fullCalendar({
       weekends: true,
          //  lang: 'pt-br',

              header: {

                  left: 'prev,next today',

                  center: 'title',

                  right: 'month'//  ',agendaWeek,agendaDay'

              },

            //  defaultDate: ObterDataAtual(),

              dayNames: ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sabado'],

              dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],

              monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outrubro', 'Novembro', 'Dezembro'],

              monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Maio', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],

              allDayText: 'Dia inteiro',

              buttonText: {

                  today:    'Hoje',

                  month:    'Mês',

                  week:     'Semana',

                  day:      'Dia'

              },

              events: '../ListaEventos?id=' + $('#idInstrutor').val(),//método responsável por listar os eventos

              droppable: false, // Permite arrastar eventos no calendário

              drop: function(date) {

                  $(this).remove();//remove o evento da lista

                  var titulo = $(this).html();

                  $.ajax({

                      type: 'POST',

                       url: "@Url.Action('AdicionarEvento')" + "?title=" + titulo + "&start=" + date.format(),

                          dataType: "json",

                          contentType: "application/json",

                          success: function () {

                              $("#calendar").fullCalendar('removeEvents');

                              $("#calendar").fullCalendar("refetchEvents");

                          }

                  });

              },

              eventClick: function (calEvent) {

                  $("#hdf-id-evento-edicao").val(calEvent.id);

                  $("#txt-titulo-evento").val(calEvent.title);

                  $('.modal-editar-evento').modal('show');

              },

              editable: true,

              eventDrop: function (event) {//Chama a atualização de evento

                  atualizarEvento(event.id, event.start, event.end);

              },

              eventResize: function (event) {//quando redimensiona um evento

                  atualizarEvento(event.id, event.start, event.end);

              }
   });

     $('#verCalendario').click(function () {
        // $('div.calendario').show();
        // $('div.calendario').ready(function () {
        //     $('.fc-button-group button').click();
             
        // });
        
         //return false;
         $('#calendarioModal').modal('show');

         $('#calendar').fullCalendar({
             weekends: false,
             lang: 'pt-br'

         });
         return false;
     });

     $('#eventoId').click(function () {
        $('#eventoModal').modal('show');
        return false;
     });


     $('#btnSave').click(function () {

         var object = {
             Inicio: $("#dtInicio").val(),
             Fim: $("#dtFim").val(),
             IdEvento: $.trim($('#ddlEvento option:selected').val()),
             IdTipoPeriodo: $.trim($('#ddlTipoPeriodo option:selected').val()),
             IdInstrutor: $("#IdInstrutor").val()
         };

         $.ajax({
             url: appPath + '/Agenda/Evento',
             data: JSON.stringify(object),
             type: 'POST',
             contentType: 'application/json; charset=utf-8',
             success: function (result) {
                 if (result != null)
                     $("#myModal").modal("hide");
                     $('#msgError').fadeOut("slow");
                     window.location.reload(true);
             },
             error: function (xhr, ajaxOptions, thrownError) {
                 console.log("Erro: " + xhr.responseText);
                 $(this).showMessage("Erro", "Erro.");
             }
         });
     });
    
});