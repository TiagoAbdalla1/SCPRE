$(document).ready(function () {
    let usuario = JSON.parse(sessionStorage.getItem('usuario'));
    if (usuario.permissao == "\"user\"" )
        window.location.href = "Relatorio.html";
      
});