/* ============================================================
   AfriConnect Summit 2026 - main.js
 ============================================================ */

document.addEventListener("DOMContentLoaded", () => {

    /* ============================================================
       1. DARK MODE / LIGHT MODE
       - Le thème choisi est sauvegardé dans le localStorage
       - Il reste donc actif même après un rechargement ou un
         changement de page
       - Le CSS gère les couleurs via l'attribut [data-theme="dark"]
         sur la balise <html>
       ============================================================ */

    const themeToggleBtn = document.getElementById("themeToggle");
    const themeIcon = themeToggleBtn.querySelector("i");
    const htmlElement = document.documentElement;

    // On récupère le thème déjà enregistré (s'il existe)
    const savedTheme = localStorage.getItem("theme");

    // Si un thème a déjà été choisi avant, on l'applique tout de suite
    if (savedTheme === "dark") {
        htmlElement.setAttribute("data-theme", "dark");
        themeIcon.classList.remove("bi-moon-stars-fill");
        themeIcon.classList.add("bi-sun-fill");
    }

    // Fonction qui bascule le thème au clic sur le bouton
    function toggleTheme() {
        const isDark = htmlElement.getAttribute("data-theme") === "dark";

        if (isDark) {
            // On repasse en mode clair
            htmlElement.removeAttribute("data-theme");
            localStorage.setItem("theme", "light");
            themeIcon.classList.remove("bi-sun-fill");
            themeIcon.classList.add("bi-moon-stars-fill");
        } else {
            // On passe en mode sombre
            htmlElement.setAttribute("data-theme", "dark");
            localStorage.setItem("theme", "dark");
            themeIcon.classList.remove("bi-moon-stars-fill");
            themeIcon.classList.add("bi-sun-fill");
        }
    }

    themeToggleBtn.addEventListener("click", toggleTheme);


    /* ============================================================
       2. NAVBAR DYNAMIQUE + MENU HAMBURGER MOBILE
       - Ajoute la classe "navbar--scrolled" après 80px de défilement
       - Ouvre/ferme le menu mobile au clic sur le burger
       ============================================================ */

    const navbar = document.getElementById("navbar");
    const burger = document.getElementById("burger");
    const navLinks = document.getElementById("navLinks");

    // Changement d'apparence de la navbar au scroll
    window.addEventListener("scroll", () => {
        if (window.scrollY > 80) {
            navbar.classList.add("navbar--scrolled");
        } else {
            navbar.classList.remove("navbar--scrolled");
        }
    });

    // Ouverture / fermeture du menu hamburger (mobile)
    burger.addEventListener("click", () => {
        navLinks.classList.toggle("navLinks--open");
        burger.classList.toggle("burger--active");

        // Mise à jour de l'attribut aria-expanded pour l'accessibilité
        const isOpen = navLinks.classList.contains("navLinks--open");
        burger.setAttribute("aria-expanded", isOpen);
    });

    // Ferme le menu automatiquement quand on clique sur un lien (mobile)
    const allNavLinks = navLinks.querySelectorAll("a");
    allNavLinks.forEach((link) => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("navLinks--open");
            burger.classList.remove("burger--active");
            burger.setAttribute("aria-expanded", "false");
        });
    });

});