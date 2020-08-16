let xhr;
let queryTime;
const busList = [];

const stopName = document.getElementById("stopName");
const mainWrap = document.getElementById("mainWrap");
let data = window.sessionStorage.getItem("data");

if (!data) {
  const text = document.createTextNode("How did you get here??");
  document.body.appendChild(text);
} else {
  data = JSON.parse(data);
  xhr = new XMLHttpRequest();
  const url = `https://transport.tallinn.ee/siri-stop-departures.php?stopid=${data.SiriID}&time=${new Date().getTime()}`;
  xhr.open("get", url);
  xhr.send();
  xhr.onloadend = handleXHRData;
  stopName.innerText = data.name;

  setInterval(() => {
    const url = `https://transport.tallinn.ee/siri-stop-departures.php?stopid=${data.SiriID}&time=${new Date().getTime()}`;
    xhr.open("get", url);
    xhr.send();
  }, 6000);
}

function handleXHRData() {
  const rawData = xhr.responseText;

  const data = rawData.split('\n');
  queryTime = parseInt(data[0].split(',')[4]);
  for (let i = 2; i < data.length; i++) {
    if (data[i].length) {
      busList.push(new BusData(data[i]));
    }
  }
  mainWrap.innerHTML = "";
  busList.forEach(e => {
    mainWrap.appendChild(e.createDOM());
  });
  busList.length = 0;
}

class BusData {
  constructor(data) {
    const rawData = data.split(",");
    this.vehicleType = rawData[0];
    this.vehiclId = rawData[1];
    this.expectedTime = rawData[2] - queryTime;
    this.direction = rawData[4];
  }

  createDOM() {
    const wrapper = document.createElement("div");
    wrapper.setAttribute("class", "bus-wrapper");

    const icon = document.createElement("img");
    icon.src = (this.vehicleType === "trol") ? "../assets/trol.png" : "../assets/bus.png";

    const dataWrapper = document.createElement("div");
    dataWrapper.setAttribute("class", "data-wrapper");

    const h1 = document.createElement("h1");
    h1.setAttribute("class", "bus-number");
    h1.innerText = this.vehiclId;

    const direction = document.createElement("div");
    direction.setAttribute("class", "bus-direction");
    direction.innerText = this.direction;

    const exTime = document.createElement("div");
    exTime.setAttribute("class", "expected-time");
    exTime.innerText = convertReadableTime(this.expectedTime);
    if (!exTime.innerText) exTime.setAttribute("class", "to-station");
    
    const timeWrap = document.createElement("div");
    timeWrap.setAttribute("class", "time-wrapper");
    timeWrap.appendChild(exTime);

    dataWrapper.appendChild(direction);
    dataWrapper.appendChild(timeWrap);
    
    wrapper.appendChild(h1);
    wrapper.appendChild(icon);
    wrapper.appendChild(dataWrapper);

    return wrapper;
  }
}

function convertReadableTime(input) {
  if (!input) return null;
  let sec = input;
  let min = "";
  if (sec > 60) {
    min = Math.floor(sec / 60);
    sec %= 60;
  }
  if (min) return min + " min " + sec + " sec";
  else return sec + " sec";
}

function closeWindow() {
  window.location.href = "../index.html";
}