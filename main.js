const venom = require("venom-bot");
const fs = require("fs");
const fsPromises = require("fs/promises");

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
      console.log(msg.body);
      const args = msg.body.slice(8).split(" ");
      let dataFile = [];
      fs.writeFileSync("numbers.json", JSON.stringify(dataFile));
      for (const arg of args) {
        await client
          .checkNumberStatus(arg + "@c.us")
          .then(async (result) => {
            const resultStatus = result.status;
            const resultExist = result.numberExists;
            const resultIdUser = result.id.user;
            console.log(
              JSON.stringify(
                "Status: " +
                  resultStatus +
                  " Exist: " +
                  resultExist +
                  "Id: " +
                  resultIdUser
              )
            );
            async function readwriteFileJson() {
              var data = fs.readFileSync("numbers.json");
              var myObject = JSON.parse(data);
              let newData = {
                resultStatus: resultStatus,
                resultExist: resultExist,
                resultIdUser: resultIdUser,
              };
              await myObject.push(newData);
              await fsPromises.writeFile(
                "numbers.json",
                JSON.stringify(myObject),
                (err) => {
                  if (err) throw err;
                }
              );
              console.log("Deu certo");
            }
            await readwriteFileJson();
          })
          .catch((erro) => {
            console.log(erro);
          });
      }
    }
  });
}
