const SERVER_URL = 'http://localhost:4000';
let current_user = sessionStorage.getItem('current_user');

if (!['/login.html', '/signup.html'].includes(window.location.pathname)) {
    if (current_user === null) {
        location.href ='login.html';
    }
}
