$(document).ready(function () {
    $.get("/usuarios/lista-usuarios", function (usuarios) {
        for (let u of usuarios)
            $("#nameSelect").append(new Option(u.nome, u.cod));
    });

    $(".toggle-password").click(function() {

        $(this).toggleClass("fa-eye fa-eye-slash");
        var input = $("#inputPasswordReg");
        if (input.attr("type") == "password") {
          input.attr("type", "text");
        } else {
          input.attr("type", "password");
        }
      });

});

function setInputFilter(textbox, inputFilter) {
    ["input", "mousedown", "mouseup", "select", "contextmenu", "drop"].forEach(function(event) {
      textbox.addEventListener(event, function() {
        if (inputFilter(this.value)) {
          this.oldValue = this.value;
          this.oldSelectionStart = this.selectionStart;
          this.oldSelectionEnd = this.selectionEnd;
        } else if (this.hasOwnProperty("oldValue")) {
          this.value = this.oldValue;
          this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
        }
      });
    });
  }

setInputFilter(document.getElementById("inputPasswordReg"), function(value) {
    return /^\d*$/.test(value); });


function verificaUsuarioSenha(value) {
    $.get(`/usuarios/${value}`, function (usuarios) {
        user = usuarios
        console.log(user.permissao)
        if (user.permissao == "\"admin\"") {
            $("#inputPasswordReg").prop('disabled', true);
        } else {
            $("#inputPasswordReg").prop('disabled', false);
        }
    });
}

$("#btnResetPass").on('click', function () {
    let cod = $('#nameSelect option:selected').val();

    $.ajaxSetup({
        headers: {
            'x-access-token': sessionStorage.getItem('token'),
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        }
    });

    $.ajax({
        "url": `/usuarios/${cod}/senha`,
        'data': JSON.stringify(
            {
                "senha": $("#inputPasswordReg").val(),
            }),
        'processData': false,
        'contentType': 'application/json',
        'type': 'PATCH',
    }).done(function (data) {
        $("#modalChangePass").modal('show')
        document.getElementById("modalCPassTitle").innerHTML = "Senha Alterada com sucesso!";
        document.getElementById("modalCPassDesc").innerHTML = "A senha foi alterada com sucesso. Acesso liberado ao sistema com a nova senha";
        document.getElementById("modalBorder2").style.backgroundColor = "rgb(28, 190, 61)";
        document.getElementById("modalBorder2").style.borderColor = "#fff";
        $().ready(function () {
            setTimeout(function () {
                $("#modalChangePass").modal('hide');
                location.reload();
            }, 2500);
        });
    

}).fail(function (data) {
    $("#modalChangePass").modal('show');
    document.getElementById("modalCPassTitle").innerHTML = "Não foi possível Alterar sua senha!";
    document.getElementById("modalCPassDesc").innerHTML = data.responseJSON.error;
    document.getElementById("modalBorder2").style.backgroundColor = "#DE2A27";
    document.getElementById("modalBorder2").style.borderColor = "#fff";
    $().ready(function () {
        setTimeout(function () {
            $("#modalChangePass").modal('hide');
        }, 2500);
    });
});

$("#btnOkCPass").on("click", function (e) {
    $("#modalChangePass").modal('hide');

});

})
