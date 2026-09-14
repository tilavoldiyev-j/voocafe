const express = require("express");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = 3000;

// JSON ma'lumotlarni qabul qilish
app.use(express.json());

// Sayt fayllarini ko'rsatish
app.use(express.static(__dirname));

// Telegram ma'lumotlari
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;


// ===============================
// STOL BAND QILISH
// ===============================

app.post("/api/reservation", async (req, res) => {
    try {
        const {
            name,
            phone,
            email,
            guests,
            date,
            comment
        } = req.body;

        // Majburiy maydonlarni tekshirish
        if (!name || !phone || !guests || !date) {
            return res.status(400).json({
                success: false,
                message: "Majburiy ma'lumotlar to'ldirilmagan."
            });
        }

        // Telegramga yuboriladigan xabar
        const message = `
🔔 <b>YANGI STOL BAND QILISH</b>

🏠 <b>Voo! Cafe — Andijon</b>
📍 Mashrab ko'chasi, Eco Park
🕐 24/7

👤 <b>Kim band qilyapti:</b>
${name}

📞 <b>Telefon:</b>
${phone}

📧 <b>Elektron pochta:</b>
${email || "Kiritilmagan"}

👥 <b>Mehmonlar miqdori:</b>
${guests} kishi

📅 <b>Tashrif sanasi:</b>
${date}

💬 <b>Izoh:</b>
${comment || "Izoh qoldirilmagan"}
        `.trim();

        // Telegram Bot API
        const telegramUrl =
            `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

        const telegramResponse = await fetch(telegramUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: message,
                parse_mode: "HTML"
            })
        });

        const telegramData = await telegramResponse.json();

        if (!telegramData.ok) {
            console.error("Telegram xatosi:", telegramData);

            return res.status(500).json({
                success: false,
                message: "Telegramga yuborishda xatolik yuz berdi."
            });
        }

        // Muvaffaqiyatli
        res.json({
            success: true,
            message: "Arizangiz muvaffaqiyatli yuborildi!"
        });

    } catch (error) {
        console.error("Server xatosi:", error);

        res.status(500).json({
            success: false,
            message: "Serverda xatolik yuz berdi."
        });
    }
});


// ===============================
// SERVER
// ===============================

app.listen(PORT, () => {
    console.log(`Voo! server ishga tushdi: http://localhost:${PORT}`);
});