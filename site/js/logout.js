var btnLogout = document.getElementById('btnLogout');

btnLogout.addEventListener('click', function () {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('usuario');
    window.location.href = "Login.html"
});