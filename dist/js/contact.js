const scriptURL = "https://script.google.com/macros/s/AKfycbx0eCzzKaKtZ2gIwprnJ-5xtkpoM0kqcLv5uoVVUVZZMgIsJ6Fn6YHJ5OzUIOcpIcJV/exec";
const form = document.forms["Ant1po1e-contact-form"];
const formAlert = document.querySelector(".alert");
const submitBtn = document.getElementById("submit");
const submitBtnText = submitBtn.querySelector("span");

form.addEventListener("submit", (e) => {
   e.preventDefault();

   submitBtn.disabled = true;
   submitBtnText.innerHTML = `<i class="bi bi-arrow-clockwise animate-spin inline-block transition duration-300"></i>`;

   fetch(scriptURL, {
         method: "POST",
         body: new FormData(form),
      })
      .then((response) => {
         formAlert.classList.remove("hidden");
         formAlert.classList.add("flex");

         form.reset();

         submitBtn.disabled = false;
         submitBtnText.textContent = "Submit";

         setTimeout(() => {
            formAlert.classList.remove("flex");
            formAlert.classList.add("hidden");
         }, 3000);
      })
      .catch((error) => {
         console.error("Error!", error.message);
         alert("Something went wrong! Please try again later.");

         submitBtn.disabled = false;
         submitBtnText.textContent = "Submit";
      });
});