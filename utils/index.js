const axios = require("axios");
const cheerio = require('cheerio');

module.exports.readMe = function (data) {
  return `# Last-EarthQuake
This repo will looking update every 5 minute with Last EarthQuake report from BMKG
<br>
<br>
<img src="${data.img}" width="400"/>
<br>
Lokasi: ${data.lokasi} <br>
Magnitude: ${data.magnitude} <br>
Kedalaman: ${data.kedalaman} <br>
Koordinat: ${data.koordinat} <br>
Waktu: ${data.waktu} <br>

<a href="./data/data.json">**JSON Data**</a>
<br>
Made with ❤️ by <a href="https://github.com/an-halim">An Halim</a>
## License

This project is open source and available under the [MIT License](LICENSE).
`;
};

module.exports.getUpdate =  async function() {
  let request = await axios.get(
    "https://www.bmkg.go.id/gempabumi/gempabumi-dirasakan.bmkg"
  );
  
  const $ = cheerio.load(request.data);
  const table = $('table > tbody');
  const tableRows = table.find('tr');
  const earthQuakeData = Array.from(tableRows).map((row) => {
    const rowDatas = $(row).find('td');
    const img = $(rowDatas).find('img');
    const rowData = Array.from(rowDatas).map((td) => $(td).text());
    const imgData = Array.from(img).map((img) => $(img).attr('src'));
    return {
      img: imgData[0],
      waktu: rowData[1],
      koordinat: rowData[2],
      magnitude: rowData[3],
      kedalaman: rowData[4],
      lokasi: rowData[5].split("\n")[0],
    };
  })
  let json = earthQuakeData
  if (earthQuakeData[0].waktu == "" || earthQuakeData[0].waktu == null) json = await getUpdate();
  return json;
}
