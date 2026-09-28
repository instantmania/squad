/* =========================================
   INSTANT MANIA
   INTERACTION
========================================= */


/* =========================================
   SCROLL REVEAL
========================================= */

const revealElements =
    document.querySelectorAll(".reveal");


const revealObserver =
    new IntersectionObserver(

        (entries) => {

            entries.forEach((entry) => {

                if (entry.isIntersecting) {

                    entry.target.classList.add("visible");

                    revealObserver.unobserve(
                        entry.target
                    );

                }

            });

        },

        {
            threshold: 0.12
        }

    );


revealElements.forEach((element) => {

    revealObserver.observe(element);

});


/* =========================================
   PLAYER DATA
========================================= */

const players = {

    fitra: {

        number: "69",

        name: "FITRA",

        role: "KANG NGABISIN CP",

        position: "Ujung Kiri",

        speciality:
            "Ngedit / SMakan / Tidur",

        joined: "2025",

        image: "assets/Fitra.jpg"

    },


    rizky: {

        number: "07",

        name: "RIZKY",

        role: "PHOTOGRAPHER",

        position: "Photographer",

        speciality:
            "Photography / Lighting / Visual",

        joined: "2024",

        image: "assets/rizky.jpg"

    },


    nana: {

        number: "10",

        name: "NANA",

        role: "PRODUCTION",

        position: "Production",

        speciality:
            "Production / Coordination / Creative",

        joined: "2025",

        image: "assets/nana.jpg"

    },


    farhan: {

        number: "17",

        name: "FARHAN",

        role: "MARKETING",

        position: "Marketing",

        speciality:
            "Marketing / Communication / Strategy",

        joined: "2025",

        image: "assets/farhan.jpg"

    },


    satria: {

        number: "23",

        name: "SATRIA",

        role: "EDITOR",

        position: "Photo & Video Editor",

        speciality:
            "Editing / Color / Retouch",

        joined: "2024",

        image: "assets/satria.jpg"

    },


    devi: {

        number: "99",

        name: "DEVI",

        role: "FINANCE & SUPPORT",

        position: "Finance & Support",

        speciality:
            "Finance / Administration / Support",

        joined: "2025",

        image: "assets/devi.jpg"

    }

};


/* =========================================
   MODAL ELEMENTS
========================================= */

const modal =
    document.getElementById("playerModal");

const modalClose =
    document.getElementById("modalClose");

const modalImage =
    document.getElementById("modalImage");

const modalNumber =
    document.getElementById("modalNumber");

const modalName =
    document.getElementById("modalName");

const modalRole =
    document.getElementById("modalRole");

const modalPosition =
    document.getElementById("modalPosition");

const modalSpeciality =
    document.getElementById("modalSpeciality");

const modalJoined =
    document.getElementById("modalJoined");


/* =========================================
   OPEN PLAYER
========================================= */

document
    .querySelectorAll(".player-card")
    .forEach((card) => {

        card.addEventListener("click", () => {

            const playerId =
                card.dataset.player;

            const player =
                players[playerId];

            if (!player) return;


            modalImage.src =
                player.image;

            modalImage.alt =
                player.name;


            modalNumber.textContent =
                player.number;

            modalName.textContent =
                player.name;

            modalRole.textContent =
                player.role;

            modalPosition.textContent =
                player.position;

            modalSpeciality.textContent =
                player.speciality;

            modalJoined.textContent =
                player.joined;


            modal.classList.add("active");

            document.body.style.overflow =
                "hidden";

        });

    });


/* =========================================
   CLOSE MODAL
========================================= */

function closeModal() {

    modal.classList.remove("active");

    document.body.style.overflow = "";

}


modalClose.addEventListener(
    "click",
    closeModal
);


modal.addEventListener(
    "click",
    (event) => {

        if (
            event.target === modal
        ) {

            closeModal();

        }

    }
);


/* =========================================
   ESC KEY
========================================= */

document.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key === "Escape" &&
            modal.classList.contains("active")
        ) {

            closeModal();

        }

    }
);


/* =========================================
   MOBILE MENU
========================================= */

const menuButton =
    document.getElementById("menuButton");


const nav =
    document.querySelector(".nav");


menuButton.addEventListener(
    "click",
    () => {

        nav.classList.toggle(
            "mobile-open"
        );

    }
);


/* =========================================
   HEADER SCROLL
========================================= */

const header =
    document.getElementById("header");


let lastScroll = 0;


window.addEventListener(
    "scroll",
    () => {

        const currentScroll =
            window.scrollY;


        if (
            currentScroll > 80
        ) {

            header.classList.add(
                "scrolled"
            );

        } else {

            header.classList.remove(
                "scrolled"
            );

        }


        lastScroll =
            currentScroll;

    }
);


/* =========================================
   FORMATION PLAYER HOVER
========================================= */

document
    .querySelectorAll(".formation-player")
    .forEach((player) => {

        player.addEventListener(
            "mouseenter",
            () => {

                player.style.zIndex = "5";

            }
        );

    });
