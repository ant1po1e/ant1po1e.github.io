require('dotenv').config();

const scriptURL = process.env.CONTACT_SCRIPT_URL;
const form = document.forms["Ant1po1e-contact-form"];
const success = document.querySelector(".success")
const formAlert = document.querySelector(".alert");

form.addEventListener("submit", (e) => {
   e.preventDefault();
   formAlert.classList.toggle('hidden');
   formAlert.classList.toggle('flex');
   success.classList.toggle('hidden');
   fetch(scriptURL, {
      method: "POST",
      body: new FormData(form),
   })
      .then((response) => {
         formAlert.classList.toggle("hidden");
         formAlert.classList.toggle("flex");
         success.classList.add("hidden");
         form.reset();
         console.log("Success!", response);
      })
      .catch((error) => console.error("Error!", error.message));
});