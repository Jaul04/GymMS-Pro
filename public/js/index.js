document.addEventListener("DOMContentLoaded", () => {

    const links = document.querySelectorAll(".nav-link");

    links.forEach(link => {

        link.addEventListener("click", function () {

            links.forEach(item => item.classList.remove("active"));

            this.classList.add("active");

        });

    });

    const form = document.querySelector(".contact-form");

    form.addEventListener("submit", function (e) {

        e.preventDefault();

        alert("Thank you! Your message has been received.");

        form.reset();

    });

});