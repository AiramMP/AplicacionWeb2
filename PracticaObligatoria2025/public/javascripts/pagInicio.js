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
    
    $("#Registrar").on('click', function (event) {
        event.preventDefault();
        var check = true;
        var correo = $("#correo").val();
        var nombre = $("#nombre").val();
        var telefono = $("#tlf").val();
        var pass = $("#password").val();
    
        const expresionNombre = /^[a-zA-Z]+$/;
        const expresionCorreo = /^[^@]+@ucm\.es$/;
        const expresionContrasena = /\s/;
        const expresionTelefono = /^\d{9}$/;
    
        // Reiniciar los errores
        $("#ErrorNombre").text("");
        $("#ErrorCorreo").text("");
        $("#ErrorTlf").text("");
        $("#ErrorPassword").text("");
    
        // Validar los campos
        if (!expresionNombre.test(nombre)) {
            $("#ErrorNombre").text("Nombre no válido");
            showToast("Nombre no válido", "error");
            check = false;
        }
        if (!expresionCorreo.test(correo)) {
            $("#ErrorCorreo").text("Solo pueden entrar correos UCM");
            showToast("Solo se aceptan correos UCM", "error");
            check = false;
        }
        if (!expresionTelefono.test(telefono)) {
            $("#ErrorTlf").text("El teléfono debe tener exactamente 9 dígitos");
            showToast("El teléfono debe tener exactamente 9 dígitos", "error");
            check = false;
        }
        if (expresionContrasena.test(pass)) {
            $("#ErrorPassword").text("La contraseña no puede tener espacios en blanco");
            showToast("La contraseña no puede tener espacios en blanco", "error");
            check = false;
        }
    
        if (check) {
            $.ajax({
                url: "/existeUsuario",
                method: "GET",
                data: { correos: correo },
                success: function (data) {
                    if (data.length !== 0) {
                        $("#ErrorCorreo").text("Ese correo ya está en uso");
                        showToast("Ese correo ya está en uso", "error");
                    } else {
                        showToast("Registro exitoso. Redirigiendo...", "success");
                        setTimeout(() => {
                            $("#formularioSignIn").submit();
                        }, 2000);
                    }
                },
                error: function (error) {
                    showToast("No se pudo comprobar si el correo ya está en uso", "error");
                }
            });
        }
    });
    
    
   
    $("#Iniciar").on('click', function (event) {
        event.preventDefault(); // Evitar el envío del formulario por defecto
    
        const correo = $("#correolog").val();
        const password = $("#passwordlog").val();
    
        const expresionCorreo = /^[^@]+@ucm\.es$/;
    
        $("#ErrorCorreoLog").text(""); // Reiniciar el mensaje de error
    
        if (!expresionCorreo.test(correo)) {
            $("#ErrorCorreoLog").text("Solo pueden entrar correos UCM");
            showToast("Solo pueden entrar correos UCM", 'error');
        } else {
            $.ajax({
                url: "/comprobarpassword",
                method: "POST",
                contentType: "application/json",
                data: JSON.stringify({ correos: correo, passwords: password }),
                success: function (data) {
                    if (data && data.correo) {
                        showToast("Inicio de sesión exitoso", 'success');
                        setTimeout(() => {
                            $("#formulariologin").submit();
                        }, 2000);
                    } else {
                        $("#ErrorCorreoLog").text("Error desconocido, inténtelo de nuevo.");
                        showToast("Error desconocido, inténtelo de nuevo.", 'error');
                    }
                },
                error: function () {
                    $("#ErrorCorreoLog").text("Contraseña equivocada o usuario no existente");
                    showToast("Contraseña equivocada o usuario no existente", 'error');
                }
            });
        }
    });
    
    
    
    

});
