

const usuario = JSON.parse(sessionStorage.getItem('usuario'));


$(document).ready(function () {
  if (sessionStorage.getItem('token') == undefined || sessionStorage.getItem('token') == '') {
    window.location.href = "Login.html"
  }
  
    $("#userName").html(usuario.nome);
  
  

  if (usuario.permissao == "\"admin\"" || usuario.permissao == "\"rh\"")
    $("#menuAdministracao").css("display", "block");
    
  

    if (usuario.permissao == "\"rh\"")
    $("#config-admin").css("display", "none");

    if (usuario.permissao == "\"user\"")
    $("#selectUsers").css("display", "none");
   
});