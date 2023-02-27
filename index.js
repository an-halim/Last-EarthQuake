const fs = require("fs");
const utils = require("./utils");

(async () => {
  let counter = 0;
  try {
    var notif = setInterval(function () {
      console.log("Looking update....");
      counter++;
    }, 200);

    let gempa = await utils.getUpdate();
    fs.readFile("./data/data.json", (err, data) => {
      if (err) throw err;
      let localData = JSON.parse(data);
      if (localData?.latest.waktu != gempa[0]?.waktu) {
        console.log("Update require!");

        let saveToLocal = localData;
        saveToLocal.latest = gempa[0];
        saveToLocal.history.push(gempa[0]);

        fs.writeFile("./data/data.json", JSON.stringify(saveToLocal), function (err) {
          if (err) throw err;
          let readMe = utils.readMe(gempa[0]);
          
          fs.writeFile("./README.md", readMe, function (err) {
            if (err) throw err;
            console.log("Updated!");
          });
          
        });
      } else {
        console.log("No update require!");
      }

    });
  } catch (error) {
    throw error;
  }
  if (counter == 30) clearInterval(notif);
  else clearInterval(notif);
})();
