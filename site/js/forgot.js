// var btnSendPassOk = document.getElementById('btnSendPassOk')
// var InputEmailSendPass = document.getElementById('InputEmailSendPass');
// var btnResetPass = document.getElementById('btnResetPass');
// var auth = firebase.auth();

// //mudar a validacao para o campo do combo box e exibir mensagem de erro ou sucesso

// btnResetPass.addEventListener('click', function () {
//   auth.sendPasswordResetEmail(InputEmailSendPass.value).then(function () {


//           $("#modalForgot").modal('show')
//           document.getElementById("modalForgotTitle").innerHTML = "Senha alterada com sucesso!";
//           document.getElementById("modalForgotDesc").innerHTML = "Sua senha foi alterada com sucesso, por favor realize um teste para verificar se está tudo ok";
//           document.getElementById("modalBorder").style.backgroundColor = "rgb(28, 190, 61)";
//           document.getElementById("modalBorder").style.borderColor = "#fff";

//           $().ready(function () {
//               setTimeout(function () {
//                   $("#modalForgot").modal('hide');
//               }, 2500);
//           });

//       }).catch(function (error) {

//           $("#modalForgot").modal('show');
//           document.getElementById("modalForgotTitle").innerHTML = "Não foi possivel alterar a senha!";
//           document.getElementById("modalForgotDesc").innerHTML = "Por favor utilize apenas números para a senha, nenhum outro carácter é permitido";
//           document.getElementById("modalBorder").style.backgroundColor = "#DE2A27";
//           document.getElementById("modalBorder").style.borderColor = "#fff";


//           $().ready(function () {
//               setTimeout(function () {
//                   $("#modalForgot").modal('hide');
//               }, 4500);
//           });

//       });
//   });


//   btnSendPassOk.addEventListener('click', function () {
//       $("#modalForgot").modal('hide');
//   });