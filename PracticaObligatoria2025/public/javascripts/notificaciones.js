$(document).on('click', '.list-group-item', function () {
    const correoId = $(this).data('id'); // Obtener el ID del correo

    // Solicitar el modal para el correo
    $.ajax({
        url: `/correos/verNotificacion/${correoId}`,
        method: 'GET',
        success: function (data) {
            // Cargar el contenido en el contenedor del modal
            $('#modalContainer').html(data);

            // Mostrar el modal
            $(`#notificacionModal${correoId}`).modal('show');

            // Marcar como leído
            $.ajax({
                url: `/correos/marcarLeido/${correoId}`,
                method: 'POST',
                success: function () {
                    // Actualizar la vista
                    $(`[data-id=${correoId}]`)
                        .removeClass('list-group-item-warning')
                        .addClass('list-group-item-light');
                    $(`[data-id=${correoId}] .badge`)
                        .removeClass('bg-warning text-dark')
                        .addClass('bg-success')
                        .text('Leído');
                },
                error: function () {
                    console.error(`Error al marcar como leído el correo ${correoId}.`);
                },
            });
        },
        error: function () {
            alert('Error al cargar la notificación.');
        },
    });
});




