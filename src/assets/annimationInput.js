window.addEventListener('load', function () {

    let input = document.getElementById('userName');

    input.addEventListener('focus', function () {
        this.classList.add('isEmpty');
    });


    input.addEventListener('blur', function () {
        if (!this.value) {
            this.classList.remove('isEmpty');
        }
    });


    let passwordInput = document.getElementById('password');

    passwordInput.addEventListener('focus', function () {
        this.classList.add('isEmpty');
    });


    passwordInput.addEventListener('blur', function () {
        if (!this.value) {
            this.classList.remove('isEmpty');
        }
    });

});