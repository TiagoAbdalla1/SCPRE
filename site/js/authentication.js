var btnRegPt = document.getElementById('btnRegPt');
var btnRelatorio = document.getElementById('btnRelatorio');
var nameSelect = document.getElementById('nameSelect');
var inputPassword = document.getElementById('inputPassword');
var btnModalOk = document.getElementById('btnModalOk');
var newPass = document.getElementById('newPass');

$(document).ready(function () {
   
    $('#nameSelect').prop('selectedIndex', 0);
    $("#horarioSelect").prop('selectedIndex', 0);
    $("#horarioSelect").prop('disabled', true);
    $.get("/usuarios", function (usuarios) {
        for (let u of usuarios) {
            $("#nameSelect").append(new Option(u.nome, u.cod));
        }
    });

    $(".toggle-password").click(function () {

        $(this).toggleClass("fa-eye fa-eye-slash");
        var input = $("#newPass");
        if (input.attr("type") == "password") {
            input.attr("type", "text");
        } else {
            input.attr("type", "password");
        }
    });
});
$("#nameSelect").change(function (e) {
    $.get("/usuarios", function (usuarios) {
        for (let u of usuarios) {

            user = u
            cod = $("#nameSelect :selected").val()
            if (user.cod == cod) {
                //console.log(user.nome)
                UserPermi = user.nome
            }
        }
    });
})
$("#horarioSelect").change(function (e) {
    inputPassword.focus();
    inputPassword.select();
})

function verificaRegistro(value) {
    inputPassword.focus();
    inputPassword.select();
    //console.log(value)
    $.get(`/usuarios/${value}/registros`, function (registros) {
        $.get(`/usuarios/${value}`, function (usuarios) {
            var user = usuarios;
            var reg = registros[0];
            if (user.permissao == "\"rh\"" || user.permissao == "\"admin\"") {
                $("#btnRegPt").css("display", "none");
                $("#horarioSelect").css("display", "none");

            } else {
                $("#btnRegPt").css("display", "block");
                $("#horarioSelect").css("display", "block");
            }
            //console.log(user.cargo)
            //console.log(reg)
            //---------Validação se registro está undefined----------//    
               
            //var dataa = reg.data;
            //console.log(dataa)
         
            //console.log(dataBanco)
            var data = new Date();
            var ano = data.getFullYear();
            var mes = (data.getMonth() + 1);
            var dia = data.getDate();
            if (mes <= 9) {
                mes = "0" + mes;
            } else {
                mes = mes;
            }
            if (dia <= 9) {
                dia = "0" + dia;
            } else {
                dia = dia;
            }
            
            var dataAtual = ano + "-" + mes + "-" + dia;
            //console.log(reg.entrada)

            if (reg == undefined || reg.data != dataAtual)  {
                $.ajax({
                    'url': `/usuarios/${user.cod}/registros/data-script`,
                    'type': 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    }
                }).done(function (data) {
                    $("#horarioSelect").val('entrada')
                $("#horarioSelect").prop('disabled', true);
                })
                
               /* $.ajax({
                    'url': `/usuarios/${user.cod}/registros/data-entrada`,
                    'type': 'POST',
                    headers: {
                        'x-access-token': data.token,
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    }
                })*/
                
            } else if (reg.entrada == null) {
                $("#horarioSelect").val('entrada')
                $("#horarioSelect").prop('disabled', true);
            }
            //----------Verificação se data que esta no banco é igual data atual-------//    
            

            var data = reg.data;
            var res = data.split("T");
            var dataBanco = res[0];
            entrada = reg.entrada
            console.log(dataBanco)
            console.log(dataAtual)
            console.log(reg.entrada)
            if (dataBanco == dataAtual && entrada != null) {
                if (reg.entrada != null && reg.saida != null) {
                    $("#horarioSelect").val('indis')
                    $("#horarioSelect").prop('disabled', true);
                } else if (reg.intervalo != null && reg.retorno == null) {
                    $("#horarioSelect").val('retorno')
                    $("#horarioSelect").prop('disabled', false);
                } else if (reg.retorno != null && reg.saida == null) {
                    $("#horarioSelect").val('saida')
                    $("#horarioSelect").prop('disabled', false);
                } else if (reg.intervalo == null && reg.retorno == null) {
                    $("#horarioSelect").val('saida')
                    $("#horarioSelect").prop('disabled', false);
                }

            } else {

                $("#horarioSelect").val('entrada')
                $("#horarioSelect").prop('disabled', true);
            }

        });
    });
}

