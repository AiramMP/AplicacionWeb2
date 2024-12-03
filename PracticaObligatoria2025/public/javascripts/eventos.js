$(document).ready(function () {
    $(".btn-primary").click(function () {
        const idEvento = $(this).data("id");
        console.log("ID del evento enviado:", idEvento); // Verifica que sea correcto
        $.ajax({
            url: "/eventos/inscribirse",
            type: "POST",
            data: { id: idEvento },
            success: function (response) {
                if (response.success) {
                    alert(response.message);
                    location.reload(); // Recargar la página para reflejar los cambios
                } else {
                    alert("Error: " + response.message);
                }
            },
            error: function () {
                alert("Ha ocurrido un error al intentar inscribirse.");
            }
        });
    });
});

$(document).ready(function () {
    // Seleccionar todos los botones que tienen un ID que comienza con "desapuntarse-"
    $("[id^=desapuntarse-]").click(function () {
        const button = $(this);
        const idEvento = button.data("id"); // Obtener el ID del evento

        console.log("ID del evento enviado para desapuntarse:", idEvento);

        if (!idEvento) {
            alert("Error: No se pudo obtener el ID del evento.");
            return;
        }

        // Enviar solicitud AJAX al servidor para desapuntarse
        $.ajax({
            url: "/eventos/desapuntarse",
            type: "POST",
            data: { id: idEvento },
            success: function (response) {
                if (response.success) {
                    alert(response.message);
                    location.reload(); // Recargar la página para reflejar los cambios
                } else {
                    alert("Error: " + response.message);
                }
            },
            error: function () {
                alert("Ha ocurrido un error al intentar desapuntarse.");
            }
        });
    });
});

$(document).ready(function () {
    $('#btnCrearEvento').on('click', function () {
        $.ajax({
            url: '/eventos/crearEvento',
            method: 'GET',
            success: function (data) {
                // Cargar el modal en el DOM
                $('body').append(data);

                // Mostrar el modal
                $('#crearEventoModal').modal('show');
            },
            error: function (err) {
                alert('Error al cargar el modal de creación de evento');
            },
        });
    });
});

$(document).on('click', '.aceptar-lista-espera', function () {
    const inscripcionId = $(this).data('id'); // Obtener el ID de la inscripción

    $.ajax({
        url: `/eventos/aceptarListaEspera/${inscripcionId}`,
        method: 'POST',
        success: function (response) {
            alert(response.message); // Mostrar mensaje de éxito
            location.reload(); // Recargar la página para actualizar la lista
        },
        error: function (xhr) {
            if (xhr.status === 400) {
                const response = JSON.parse(xhr.responseText);
                alert(response.message); // Mostrar mensaje específico para capacidad llena
            } else {
                alert('Ocurrió un error al aceptar la inscripción.');
            }
        }
    });
});


$(document).ready(function () {
    const calendarEl = document.getElementById('calendar');
    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        locale: 'es',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        events: '/eventos/calendario',
        eventDidMount: function (info) {
            console.log('Evento cargado:', info.event);
        },
        eventClick: function (info) {
            console.log('Evento clickeado:', info.event);
            if (confirm(`¿Quieres inscribirte al evento "${info.event.title}"?`)) {
                $.ajax({
                    url: `/eventos/inscribirse`,
                    method: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify({ id: info.event.id }),
                    success: function () {
                        alert('Inscripción realizada con éxito');
                        calendar.refetchEvents(); // Recargar eventos
                    },
                    error: function () {
                        alert('Error al inscribirse al evento');
                    }
                });
            }
        }
    });
    

    calendar.render(); // Renderizar el calendario
});



$(document).on('click', '.btn-historial', function () {
    const eventoId = $(this).data('id');

    // Actualizar el título del modal dinámicamente
    $('#historialModalLabel').text(`Historial de Asistentes del Evento ${eventoId}`);

    // Solicitud AJAX para obtener el historial
    $.ajax({
        url: `/eventos/historialAsistentes/${eventoId}`,
        method: 'GET',
        success: function (data) {
            let content = '';

            if (data.length === 0) {
                content = '<p class="text-center">No hay asistentes registrados para este evento.</p>';
            } else {
                content = `
                    <table class="table table-bordered">
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Correo</th>
                                <th>Fecha de Inscripción</th>
                            </tr>
                        </thead>
                        <tbody>
                `;
                data.forEach(asistente => {
                    content += `
                        <tr>
                            <td>${asistente.nombre}</td>
                            <td>${asistente.correo}</td>
                            <td>${new Date(asistente.fecha_inscripcion).toLocaleString()}</td>
                        </tr>
                    `;
                });
                content += `
                        </tbody>
                    </table>
                `;
            }

            // Cargar el contenido en el modal
            $('#historialModal .modal-body').html(content);
        },
        error: function () {
            $('#historialModal .modal-body').html('<p class="text-center text-danger">Error al cargar el historial de asistentes.</p>');
        }
    });
});



