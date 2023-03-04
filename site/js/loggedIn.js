$(document).ready(function () {
    if (sessionStorage.getItem('token') == undefined || sessionStorage.getItem('token') == '') {
        window.location.href = "Login.html"
    }
});