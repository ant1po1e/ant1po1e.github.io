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
const navMenu = document.querySelector('#nav-menu');

hamburger.addEventListener('click', function() {
    hamburger.classList.toggle('hamburger-active');
    navMenu.classList.toggle('hidden');
});


const scriptURL = "https://script.google.com/macros/s/AKfycbx0eCzzKaKtZ2gIwprnJ-5xtkpoM0kqcLv5uoVVUVZZMgIsJ6Fn6YHJ5OzUIOcpIcJV/exec";
const form = document.forms["Ant1po1e-contact-form"];
const alert = document.querySelector(".alert");

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        alert.classList.add('hidden');
        fetch(scriptURL, {
            method: "POST",
            body: new FormData(form),
            })
        .then((response) => {
            alert.classList.remove('hidden');
            form.reset();
            console.log("Success!", response);
            })
        .catch((error) => console.error("Error!", error.message));
    });


const back2Top = document.querySelector('#back2top');

    window.addEventListener('scroll', () =>{
        if (window.pageYOffset > 200) {
            back2Top.classList.remove('opacity-0');
            back2Top.classList.add('opacity-100');
        } else {
            back2Top.classList.add('opacity-0');
            back2Top.classList.remove('opacity-100');
        }
    });

    back2Top.addEventListener('click', (e) => {
        e.preventDefault();
        window.scroll({top: 0, left: 0, behavior: 'smooth'});
    });


window.addEventListener('click', function(e) {
    if(e.target != hamburger && e.target != navMenu) {
        hamburger.classList.remove('hamburger-active');
        navMenu.classList.add('hidden');
    }
});