console.log("Voo! Cafe website loaded");


/* =========================
   MOBILE MENU
========================= */

const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");

if (menuToggle) {

    menuToggle.addEventListener("click", function () {
        nav.classList.toggle("active");
    });

}


/* =========================
   CLOSE MOBILE MENU
========================= */

const navLinks = document.querySelectorAll(".nav a");

navLinks.forEach(function (link) {

    link.addEventListener("click", function () {
        nav.classList.remove("active");
    });

});


/* =========================
   GUEST COUNTER
========================= */

const minusGuest = document.getElementById("minusGuest");
const plusGuest = document.getElementById("plusGuest");
const guestCount = document.getElementById("guestCount");

let guests = 1;


if (minusGuest && plusGuest && guestCount) {

    minusGuest.addEventListener("click", function () {

        if (guests > 1) {
            guests--;
            guestCount.textContent = guests;
        }

    });


    plusGuest.addEventListener("click", function () {

        if (guests < 20) {
            guests++;
            guestCount.textContent = guests;
        }

    });

}


/* =========================
   RESERVATION FORM
========================= */

const reservationForm =
    document.querySelector(".reservation-form");


if (reservationForm) {

    reservationForm.addEventListener("submit", async function (event) {

        event.preventDefault();


        // Formadagi ma'lumotlarni olish
        const name =
            document.getElementById("name").value.trim();

        const phone =
            document.getElementById("phone").value.trim();

        const email =
            document.getElementById("email").value.trim();

        const date =
            document.getElementById("date").value;

        const comment =
            document.getElementById("comment").value.trim();


        // Ma'lumotlarni serverga yuborish
        const reservationData = {

            name: name,

            phone: phone,

            email: email,

            guests: guests,

            date: date,

            comment: comment

        };


        // Tugmani topamiz
        const submitButton =
            reservationForm.querySelector(
                'button[type="submit"]'
            );


        // Tugmani vaqtincha bloklaymiz
        if (submitButton) {

            submitButton.disabled = true;

            submitButton.textContent =
                "Yuborilmoqda...";

        }


        try {

            const response = await fetch(
                "/api/reservation",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(reservationData)
                }
            );


            const result =
                await response.json();


            if (result.success) {

                alert(
                    "Rahmat! Arizangiz muvaffaqiyatli yuborildi.\n\n" +
                    "Tez orada administratorimiz siz bilan bog‘lanadi."
                );


                // Formani tozalash
                reservationForm.reset();


                // Mehmonlar sonini qaytarish
                guests = 1;

                if (guestCount) {
                    guestCount.textContent = guests;
                }


            } else {

                alert(
                    result.message ||
                    "Arizani yuborishda xatolik yuz berdi."
                );

            }


        } catch (error) {

            console.error(
                "Reservation error:",
                error
            );


            alert(
                "Server bilan bog‘lanib bo‘lmadi.\n\n" +
                "Iltimos, birozdan keyin qayta urinib ko‘ring."
            );

        }


        // Tugmani qayta yoqamiz
        if (submitButton) {

            submitButton.disabled = false;

            submitButton.textContent =
                "Ariza qoldirish";

        }

    });

}


// ===============================
// MENYU TABLARI
// ===============================

const menuTabs = document.querySelectorAll(".menu-tab");
const menuItems = document.querySelectorAll(".menu-item");

menuTabs.forEach(function (tab) {

    tab.addEventListener("click", function () {

        const category = tab.dataset.category;

        menuTabs.forEach(function (t) {
            t.classList.remove("active");
        });

        tab.classList.add("active");

        menuItems.forEach(function (item) {

            if (item.dataset.category === category) {
                item.style.display = "";
            } else {
                item.style.display = "none";
            }

        });

    });

});