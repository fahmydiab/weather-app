const yargs = require ('yargs');
const axios = require('axios');

const argv = yargs
  .options({
    a: {
      demand: true,
      alias: 'address',
      describe: 'Address to fetch weather for',
      string: true
    }
})
.help()
.alias('help', 'h')
.argv;

var encodedAddress = encodeURIComponent(argv.address);
var geocodeUrl = `https://us1.locationiq.com/v1/search.php?key=fdb3d516cc3939&q=${encodedAddress}&format=json`;

axios.get(geocodeUrl).then((response)=>{
  
  if(response.data[0].error === 'Unable to geocode'){
    throw new Error('Unable to find the address.');
  }
  var lat = response.data[0].lat;
  var lon = response.data[0].lon;
  var weatherUrl = `https://api.darksky.net/forecast/4af341340197ab9c445991be25520cfc/${lat},${lon}`;
  console.log(response.data[0].display_name);
  return axios.get(weatherUrl);
}).then((response)=>{
  var temperature =response.data.currently.temperature;
  var apparentTemperature = response.data.currently.apparentTemperature;
  var summary = response.data.currently.summary;
  console.log(`It's currently ${temperature}\xB0F. It feels like ${apparentTemperature}\xB0F.
  Summary : It's ${summary}.`)
})
.catch((e)=>{
  if (e.code === 'ENOTFOUND'){
    console.log('Unable to connect to API servers.');
  }else {
    console.log(e.message);
  }

});