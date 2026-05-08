const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason
} = require("@whiskeysockets/baileys")

const P = require("pino")
const qrcode = require("qrcode-terminal")

async function startBot() {

  const { state, saveCreds } =
    await useMultiFileAuthState("session")

  const sock = makeWASocket({
    auth: state,
    logger: P({ level: "silent" })
  })

  sock.ev.on("creds.update", saveCreds)

  sock.ev.on("connection.update", (update) => {

    const { connection, qr } = update

    if (qr) {
      qrcode.generate(qr, { small: true })
    }

    if (connection === "open") {
      console.log("Bot connected")
    }
  })

  sock.ev.on("messages.upsert", async ({ messages }) => {

    const m = messages[0]

    if (!m.message) return

    console.log("Message received")

  })

}

startBot()
