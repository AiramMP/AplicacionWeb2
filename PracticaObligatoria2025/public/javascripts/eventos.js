$(document).ready(function () {
    $(".inscripcion").click(function () {
        const idEvento = $(this).data("id");

        $.ajax({
            url: "/eventos/inscribirse",
            type: "POST",
            data: { id: idEvento },
            success: function (response) {
                if (response.success) {
                    showToast(response.message, 'success');
                    setTimeout(function () {
                        location.reload();
                    }, 2000);
                } else {
                    showToast("Error: " + response.message, 'error');
                }
            },
            error: function () {
                showToast("Ha ocurrido un error al intentar inscribirse.", 'error');
            }
        });
    });
});


$(document).ready(function () {
    $("[id^=desapuntarse-]").click(function () {
        const button = $(this);
        const idEvento = button.data("id");
        console.log("ID del evento para desapuntarse:", idEvento);
        console.log("Se mete aqui");
        if (!idEvento) {
            toastr.error("Error: No se pudo obtener el ID del evento.");
            return;
        }

        // Enviar solicitud AJAX al servidor para desapuntarse
        $.ajax({
            url: "/eventos/desapuntarse",
            type: "POST",
            data: { id: idEvento },
            success: function (response) {
                if (response.success) {
                    showToast(response.message, 'success');
                    setTimeout(function () {
                        location.reload();
                    }, 2000);
                } else {
                    toastr.error("Error: " + response.message, "Error");
                }
            },
            error: function () {
                showToast("Ha ocurrido un error al intentar desapuntarte.", 'error');
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
                $('body').append(data);
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
            showToast(response.message, 'success'); // Mostrar notificación de éxito
            setTimeout(() => {
                location.reload(); // Recargar la página para actualizar la lista
            }, 3000); // Esperar a que la notificación se cierre
        },
        error: function (xhr) {
            if (xhr.status === 400) {
                const response = JSON.parse(xhr.responseText);
                showToast(response.message, 'error'); // Mostrar notificación de capacidad llena
            } else {
                showToast('Ocurrió un error al aceptar la inscripción.', 'error'); // Mostrar notificación genérica
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
        },
        eventClick: function (info) {
            $.ajax({
                url: `/eventos/inscribirse`,
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({ id: info.event.id }),
                success: function (response) {
                    if (response.success) {
                        if (response.message === "Ya estás inscrito en este evento.") {
                            showToast(response.message, 'info');
                        } else {
                            showToast(response.message, 'success');
                        }
                        calendar.refetchEvents();
                    } else {
                        showToast('Error: ' + response.message, 'error');
                    }
                },
                error: function () {
                    showToast('Error al inscribirse al evento.', 'error');
                }
            });
        }
    });

    calendar.render();
});




$(document).on('click', '.btn-historial', function () {
    const eventoId = $(this).data('id');
    $('#historialModalLabel').text(`Historial de Asistentes del Evento ${eventoId}`);
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

$(document).ready(function () {
    $('#filtrosEventos').on('submit', function (event) {
        event.preventDefault();

        const filtros = $(this).serialize(); // Convierte los valores del formulario en un query string
        window.location.href = `/usuarios/eventos?${filtros}`; // Redirige con los filtros aplicados
    });
});




