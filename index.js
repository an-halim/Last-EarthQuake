const axios = require("axios");
const fs = require("fs");
const func = require("./func");
const https = require("https");

async function getUpdate() {
  let request = await axios.get(
    "https://www.bmkg.go.id/gempabumi/gempabumi-dirasakan.bmkg"
  );
  data = func.get_between(request.data, "<td>1</td>", "<td>2</td>");
  gambar = func.get_between(data, 'src="', '"');
  magnitude = func.get_between(data, 'magnitude"></span>', "</li>");
  kedalaman = func.get_between(data, 'kedalaman"></span>', "</li>");
  koordinat = func.get_between(data, 'koordinat"></span>', "</li>");
  lokasi = func.get_between(data, 'lokasi np"></span>', "</li>");
  waktu = func
    .get_between(data, "<td>1</td>>", koordinat)
    .slice(0, 26)
    .replace("<br>", " ");
  json = func.JSON(gambar, magnitude, kedalaman, koordinat, lokasi, waktu);
  if (waktu == "" || waktu == null) json = await getUpdate();
  return json;
}

(async () => {
  let counter = 0;
  try {
    var notif = setInterval(function () {
      console.log("Looking update....");
      counter++;
    }, 200);

    let gempa = await getUpdate();
    fs.readFile("./data/data.json", (err, data) => {
      if (err) throw err;
      const dataGempa = JSON.parse(data);
      dataGempa.forEach(element => {
        // console.log(check)
        const check = waktu === element.waktu
        if (!check) {
          dataGempa.push(JSON.parse(gempa));
          console.log(dataGempa)
          console.log("Update require!");
          fs.writeFile("./data/data.json", JSON.stringify(dataGempa), function (err) {
            if (err) throw err;
            let readMe = func.readMe(
              gambar,
              magnitude,
              kedalaman,
              koordinat,
              lokasi,
              waktu
            );
            fs.writeFile("./README.md", readMe, function (err) {
              if (err) throw err;
              console.log("Updated!");
            });
          });
        } else {
          console.log("No update require!");
        }
      });

    });
  } catch (error) {
    throw error;
  }
  if (counter == 30) clearInterval(notif);
  else clearInterval(notif);
})();
