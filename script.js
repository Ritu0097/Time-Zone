const x = document.getElementById("demo");
const timezoneDisplay = document.getElementById("timezone");
const offsetDisplay = document.getElementById("offset");
const offsetSecondsDisplay = document.getElementById("offsetSeconds");
const offsetDSTDisplay = document.getElementById("offsetDST");
const offsetDSTSecondsDisplay = document.getElementById("offsetDSTSeconds");
const countryLocationDisplay = document.getElementById("countryLocation");
const postcodeDisplay = document.getElementById("postcode");
const cityDisplay = document.getElementById("city");
const Display = document.getElementById("timezoneDisplay"); // Changed variable name

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    x.innerHTML = "Geolocation is not supported by this browser.";
  }
}

function showPosition(position) {
  x.innerHTML = "Latitude: " + position.coords.latitude +
    "&nbsp Longitude: " + position.coords.longitude;

  const timezone = getTimezoneName();
  timezoneDisplay.innerHTML = `Current Timezone: ${timezone}`;

  const offsetStd = getTimezoneOffsetStd();
  offsetDisplay.innerHTML = `Offset STD: ${offsetStd}`;

  const offsetSeconds = getTimezoneOffsetSeconds();
  offsetSecondsDisplay.innerHTML = `Offset STD Seconds: ${offsetSeconds}`;

  const offsetDST = getTimezoneOffsetDST();
  offsetDSTDisplay.innerHTML = `Offset DST: ${offsetDST}`;

  const offsetDSTSeconds = getTimezoneOffsetDSTSeconds();
  offsetDSTSecondsDisplay.innerHTML = `Offset DST Seconds: ${offsetDSTSeconds}`;

  const countryLocation = getCountryLocation(position.coords.latitude, position.coords.longitude);
  countryLocationDisplay.innerHTML = `Country: ${countryLocation}`;
  const countryPostcodeDisplay = getPostcode(position.coords.latitude, position.coords.longitude);
  postcodeDisplay.innerHTML = `Postcode: ${countryPostcodeDisplay}`;
  getCity(position.coords.latitude, position.coords.longitude);
}

function getTimezoneName() {
  const today = new Date();
  const short = today.toLocaleDateString(undefined);
  const full = today.toLocaleDateString(undefined, { timeZoneName: 'long' });
  const shortIndex = full.indexOf(short);
  if (shortIndex >= 0) {
    const trimmed = full.substring(0, shortIndex) + full.substring(shortIndex + short.length);
    return trimmed.replace(/^[\s,.\-:;]+|[\s,.\-:;]+$/g, '');
  } else {
    return full;
  }
}
function getTimezoneOffsetStd() {
  const today = new Date();
  const offsetMinutes = today.getTimezoneOffset();
  const offsetHours = Math.abs(offsetMinutes / 60);
  const offsetSign = offsetMinutes < 0 ? '+' : '-';
  const offset = `${offsetSign}${padZeroes(offsetHours)}:00`;
  const timezoneAbbreviation = today.toLocaleTimeString('en-us', { timeZoneName: 'short' }).split(' ')[2];
  return `GMT${offset} ${timezoneAbbreviation}`;
}
function padZeroes(num) {
  return num.toString().padStart(2, '0');
}
function getTimezoneOffsetSeconds() {
  const today = new Date();
  const offsetMinutes = today.getTimezoneOffset();
  const offsetSeconds = Math.abs(offsetMinutes * 60);
  const offsetSign = offsetMinutes < 0 ? '+' : '-';
  return `${offsetSign}${offsetSeconds}`;
}
function getTimezoneOffsetDST() {
  const today = new Date();
  const janOffset = new Date(today.getFullYear(), 0, 1).getTimezoneOffset();
  const julOffset = new Date(today.getFullYear(), 6, 1).getTimezoneOffset();
  const isDST = today.getTimezoneOffset() < Math.max(janOffset, julOffset);
  const offsetMinutes = today.getTimezoneOffset() - (isDST ? janOffset : julOffset);
  const offsetSign = offsetMinutes < 0 ? '+' : '-';
  const offsetSeconds = Math.abs(offsetMinutes * 60);
  return `${offsetSign}${offsetSeconds}`;
}
function getTimezoneOffsetDSTSeconds() {
  const today = new Date();
  const janOffset = new Date(today.getFullYear(), 0, 1).getTimezoneOffset();
  const julOffset = new Date(today.getFullYear(), 6, 1).getTimezoneOffset();
  const isDST = today.getTimezoneOffset() < Math.max(janOffset, julOffset);
  const offsetMinutes = today.getTimezoneOffset() - (isDST ? janOffset : julOffset);
  const offsetSign = offsetMinutes < 0 ? '+' : '-';
  const offsetSeconds = Math.abs(offsetMinutes * 60);
  return `${offsetSign}${offsetSeconds}`;
}
function getCountryLocation(latitude, longitude) {
  fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`)
    .then(response => response.json())
    .then(data => {
      const country = data.countryName;
      if (country) {
        countryLocationDisplay.innerHTML = `Country: ${country}`;
      } else {
        countryLocationDisplay.innerHTML = "Country name not found";
      }
    })
    .catch(error => {
      console.error('Error fetching country location:', error);
      countryLocationDisplay.innerHTML = "Error fetching country location";
    });
}
function getPostcode(latitude, longitude) {
  fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`)
    .then(response => response.json())
    .then(data => {
      const postcode = data.postcode;
      if (postcode) {
        postcodeDisplay.innerHTML = `Postcode: ${postcode}`;
      } else {
        postcodeDisplay.innerHTML = "Postcode:not found";
      }
    })
    .catch(error => {
      console.error('Error fetching postcode:', error);
      postcodeDisplay.innerHTML = "Error fetching postcode";
    });
}
function getCity(latitude, longitude) {
  fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`)
    .then(response => response.json())
    .then(data => {
      const city = data.locality;
      if (city) {
        cityDisplay.innerHTML = `City: ${city}`;
      } else {
        cityDisplay.innerHTML = "City not found";
      }
    })
    .catch(error => {
      console.error('Error fetching city:', error);
      cityDisplay.innerHTML = "Error fetching city";
    });
}
async function fetchLocationData() {
  const locationInput = document.getElementById('locationInput').value;
  const apiKey = '1592a93cd6f342588e6c11bc65d42db4';
  const apiUrl = `https://api.geoapify.com/v1/geocode/search?text=${locationInput}&apiKey=${apiKey}`;

  try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      console.log(data);
      const location = data.features[0].properties;
      const { lat, lon, country, postcode, city } = location;
      const timezone = location.timezone;
      let timezoneHTML = ''; 
      for (const [key, value] of Object.entries(timezone)) {
          timezoneHTML += `${key}:${value}<br>`;
      }
      document.getElementById('result').innerHTML = `
          <p>Latitude: ${lat}</p>
          <p>Longitude: ${lon}</p>
          <p>Country: ${country}</p>
          <p>Postcode: ${postcode}</p>
          <p>City: ${city}</p>
          ${timezoneHTML}
      `;
  } catch (error) {
      console.error('Error fetching data:', error);
  }
}
