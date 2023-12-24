const venom = require("venom-bot");
const fs = require("fs");
const csv = require("csv-parser");
const fastcsv = require("fast-csv");

venom
  .create({
    session: "Lucas-BOT",
  })
  .then((client) => start(client))
  .catch((erro) => {
    console.log(erro);
  });

function start(client) {
  client.onMessage(async (msg) => {
    if (msg.type === "chat" && msg.body.startsWith("!testar ")) {
      const fileName = msg.body.slice(8).trim();
      const phoneNumbers = await readCSV(fileName);

      let results = [];
      let id = 1;

      for (const phoneNumber of phoneNumbers) {
        const result = await checkNumber(client, phoneNumber);
        if (result) {
          results.push({ Id: id, 'Recipient-Phone-Number': phoneNumber });
          id++;
        }
      }

      // Salvando os resultados em um arquivo CSV
      saveToCSV(results);
    }
  });
}

async function readCSV(fileName) {
  return new Promise((resolve, reject) => {
    let phoneNumbers = [];
    fs.createReadStream(fileName)
      .pipe(csv())
      .on("data", (row) => {
        phoneNumbers.push(row["Recipient-Phone-Number"]);
      })
      .on("end", () => {
        resolve(phoneNumbers);
      });
  });
}

async function checkNumber(client, phoneNumber) {
  try {
    const result = await client.checkNumberStatus(phoneNumber + "@c.us");
    console.log(phoneNumber + " deu certo");
    return result.status === 200; // ou qualquer condição que determine um número válido
  } catch (error) {
    console.log(phoneNumber + " deu erro");
    return false;
  }
}

function saveToCSV(data) {
  const ws = fs.createWriteStream("result.csv");
  fastcsv
    .write(data, { headers: true })
    .pipe(ws);
}
