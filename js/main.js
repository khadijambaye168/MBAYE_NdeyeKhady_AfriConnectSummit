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
document.addEventListener("DOMContentLoaded", () => {

    /* ============================================================
       3. ANIMATIONS AU SCROLL (IntersectionObserver)
       - Toutes les sections/éléments avec la classe "reveal"
         reçoivent la classe "reveal--visible" quand ils entrent
         dans le viewport
       ============================================================ */

    const revealElements = document.querySelectorAll(".reveal");

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("reveal--visible");
                // On arrête d'observer l'élément une fois révélé (évite de refaire l'animation)
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2 // se déclenche quand 20% de l'élément est visible
    });

    revealElements.forEach((el) => revealObserver.observe(el));


    /* ============================================================
       4. COMPTEURS ANIMÉS SUR LES CHIFFRES CLÉS
       - Chaque chiffre (data-target) s'incrémente progressivement
         de 0 jusqu'à sa valeur finale, une seule fois, quand la
         section devient visible à l'écran
       ============================================================ */

    const statNumbers = document.querySelectorAll(".stat__number");

    // Fonction qui anime un seul compteur de 0 jusqu'à sa valeur cible
    function animateCounter(element) {
        const target = parseInt(element.getAttribute("data-target"), 10);
        const duration = 1500; // durée totale de l'animation en millisecondes
        const startTime = performance.now();

        function updateCounter(currentTime) {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            const currentValue = Math.floor(progress * target);

            element.textContent = currentValue;

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target; // on affiche la valeur exacte à la fin
            }
        }

        requestAnimationFrame(updateCounter);
    }

    // Observer dédié aux compteurs : l'animation ne se lance
    // qu'une seule fois, quand la section stats apparaît à l'écran
    const statsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5
    });

    statNumbers.forEach((stat) => statsObserver.observe(stat));


    /* ============================================================
       5. COMPTE À REBOURS AVANT LA CONFÉRENCE
       - Calcule le temps restant jusqu'au 15 mars 2027, 09h00
       - Met à jour l'affichage chaque seconde
       ============================================================ */

    const countdownEl = document.getElementById("countdown");

    // On ne lance le compte à rebours que si l'élément existe sur la page
    if (countdownEl) {
        const dayEl = document.getElementById("cd-days");
        const hourEl = document.getElementById("cd-hours");
        const minuteEl = document.getElementById("cd-minutes");
        const secondEl = document.getElementById("cd-seconds");

        // Date de départ de la conférence
        const eventDate = new Date("2027-03-15T09:00:00").getTime();

        function updateCountdown() {
            const now = new Date().getTime();
            const remainingTime = eventDate - now;

            // Si la date est déjà passée, on affiche 00 partout
            if (remainingTime < 0) {
                dayEl.textContent = "00";
                hourEl.textContent = "00";
                minuteEl.textContent = "00";
                secondEl.textContent = "00";
                clearInterval(countdownInterval);
                return;
            }

            // Conversion du temps restant en jours / heures / minutes / secondes
            const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
            const hours = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

            // padStart ajoute un zéro devant si le nombre est inférieur à 10 (ex: 5 -> "05")
            dayEl.textContent = String(days).padStart(2, "0");
            hourEl.textContent = String(hours).padStart(2, "0");
            minuteEl.textContent = String(minutes).padStart(2, "0");
            secondEl.textContent = String(seconds).padStart(2, "0");
        }

        updateCountdown(); // premier affichage immédiat
        const countdownInterval = setInterval(updateCountdown, 1000); // mise à jour chaque seconde
    }

});