function registroPonto() {
    $.ajax({
        'url': '/login',
        'data': JSON.stringify({ cod: $("#nameSelect :selected").val(), senha: inputPassword.value }),
        'type': 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        }
    }).done(function (data) {
        senha = $('#inputPassword').val()
        if (senha == 123) {
     
          mudarSenha()
         
        } else {
            let tipoRegistro = $("#horarioSelect").val();
            console.log(tipoRegistro)
            $.ajax({
                'url': `/usuarios/${data.usuario.cod}/registros/${tipoRegistro}`,
                'type': 'POST',
                headers: {
                    'x-access-token': data.token,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                }
            }).done(function (data) {
                // console.log("data")
                $("#modalLogin").modal('show')
                document.getElementById("modalLoginTitle").innerHTML = "Presença confirmada!";
                document.getElementById("modalLoginDesc").innerHTML = "Sua presença foi confirmada com sucesso!";
                document.getElementById("modalBorder").style.backgroundColor = "rgb(28, 190, 61)";
                document.getElementById("modalBorder").style.borderColor = "#fff";
                $().ready(function () {
                    setTimeout(function () {
                        $("#modalLogin").modal('hide');
                        window.location.replace(window.location.href)
                    }, 1500);
                });
            }).fail(function (xhr, status, error) {
                    $("#modalLogin").modal('show');
                    document.getElementById("modalLoginTitle").innerHTML = "Não foi possível confirmar sua presença!";
                    document.getElementById("modalLoginDesc").innerHTML = xhr.responseJSON.error;
                    document.getElementById("modalBorder").style.backgroundColor = "#DE2A27";
                    document.getElementById("modalBorder").style.borderColor = "#fff";
                    //window.location.replace( window.location.href )
                })

            /*  $().ready(function () {
              setTimeout(function () {
                    $.ajax({
                        'url': `/usuarios/${data.usuario.cod}/registros/entrada`,
                        'type': 'POST',
                        headers: {
                            'x-access-token': data.token,
                            'Content-Type': 'application/json',
                            'Accept': 'application/json',
                        }
                    })
                        .done(function (data) {
                            //  console.log("entrada")
                        })
                }, 5);




            });*/
           
        }
   
    }).fail(function (xhr, status, error) {
            $("#modalLogin").modal('show');
            document.getElementById("modalLoginTitle").innerHTML = "Não foi possível confirmar sua presença!";
            document.getElementById("modalLoginDesc").innerHTML = xhr.responseJSON.error;
            document.getElementById("modalBorder").style.backgroundColor = "#DE2A27";
            document.getElementById("modalBorder").style.borderColor = "#fff";
            $().ready(function () {
                setTimeout(function () {
                    $("#modalLogin").modal('hide');
                    //window.location.replace( window.location.href )
                }, 1600);
            });
        })
}

function relatorio() {
    $.post("/login", { cod: $("#nameSelect :selected").val(), senha: inputPassword.value })
        .done(function (data) {

            senha = $('#inputPassword').val()
            if (senha == "123") {
             mudarSenha()
            } else {


                sessionStorage.setItem('token', data.token);
                sessionStorage.setItem('usuario', JSON.stringify(data.usuario));
                $("#modalLogin").modal('show')
                document.getElementById("modalLoginTitle").innerHTML = "Autenticação Realizada Com Sucesso!";
                document.getElementById("modalLoginDesc").innerHTML = "Você será redirecionado para a página de Relatório.";
                document.getElementById("modalBorder").style.backgroundColor = "rgb(28, 190, 61)";
                document.getElementById("modalBorder").style.borderColor = "#fff";
                $().ready(function () {
                    setTimeout(function () {
                        $("#modalLogin").modal('hide');
                    }, 3500);
                });
                $().ready(function () {
                    setTimeout(function () {
                        window.location.href = "Relatorio.html"
                    }, 3700);
                });
                btnModalOk.addEventListener('click', function () {
                    $("#modalLogin").modal('hide');
                    window.location.href = "Relatorio.html"
                });
            }
        }).fail(function (xhr, status, error) {
            $("#modalLogin").modal('show');
            document.getElementById("modalLoginTitle").innerHTML = "Não foi possível Acessar o Relatório!";
            document.getElementById("modalLoginDesc").innerHTML = xhr.responseJSON.error;
            document.getElementById("modalBorder").style.backgroundColor = "#DE2A27";
            document.getElementById("modalBorder").style.borderColor = "#fff";
            $().ready(function () {
                setTimeout(function () {
                    $("#modalLogin").modal('hide');
                }, 4500);
            });
        })
}


