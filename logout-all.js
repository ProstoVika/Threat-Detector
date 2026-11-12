require("dotenv").config();

const { TelegramClient, Api } = require("telegram");
const { StringSession } = require("telegram/sessions");
const readline = require("node:readline/promises");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function main() {
    const apiId = Number(process.env.TG_API_ID);
    const apiHash = process.env.TG_API_HASH;
    const session = process.env.TG_SESSION || "";

    if (!apiId || !apiHash) {
        console.log("ERROR: API ID або API Hash відсутні.");
        return;
    }

    if (!session) {
        console.log("ERROR: Немає авторизованої сесії.");
        console.log("Номер телефону сам по собі недостатній.");
        return;
    }

    const client = new TelegramClient(
        new StringSession(session),
        apiId,
        apiHash,
        { connectionRetries: 1 }
    );

    try {
        await client.connect();

        if (!(await client.isUserAuthorized())) {
            console.log("Сесія недійсна.");
            return;
        }

        const me = await client.getMe();

        console.log("Account ID:", me.id.toString());

        const answer = await rl.question(
            "Завершити всі інші сесії? Введи YES: "
        );

        if (answer !== "YES") return;

        const result = await client.invoke(
            new Api.auth.ResetAuthorizations()
        );

        if (result) {
            console.log("Telegram підтвердив запит.");
        }

    } catch (error) {
        console.log(
            "Telegram error:",
            error.errorMessage || error.message
        );
    } finally {
        await client.disconnect();
    }
}

main().finally(() => rl.close());