/**
 * Monica Moritsch – Personal Website
 * Minimal JavaScript for navigation, scroll behavior, contact form, and in-page lightbox.
 */
(function () {
    "use strict";

    /* ---------- Footer Copyright Year ---------- */
    var copyrightYear = document.querySelector("#copyright-year");

    if (copyrightYear) {
        copyrightYear.textContent = new Date().getFullYear().toString();
    }

    /* ---------- Image Lightbox ---------- */
    var lightbox = document.querySelector("#image-lightbox");
    var lightboxImage = document.querySelector("#lightbox-image");
    var lightboxTriggers = document.querySelectorAll("[data-lightbox-image]");
    var lightboxClosers = document.querySelectorAll("[data-lightbox-close]");
    var lastLightboxTrigger = null;

    function closeLightbox() {
        if (!lightbox || !lightboxImage) {
            return;
        }

        lightbox.hidden = true;
        lightbox.setAttribute("aria-hidden", "true");
        lightboxImage.setAttribute("src", "");
        lightboxImage.setAttribute("alt", "");
        document.body.style.overflow = "";

        if (lastLightboxTrigger) {
            lastLightboxTrigger.focus();
        }
    }

    if (lightbox && lightboxImage && lightboxTriggers.length > 0) {
        lightboxTriggers.forEach(function (trigger) {
            trigger.addEventListener("click", function () {
                var imageSrc = trigger.getAttribute("data-lightbox-image");
                var imageAlt = trigger.getAttribute("data-lightbox-alt") || "";

                if (!imageSrc) {
                    return;
                }

                lastLightboxTrigger = trigger;
                lightboxImage.setAttribute("src", imageSrc);
                lightboxImage.setAttribute("alt", imageAlt);
                lightbox.hidden = false;
                lightbox.setAttribute("aria-hidden", "false");
                document.body.style.overflow = "hidden";
            });
        });

        lightboxClosers.forEach(function (closer) {
            closer.addEventListener("click", closeLightbox);
        });
    }

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
        if (e.key === "Escape" && galleryLightbox && !galleryLightbox.hidden) {
            closeGallery();
            return;
        }

        if (e.key === "ArrowLeft" && galleryLightbox && !galleryLightbox.hidden) {
            showGalleryImage(galleryIndex - 1);
            return;
        }

        if (e.key === "ArrowRight" && galleryLightbox && !galleryLightbox.hidden) {
            showGalleryImage(galleryIndex + 1);
            return;
        }

        if (e.key === "Escape" && lightbox && !lightbox.hidden) {
            closeLightbox();
            return;
        }

        if (e.key === "Escape" && nav.classList.contains("nav--open")) {
            closeNav();
            toggle.focus();
        }
    });

    /* ---------- Gallery Lightbox ---------- */
    var galleryLightbox = document.querySelector("#gallery-lightbox");
    var galleryImage = document.querySelector("#gallery-lightbox-image");
    var galleryCaption = document.querySelector("#gallery-lightbox-caption");
    var galleryTiles = document.querySelectorAll(".gallery-tile");
    var galleryPrev = document.querySelector("[data-gallery-prev]");
    var galleryNext = document.querySelector("[data-gallery-next]");
    var galleryClosers = document.querySelectorAll("[data-gallery-close]");
    var galleryItems = [];
    var galleryIndex = 0;
    var lastGalleryTrigger = null;

    if (galleryTiles.length > 0) {
        galleryTiles.forEach(function (tile) {
            var img = tile.querySelector("img");
            galleryItems.push({
                src: img ? img.getAttribute("src") : "",
                alt: img ? img.getAttribute("alt") : "",
                caption: tile.getAttribute("data-caption") || ""
            });
        });
    }

    function showGalleryImage(index) {
        if (!galleryLightbox || !galleryImage || galleryItems.length === 0) {
            return;
        }

        galleryIndex = (index + galleryItems.length) % galleryItems.length;
        galleryImage.setAttribute("src", galleryItems[galleryIndex].src);
        galleryImage.setAttribute("alt", galleryItems[galleryIndex].alt);

        if (galleryCaption) {
            galleryCaption.textContent = galleryItems[galleryIndex].caption;
        }
    }

    function openGallery(index) {
        if (!galleryLightbox) {
            return;
        }

        showGalleryImage(index);
        galleryLightbox.hidden = false;
        galleryLightbox.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
    }

    function closeGallery() {
        if (!galleryLightbox) {
            return;
        }

        galleryLightbox.hidden = true;
        galleryLightbox.setAttribute("aria-hidden", "true");
        galleryImage.setAttribute("src", "");
        galleryImage.setAttribute("alt", "");
        document.body.style.overflow = "";

        if (lastGalleryTrigger) {
            lastGalleryTrigger.focus();
        }
    }

    if (galleryTiles.length > 0 && galleryLightbox) {
        galleryTiles.forEach(function (tile, i) {
            tile.addEventListener("click", function () {
                lastGalleryTrigger = tile;
                openGallery(i);
            });
        });

        if (galleryPrev) {
            galleryPrev.addEventListener("click", function () {
                showGalleryImage(galleryIndex - 1);
            });
        }

        if (galleryNext) {
            galleryNext.addEventListener("click", function () {
                showGalleryImage(galleryIndex + 1);
            });
        }

        galleryClosers.forEach(function (closer) {
            closer.addEventListener("click", closeGallery);
        });
    }

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
})();
