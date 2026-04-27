/**
 * Monica Moritsch – Personal Website
 * Minimal JavaScript for navigation, scroll behavior, and contact form.
 */
(function () {
    "use strict";

    /* ---------- Mobile Navigation ---------- */
    var toggle = document.querySelector(".nav__toggle");
    var nav = document.querySelector(".nav");
    var overlay = document.querySelector(".nav__overlay");

    function openNav() {
        nav.classList.add("nav--open");
        overlay.classList.add("nav__overlay--visible");
        toggle.setAttribute("aria-expanded", "true");
        document.body.style.overflow = "hidden";
    }

    function closeNav() {
        nav.classList.remove("nav--open");
        overlay.classList.remove("nav__overlay--visible");
        toggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
    }

    if (toggle) {
        toggle.addEventListener("click", function () {
            var isOpen = nav.classList.contains("nav--open");
            if (isOpen) {
                closeNav();
            } else {
                openNav();
            }
        });
    }

    if (overlay) {
        overlay.addEventListener("click", closeNav);
    }

    var navLinks = document.querySelectorAll(".nav__link");
    navLinks.forEach(function (link) {
        link.addEventListener("click", function () {
            if (nav.classList.contains("nav--open")) {
                closeNav();
            }
        });
    });

    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && nav.classList.contains("nav--open")) {
            closeNav();
            toggle.focus();
        }
    });

    /* ---------- Header Scroll Behavior ---------- */
    var header = document.querySelector(".header");

    if (header && header.classList.contains("header--transparent")) {
        var scrollThreshold = 60;

        function updateHeader() {
            if (window.scrollY > scrollThreshold) {
                header.classList.add("header--scrolled");
                header.classList.remove("header--transparent");
            } else {
                header.classList.remove("header--scrolled");
                header.classList.add("header--transparent");
            }
        }

        window.addEventListener("scroll", updateHeader, { passive: true });
        updateHeader();
    }

    /* ---------- Contact Form (Formspree) ---------- */
    var form = document.querySelector(".contact__form");

    if (form) {
        form.addEventListener("submit", function (e) {
            var action = form.getAttribute("action");

            if (!action || action.indexOf("YOUR_FORM_ID") !== -1) {
                e.preventDefault();
                showFormStatus(
                    "error",
                    "Contact form is not yet configured. Please email monicamoritsch@gmail.com directly."
                );
                return;
            }

            e.preventDefault();
            var submitBtn = form.querySelector(".form__submit");
            submitBtn.disabled = true;
            submitBtn.textContent = "Sending\u2026";

            var data = new FormData(form);

            fetch(action, {
                method: "POST",
                body: data,
                headers: { Accept: "application/json" },
            })
                .then(function (response) {
                    if (response.ok) {
                        showFormStatus(
                            "success",
                            "Thank you! Your message has been sent. I will get back to you soon."
                        );
                        form.reset();
                    } else {
                        return response.json().then(function (json) {
                            var msg =
                                json.errors
                                    ? json.errors
                                          .map(function (err) {
                                              return err.message;
                                          })
                                          .join(", ")
                                    : "Something went wrong. Please try again.";
                            showFormStatus("error", msg);
                        });
                    }
                })
                .catch(function () {
                    showFormStatus(
                        "error",
                        "Network error. Please email monicamoritsch@gmail.com directly."
                    );
                })
                .finally(function () {
                    submitBtn.disabled = false;
                    submitBtn.textContent = "Send Message";
                });
        });
    }

    function showFormStatus(type, message) {
        var statusEl = document.querySelector(".form__status");
        if (!statusEl) return;

        statusEl.className = "form__status";
        statusEl.classList.add("form__status--" + type);
        statusEl.textContent = message;

        setTimeout(function () {
            statusEl.className = "form__status";
            statusEl.textContent = "";
        }, 8000);
    }
})();
