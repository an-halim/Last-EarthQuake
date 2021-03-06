const axios = require("axios");

module.exports.get_between = function (string, start, end) {
  string = " " + string;
  let ini = string.indexOf(start);
  if (ini == 0) return "";
  ini += start.length;
  let len = string.indexOf(end, ini) - ini;
  return string.substr(ini, len);
};

module.exports.JSON = function (gambar, magnitude, kedalaman, koordinat, lokasi, waktu) {
  return `{
      "gambar": "${gambar}", 
      "magnitude": "${magnitude}", 
      "kedalaman": "${kedalaman}", 
      "koordinat": "${koordinat}", 
      "lokasi": "${lokasi}", 
      "waktu": "${waktu}"
}`;
};

module.exports.readMe = function (gambar, magnitude, kedalaman, koordinat, lokasi, waktu) {
  return `# Last-EarthQuake
This repo will looking update every 5 minute with Last EarthQuake report from BMKG
<br>
<br>
Last Update
<br>
<img src="${gambar}" width="400"/>
<br>
Lokasi: ${lokasi} <br>
Magnitude: ${magnitude} <br>
Kedalaman: ${kedalaman} <br>
Koordinat: ${koordinat} <br>
Waktu: ${waktu} <br>

<a href="./data/data.json">**JSON Data**</a>
`;
};
