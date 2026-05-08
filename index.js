const {
 default: makeWASocket,
 useMultiFileAuthState,
 fetchLatestBaileysVersion,
 DisconnectReason
} = require("@whiskeysockets/baileys")

const P = require("pino")
const qrcode = require("qrcode-terminal")

async function startBot() {

 const { state, saveCreds } =
 await useMultiFileAuthState("session")

 const { version } =
 await fetchLatestBaileysVersion()

 const sock = makeWASocket({
   version,
   auth: state,
   printQRInTerminal: false,
   logger: P({ level: "silent" })
 })

 sock.ev.on("creds.update", saveCreds)

 sock.ev.on("connection.update", ({ connection, qr }) => {

   if (qr) {
     qrcode.generate(qr, { small: true })
   }

   if (connection === "open") {
     console.log("CONNECTED SUCCESSFULLY")
   }

 })

}

startBot()
