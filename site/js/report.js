const user = JSON.parse(sessionStorage.getItem('usuario'));
$("#textNome").hide();
if (user.permissao == "\"rh\"" || user.permissao == "\"admin\"") {
    function printData() {
        var divToPrint = document.getElementById("card");
        newWin = window.open("");
        newWin.document.write(divToPrint.outerHTML);
        newWin.print();
        newWin.close();
    }

    $("#selectUsers").change(function (e) {
        $.get("/usuarios/lista-usuarios", function (usuarios) {
            for (let u of usuarios) {
                let usuario = u
                cod = $("#selectUsers :selected").val()
                //console.log(cod)
                if (usuario.cod == cod) {
                    //console.log(usuario.nome)
                    Nome = usuario.nome
                    $("#textNome").html("Nome: " + Nome);
                }
            }
        });
    })

    $("#selectUser").change(function (e) {
        cod = $("#selectUser").val()
        $.get(`/usuarios/${cod}`, function (usuarios) {
            let u = usuarios
            cargoNotaEstg = u.cargo
        });
    })
    $("#buttonPrint").click(function () {
        $("#buttonPrint").hide();
        $("#buttonfiltro").hide();
        $("#selectUsers").hide();
        $("#btnConcluirSelectedUser").hide();
        $("#textNome").show();
        $("#BhHt").css('font-size', '12px');
        $("#ChDi").css('font-size', '12px');
        $("#BhHt").css("float", "left");
        $("#ChDi").css("float", "right");
        $('#textNome').css('margin-top', 10);
        $('#textNome').css('margin-bottom', 10);
        $('#dataTable').css('font-size', '12px')
        $('#incon').css('font-size', '12px')
        $('#incon2').css('font-size', '12px')
        $('#incon3').css('font-size', '12px')
        $('#incon4').css('font-size', '12px')
        if (cargoNotaEstg == "Estagiário") {
            $("#dataNotaEst").show();
            $("#notaEstagio").show();
        }
        printData()
        $().ready(function () {
            setTimeout(function () {
                $("#BhHt").removeAttr("style")
                $("#ChDi").removeAttr("style")
                $('#dataTable').removeAttr("style")
                $('#incon').removeAttr("style")
                $('#incon2').removeAttr("style")
                $('#incon3').removeAttr("style")
                $('#incon4').removeAttr("style")
                $("#buttonPrint").show();
                $("#selectUsers").show();
                $("#dataNotaEst").hide();
                $("#notaEstagio").hide();
                $("#buttonfiltro").show();
                $("#btnConcluirSelectedUser").show();
                $("#textNome").hide();
            }, 500);
        });
    });

    Date.timeDifference = function (date1, date2) {
        if (date1 == null || date2 == null) {
            return null;
        }
        let date1_ms = new Date(date1).getTime();
        let date2_ms = new Date(date2).getTime();
        //console.log(date_ms + " date ms")
        let difference_ms = date2_ms - date1_ms;
        difference_ms = difference_ms / 1000;
        let seconds = Math.floor(difference_ms % 60);
        difference_ms = difference_ms / 60;
        let minutes = Math.floor(difference_ms % 60);
        difference_ms = difference_ms / 60;
        let hours = Math.floor(difference_ms);
        return new Date(0, 0, 0, hours, minutes, seconds, 0);
    }

    Date.timeSum = function (date1, date2) {
        if (date1 == null || date2 == null) {
            return null;
        }
        date1 = new Date(date1);
        date2 = new Date(date2);
        let hours = date1.getHours() + date2.getHours();
        let minutes = date1.getMinutes() + date2.getMinutes();
        let seconds = date1.getSeconds() + date2.getSeconds();
        return new Date(0, 0, 0, hours, minutes, seconds, 0);
    }


    Date.timeSumFi = function (date1) {
        if (date1 == null || date1 == "----") {
            return null;
        }
        date1 = new Date(date1);
        console.log(getTime(date1))

        let hours = date1.getHours() + date1.getHours();
        let minutes = date1.getMinutes() + date1.getMinutes();
        let seconds = date1.getSeconds() + date1.getSeconds();

        // console.log(hours +" horas")
        // console.log(minutes +" minutos")
        //console.log(seconds +" segundos")
        return new Date(0, 0, 0, hours, minutes, seconds, 0);
    }


    Date.secondsDifference = function (date1, date2) {
        //console.log(date1 + " horas trabalhadas")
        //console.log(date2 + " horas esperado")
        let diff_sec = date1 - date2;
        // console.log(diff_sec)
        let positiveDiff = true;
        //asc 43 = + ----- 45 = -
        if (diff_sec < 0) {
            positiveDiff = false;
            diff_sec *= -1;
            asc = 45
        } else {
            asc = 43
        }
        horas = Math.floor(diff_sec / 3600)
        minutos1 = (diff_sec % 3600)
        minutos = Math.floor(minutos1 / 60)
        segundos = Math.floor(diff_sec % 60)
        // console.log(horas + " horas ," + minutos + " minutos ," + segundos + " segundos")
        // console.log(minutos + " minutos")
        // console.log(segundos + " segundos")
        sinal = String.fromCharCode(asc)
        bancoHoras = (sinal + horas + " Horas, " + minutos + " Minutos, " + segundos + " Segundos")
        console.log(bancoHoras)
        if (sinal == "-") {
            //[0, 1, 2]) > 0
            $("#bancoDeHoras").removeClass("text-success").addClass("text-danger");
        } else if (sinal == "+") {
            $("#bancoDeHoras").removeClass("text-danger").addClass("text-success");
        }
        return bancoHoras;
    }
    //NÃO ESQUECER DE COLOCAR AS MODIFICAÇÕES PARA OS DOIS PERFIS (ADMIN - USUARIO PADRAO)

    Date.calcHrTrab = function (date1, date2, date3, date4) {
        if (date1 == null && date2 == null && date3 == null && date4 == null) {
            return null;
        } else if (date1 != null && date2 != null && date3 != null && date4 != null) {
            dataTrab = Date.timeSum(Date.timeDifference(date1, date2), Date.timeDifference(date3, date4));
            return dataTrab;
        } else if (date1 != null && date2 == null && date3 == null && date4 != null) {
            let date1_ms = new Date(date1).getTime();
            let date4_ms = new Date(date4).getTime();
            let difference_ms = date4_ms - date1_ms;
            difference_ms = difference_ms / 1000;
            let seconds = Math.floor(difference_ms % 60);
            difference_ms = difference_ms / 60;
            let minutes = Math.floor(difference_ms % 60);
            difference_ms = difference_ms / 60;
            let hours = Math.floor(difference_ms);
            return new Date(0, 0, 0, hours, minutes, seconds, 0);
        } else if (date1 != null && date2 != null) {
            let date1_ms = new Date(date1).getTime();
            let date2_ms = new Date(date2).getTime();
            let difference_ms = date2_ms - date1_ms;
            difference_ms = difference_ms / 1000;
            let seconds = Math.floor(difference_ms % 60);
            difference_ms = difference_ms / 60;
            let minutes = Math.floor(difference_ms % 60);
            difference_ms = difference_ms / 60;
            let hours = Math.floor(difference_ms);
            return new Date(0, 0, 0, hours, minutes, seconds, 0);
        }
    }

    function checkZero(n) {
        return n > 9 ? n : "0" + n;
    }

    function getTime(dt) {
        if (dt == null) {
            return `----`;
        }
        dt = new Date(dt);
        return `${checkZero(dt.getHours())}:${checkZero(dt.getMinutes())}:${checkZero(dt.getSeconds())}`
    }

    function sameDay(d1, d2) {
        return d1.getFullYear() === d2.getFullYear() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getDate() === d2.getDate();
    }

    function setModalId(id, periodo, data, entrada, intervalo, retorno, saida) {
        $("#inputId").val(id);
        $("#inputPeriodo").val(periodo);
        $("#inputData").val(data);
        $("#inputHorasEntrada").val(entrada);
        $("#inputHorasIntervalo").val(intervalo);
        $("#inputHorasRetorno").val(retorno);
        $("#inputHorasSaida").val(saida);
        // console.log(id)
    }



   
    function obterHorasTrabalhadas(re) {
                                       
        var entrada = moment(re.entrada);
        
        var saida = moment(re.saida);

        var diffEntradaSaida = moment.duration(saida.diff(entrada)).hours();
       
        var intervalo = moment(re.intervalo);
       
        var retorno = moment(re.retorno);
        
        var dataDiffIntervalo = moment.duration(retorno.diff(intervalo)).hours();
        
        return diffEntradaSaida - dataDiffIntervalo
    }




    const userLogged = JSON.parse(sessionStorage.getItem('usuario'));
    $("#btnEditSelectedUser").hide();
    $("#btnConcluirSelectedUser").hide();
    $("#filtro").hide();
    $(document).ready(function () {
        $.get("/usuarios/lista-usuarios", function (usuarios) {
            for (let u of usuarios)
                $("#selectUser").append(new Option(u.nome, u.cod));
        });
    });

    $('#btnConcluirSelectedUser').click(function () {
        location.reload();
    });

    function optionUsers(value) {
        $('#modalFiltro').modal({ backdrop: 'static', keyboard: false })
        $("#modalFiltro").modal('show')

        $.get(`/usuarios/${value}`, function (usuarios) {

            var user = usuarios

            $("#buttonPrint").show();
            $("#selectUser").prop('disabled', true);
            $("#btnConcluirSelectedUser").show();
            $(document).ready(function () {

                let justificativas;
                $.get("/justificativas", function (justificativas) {

                    justificativas = justificativas;
                    for (let j of justificativas)
                        $("#inputJustificativa").append(new Option(j.descricao, j.cod));

                });

                $("#cargaHoraria").html(`${user.carga_horaria} horas`);

                $.get(`/usuarios/${value}`, function (usuario) {
                    let horasTrabalhadas = user.horas_trabalhadas.split(":");
                    $("#horasTrabalhadas").html(`${parseInt(horasTrabalhadas[0])} horas, ${parseInt(horasTrabalhadas[1])} minutos, ${parseInt(horasTrabalhadas[2].split('.')[0])} segundos`);
                });

                function FiltroPromise() {
                    var outsideResolve;
                    var outsideReject;
                    let p1 = new Promise(
                        (resolve, reject) => {
                            outsideReject = reject;
                            outsideResolve = resolve;
                            $("#buttonFilter").click(function () {
                                let mes = $('#selectFiltroMes option:selected').val()
                                let ano = $('#selectFiltroAno option:selected').val()
                                $("#inputFiltroMes").val(mes)
                                $("#inputFiltroAno").val(ano)
                                $("#modalFiltro").modal('hide')
                                var filtroConfirm = "2"
                                $("#inputFiltroYN").val(filtroConfirm)
                                outsideResolve();
                            })
                            $("#btnCancelFilter").click(function () {
                                var filtroConfirm = "1"
                                $("#inputFiltroYN").val(filtroConfirm)
                                outsideResolve();
                            })
                            $("#btnCloseModalFiltro").click(function () {
                                var filtroConfirm = "1"
                                $("#inputFiltroYN").val(filtroConfirm)
                                outsideResolve();
                            })
                        }
                    );
                    p1.then(
                        // apenas logamos a mensagem e o valor
                        function (val) {
                            var filtroConfirm = $("#inputFiltroYN").val()
                            var mes = $("#inputFiltroMes").val()
                            var ano = $("#inputFiltroAno").val()
                            if (filtroConfirm == "2") {
                                //////////////////////////////    condicao com filtro       //////////////////////////////////////////////

                                $.get(`/usuarios/${value}/filtro/registros?year=${ano}&month=${mes}`, function (registros) {
                                    let inconsistencias = [];
                                    let horasTrabalhadasDia = [];
                                    registros.forEach(function (re) {
                                        var hrTrabalhadasFiltro = getTime(Date.calcHrTrab(re.entrada, re.intervalo, re.retorno, re.saida))
                                        //console.log(hrTrabalhadasFiltro)

                                        if (hrTrabalhadasFiltro == '----') {
                                            return null;
                                        }
                                        horasTrabalhadasDia.push(hrTrabalhadasFiltro);
                                    });
                                    //console.log(horasTrabalhadasDia)
                                    hrTrabalhadaFiCalculada = horasTrabalhadasDia.reduce((acc, cur) => {
                                        const [horas, minutos, segundos] = cur.split(':');
                                        return acc + horas * 60 * 60000 + minutos * 60000 + segundos * 1000;
                                    }, 0);
                                    //console.log(hrTrabalhadaFiCalculada)
                                        segundos = ( hrTrabalhadaFiCalculada / 1000 ) % 60;      
                                        minutos  = ( hrTrabalhadaFiCalculada / 60000 ) % 60;     
                                        horas    = hrTrabalhadaFiCalculada / 3600000;  
                                        horas = horas +""
                                        horas = horas.split(".")
                                        minutos = minutos +""
                                        minutos = minutos.split(".")
                                        segundos = segundos +""
                                        segundos = segundos.split(".")
                                     
                                        //console.log(horas[0])
                                       // console.log(minutos[0])
                                        //console.log(segundos[0])
                                        
                                        ja = ( horas[0] + " Horas, " + minutos[0] + " Minutos, " + segundos[0] + " Segundos")
                                        $("#horasaTrabalhadas").html(`${ja}`);
                                       // console.log(ja)
                                    
                                    if (registros.length > 0) {
                                        for (let re of registros) {

                                            dayName = new Array("DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SAB")
                                            monName = new Array("JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ")
                                            now = new Date(re.data);
                                            fds = dayName[now.getDay()]
                                            
                                            entradaSplit = re.entrada+""
                                            entradaSplit = entradaSplit.split(".")
                                            entradaSplit = entradaSplit[0].split("T")
                                           // console.log(entradaSplit[1])
                                            intervaloSplit = re.intervalo+""
                                            intervaloSplit = intervaloSplit.split(".")
                                            intervaloSplit = intervaloSplit[0].split("T")
                                            //console.log(intervaloSplit[1])
                                            retornoSplit =re.retorno+""
                                            retornoSplit = retornoSplit.split(".")
                                            retornoSplit = retornoSplit[0].split("T")
                                            //console.log(retornoSplit[1])
                                            saidaSplit =re.saida+""
                                            saidaSplit = saidaSplit.split(".")
                                            saidaSplit = saidaSplit[0].split("T")
                                            console.log(saidaSplit[1])

                                            if (intervaloSplit[1] == undefined) {
                                                intervaloSplit[1] = "----"
                                            }
                                            if (retornoSplit[1] == undefined){
                                                retornoSplit[1] = "----"
                                            } 
                                            if (saidaSplit[1] == undefined){
                                                saidaSplit[1] = "----"
                                            }

                                            if (!sameDay(now, new Date())) {
                                                if (re.entrada == null && re.intervalo == null && re.retorno == null && re.saida == null && fds == "DOM" || fds == "SAB") {
                                                } else if (re.entrada != null && re.intervalo == null && re.retorno == null && re.saida != null) {
                                                } else if (re.entrada == null && re.justificativa_entrada == null ||
                                                    re.intervalo == null && re.justificativa_intervalo == null ||
                                                    re.retorno == null && re.justificativa_retorno == null ||
                                                    re.saida == null && re.justificativa_saida == null) {
                                                    inconsistencias.push(re)
                                                }
                                                let justEntrada = null;
                                                let justIntervalo = null;
                                                let justRetorno = null;
                                                let justSaida = null;



                                                justEntrada = `<a class="btn btn-link btn-sm text-danger" id="incon">INCONSISTENTE</a>`;
                                                if (re.entrada == null && re.intervalo == null && re.retorno == null && re.saida == null && fds == "DOM" || fds == "SAB") {
                                                    justEntrada = `Fim de semana`
                                                } else if (userLogged.permissao == "\"admin\"" || userLogged.permissao == "\"rh\"" && re.entrada == null && re.justificativa_entrada == null) {
                                                    justEntrada = `<a href="" class="btn btn-link btn-sm text-danger" id="incon" data-toggle="modal"
                                            data-target="#modalAdd"  onClick="setModalId(${re.cod}, 'entrada', '${re.data}', '${getTime(re.entrada)}', '${getTime(re.intervalo)}', '${getTime(re.retorno)}', '${getTime(re.saida)}')">INCONSISTENTE</a>`;
                                                } else if (re.entrada != null && re.justificativa_entrada != null) {
                                                    justEntrada = re.justificativa_entrada;
                                                }
                                                justIntervalo = `<a class="btn btn-link btn-sm text-danger" id="incon2">INCONSISTENTE</a>`;
                                                if (re.entrada == null && re.intervalo == null && re.retorno == null && re.saida == null && fds == "DOM" || fds == "SAB") {
                                                    justIntervalo = `----`
                                                } else if (re.entrada != null && re.intervalo == null && re.retorno == null && re.saida != null) {
                                                    justIntervalo = `----`
                                                } else if (userLogged.permissao == "\"admin\"" || userLogged.permissao == "\"rh\"" && re.intervalo == null && re.justificativa_intervalo == null) {
                                                    justIntervalo = `<a href="" class="btn btn-link btn-sm text-danger" id="incon2" data-toggle="modal"
                                            data-target="#modalAdd"  onClick="setModalId(${re.cod}, 'intervalo', '${re.data}', '${getTime(re.entrada)}', '${getTime(re.intervalo)}', '${getTime(re.retorno)}', '${getTime(re.saida)}')">INCONSISTENTE</a>`;
                                                } else if (re.intervalo != null && re.justificativa_intervalo != null) {
                                                    justIntervalo = `----`;
                                                }
                                                justRetorno = `<a class="btn btn-link btn-sm text-danger" id="incon3">INCONSISTENTE</a>`;
                                                if (re.entrada == null && re.intervalo == null && re.retorno == null && re.saida == null && fds == "DOM" || fds == "SAB") {
                                                    justRetorno = `----`
                                                } else if (re.entrada != null && re.intervalo == null && re.retorno == null && re.saida != null) {
                                                    justRetorno = `----`
                                                } else if (userLogged.permissao == "\"admin\"" || userLogged.permissao == "\"rh\"" && re.retorno == null && re.justificativa_retorno == null) {
                                                    justRetorno = `<a href="" class="btn btn-link btn-sm text-danger" id="incon3" data-toggle="modal"
                                            data-target="#modalAdd"  onClick="setModalId(${re.cod}, 'retorno', '${re.data}', '${getTime(re.entrada)}', '${getTime(re.intervalo)}', '${getTime(re.retorno)}', '${getTime(re.saida)}')" >INCONSISTENTE</a>`;
                                                } else if (re.retorno != null && re.justificativa_retorno != null) {
                                                    justRetorno = `----`;
                                                }
                                                justSaida = `<a class="btn btn-link btn-sm text-danger" id="incon4">INCONSISTENTE</a>`;
                                                if (re.entrada == null && re.intervalo == null && re.retorno == null && re.saida == null && fds == "DOM" || fds == "SAB") {
                                                    justSaida = `Fim de semana`
                                                } else if (userLogged.permissao == "\"admin\"" || userLogged.permissao == "\"rh\"" && re.saida == null && re.justificativa_saida == null) {
                                                    justSaida = `<a href="" class="btn btn-link btn-sm text-danger" id="incon4" data-toggle="modal"
                                            data-target="#modalAdd"  onClick="setModalId(${re.cod}, 'saida', '${re.data}', '${getTime(re.entrada)}', '${getTime(re.intervalo)}', '${getTime(re.retorno)}', '${getTime(re.saida)}')" >INCONSISTENTE</a>`;
                                                } else if (re.saida != null && re.justificativa_saida != null) {
                                                    justSaida = re.justificativa_saida;
                                                }


                                               
                                                $("#dataTable tr:last").after(`
                                        <tr>
                                            <td>${monName[now.getMonth()] + " " + dayName[now.getDay()] + " " + now.getDate()}</td>
                                            <td>${re.entrada != null && re.justificativa_entrada == null ? entradaSplit[1] : justEntrada}</td>
                                            <td>${re.intervalo != null && re.justificativa_intervalo == null ? intervaloSplit[1] : justIntervalo}</td>
                                            <td>${re.retorno != null && re.justificativa_retorno == null ? retornoSplit[1] : justRetorno}</td>
                                            <td>${re.saida != null && re.justificativa_saida == null ? saidaSplit[1] : justSaida}</td>
                                            <td>${getTime(Date.calcHrTrab(re.entrada, re.intervalo, re.retorno, re.saida))}</td>
                                        </tr>
                                    ` );

                                            } else {

                                               
                                                //se for o dia atual
                                               
                                                $("#dataTable tr:last").after(`
                                        <tr>
                                            <td>${monName[now.getMonth()] + " " + dayName[now.getDay()] + " " + now.getDate()}</td>
                                            <td>${(entradaSplit[1])}</td>
                                            <td>${(intervaloSplit[1])}</td>
                                            <td>${(retornoSplit[1])}</td>
                                            <td>${(saidaSplit[1])}</td>
                                            <td>${getTime(Date.calcHrTrab(re.entrada, re.intervalo, re.retorno, re.saida))}</td>
                                        </tr>
                                    `);
                                            }

                                            // tamanhoRegistro = registros.length
                                            //var horasTrabFiltro = Date.timeSumFi((Date.calcHrTrab(re.entrada, re.intervalo, re.retorno, re.saida)));
                                            //console.log(horasTrabFiltro)
                                            //let horasTrabFiltroTotal = tamanhoRegistro * horasTrabFiltro;
                                            //console.log(horasTrabFiltro)


                                        }
                                        let inconsistenciasTexto = inconsistencias.length == 1 ? 'dia' : 'dias';
                                        $("#diasInconsistente").html(`${inconsistencias.length} ${inconsistenciasTexto}`);

                                        tamanhoRegistro = registros.length
                                        for (let re of registros) {
                                            data = new Date(re.data);
                                            fds = dayName[data.getDay()]
                                            if (fds == "DOM") {
                                                tamanhoRegistro -= 1
                                            }
                                            if (fds == "SAB") {
                                                tamanhoRegistro -= 1
                                            }
                                        }
                                        //console.log(tamanhoRegistro + " tamanho")
                                        let horasEsperado = tamanhoRegistro * user.carga_horaria * 60 * 60;
                                        
                                        let horasTrabalhadas = user.horas_trabalhadas.split(":");
                                        console.log(horasTrabalhadas)
                                        horatrabfi = checkZero(horas[0])
                                        mintrabfi = checkZero(minutos[0])
                                        segtrabfi = checkZero(segundos[0])
                                       
                                        horasTrabalhadas = parseInt(horatrabfi) * 60 * 60 + parseInt(mintrabfi) * 60 + parseInt(segtrabfi);
                                        
                                        let bancoDeHoras = Date.secondsDifference(horasTrabalhadas, horasEsperado);
                                        $("#bancoDeHoras").html(bancoDeHoras);


                                    } else if (registros.length <= 0) {
                                        $('#modalErroFiltro').modal({ backdrop: 'static', keyboard: false })
                                        $("#modalErroFiltro").modal('show')
                                    }
                                    $("#btnCancelRetFiltro").click(function () {
                                        location.reload();

                                    })

                                    $("#btnRetFiltro").click(function () {

                                        $("#modalErroFiltro").modal('hide')
                                        $("#modalFiltro").modal('show')
                                        FiltroPromise()
                                    })

                                    $("#buttonfiltro").click(function () {
                                        //tableDivData
                                        //dataTable

                                        $("#tableDivData").load("Relatorio.html #tableDivData");
                                        $("#modalFiltro").modal('show')
                                        FiltroPromise()
                                    })

                                });  /////

                            } else {

                                /////////// condiçao sem filtro   ////////////////////

                                $.get(`/usuarios/${value}/registros`, function (registros) {
                                    let inconsistencias = [];
                                    let horasTrabalhadasDia = [];
                                    registros.forEach(function (re) {
                                        var hrTrabalhadasFiltro = getTime(Date.calcHrTrab(re.entrada, re.intervalo, re.retorno, re.saida))
                                        //console.log(hrTrabalhadasFiltro)

                                        if (hrTrabalhadasFiltro == '----') {
                                            return null;
                                        }
                                        horasTrabalhadasDia.push(hrTrabalhadasFiltro);
                                    });
                                    //console.log(horasTrabalhadasDia)
                                    hrTrabalhadaFiCalculada = horasTrabalhadasDia.reduce((acc, cur) => {
                                        const [horas, minutos, segundos] = cur.split(':');
                                        return acc + horas * 60 * 60000 + minutos * 60000 + segundos * 1000;
                                    }, 0);
                                    //console.log(hrTrabalhadaFiCalculada)
                                        segundos = ( hrTrabalhadaFiCalculada / 1000 ) % 60;      
                                        minutos  = ( hrTrabalhadaFiCalculada / 60000 ) % 60;     
                                        horas    = hrTrabalhadaFiCalculada / 3600000;  
                                        horas = horas +""
                                        horas = horas.split(".")
                                        minutos = minutos +""
                                        minutos = minutos.split(".")
                                        segundos = segundos +""
                                        segundos = segundos.split(".")
                                     
                                        //console.log(horas[0])
                                       // console.log(minutos[0])
                                        //console.log(segundos[0])
                                        
                                        ja = ( horas[0] + " Horas, " + minutos[0] + " Minutos, " + segundos[0] + " Segundos")
                                        $("#horasaTrabalhadas").html(`${ja}`);
                                       // console.log(ja)
                                    

                                    if (registros.length > 0) {
                                        for (let re of registros) {

                                            dayName = new Array("DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SAB")
                                            monName = new Array("JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ")
                                            now = new Date(re.data);
                                            fds = dayName[now.getDay()]

                                            entradaSplit = re.entrada+""
                                            entradaSplit = entradaSplit.split(".")
                                            entradaSplit = entradaSplit[0].split("T")
                                           // console.log(entradaSplit[1])
                                            intervaloSplit = re.intervalo+""
                                            intervaloSplit = intervaloSplit.split(".")
                                            intervaloSplit = intervaloSplit[0].split("T")
                                            //console.log(intervaloSplit[1])
                                            retornoSplit =re.retorno+""
                                            retornoSplit = retornoSplit.split(".")
                                            retornoSplit = retornoSplit[0].split("T")
                                            //console.log(retornoSplit[1])
                                            saidaSplit =re.saida+""
                                            saidaSplit = saidaSplit.split(".")
                                            saidaSplit = saidaSplit[0].split("T")
                                            console.log(saidaSplit[1])

                                            if (intervaloSplit[1] == undefined) {
                                                intervaloSplit[1] = "----"
                                            }
                                            if (retornoSplit[1] == undefined){
                                                retornoSplit[1] = "----"
                                            } 
                                            if (saidaSplit[1] == undefined){
                                                saidaSplit[1] = "----"
                                            }

                                            if (!sameDay(now, new Date())) {

                                                if (re.entrada == null && re.intervalo == null && re.retorno == null && re.saida == null && fds == "DOM" || fds == "SAB") {

                                                } else if (re.entrada != null && re.intervalo == null && re.retorno == null && re.saida != null) {
                                                } else if (re.entrada == null && re.justificativa_entrada == null ||
                                                    re.intervalo == null && re.justificativa_intervalo == null ||
                                                    re.retorno == null && re.justificativa_retorno == null ||
                                                    re.saida == null && re.justificativa_saida == null) {
                                                    inconsistencias.push(re)
                                                }

                                                let justEntrada = null;
                                                let justIntervalo = null;
                                                let justRetorno = null;
                                                let justSaida = null;



                                                justEntrada = `<a class="btn btn-link btn-sm text-danger" id="incon">INCONSISTENTE</a>`;
                                                if (re.entrada == null && re.intervalo == null && re.retorno == null && re.saida == null && fds == "DOM" || fds == "SAB") {
                                                    justEntrada = `Fim de semana`
                                                } else if (userLogged.permissao == "\"admin\"" || userLogged.permissao == "\"rh\"" && re.entrada == null && re.justificativa_entrada == null) {
                                                    justEntrada = `<a href="" class="btn btn-link btn-sm text-danger" id="incon" data-toggle="modal"
                                            data-target="#modalAdd"  onClick="setModalId(${re.cod}, 'entrada', '${re.data}', '${getTime(re.entrada)}', '${getTime(re.intervalo)}', '${getTime(re.retorno)}', '${getTime(re.saida)}')">INCONSISTENTE</a>`;
                                                } else if (re.entrada != null && re.justificativa_entrada != null) {
                                                    justEntrada = re.justificativa_entrada;
                                                }
                                                justIntervalo = `<a class="btn btn-link btn-sm text-danger" id="incon2">INCONSISTENTE</a>`;
                                                if (re.entrada == null && re.intervalo == null && re.retorno == null && re.saida == null && fds == "DOM" || fds == "SAB") {
                                                    justIntervalo = `----`
                                                } else if (re.entrada != null && re.intervalo == null && re.retorno == null && re.saida != null) {
                                                    justIntervalo = `----`
                                                } else if (userLogged.permissao == "\"admin\"" || userLogged.permissao == "\"rh\"" && re.intervalo == null && re.justificativa_intervalo == null) {
                                                    justIntervalo = `<a href="" class="btn btn-link btn-sm text-danger" id="incon2" data-toggle="modal"
                                            data-target="#modalAdd"  onClick="setModalId(${re.cod}, 'intervalo', '${re.data}', '${getTime(re.entrada)}', '${getTime(re.intervalo)}', '${getTime(re.retorno)}', '${getTime(re.saida)}')">INCONSISTENTE</a>`;
                                                } else if (re.intervalo != null && re.justificativa_intervalo != null) {
                                                    justIntervalo = `----`;
                                                }
                                                justRetorno = `<a class="btn btn-link btn-sm text-danger" id="incon3">INCONSISTENTE</a>`;
                                                if (re.entrada == null && re.intervalo == null && re.retorno == null && re.saida == null && fds == "DOM" || fds == "SAB") {
                                                    justRetorno = `----`
                                                } else if (re.entrada != null && re.intervalo == null && re.retorno == null && re.saida != null) {
                                                    justRetorno = `----`
                                                } else if (userLogged.permissao == "\"admin\"" || userLogged.permissao == "\"rh\"" && re.retorno == null && re.justificativa_retorno == null) {
                                                    justRetorno = `<a href="" class="btn btn-link btn-sm text-danger" id="incon3" data-toggle="modal"
                                            data-target="#modalAdd"  onClick="setModalId(${re.cod}, 'retorno', '${re.data}', '${getTime(re.entrada)}', '${getTime(re.intervalo)}', '${getTime(re.retorno)}', '${getTime(re.saida)}')" >INCONSISTENTE</a>`;
                                                } else if (re.retorno != null && re.justificativa_retorno != null) {
                                                    justRetorno = `----`;
                                                }
                                                justSaida = `<a class="btn btn-link btn-sm text-danger" id="incon4">INCONSISTENTE</a>`;
                                                if (re.entrada == null && re.intervalo == null && re.retorno == null && re.saida == null && fds == "DOM" || fds == "SAB") {
                                                    justSaida = `Fim de semana`
                                                } else if (userLogged.permissao == "\"admin\"" || userLogged.permissao == "\"rh\"" && re.saida == null && re.justificativa_saida == null) {
                                                    justSaida = `<a href="" class="btn btn-link btn-sm text-danger" id="incon4" data-toggle="modal"
                                            data-target="#modalAdd"  onClick="setModalId(${re.cod}, 'saida', '${re.data}', '${getTime(re.entrada)}', '${getTime(re.intervalo)}', '${getTime(re.retorno)}', '${getTime(re.saida)}')" >INCONSISTENTE</a>`;
                                                } else if (re.saida != null && re.justificativa_saida != null) {
                                                    justSaida = re.justificativa_saida;
                                                }
                                               
                                                $("#dataTable tr:last").after(`
                                        <tr>
                                            <td>${monName[now.getMonth()] + " " + dayName[now.getDay()] + " " + now.getDate()}</td>
                                            <td>${re.entrada != null && re.justificativa_entrada == null ? entradaSplit[1] : justEntrada}</td>
                                            <td>${re.intervalo != null && re.justificativa_intervalo == null ? intervaloSplit[1] : justIntervalo}</td>
                                            <td>${re.retorno != null && re.justificativa_retorno == null ? retornoSplit[1] : justRetorno}</td>
                                            <td>${re.saida != null && re.justificativa_saida == null ? saidaSplit[1] : justSaida}</td>
                                            <td>${getTime(Date.calcHrTrab(re.entrada, re.intervalo, re.retorno, re.saida))}</td>
                                        </tr>
                                    ` );

                                            } else {
                                                console.log(re.entrada)
                                                //se for o dia atual
                                               
                                                $("#dataTable tr:last").after(`
                                        <tr>
                                            <td>${monName[now.getMonth()] + " " + dayName[now.getDay()] + " " + now.getDate()}</td>
                                            <td>${(entradaSplit[1])}</td>
                                            <td>${(intervaloSplit[1])}</td>
                                            <td>${(retornoSplit[1])}</td>
                                            <td>${(saidaSplit[1])}</td>
                                            <td>${getTime(Date.calcHrTrab(re.entrada, re.intervalo, re.retorno, re.saida))}</td>
                                        </tr>
                                    `);
                                            }

                                        }
                                        let inconsistenciasTexto = inconsistencias.length == 1 ? 'dia' : 'dias';
                                        $("#diasInconsistente").html(`${inconsistencias.length} ${inconsistenciasTexto}`);

                                        tamanhoRegistro = registros.length
                                        for (let re of registros) {
                                            data = new Date(re.data);
                                            fds = dayName[data.getDay()]
                                            if (fds == "DOM") {
                                                tamanhoRegistro -= 1
                                            }
                                            if (fds == "SAB") {
                                                tamanhoRegistro -= 1
                                            }
                                        }
                                        //console.log(tamanhoRegistro + " tamanho")
                                        let horasEsperado = tamanhoRegistro * user.carga_horaria * 60 * 60;

                                        let horasTrabalhadas = user.horas_trabalhadas.split(":");
                                        console.log(horasTrabalhadas)
                                        horatrabfi = checkZero(horas[0])
                                        mintrabfi = checkZero(minutos[0])
                                        segtrabfi = checkZero(segundos[0])
                                       
                                        horasTrabalhadas = parseInt(horatrabfi) * 60 * 60 + parseInt(mintrabfi) * 60 + parseInt(segtrabfi);
                                        let bancoDeHoras = Date.secondsDifference(horasTrabalhadas, horasEsperado);
                                        $("#bancoDeHoras").html(bancoDeHoras);

                                    }

                                });  /////
                            }


                        });


                }

                FiltroPromise()



            });

            $("#selectFiltro").on("change", function (e) {
                var verifyFiltro = $("#selectFiltro option:selected").val()

                if (verifyFiltro == "mes") {
                    $("#divSelectMes").css("display", "flex");
                    $("#divSelectAno").css("display", "flex");
                } else if (verifyFiltro == "ano") {
                    $("#divSelectMes").css("display", "none");
                    $("#divSelectAno").css("display", "flex");
                } else {
                    $("#divSelectMes").css("display", "none");
                    $("#divSelectAno").css("display", "none");
                }
            })
            $("#inputJustificativa").on("change", function (e) {
                let justificativas;
                $.get("/justificativas", function (justificativas) {
                    justificativas = justificativas;
                    for (let j of justificativas) {
                        if (j.cod == $('#inputJustificativa option:selected').val()) {
                            if (j.permite_horario == 1) {

                                $('#inputHorarioContainer').css("display", "flex");
                                $('#inputEditRegistros').css("display", "none");
                            } else if (j.permite_horario == 2) {
                                $('#inputEditRegistros').css("display", "flex");
                                $('#inputHorarioContainer').css("display", "none");
                            } else if (j.permite_horario != 1 && j.permite_horario != 2) {
                                $('#inputEditRegistros').css("display", "none");
                                $('#inputHorarioContainer').css("display", "none");
                            }
                        }
                    }
                });
            })

            $("#inputJustificativa").on("change", function (e) {
                data = $("#inputData").val();
                $("#inputData").append(data);
                if (data != "") {
                    data = new Date(data);
                    data.setHours(data.getHours() - 3);
                    data = data.toISOString().slice(0, 19);
                    data = data.split('T');
                    // console.log("nova hora", data)
                    dataDia = data[0];
                    dataHora = data[1];
                }
                if (dataHora != "") {
                    dataHora = null
                }
                $("#inputDataDia").val(dataDia);
                $("#inputDataHorario").val(dataHora);
            })

            $("#inputDataHorario").change(function (e) {
                let dia = $("#inputDataDia").val();
                let horas = $("#inputDataHorario").val();
                let datahora = dia + " " + horas;
                $("#inputDataNova").val(datahora);
                // console.log(datahora)

            })
            $("#inputHorasEntrada").change(function (e) {
                let dia = $("#inputDataDia").val();
                let horaEnt = $("#inputHorasEntrada").val();
                dataEntChange = dia + " " + horaEnt;
                dataEntrada = new Date(dataEntChange);
                dataEntrada.setHours(dataEntrada.getHours() - 3);
                dataEntrada = dataEntrada.toISOString().slice(0, 16);
                dataEntrada = dataEntrada.replace('T', ' ');
                $("#inputHorasEntradaNova").val(dataEntrada);
            })
            $("#inputHorasIntervalo").change(function (e) {
                let dia = $("#inputDataDia").val();
                let horaInt = $("#inputHorasIntervalo").val();
                dataIntChange = dia + " " + horaInt;
                dataIntervalo = new Date(dataIntChange);
                dataIntervalo.setHours(dataIntervalo.getHours() - 3);
                dataIntervalo = dataIntervalo.toISOString().slice(0, 16);
                dataIntervalo = dataIntervalo.replace('T', ' ');
                $("#inputHorasIntervaloNova").val(dataIntervalo);
                //console.log(dataIntervalo)
            })
            $("#inputHorasRetorno").change(function (e) {
                let dia = $("#inputDataDia").val();
                let horaRet = $("#inputHorasRetorno").val();
                dataRetChange = dia + " " + horaRet;
                dataRetorno = new Date(dataRetChange);
                dataRetorno.setHours(dataRetorno.getHours() - 3);
                dataRetorno = dataRetorno.toISOString().slice(0, 16);
                dataRetorno = dataRetorno.replace('T', ' ');
                $("#inputHorasRetornoNova").val(dataRetorno);
                //console.log(dataRetorno)
            })
            $("#inputHorasSaida").change(function (e) {
                let dia = $("#inputDataDia").val();
                let horaSai = $("#inputHorasSaida").val();
                dataSaiChange = dia + " " + horaSai;
                dataSaida = new Date(dataSaiChange);
                dataSaida.setHours(dataSaida.getHours() - 3);
                dataSaida = dataSaida.toISOString().slice(0, 16);
                dataSaida = dataSaida.replace('T', ' ');
                $("#inputHorasSaidaNova").val(dataSaida);
                //console.log(dataSaida)
            })



            $("#btnConcluirJustificativa").on("click", function (e) {
                let codRegistro = $("#inputId").val();
                let periodo = $("#inputPeriodo").val();
                let justificativa = $('#inputJustificativa option:selected').val();
                let datahora = $("#inputDataNova").val();
                let dataEntrada = $("#inputHorasEntradaNova").val();
                let dataIntervalo = $("#inputHorasIntervaloNova").val();
                let dataRetorno = $("#inputHorasRetornoNova").val();
                let dataSaida = $("#inputHorasSaidaNova").val();
                $.get("/justificativas", function (justificativas) {
                    justificativas = justificativas;
                    for (let j of justificativas) {

                        if (j.cod == justificativa) {
                            if (j.permite_horario == 0) {
                                cargaHr = user.carga_horaria
                                let dia = $("#inputDataDia").val();
                                // let horas = $("#inputDataHorario").val();
                                console.log(dia)
                                console.log(horas)
                                console.log(cargaHr)
                                if (cargaHr == 8) {
                                    horasEnt = "08:00:00"
                                    horasInt = "00:00:00"
                                    horasRet = "00:00:00"
                                    horasSai = "16:00:00"
                                    datahoraEnt = dia + " " + horasEnt
                                    datahoraInt = dia + " " + horasInt
                                    datahoraRet = dia + " " + horasRet
                                    datahoraSai = dia + " " + horasSai
                                    console.log(datahoraEnt + "ent")
                                    console.log(datahoraSai + "sai")
                                } else if (cargaHr == 7) {
                                    horasEnt = "08:00:00"
                                    horasInt = "00:00:00"
                                    horasRet = "00:00:00"
                                    horasSai = "15:00:00"
                                    datahoraEnt = dia + " " + horasEnt
                                    datahoraInt = dia + " " + horasInt
                                    datahoraRet = dia + " " + horasRet
                                    datahoraSai = dia + " " + horasSai
                                    console.log(datahoraEnt + "ent")
                                    console.log(datahoraSai + "sai")
                                } else if (cargaHr == 5) {
                                    horasEnt = "08:00:00"
                                    horasInt = "00:00:00"
                                    horasRet = "00:00:00"
                                    horasSai = "13:00:00"
                                    datahoraEnt = dia + " " + horasEnt
                                    datahoraInt = dia + " " + horasInt
                                    datahoraRet = dia + " " + horasRet
                                    datahoraSai = dia + " " + horasSai
                                    console.log(datahoraEnt + "ent")
                                    console.log(datahoraSai + "sai")
                                } else if (cargaHr == 4) {
                                    horasEnt = "08:00:00"
                                    horasInt = "00:00:00"
                                    horasRet = "00:00:00"
                                    horasSai = "12:00:00"
                                    datahoraEnt = dia + " " + horasEnt
                                    datahoraInt = dia + " " + horasInt
                                    datahoraRet = dia + " " + horasRet
                                    datahoraSai = dia + " " + horasSai
                                    console.log(datahoraEnt + "ent")
                                    console.log(datahoraSai + "sai")
                                }else if (cargaHr == 6) {
                                    horasEnt = "08:00:00"
                                    horasInt = "00:00:00"
                                    horasRet = "00:00:00"
                                    horasSai = "14:00:00"
                                    datahoraEnt = dia + " " + horasEnt
                                    datahoraInt = dia + " " + horasInt
                                    datahoraRet = dia + " " + horasRet
                                    datahoraSai = dia + " " + horasSai
                                    console.log(datahoraEnt + "ent")
                                    console.log(datahoraSai + "sai")
                                }


                                $.ajaxSetup({
                                    headers: {
                                        'x-access-token': sessionStorage.getItem('token'),
                                        'Content-Type': 'application/json',
                                        'Accept': 'application/json',
                                    }
                                });

                                $.ajax({
                                    "url": `/usuarios/${user.cod}/registros/${codRegistro}/justificativas/entrada`,
                                    'data': JSON.stringify({ "datahora": datahoraEnt, "justificativa": justificativa }),
                                    'type': 'POST',
                                }).done(function (data) {
                                    $("#modalJustificativa").show();
                                    setTimeout(function () {
                                        $("#modalJustificativa").hide();

                                    }, 500);
                                });
                                $.ajax({
                                    "url": `/usuarios/${user.cod}/registros/${codRegistro}/justificativas/retorno`,
                                    'data': JSON.stringify({ "datahora": datahoraInt, "justificativa": justificativa }),
                                    'type': 'POST',
                                }).done(function (data) {
                                    $("#modalJustificativa").show();
                                    setTimeout(function () {
                                        $("#modalJustificativa").hide();
                                    }, 500);
                                });
                                $.ajax({
                                    "url": `/usuarios/${user.cod}/registros/${codRegistro}/justificativas/intervalo`,
                                    'data': JSON.stringify({ "datahora": datahoraRet, "justificativa": justificativa }),
                                    'type': 'POST',
                                }).done(function (data) {
                                    $("#modalJustificativa").show();
                                    setTimeout(function () {
                                        $("#modalJustificativa").hide();
                                    }, 500);
                                });
                                $.ajax({
                                    "url": `/usuarios/${user.cod}/registros/${codRegistro}/justificativas/saida`,
                                    'data': JSON.stringify({ "datahora": datahoraSai, "justificativa": justificativa }),
                                    'type': 'POST',
                                }).done(function (data) {
                                    $("#modalJustificativa").show();
                                    setTimeout(function () {
                                        $("#modalJustificativa").hide();
                                    }, 500);
                                });


                            } else if (j.permite_horario == 1) {
                                $.ajaxSetup({
                                    headers: {
                                        'x-access-token': sessionStorage.getItem('token'),
                                        'Content-Type': 'application/json',
                                        'Accept': 'application/json',
                                    }
                                });

                                $.ajax({
                                    "url": `/usuarios/${user.cod}/registros/${codRegistro}/justificativas/${periodo}`,
                                    'data': JSON.stringify({ "datahora": datahora, "justificativa": justificativa }),
                                    'type': 'POST',
                                }).done(function (data) {
                                    $("#modalJustificativa").show();
                                    setTimeout(function () {
                                        $("#modalJustificativa").hide();
                                    }, 500);
                                });

                            } else if (j.permite_horario == 2) {
                                $.ajaxSetup({
                                    headers: {
                                        'x-access-token': sessionStorage.getItem('token'),
                                        'Content-Type': 'application/json',
                                        'Accept': 'application/json',
                                    }
                                });

                                $.ajax({
                                    "url": `/usuarios/${user.cod}/registros/${codRegistro}/justificativas/entrada`,
                                    'data': JSON.stringify({ "datahora": dataEntrada, "justificativa": justificativa }),
                                    'type': 'POST',
                                })
                                $.ajax({
                                    "url": `/usuarios/${user.cod}/registros/${codRegistro}/justificativas/intervalo`,
                                    'data': JSON.stringify({ "datahora": dataIntervalo, "justificativa": justificativa }),
                                    'type': 'POST',
                                })
                                $.ajax({
                                    "url": `/usuarios/${user.cod}/registros/${codRegistro}/justificativas/retorno`,
                                    'data': JSON.stringify({ "datahora": dataRetorno, "justificativa": justificativa }),
                                    'type': 'POST',
                                })
                                $.ajax({
                                    "url": `/usuarios/${user.cod}/registros/${codRegistro}/justificativas/saida`,
                                    'data': JSON.stringify({ "datahora": dataSaida, "justificativa": justificativa }),
                                    'type': 'POST',
                                }).done(function (data) {
                                    $("#modalJustificativa").show();
                                    setTimeout(function () {
                                        $("#modalJustificativa").hide();

                                    }, 500);
                                });

                            }
                        }
                    }
                })



            });

        })


        ////////////

    }

    // Condição para usuario padrao//
} else {

    $("#buttonPrint").hide();

    Date.timeDifference = function (date1, date2) {
        if (date1 == null || date2 == null) {
            return null;
        }
        let date1_ms = new Date(date1).getTime();
        let date2_ms = new Date(date2).getTime();
        let difference_ms = date2_ms - date1_ms;
        difference_ms = difference_ms / 1000;
        let seconds = Math.floor(difference_ms % 60);
        difference_ms = difference_ms / 60;
        let minutes = Math.floor(difference_ms % 60);
        difference_ms = difference_ms / 60;
        let hours = Math.floor(difference_ms);
        return new Date(0, 0, 0, hours, minutes, seconds, 0);
    }

    Date.timeSum = function (date1, date2) {
        if (date1 == null || date2 == null) {
            return null;
        }
        date1 = new Date(date1);
        date2 = new Date(date2);
        let hours = date1.getHours() + date2.getHours();
        let minutes = date1.getMinutes() + date2.getMinutes();
        let seconds = date1.getSeconds() + date2.getSeconds();
        return new Date(0, 0, 0, hours, minutes, seconds, 0);
    }
    Date.secondsDifference = function (date1, date2) {
        console.log(date1 + " horas trabalhadas")
        console.log(date2 + " horas esperado")
        let diff_sec = date1 - date2;
        // console.log(diff_sec)
        let positiveDiff = true;
        //asc 43 = + ----- 45 = -
        if (diff_sec < 0) {
            positiveDiff = false;
            diff_sec *= -1;
            asc = 45

        } else {
            asc = 43
        }
        horas = Math.floor(diff_sec / 3600)
        minutos1 = (diff_sec % 3600)
        minutos = Math.floor(minutos1 / 60)
        segundos = Math.floor(diff_sec % 60)
        // console.log(horas + " horas ," + minutos + " minutos ," + segundos + " segundos")
        // console.log(minutos + " minutos")
        // console.log(segundos + " segundos")
        sinal = String.fromCharCode(asc)
        bancoHoras = (sinal + horas + " Horas, " + minutos + " Minutos, " + segundos + " Segundos")


        if (sinal == "-") {
            //[0, 1, 2]) > 0
            $("#bancoDeHoras").removeClass("text-success").addClass("text-danger");
        } else if (sinal == "+") {
            $("#bancoDeHoras").removeClass("text-danger").addClass("text-success");
        }
        return bancoHoras;
    }

    Date.calcHrTrab = function (date1, date2, date3, date4) {

        if (date1 == null && date2 == null && date3 == null && date4 == null) {
            return null;

        } else if (date1 != null && date2 != null && date3 != null && date4 != null) {
            dataTrab = Date.timeSum(Date.timeDifference(date1, date2), Date.timeDifference(date3, date4));
            return dataTrab;

        } else if (date1 != null && date2 == null && date3 == null && date4 != null) {

            let date1_ms = new Date(date1).getTime();
            let date4_ms = new Date(date4).getTime();
            let difference_ms = date4_ms - date1_ms;
            difference_ms = difference_ms / 1000;
            let seconds = Math.floor(difference_ms % 60);
            difference_ms = difference_ms / 60;
            let minutes = Math.floor(difference_ms % 60);
            difference_ms = difference_ms / 60;
            let hours = Math.floor(difference_ms);
            return new Date(0, 0, 0, hours, minutes, seconds, 0);
        } else if (date1 != null && date2 != null) {

            let date1_ms = new Date(date1).getTime();
            let date2_ms = new Date(date2).getTime();
            let difference_ms = date2_ms - date1_ms;
            difference_ms = difference_ms / 1000;
            let seconds = Math.floor(difference_ms % 60);
            difference_ms = difference_ms / 60;
            let minutes = Math.floor(difference_ms % 60);
            difference_ms = difference_ms / 60;
            let hours = Math.floor(difference_ms);
            return new Date(0, 0, 0, hours, minutes, seconds, 0);
        }

    }
    function checkZero(n) {
        return n > 9 ? n : "0" + n;
    }

    function getTime(dt) {
        if (dt == null) {
            return `----`;
        }
        dt = new Date(dt);
        return `${checkZero(dt.getHours())}:${checkZero(dt.getMinutes())}:${checkZero(dt.getSeconds())}`
    }

    function sameDay(d1, d2) {
        return d1.getFullYear() === d2.getFullYear() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getDate() === d2.getDate();
    }

    function setModalId(id, retorno) {
        $("#inputId").val(id);
        $("#inputPeriodo").val(retorno);
    }
   // $(document).ready(function () {

   // });
    $("#btnConcluirSelectedUser").hide();
    const user = JSON.parse(sessionStorage.getItem('usuario'));
    $(document).ready(function () {

        let justificativas;
        $.get("/justificativas", function (justificativas) {
            justificativas = justificativas;
            for (let j of justificativas)
                $("#inputJustificativa").append(new Option(j.descricao, j.cod));
        });

        $("#cargaHoraria").html(`${user.carga_horaria} horas`);

        $.get(`/usuarios/${user.cod}`, function (usuario) {
            let horasTrabalhadas = usuario.horas_trabalhadas.split(":");
            $("#horasTrabalhadas").html(`${parseInt(horasTrabalhadas[0])} horas, ${parseInt(horasTrabalhadas[1])} minutos, ${parseInt(horasTrabalhadas[2].split('.')[0])} segundos`);
        });

        $.get(`/usuarios/${user.cod}/registros`, function (registros) {
            let inconsistencias = [];
            let horasTrabalhadasDia = [];
            registros.forEach(function (re) {
                var hrTrabalhadasFiltro = getTime(Date.calcHrTrab(re.entrada, re.intervalo, re.retorno, re.saida))
                console.log(hrTrabalhadasFiltro)

                if (hrTrabalhadasFiltro == '----') {
                    return null;
                }
                horasTrabalhadasDia.push(hrTrabalhadasFiltro);
            });
            console.log(horasTrabalhadasDia)
            hrTrabalhadaFiCalculada = horasTrabalhadasDia.reduce((acc, cur) => {
                const [horas, minutos, segundos] = cur.split(':');
                return acc + horas * 60 * 60000 + minutos * 60000 + segundos * 1000;
            }, 0);
            console.log(hrTrabalhadaFiCalculada)
                segundos = ( hrTrabalhadaFiCalculada / 1000 ) % 60;      
                minutos  = ( hrTrabalhadaFiCalculada / 60000 ) % 60;     
                horas    = hrTrabalhadaFiCalculada / 3600000;  
                horas = horas +""
                horas = horas.split(".")
                minutos = minutos +""
                minutos = minutos.split(".")
                segundos = segundos +""
                segundos = segundos.split(".")

                console.log(horas[0])
                console.log(minutos[0])
                console.log(segundos[0])
                ja = ( horas[0] + " Horas, " + minutos[0] + " Minutos, " + segundos[0] + " Segundos")
                $("#horasaTrabalhadas").html(`${ja}`);
                console.log(ja)

            if (registros.length > 0) {
                for (let re of registros) {
                    dayName = new Array("DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SAB")
                    monName = new Array("JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ")
                    now = new Date(re.data);
                    fds = dayName[now.getDay()]

                    entradaSplit = re.entrada+""
                    entradaSplit = entradaSplit.split(".")
                    entradaSplit = entradaSplit[0].split("T")
                   // console.log(entradaSplit[1])
                    intervaloSplit = re.intervalo+""
                    intervaloSplit = intervaloSplit.split(".")
                    intervaloSplit = intervaloSplit[0].split("T")
                    //console.log(intervaloSplit[1])
                    retornoSplit =re.retorno+""
                    retornoSplit = retornoSplit.split(".")
                    retornoSplit = retornoSplit[0].split("T")
                    //console.log(retornoSplit[1])
                    saidaSplit =re.saida+""
                    saidaSplit = saidaSplit.split(".")
                    saidaSplit = saidaSplit[0].split("T")
                    console.log(saidaSplit[1])

                    if (intervaloSplit[1] == undefined) {
                        intervaloSplit[1] = "----"
                    }
                    if (retornoSplit[1] == undefined){
                        retornoSplit[1] = "----"
                    } 
                    if (saidaSplit[1] == undefined){
                        saidaSplit[1] = "----"
                    }
                    //dadad

                    if (!sameDay(now, new Date())) {
                        if (re.entrada == null && re.intervalo == null && re.retorno == null && re.saida == null && fds == "DOM" || fds == "SAB") {

                        } else if (re.entrada != null && re.intervalo == null && re.retorno == null && re.saida != null) {
                        } else if (re.entrada == null && re.justificativa_entrada == null ||
                            re.intervalo == null && re.justificativa_intervalo == null ||
                            re.retorno == null && re.justificativa_retorno == null ||
                            re.saida == null && re.justificativa_saida == null) {
                            inconsistencias.push(re)
                        }
                        let justEntrada = null;
                        let justIntervalo = null;
                        let justRetorno = null;
                        let justSaida = null;



                        justEntrada = `<a class="btn btn-link btn-sm text-danger" >INCONSISTENTE</a>`;
                        if (re.entrada == null && re.intervalo == null && re.retorno == null && re.saida == null && fds == "DOM" || fds == "SAB") {
                            justEntrada = `Fim de semana`
                        } else if (user.permissao == "\"admin\"" || user.permissao == "\"rh\"" && re.entrada == null && re.justificativa_entrada == null) {
                            justEntrada = `<a href="" class="btn btn-link btn-sm text-danger" data-toggle="modal"
                        data-target="#modalAdd"  onClick="setModalId(${re.cod}, 'entrada')">INCONSISTENTE</a>`;
                        } else if (re.entrada != null && re.justificativa_entrada != null) {
                            justEntrada = re.justificativa_entrada;
                        }

                        justIntervalo = `<a class="btn btn-link btn-sm text-danger" >INCONSISTENTE</a>`;
                        if (re.entrada == null && re.intervalo == null && re.retorno == null && re.saida == null && fds == "DOM" || fds == "SAB") {
                            justIntervalo = `----`
                        } else if (re.entrada != null && re.intervalo == null && re.retorno == null && re.saida != null) {
                            justIntervalo = `----`
                        } else if (user.permissao == "\"admin\"" || user.permissao == "\"rh\"" && re.intervalo == null && re.justificativa_intervalo == null) {
                            justIntervalo = `<a href="" class="btn btn-link btn-sm text-danger" data-toggle="modal"
                        data-target="#modalAdd"  onClick="setModalId(${re.cod}, 'intervalo')">INCONSISTENTE</a>`;
                        } else if (re.intervalo != null && re.justificativa_intervalo != null) {
                            justIntervalo = `----`;
                        }

                        justRetorno = `<a class="btn btn-link btn-sm text-danger" >INCONSISTENTE</a>`;
                        if (re.entrada == null && re.intervalo == null && re.retorno == null && re.saida == null && fds == "DOM" || fds == "SAB") {
                            justRetorno = `----`
                        } else if (re.entrada != null && re.intervalo == null && re.retorno == null && re.saida != null) {
                            justRetorno = `----`
                        } else if (user.permissao == "\"admin\"" || user.permissao == "\"rh\"" && re.retorno == null && re.justificativa_retorno == null) {
                            justRetorno = `<a href="" class="btn btn-link btn-sm text-danger" data-toggle="modal"
                        data-target="#modalAdd"  onClick="setModalId(${re.cod}, 'retorno')" >INCONSISTENTE</a>`;
                        } else if (re.retorno != null && re.justificativa_retorno != null) {
                            justRetorno = `----`;
                        }
                        justSaida = `<a class="btn btn-link btn-sm text-danger" >INCONSISTENTE</a>`;
                        if (re.entrada == null && re.intervalo == null && re.retorno == null && re.saida == null && fds == "DOM" || fds == "SAB") {
                            justSaida = `Fim de semana`
                        } else if (user.permissao == "\"admin\"" || user.permissao == "\"rh\"" && re.saida == null && re.justificativa_saida == null) {
                            justSaida = `<a href="" class="btn btn-link btn-sm text-danger" data-toggle="modal"
                        data-target="#modalAdd"  onClick="setModalId(${re.cod}, 'saida')" >INCONSISTENTE</a>`;
                        } else if (re.saida != null && re.justificativa_saida != null) {
                            justSaida = re.justificativa_saida;
                        }
                      
                        $("#dataTable tr:last").after(`
                            <tr>
                                <td>${monName[now.getMonth()] + " " + dayName[now.getDay()] + " " + now.getDate()}</td>
                                <td>${re.entrada != null && re.justificativa_entrada == null ? entradaSplit[1] : justEntrada}</td>
                                <td>${re.intervalo != null && re.justificativa_intervalo == null ? intervaloSplit[1] : justIntervalo}</td>
                                <td>${re.retorno != null && re.justificativa_retorno == null ? retornoSplit[1] : justRetorno}</td>
                                <td>${re.saida != null && re.justificativa_saida == null ? saidaSplit[1] : justSaida}</td>
                                <td>${getTime(Date.calcHrTrab(re.entrada, re.intervalo, re.retorno, re.saida))}</td>
                            </tr>
                        `);
                    } else {
                        $("#dataTable tr:last").after(`
                            <tr>
                                <td>${monName[now.getMonth()] + " " + dayName[now.getDay()] + " " + now.getDate()}</td>
                                <td>${(entradaSplit[1])}</td>
                                <td>${(intervaloSplit[1])}</td>
                                <td>${(retornoSplit[1])}</td>
                                <td>${(saidaSplit[1])}</td>
                                <td>${getTime(Date.calcHrTrab(re.entrada, re.intervalo, re.retorno, re.saida))}</td>
                            </tr>
                        `);
                    }

                }
                let inconsistenciasTexto = inconsistencias.length == 1 ? 'dia' : 'dias';
                $("#diasInconsistente").html(`${inconsistencias.length} ${inconsistenciasTexto}`);
                tamanhoRegistro = registros.length
                for (let re of registros) {
                    data = new Date(re.data);
                    fds = dayName[data.getDay()]
                    if (fds == "DOM") {
                        tamanhoRegistro -= 1
                    }
                    if (fds == "SAB") {
                        tamanhoRegistro -= 1
                    }
                }
                //console.log(tamanhoRegistro + " tamanho")
                let horasEsperado = tamanhoRegistro * user.carga_horaria * 60 * 60;

                let horasTrabalhadas = user.horas_trabalhadas.split(":");
                console.log(horasTrabalhadas)
                horatrabfi = checkZero(horas[0])
                mintrabfi = checkZero(minutos[0])
                segtrabfi = checkZero(segundos[0])
               
                horasTrabalhadas = parseInt(horatrabfi) * 60 * 60 + parseInt(mintrabfi) * 60 + parseInt(segtrabfi);
                let bancoDeHoras = Date.secondsDifference(horasTrabalhadas, horasEsperado);
              
                $("#bancoDeHoras").html(bancoDeHoras);

            }
        });

    });
}