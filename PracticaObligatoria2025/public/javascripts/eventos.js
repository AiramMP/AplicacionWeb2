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
