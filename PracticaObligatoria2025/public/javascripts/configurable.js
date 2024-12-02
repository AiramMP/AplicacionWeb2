$(document).ready(function () {
    // Aplicar configuraciones al cargar la página
    if (window.configuracionAccesibilidad) {
        const config = window.configuracionAccesibilidad;

        if (config.paleta_colores) {
            aplicarPaletaColores(config.paleta_colores);
        }
        if (config.tamano_texto) {
            aplicarTamanoTexto(config.tamano_texto);
        }
        if (config.configuracion_navegacion !== undefined) {
            aplicarSubrayadoEnlaces(config.configuracion_navegacion === 1);
        }
    }

    // Botón para abrir el modal de configuración de accesibilidad
    $('#btnAccesibilidad').on('click', function () {
        $.ajax({
            url: '/accesibilidad/modal', // Ruta para obtener el contenido del modal
            method: 'GET',
            success: function (data) {
                // Eliminar el modal previo si existe
                if ($('#configModal').length) {
                    $('#configModal').modal('dispose');
                    $('#configModal').remove();
                }

                // Insertar el nuevo modal
                $('body').append(data);

                // Mostrar el modal
                $('#configModal').modal('show');

                // Cargar configuraciones al abrir el modal
                cargarConfiguraciones();
            },
            error: function () {
                alert('Error al cargar el modal de configuración de accesibilidad.');
            },
        });
    });

    // Cargar configuraciones de accesibilidad
    function cargarConfiguraciones() {
        $.ajax({
            url: '/accesibilidad/cargar',
            method: 'GET',
            success: function (data) {
                // Aplicar configuraciones al modal
                if (data.paleta_colores) {
                    $('#sectionColor').val(data.paleta_colores);
                    aplicarPaletaColores(data.paleta_colores);
                }
                if (data.tamano_texto) {
                    $('#fontSize').val(data.tamano_texto);
                    aplicarTamanoTexto(data.tamano_texto);
                }
                if (data.configuracion_navegacion !== undefined) {
                    $('#underlineLinks').prop('checked', data.configuracion_navegacion === 1);
                    aplicarSubrayadoEnlaces(data.configuracion_navegacion === 1);
                }
            },
            error: function () {
                alert('Error al cargar configuraciones de accesibilidad.');
            },
        });
    }

    // Guardar configuraciones de accesibilidad
    $(document).on('click', '#guardarConfiguracion', function () {
        const configuracion = {
            paleta_colores: $('#sectionColor').val(),
            tamano_texto: $('#fontSize').val(),
            configuracion_navegacion: $('#underlineLinks').is(':checked') ? 1 : 0
        };

        $.ajax({
            url: '/accesibilidad/guardar',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(configuracion),
            success: function () {
                alert('Configuración guardada exitosamente.');
                $('#configModal').modal('hide'); // Cerrar el modal
                aplicarPaletaColores(configuracion.paleta_colores);
                aplicarTamanoTexto(configuracion.tamano_texto);
                aplicarSubrayadoEnlaces(configuracion.configuracion_navegacion === 1);
            },
            error: function () {
                alert('Error al guardar la configuración.');
            }
        });
    });

    // Aplicar la paleta de colores en tiempo real
    $(document).on('change', '#sectionColor', function () {
        const paleta = $(this).val();
        aplicarPaletaColores(paleta);
    });

    // Aplicar el tamaño de texto en tiempo real
    $(document).on('change', '#fontSize', function () {
        const tamano = $(this).val();
        aplicarTamanoTexto(tamano);
    });

    // Aplicar el subrayado de enlaces en tiempo real
    $(document).on('change', '#underlineLinks', function () {
        const subrayado = $(this).is(':checked');
        aplicarSubrayadoEnlaces(subrayado);
    });

    // Función para aplicar la paleta de colores
    function aplicarPaletaColores(paleta) {
        $('body').removeClass('alto-contraste');
        if (paleta === 'alto-contraste') {
            $('body').addClass('alto-contraste');
        }
    }

    // Función para aplicar el tamaño de texto
    function aplicarTamanoTexto(tamano) {
        $('body').removeClass('texto-pequeno texto-mediano texto-grande');
        if (tamano === 'pequeno') {
            $('body').addClass('texto-pequeno');
        } else if (tamano === 'mediano') {
            $('body').addClass('texto-mediano');
        } else if (tamano === 'grande') {
            $('body').addClass('texto-grande');
        }
    }

    // Función para aplicar subrayado a los enlaces
    function aplicarSubrayadoEnlaces(subrayado) {
        if (subrayado) {
            $('a').css('text-decoration', 'underline');
        } else {
            $('a').css('text-decoration', 'none');
        }
    }
});
