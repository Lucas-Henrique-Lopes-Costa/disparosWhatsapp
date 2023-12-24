const { Client } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const readline = require("readline");
const fs = require("fs");
const parse = require("csv-parse/lib/sync");
const stringify = require("csv-stringify/lib/sync");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Por favor, insira o nome do arquivo CSV: ", (fileName) => {
  const client = new Client();

  client.on("qr", (qr) => {
    qrcode.generate(qr, { small: true });
  });

  client.on("ready", () => {
    console.log("Client is ready!");
    verificarNumeros(client, fileName);
  });

  client.initialize();
});

async function verificarNumeros(client, fileName) {
  const data = fs.readFileSync(fileName);
  const records = parse(data, {
    columns: true,
    skip_empty_lines: true,
  });

  const numerosVerificados = [];

  for (const record of records) {
    const numero = record["Recipient-Phone-Number"];
    if (await verificarWhatsApp(client, numero)) {
      numerosVerificados.push({ "Recipient-Phone-Number": numero });
    }
  }

  const csvString = stringify(numerosVerificados, { header: true });
  fs.writeFileSync("numeros_verificados.csv", csvString);
  console.log("Arquivo numeros_verificados.csv criado com sucesso.");

  client.destroy();
  rl.close();
}

function verificarWhatsApp(client, numero) {
  return new Promise((resolve) => {
    const chatId = numero.includes("@c.us") ? numero : `${numero}@c.us`;

    client
      .sendMessage(chatId, "Teste de verificação do WhatsApp")
      .then((response) => {
        if (response.id.fromMe) {
          console.log(`Número ${numero} verificado com sucesso.`);
          resolve(true);
        }
      })
      .catch((err) => {
        console.log(`Erro ao verificar o número ${numero}:`, err);
        resolve(false);
      });
  });
}
