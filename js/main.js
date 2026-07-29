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
/* =====================================================
   ONGLETS DU PROGRAMME (programme.html)
   Affiche le planning du jour cliqué, sans recharger la page
===================================================== */

// On récupère tous les boutons d'onglets et tous les panneaux
const tabButtons = document.querySelectorAll(".tab-btn");
const tabPanels = document.querySelectorAll(".tab-panel");

// On boucle sur chaque bouton pour lui ajouter un écouteur de clic
tabButtons.forEach(function (button) {
  button.addEventListener("click", function () {

    // 1. On enlève la classe "active" de TOUS les boutons et panneaux
    tabButtons.forEach(function (btn) {
      btn.classList.remove("active");
    });
    tabPanels.forEach(function (panel) {
      panel.classList.remove("active");
    });

    // 2. On récupère le jour à afficher grâce à l'attribut data-tab
    const jourCible = button.getAttribute("data-tab");

    // 3. On ajoute la classe "active" au bouton cliqué
    button.classList.add("active");

    // 4. On ajoute la classe "active" au panneau correspondant
    const panelCible = document.getElementById(jourCible);
    if (panelCible) {
      panelCible.classList.add("active");
    }
  });
});
/* =====================================================
   FILTRAGE DYNAMIQUE DES INTERVENANTS (intervenants.html)
   Affiche/masque les cartes selon la thématique choisie
===================================================== */

const filterButtons = document.querySelectorAll(".filter-btn");
const speakerCards = document.querySelectorAll(".speaker-card");

filterButtons.forEach(function (button) {
  button.addEventListener("click", function () {

    // 1. Gestion du bouton actif (mise en évidence visuelle)
    filterButtons.forEach(function (btn) {
      btn.classList.remove("active");
    });
    button.classList.add("active");

    // 2. On récupère la catégorie choisie
    const categorieChoisie = button.getAttribute("data-filter");

    // 3. On parcourt toutes les cartes d'intervenants
    speakerCards.forEach(function (card) {
      const categorieCard = card.getAttribute("data-category");

      // Si "Tous" est sélectionné OU si la catégorie correspond -> on affiche
      if (categorieChoisie === "tous" || categorieChoisie === categorieCard) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });
  });
});
/* =====================================================
   VALIDATION DU FORMULAIRE D'INSCRIPTION (contact.html)
===================================================== */

const form = document.getElementById("registration-form");

if (form) {
  form.addEventListener("submit", function (event) {
    // On empêche l'envoi normal du formulaire (pas de rechargement)
    event.preventDefault();

    let formulaireValide = true; // on suppose que tout est bon au départ

    // ---------- Récupération des champs ----------
    const fullName = document.getElementById("full-name");
    const email = document.getElementById("email");
    const phone = document.getElementById("phone");
    const participationType = document.getElementById("participation-type");
    const country = document.getElementById("country");
    const message = document.getElementById("message");

    // ---------- Fonction utilitaire pour afficher une erreur ----------
    function afficherErreur(champ, messageErreur) {
      const erreurElement = document.getElementById(champ.id + "-error");
      champ.classList.add("invalid");
      champ.classList.remove("valid");
      erreurElement.textContent = messageErreur;
      formulaireValide = false;
    }

    // ---------- Fonction utilitaire pour valider un champ ----------
    function marquerValide(champ) {
      const erreurElement = document.getElementById(champ.id + "-error");
      champ.classList.add("valid");
      champ.classList.remove("invalid");
      erreurElement.textContent = "";
    }

    // ---------- 1. Nom complet ----------
    if (fullName.value.trim() === "") {
      afficherErreur(fullName, "Le nom complet est obligatoire.");
    } else {
      marquerValide(fullName);
    }

    // ---------- 2. Email (vérifié par regex) ----------
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email.value.trim() === "") {
      afficherErreur(email, "L'adresse email est obligatoire.");
    } else if (!regexEmail.test(email.value.trim())) {
      afficherErreur(email, "Veuillez entrer une adresse email valide.");
    } else {
      marquerValide(email);
    }

    // ---------- 3. Téléphone (minimum 8 chiffres) ----------
    const chiffresTelephone = phone.value.replace(/\D/g, ""); // on garde uniquement les chiffres
    if (phone.value.trim() === "") {
      afficherErreur(phone, "Le numéro de téléphone est obligatoire.");
    } else if (chiffresTelephone.length < 8) {
      afficherErreur(phone, "Le téléphone doit contenir au moins 8 chiffres.");
    } else {
      marquerValide(phone);
    }

    // ---------- 4. Type de participation ----------
    if (participationType.value === "") {
      afficherErreur(participationType, "Veuillez choisir un type de participation.");
    } else {
      marquerValide(participationType);
    }

    // ---------- 5. Pays ----------
    if (country.value === "") {
      afficherErreur(country, "Veuillez choisir votre pays.");
    } else {
      marquerValide(country);
    }

    // ---------- 6. Message (minimum 20 caractères) ----------
    if (message.value.trim() === "") {
      afficherErreur(message, "Le message est obligatoire.");
    } else if (message.value.trim().length < 20) {
      afficherErreur(message, "Le message doit contenir au moins 20 caractères.");
    } else {
      marquerValide(message);
    }

    // ---------- Résultat final ----------
    if (formulaireValide) {
      // On affiche le message de succès
      const successMessage = document.getElementById("form-success");
      successMessage.classList.add("show");

      // On réinitialise le formulaire
      form.reset();

      // On enlève les classes valid/invalid restantes après reset
      const champs = form.querySelectorAll("input, select, textarea");
      champs.forEach(function (champ) {
        champ.classList.remove("valid");
        champ.classList.remove("invalid");
      });

      // On masque le message de succès après quelques secondes
      setTimeout(function () {
        successMessage.classList.remove("show");
      }, 4000);
    }
  });
}
/* =====================================================
   ANNÉE DYNAMIQUE DANS LE FOOTER (sur les 4 pages)
===================================================== */

const anneeSpan = document.getElementById("year");

if (anneeSpan) {
  anneeSpan.textContent = new Date().getFullYear();
}


/* =====================================================
   BOUTON RETOUR EN HAUT
===================================================== */

// On récupère tous les boutons "retour en haut" de la page
const boutonsRetourHaut = document.querySelectorAll(".back-to-top");

// 1. Afficher le(s) bouton(s) après 300px de défilement
window.addEventListener("scroll", function () {
  if (window.scrollY > 300) {
    boutonsRetourHaut.forEach(function (bouton) {
      bouton.classList.add("show");
    });
  } else {
    boutonsRetourHaut.forEach(function (bouton) {
      bouton.classList.remove("show");
    });
  }
});

// 2. Remonter en douceur au clic sur un des boutons
boutonsRetourHaut.forEach(function (bouton) {
  bouton.addEventListener("click", function (event) {
    event.preventDefault(); // empêche le lien "#top" de sauter directement
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
});