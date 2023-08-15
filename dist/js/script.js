window.onscroll = function() {
    const header = document.querySelector('header');
    const fixedNav = header.offsetTop;

    if (window.pageYOffset > fixedNav) {
        header.classList.add('navbar-fixed');
    } else {
        header.classList.remove('navbar-fixed');
    }
}


const hamburger = document.querySelector('#hamburger');
const navMenu = document.querySelector('#nav-menu')

hamburger.addEventListener('click', function() {
    hamburger.classList.toggle('hamburger-active');
    navMenu.classList.toggle('hidden');
});


const scriptURL = "https://script.google.com/macros/s/AKfycbx0eCzzKaKtZ2gIwprnJ-5xtkpoM0kqcLv5uoVVUVZZMgIsJ6Fn6YHJ5OzUIOcpIcJV/exec";
        const form = document.forms["Ant1po1e-contact-form"];
        const btnSend = document.querySelector(".btn-send");
        const alert = document.querySelector(".alert")
        
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            alert.classList.add('hidden')
                fetch(scriptURL, {
                    method: "POST",
                    body: new FormData(form),
                })
            .then((response) => {
                alert.classList.remove('hidden')
                form.reset();
                console.log("Success!", response);
            })
            .catch((error) => console.error("Error!", error.message));
        });