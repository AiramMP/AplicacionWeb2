$(function(){
    $("#visibilidad").on('click',function(){
        var mostrar = $("#visibilidad").data("mostrar");
        mostrar = !mostrar;
        $(this).text(mostrar ? "Ocultar" : "Mostrar");
        $(this).data("mostrar", mostrar);
        var passwordField = $("#password");
        passwordField.attr("type", passwordField.attr("type") === "password" ? "text" : "password");
    })

    $("#visibilidadlog").on('click',function(){
        var mostrar = $("#visibilidadlog").data("mostrar");
        mostrar = !mostrar;
        $(this).text(mostrar ? "Ocultar" : "Mostrar");

        $(this).data("mostrar", mostrar);
        var passwordField = $("#passwordlog");
        passwordField.attr("type", passwordField.attr("type") === "password" ? "text" : "password");
    })
    
    $("#Registrar").on('click', function () {
        var check = true;
        var correo = $("#correo").val();
        var nombre = $("#nombre").val();
        var telefono = $("#tlf").val(); // Obtener el valor del teléfono
        var pass = $("#password").val();
    
        const expresionNombre = /^[a-zA-Z]+$/;
        const expresionCorreo = /^[^@]+@ucm\.es$/;
        const expresionContrasena = /\s/;
        const expresionTelefono = /^\d{9}$/; // Exactamente 9 dígitos
    
        // Reiniciar los errores
        $("#ErrorNombre").text("");
        $("#ErrorCorreo").text("");
        $("#ErrorTlf").text("");
        $("#ErrorPassword").text("");
    
        if (!expresionNombre.test(nombre)) {
            $("#ErrorNombre").text("Nombre no válido");
            check = false;
        }
        if (!expresionCorreo.test(correo)) {
            $("#ErrorCorreo").text("Solo pueden entrar correos UCM");
            check = false;
        }
        if (!expresionTelefono.test(telefono)) {
            $("#ErrorTlf").text("El teléfono debe tener exactamente 9 dígitos");
            check = false;
        }
        if (expresionContrasena.test(pass)) {
            $("#ErrorPassword").text("La contraseña no puede tener espacios en blanco");
            check = false;
        }
         else if (check) {
            $.ajax({
                url: "/existeUsuario",
                method: "GET",
                data: { correos: correo },
                success: function (data) {
                    if (data.length !== 0) {
                        $("#ErrorCorreo").text("Ese correo ya está en uso");
                        check = false;
                    } else if (check) {
                        $("#formularioSignIn").submit();
                    }
                },
                error: function (error) {
                    alert("No se pudo comprobar si el correo ya está en uso");
                }
            });
        }
    });
    
   
    $("#Iniciar").on('click', function (event) {
        // Evitar el envío predeterminado del formulario
        event.preventDefault();
    
        var correo = $("#correolog").val();
        var password = $("#passwordlog").val();
    
        const expresionCorreo = /^[^@]+@ucm\.es$/; // Validación de correo
    
        // Limpiar mensajes de error previos
        $("#ErrorCorreoLog").text("");
    
        if (!expresionCorreo.test(correo)) {
            $("#ErrorCorreoLog").text("Solo pueden entrar correos UCM");
        } else {
            $.ajax({
                url: "/comprobarpassword",
                method: "GET",
                data: { correos: correo, passwords: password },
                success: function (data) {
                    // Si la respuesta es exitosa, envía el formulario
                    if (data && data.correo) {
                        $("#formulariologin").submit();
                    } else {
                        $("#ErrorCorreoLog").text("Error desconocido, inténtelo de nuevo.");
                    }
                },
                error: function (error) {
                    // Manejar error del servidor (por ejemplo, código 400 o 500)
                    $("#ErrorCorreoLog").text("Contraseña equivocada o usuario no existente");
                }
            });
        }
    });
    
    

});
