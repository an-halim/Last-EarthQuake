const axios = require('axios')
const fs = require('fs');

function get_between(string, start, end) {
    string = " " + string;
    let ini = string.indexOf(start);
    if (ini == 0) return "";
    ini += start.length;
    let len = string.indexOf(end, ini) - ini;
    return string.substr(ini, len);
}


(async() =>{
    try {
        let gempa = await axios.get("https://www.bmkg.go.id/gempabumi/gempabumi-dirasakan.bmkg");
        data = get_between(gempa.data, '<td>1</td>', '<td>2</td>');
        gambar = get_between(data, 'src="', '"');
        magnitude = get_between(data, 'magnitude"></span>', '</li>');
        kedalaman = get_between(data, 'kedalaman"></span>', '</li>');
        koordinat = get_between(data, 'koordinat"></span>', '</li>');
        lokasi = get_between(data, 'lokasi np"></span>', '</li>');
        waktu = get_between(data, '<td>1</td>>', koordinat).slice(0, 26).replace("<br>", " ");
        json = `{"gambar": "${gambar}", "magnitude": "${magnitude}", "kedalaman": "${kedalaman}", "koordinat": "${koordinat}", "lokasi": "${lokasi}", "waktu": "${waktu}"}`
        fs.readFile("./data/data.json", (err, data) =>{
            if(err) throw err
            dataGempa = JSON.parse(data)
            if (dataGempa.waktu != waktu) {
                fs.writeFile("./data/data.json", json, function(err){
                    if(err) throw err
                    let readMe = `
# Last-EarthQuake
This repo will auto update every 5 minute with Last EarthQuake report from BMKG
<br>
<br>
Last Update
<br>
<img src="${gambar}" width="400"></img>
<br>
<br>
Magnitude: ${magnitude} <br>
Kedalaman: ${kedalaman} <br>
Koordinat: ${koordinat} <br>
Waktu: ${waktu} <br>
`
                    fs.writeFile("./README.md", readMe, function(err){
                        if(err) throw err
                    })
                })
            }
        })
        
    } catch (error) {
        throw error
    }
    
})();