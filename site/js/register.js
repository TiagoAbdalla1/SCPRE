let btnRegister = document.getElementById('btnRegister');

$(document).ready(function () {
  $("#inputPasswordReg").val("123");
  $("#inputPasswordReg").prop('disabled', true);
  $("#inputPasswordReg").attr("type", "text");
  $("#datainicio").hide();
$("#datafim").hide();
    $.get("/cargos", function (cargos) {
        for (let c of cargos)
            $("#selectCargo").append(new Option(c.nome, c.cod));
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

$("#selectCargo").change(function (e) {
  let cargoId = $("#selectCargo").val();

  if (cargoId != '1') {
    $("#imgAdduser").height('620px');
$("#datainicio").hide();
$("#datafim").hide();
  }else{
    $("#imgAdduser").height('687px');
    $("#datainicio").show();
$("#datafim").show();
  }

})

/*function verificaCargo(value) {
    console.log(value)
    var input = document.getElementById("inputDtInicio");
    if (value == '1') {
      $("#imgAdduser").height('687px');
      inputDtInicio.style.display = "block";
      inputDtFim.style.display = "block";
      inputDtTitle.style.display = "block";
      inputDtTitle2.style.display = "block";
    } else if (value != '1') {
      $("#imgAdduser").height('620px');
      inputDtInicio.style.display = "none";
      inputDtFim.style.display = "none";
      inputDtTitle.style.display = "none";
      inputDtTitle2.style.display = "none";
    }
  };*/


  function setInputFilter(textbox, inputFilter) {
    ["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop"].forEach(function(event) {
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

  $('#inputPasswordReg').balloon({  });

  
  
  
    setInputFilter(document.getElementById("inputPasswordReg"), function(value) {
      return /^\d*$/.test(value); });


btnRegister.addEventListener('click', function () {
    let inputNome = document.getElementById('inputNomeReg').value;
    let inputEmail = document.getElementById('inputEmailReg').value;
    let inputPassword = document.getElementById('inputPasswordReg').value;
    let inputRamal = document.getElementById('inputRamalReg').value;
    let dtInicio = document.getElementById('inputDtInicio').value;
    let dtFim = document.getElementById('inputDtFim').value;

    $.ajaxSetup({
        headers: {
            'x-access-token': sessionStorage.getItem('token'),
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        }
    });

    $.ajax({
        "url": `/usuarios`,
        'data': JSON.stringify(
            {
                "cod_cargo": $('#selectCargo option:selected').val(),
                "cod_permissao": 3,
                "nome": inputNome,
                "senha": inputPassword,
                "email": inputEmail,
                "ramal": inputRamal,
                "data_inicio_contrato": dtInicio,
                "data_fim_contrato": dtFim
            }),
        'type': 'POST',
    }).done(function (data) {
        $("#modalCadastro").modal('show')
        document.getElementById("modalCadTitle").innerHTML = "Usuário criado com sucesso!";
        document.getElementById("modalCadDesc").innerHTML = "Novo usuário cadastrado no sistema com sucesso. Tudo pronto para utilizá-lo";
        document.getElementById("modalCadColor").style.backgroundColor = "#19a820";
        document.getElementById("modalCadColor").style.borderColor = "#53555f"; 
        $().ready(function () {
            setTimeout(function () {
                $("#modalLogin").modal('hide');
                window.location.replace( window.location.href )
            }, 1500);
        });
        
    }).fail(function (data) {
        $("#modalCadastro").modal('show');
        document.getElementById("modalCadTitle").innerHTML = "Não foi possível cadastrar o usuário!";
        document.getElementById("modalCadDesc").innerHTML = data.responseJSON.error;
        document.getElementById("modalCadColor").style.backgroundColor = "#DE2A27";
        document.getElementById("modalCadColor").style.borderColor = "#53555f";
    });
});






