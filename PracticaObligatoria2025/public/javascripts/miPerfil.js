$(function(){
    /*$("#miFoto").on('click',function(){
        $("#uploadModal").modal('show');
    })*/

    $("#miFoto").on('click keypress', function (event) {
        if (event.type === 'click' || (event.type === 'keypress' && event.key === 'Enter')) {
            $("#uploadModal").modal('show');
        }
    });
    

    $("#botonsubmit").on('click',function(){
        var fileInput = $('#imageInput')[0];
        if(fileInput.files.length>0){
            var file = fileInput.files[0];
            if(file.size<=500*1024){
                $('#uploadForm').submit();
            }
            else{
                $("#errorInput").text("La imagen es muy pesada");
            }
        }
        else{
            $("#errorInput").text("No has subido una imagen");
        }
    })


     //el de abajo
    $("#botonCerrar").on('click',function(){
        $('#uploadModal').modal('hide');
    })
    //el de la cruz
    $("#cruzcerrar").on('click',function(){
        $('#uploadModal').modal('hide');
    })
})