function mudarSenha(){
    $("#modalNewPass").modal('show')
    document.getElementById("passTitle").innerHTML = "Cadastro de senha";
    document.getElementById("passDesc").innerHTML = "Digite sua nova senha abaixo para acessar o sistema.";
    document.getElementById("passModal").style.backgroundColor = "#0a635e";
    document.getElementById("passModal").style.borderColor = "#fff";
    $().ready(function () {
        setTimeout(function () {
            newPass.focus();
            newPass.select();
        }, 500);
    });
    $("#btnPassOk").on('click', function () {
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
                    "senha": $("#newPass").val(),
                }),
            'processData': false,
            'contentType': 'application/json',
            'type': 'PATCH',
        }).done(function (data) {
            document.getElementById("passTitle").innerHTML = "Senha Alterada com sucesso!";
            document.getElementById("passDesc").innerHTML = "A senha foi alterada com sucesso. Acesso liberado ao sistema com a nova senha";
            document.getElementById("passModal").style.backgroundColor = "rgb(28, 190, 61)";
            document.getElementById("passModal").style.borderColor = "#fff";
            $("#btnPassOk").prop('disabled', true);
            $().ready(function () {
                setTimeout(function () {
                    window.location.href = "login.html"
                    $("#passModal").modal('hide')
                }, 2200);
            });

        }).fail(function (data) {
            $("#btnPassOk").prop('disabled', false);
            document.getElementById("passTitle").innerHTML = "Não foi possível Alterar sua senha!";
            document.getElementById("passDesc").innerHTML =  data.responseJSON.error;
            document.getElementById("passModal").style.backgroundColor = "#DE2A27";
            document.getElementById("passModal").style.borderColor = "#fff";
        });
    })
}
function mudarSenhaEnter(){
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
                    "senha": $("#newPass").val(),
                }),
            'processData': false,
            'contentType': 'application/json',
            'type': 'PATCH',
        }).done(function (data) {
            document.getElementById("passTitle").innerHTML = "Senha Alterada com sucesso!";
            document.getElementById("passDesc").innerHTML = "A senha foi alterada com sucesso. Acesso liberado ao sistema com a nova senha";
            document.getElementById("passModal").style.backgroundColor = "rgb(28, 190, 61)";
            document.getElementById("passModal").style.borderColor = "#fff";
            $("#btnPassOk").prop('disabled', true);
            $().ready(function () {
                setTimeout(function () {
                    window.location.href = "login.html"
                    $("#passModal").modal('hide')
                }, 2200);
            });

        }).fail(function (data) {
            $("#btnPassOk").prop('disabled', false);
            document.getElementById("passTitle").innerHTML = "Não foi possível Alterar sua senha!";
            document.getElementById("passDesc").innerHTML =  data.responseJSON.error;
            document.getElementById("passModal").style.backgroundColor = "#DE2A27";
            document.getElementById("passModal").style.borderColor = "#fff";
        });
}

function setInputFilter(textbox, inputFilter) {
    ["input", "mousedown", "mouseup", "select", "contextmenu", "drop"].forEach(function (event) {
        textbox.addEventListener(event, function () {
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

$('#newPass').balloon({ position: "right" });

setInputFilter(document.getElementById("newPass"), function (value) {
    return /^\d*$/.test(value);
});
setInputFilter(document.getElementById("inputPassword"), function (value) {
    return /^\d*$/.test(value);
});

$('#newPass').keydown(function (event) {
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if (keycode == '13') {
        if (UserPermi != "RH") {
            mudarSenhaEnter()
        } else {
            window.location.href = "login.html"
        }

    } event.stopPropagation();
});

$('#inputPassword').keydown(function (event) {
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if (keycode == '13') {
        if (UserPermi == "RH") {
            relatorio()

        } else {
            registroPonto()
        }

    } event.stopPropagation();
});

btnRegPt.addEventListener('click', function () {
    registroPonto()

});

btnRelatorio.addEventListener('click', function (event) {
    relatorio()
})

btnModalOk.addEventListener('click', function () {
    $("#modalLogin").modal('hide');
});