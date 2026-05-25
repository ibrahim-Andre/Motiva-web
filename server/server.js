require("dotenv").config();

const express = require("express");

const TelegramBot =
    require("node-telegram-bot-api");

const {
    createClient,
} = require("@supabase/supabase-js");

const app = express();

const bot = new TelegramBot(
    process.env.TELEGRAM_BOT_TOKEN,
    {
        polling: true,
    }
);

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
);

console.log("🚀 Dispatch Server Started");



// =========================
// GEOCODE
// =========================

async function geocodeAddress(
    address
) {

    try {

        const response =
            await fetch(

                `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`,

                {
                    headers: {
                        "User-Agent":
                            "MotivaTaxi/1.0",
                    },
                }
            );

        const data =
            await response.json();

        if (!data.length)
            return null;

        return {

            lat: parseFloat(
                data[0].lat
            ),

            lon: parseFloat(
                data[0].lon
            ),

        };

    } catch (err) {

        console.log(
            "GEOCODE ERROR:",
            err
        );

        return null;
    }

}



// =========================
// DISTANCE
// =========================

function distance(
    lat1,
    lon1,
    lat2,
    lon2
) {

    const R = 6371;

    const dLat =
        (lat2 - lat1) *
        Math.PI /
        180;

    const dLon =
        (lon2 - lon1) *
        Math.PI /
        180;

    const a =

        Math.sin(dLat / 2) *
        Math.sin(dLat / 2)

        +

        Math.cos(
            lat1 * Math.PI / 180
        )

        *

        Math.cos(
            lat2 * Math.PI / 180
        )

        *

        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c =
        2 *
        Math.atan2(
            Math.sqrt(a),
            Math.sqrt(1 - a)
        );

    return R * c;

}



// =========================
// LAST REQUEST
// =========================

let lastRequestId = 0;



// =========================
// CHECK NEW REQUESTS
// =========================

setInterval(async () => {

    try {

        const { data, error } =
            await supabase

                .from("taxi_requests")

                .select("*")

                .order("id", {
                    ascending: false,
                })

                .limit(1);

        if (error) {

            console.log(error);

            return;
        }

        if (!data.length)
            return;

        const request =
            data[0];

        // SAME REQUEST?
        if (
            request.id <= lastRequestId
        ) {
            return;
        }

        lastRequestId =
            request.id;

        console.log(
            "🚕 NEW REQUEST:",
            request.id
        );



        // =========================
        // GEOCODE PICKUP
        // =========================

        const pickupCoords =
            await geocodeAddress(
                request.pickup + ", Sweden"
            );

        console.log(
            "📍 PICKUP:",
            pickupCoords
        );



        // =========================
        // DRIVERS
        // =========================

        const { data: drivers } =
            await supabase

                .from("drivers")

                .select("*");

        let nearestDriver =
            null;

        let nearestDistance =
            999999;



        drivers.forEach((driver) => {

            if (
                !driver.latitude ||
                !driver.longitude
            )
                return;

            if (!pickupCoords)
                return;

            const dist =
                distance(

                    pickupCoords.lat,
                    pickupCoords.lon,

                    driver.latitude,
                    driver.longitude
                );

            if (
                dist < nearestDistance
            ) {

                nearestDistance =
                    dist;

                nearestDriver =
                    driver;

            }

        });



        console.log(
            "🚖 NEAREST:",
            nearestDriver
        );



        // =========================
        // TELEGRAM MESSAGE
        // =========================

        await bot.sendMessage(

            process.env.TELEGRAM_GROUP_ID,

            `
🚕 NEW TAXI REQUEST

👤 Customer:
${request.customer_name}

📍 Pickup:
${request.pickup}

🏁 Destination:
${request.destination}

📞 Phone:
${request.phone}

🚖 Nearest Driver:
${nearestDriver?.full_name || "None"}

📏 Distance:
${nearestDriver
                ? nearestDistance.toFixed(1)
                : "Unknown"} km
      `,

            {
                reply_markup: {

                    inline_keyboard: [

                        [
                            {
                                text: "✅ Accept",
                                callback_data:
                                    `accept_${request.id}`,
                            },

                            {
                                text: "❌ Reject",
                                callback_data:
                                    `reject_${request.id}`,
                            },
                        ],
                    ],
                },
            }

        );

    } catch (err) {

        console.log(
            "SERVER ERROR:",
            err
        );

    }

}, 5000);



// =========================
// ACCEPT BUTTON
// =========================

bot.on(
    "callback_query",

    async (query) => {

        try {

            const data =
                query.data;

            if (
                data.startsWith("accept_")
            ) {

                const requestId =
                    data.split("_")[1];

                const driver =
                    query.from.first_name;



                const { data: request } =
                    await supabase

                        .from("taxi_requests")

                        .select("*")

                        .eq("id", requestId)

                        .single();



                if (
                    request.status === "Assigned"
                ) {

                    bot.answerCallbackQuery(
                        query.id,
                        {
                            text:
                                "❌ Ride already taken",
                            show_alert: true,
                        }
                    );

                    return;
                }



                await supabase

                    .from("taxi_requests")

                    .update({
                        status: "Assigned",
                        driver,
                    })

                    .eq("id", requestId);



                await bot.sendMessage(

                    process.env.TELEGRAM_GROUP_ID,

                    `
✅ RIDE ASSIGNED

👨 Driver:
${driver}

👤 Customer:
${request.customer_name}

📍 Pickup:
${request.pickup}

🏁 Destination:
${request.destination}
          `
                );



                bot.answerCallbackQuery(
                    query.id,
                    {
                        text:
                            "✅ Ride accepted",
                    }
                );



                console.log(
                    "✅ ACCEPTED:",
                    requestId,
                    driver
                );

            }

        } catch (err) {

            console.log(
                "ACCEPT ERROR:",
                err
            );

        }

    }
);



// =========================
// DRIVER LIVE LOCATION
// =========================

bot.on(
    "location",

    async (msg) => {

        try {

            const phone =
                msg.contact.phone_number;

            const telegramId =
                msg.from.id;

            console.log(
                "📱 PHONE:",
                phone
            );



            await supabase

                .from("drivers")

                .update({
                    telegram_phone: phone,
                })

                .eq(
                    "full_name",
                    telegramId
                );



            bot.sendMessage(

                msg.chat.id,

                "✅ Phone saved"
            );

        } catch (err) {

            console.log(
                "LOCATION ERROR:",
                err
            );

        }

    }
);



// =========================
// EXPRESS
// =========================

app.listen(3000, () => {

    console.log(
        "🔥 Server running on port 3000"
    );

});