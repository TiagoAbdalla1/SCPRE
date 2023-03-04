const user = JSON.parse(sessionStorage.getItem('usuario'));

$(document).ready(function () {
    if (user.ramal == null) user.ramal = "";
    if (user.email == null) user.email = "";
    $("#inputName").val(user.nome);
    $("#inputEmail").val(user.email);
    $("#inputSenha").val(user.senha);
    $("#inputCargo").val(user.cargo);
    $("#inputRamal").val(user.ramal);
    
    $(".toggle-password").click(function() {

  $(this).toggleClass("fa-eye fa-eye-slash");
  var input = $("#inputSenha");
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

  
  setInputFilter(document.getElementById("inputSenha"), function(value) {
    return /^\d*$/.test(value); });

$("#btnFinalizarEdicao").on("click", function (e) {
    const nome = $("#inputName").val();
    const senha = $("#inputSenha").val();
    const email = $("#inputEmail").val();
    const ramal = $("#inputRamal").val();
    $.ajax({
        "url": `/usuarios/${user.cod}`,
        'data': JSON.stringify({
            "nome": nome, "senha": senha, "email": email, "ramal": ramal
        }),
        'processData': false,
        'contentType': 'application/json',
        'type': 'PATCH',
    }).done(function (data) {
        $.get(`/usuarios/${user.cod}`, function (usuario) {
            let oldUser = JSON.parse(sessionStorage.getItem("usuario"));
            oldUser.email = usuario.email;
            oldUser.senha = usuario.senha
            oldUser.ramal = usuario.ramal;
            sessionStorage.setItem('usuario', JSON.stringify(oldUser));
            console.log(data.error)
            $("#modalEditUser").modal('show')
            document.getElementById("modalEduTitle").innerHTML = "Dados Alterados com sucesso!";
            document.getElementById("modalEduDesc").innerHTML = "Seus dados foram atualizados com sucesso. A página irá recarregar em instantes";
            document.getElementById("modalBorder2").style.backgroundColor = "rgb(28, 190, 61)";
            document.getElementById("modalBorder2").style.borderColor = "#fff"; 
            $().ready(function () {
               setTimeout(function () {
                    $("#modalEditUser").modal('hide');
                    location.reload();
                }, 2500);
            });
        });

    }).fail(function (data) {
        $("#modalEditUser").modal('show');
        document.getElementById("modalEduTitle").innerHTML = "Não foi possível Alterar seus dados!";
        document.getElementById("modalEduDesc").innerHTML = data.responseJSON.error;
        document.getElementById("modalBorder2").style.backgroundColor = "#DE2A27";
        document.getElementById("modalBorder2").style.borderColor = "#fff";
        $().ready(function () {
            setTimeout(function () {
                $("#modalEditUser").modal('hide');
            }, 2500);
        });
    });

    $("#btnOkEditUser").on("click", function (e) {
        $("#modalEditUser").modal('hide');

    });
})
