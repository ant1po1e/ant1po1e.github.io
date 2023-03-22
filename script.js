const navbar = document.querySelector('.navbar')
const jumbotron = document.querySelector('.jumbotron');
const btntheme = document.querySelector('.btnTheme');
const about = document.querySelector('#about');
const skill = document.querySelector('#skill');
const gallery = document.querySelector('#gallery');
const contact = document.querySelector('#contact');
const footer = document.querySelector('.footer');

var svghead = document.getElementById("svgheader");
var svgabt = document.getElementById("svgabout");
var svgskill = document.getElementById("svgskill");
var svggal = document.getElementById("svggallery");
var svgcont = document.getElementById("svgcontact");

var btnin = document.getElementById("btnInner");

var foot = document.getElementById("foot");

var yt = document.getElementById("yt");
var twt = document.getElementById("twt");
var ig = document.getElementById("ig");
var gith = document.getElementById("gith");
var lnktr = document.getElementById("lnktr");



btntheme.addEventListener('click', () => {
    btntheme.classList.toggle('active');
    btntheme.classList.toggle('btn-dark');
    btntheme.classList.toggle('btn-light');

    if (btntheme.classList.contains('active')) {
        svghead.innerHTML = `<path fill="#b5e5ff" fill-opacity="1"
        d="M0,160L40,154.7C80,149,160,139,240,112C320,85,400,43,480,64C560,85,640,171,720,181.3C800,192,880,128,960,117.3C1040,107,1120,149,1200,149.3C1280,149,1360,107,1400,85.3L1440,64L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z">
        </path>`;
        svgabt.innerHTML = `<path fill="#a3e2ff" fill-opacity="1"
        d="M0,160L34.3,186.7C68.6,213,137,267,206,261.3C274.3,256,343,192,411,176C480,160,549,192,617,192C685.7,192,754,160,823,160C891.4,160,960,192,1029,224C1097.1,256,1166,288,1234,293.3C1302.9,299,1371,277,1406,266.7L1440,256L1440,320L1405.7,320C1371.4,320,1303,320,1234,320C1165.7,320,1097,320,1029,320C960,320,891,320,823,320C754.3,320,686,320,617,320C548.6,320,480,320,411,320C342.9,320,274,320,206,320C137.1,320,69,320,34,320L0,320Z">
        </path>`;
        svgskill.innerHTML = `<path fill="#91dcff" fill-opacity="1"
            d="M0,128L48,154.7C96,181,192,235,288,229.3C384,224,480,160,576,160C672,160,768,224,864,213.3C960,203,1056,117,1152,96C1248,75,1344,117,1392,138.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z">
        </path>`;
        svggal.innerHTML = `<path fill="#71d3fd" fill-opacity="1"
        d="M0,256L48,266.7C96,277,192,299,288,293.3C384,288,480,256,576,245.3C672,235,768,245,864,240C960,235,1056,213,1152,213.3C1248,213,1344,235,1392,245.3L1440,256L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z">
        </path>`;
        svgcont.innerHTML = `<path fill="#f8f9fa" fill-opacity="1"
            d="M0,224L48,224C96,224,192,224,288,218.7C384,213,480,203,576,192C672,181,768,171,864,181.3C960,192,1056,224,1152,240C1248,256,1344,256,1392,256L1440,256L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z">
        </path>`;


        btnin.innerHTML = `Dark mode`;


        navbar.classList.remove('bg-dark');
        navbar.classList.remove('navbar-dark');
        navbar.classList.add('bg-light');
        navbar.classList.add('navbar-light');


        yt.classList.remove('text-light');
        yt.classList.add('text-dark');
        twt.classList.remove('text-light');
        twt.classList.add('text-dark');
        ig.classList.remove('text-light');
        ig.classList.add('text-dark');
        gith.classList.remove('text-light');
        gith.classList.add('text-dark');
        lnktr.innerHTML = `<a href="https://linktr.ee/Symavity" target="blank"><img src="img/linktr-dark.png" width="100"></a>`;


        footer.classList.remove('bg-dark');
        footer.classList.remove('text-light');
        footer.classList.add('bg-light');
        footer.classList.add('text-dark');
        foot.classList.remove('text-light');
        foot.classList.add('text-dark');


        jumbotron.classList.add('active');
        about.classList.add('active');
        skill.classList.add('active');
        gallery.classList.add('active');
        contact.classList.add('active');
    } else {
        svghead.innerHTML = `<path fill="#242424" fill-opacity="1"
        d="M0,160L40,154.7C80,149,160,139,240,112C320,85,400,43,480,64C560,85,640,171,720,181.3C800,192,880,128,960,117.3C1040,107,1120,149,1200,149.3C1280,149,1360,107,1400,85.3L1440,64L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z">
        </path>`;
        svgabt.innerHTML = `<path fill="#212121" fill-opacity="1"
        d="M0,160L34.3,186.7C68.6,213,137,267,206,261.3C274.3,256,343,192,411,176C480,160,549,192,617,192C685.7,192,754,160,823,160C891.4,160,960,192,1029,224C1097.1,256,1166,288,1234,293.3C1302.9,299,1371,277,1406,266.7L1440,256L1440,320L1405.7,320C1371.4,320,1303,320,1234,320C1165.7,320,1097,320,1029,320C960,320,891,320,823,320C754.3,320,686,320,617,320C548.6,320,480,320,411,320C342.9,320,274,320,206,320C137.1,320,69,320,34,320L0,320Z">
        </path>`;
        svgskill.innerHTML = `<path fill="1e1e1e" fill-opacity="1"
            d="M0,128L48,154.7C96,181,192,235,288,229.3C384,224,480,160,576,160C672,160,768,224,864,213.3C960,203,1056,117,1152,96C1248,75,1344,117,1392,138.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z">
        </path>`;
        svggal.innerHTML = `<path fill="#151515" fill-opacity="1"
        d="M0,256L48,266.7C96,277,192,299,288,293.3C384,288,480,256,576,245.3C672,235,768,245,864,240C960,235,1056,213,1152,213.3C1248,213,1344,235,1392,245.3L1440,256L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z">
        </path>`;
        svgcont.innerHTML = `<path fill="#212529" fill-opacity="1"
            d="M0,224L48,224C96,224,192,224,288,218.7C384,213,480,203,576,192C672,181,768,171,864,181.3C960,192,1056,224,1152,240C1248,256,1344,256,1392,256L1440,256L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z">
        </path>`;


        btnin.innerHTML = `Light mode`;

        navbar.classList.remove('bg-light');
        navbar.classList.remove('navbar-light');
        navbar.classList.add('bg-dark');
        navbar.classList.add('navbar-dark');


        yt.classList.remove('text-dark');
        yt.classList.add('text-light');
        twt.classList.remove('text-dark');
        twt.classList.add('text-light');
        ig.classList.remove('text-dark');
        ig.classList.add('text-light');
        gith.classList.remove('text-dark');
        gith.classList.add('text-light');
        lnktr.innerHTML = `<a href="https://linktr.ee/Symavity" target="blank"><img src="img/linktr-light.png" width="100"></a>`;


        footer.classList.remove('bg-light');
        footer.classList.remove('text-dark');
        footer.classList.add('bg-dark');
        footer.classList.add('text-light');
        foot.classList.remove('text-dark');
        foot.classList.add('text-light');


        jumbotron.classList.remove('active');
        about.classList.remove('active');
        skill.classList.remove('active');
        gallery.classList.remove('active');
        contact.classList.remove('active');
    }
});