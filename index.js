const {
 default: makeWASocket,
 useMultiFileAuthState,
 fetchLatestBaileysVersion
} = require("@whiskeysockets/baileys")

const P = require("pino")
const readline = require("readline")

const rl = readline.createInterface({
 input: process.stdin,
 output: process.stdout
})

async function startBot() {

 const { state, saveCreds } =
 await useMultiFileAuthState("session")

 const { version } =
 await fetchLatestBaileysVersion()

 const sock = makeWASocket({
   version,
   auth: state,
   logger: P({ level: "silent" }),
   browser: ["LexxoBot", "Chrome", "1.0.0"]
 })

 sock.ev.on("creds.update", saveCreds)

 if (!sock.authState.creds.registered) {

   const number = await new Promise((resolve) => {

     rl.question(
       "Enter WhatsApp number: ",
       resolve
     )

   })

   const code =
   await sock.requestPairingCode(number)

   console.log(`Your Pairing Code: ${code}`)

 }

 sock.ev.on("connection.update",
 ({ connection }) => {

   if (connection === "open") {
     console.log("BOT CONNECTED")
   }

 })

}

startBot()
