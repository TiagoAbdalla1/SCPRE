$.get(`/usuarios`,function(usuarios){

    
for  (let u of usuarios){
    cod = u.cod
    nome = u.nome
    email = u.email
   ramal = u.ramal
   cargo = u.cargo
   data = u.data
   entrada = u.entrada
   intervalo = u.intervalo
   retorno = u.retorno
   saida = u.saida
   
        
   
     
console.log(u)

if(entrada == null && intervalo == null && retorno == null && saida == null){
    status = ""
    
}else if(entrada != null && intervalo == null && retorno == null && saida == null){
    status = "Presente"
    
} else if (entrada != null  && intervalo != null && retorno == null && saida == null){
    status = "Ausente"
  
}else if (entrada != null  && intervalo != null && retorno != null && saida == null){
    status = "Presente"
    
}else if(entrada != null && intervalo != null && retorno != null && saida != null){
    status = "Ausente"
    
}

   if (email == null || email ==""){
       email = "Indisponível"
   }
   if (ramal == null || ramal==""){
    ramal = "Indisponível"
}




    $("#dataTableUsers tr:last").after(      
`
    <tr>
        <td>${nome}</td>
        <td>${email}</td>
        <td>${ramal}</td>
        <td>${cargo}</td>
        <td>${status}</td>
       
    </tr>
`
);

}

        });



        /*var data = new Date();
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

ent = entrada+""
var res = ent.split("T");
var dataBanco = res[0];
console.log(dataAtual)
console.log(dataBanco)*/


      

       