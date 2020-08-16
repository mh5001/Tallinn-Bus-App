let map, service;
let isLoaded = false;
const mainWrap = document.getElementById("mainWrap");
const resultWrap = document.getElementById("resultWrap");
const searchBus = document.getElementById("searchBus");
const currentInfo = document.getElementById("currentInfo");
const searchState = document.getElementById("searchState");
const coord = document.getElementById("coord");

let currentPos = {
  x: 59.40471763166499,
  y: 24.68289197486948
};

class BusResult {
  constructor (feature, len) {
    this.pos = {
      x: feature.geometry.coordinates[0],
      y: feature.geometry.coordinates[1]
    };
    this.name = feature.properties.Name;
    this.SiriID = feature.properties.SiriID;
    this.lengthToPos = len;
    this.meterLen = Math.round(len * 110.567 * 1000 * 100) / 100;
  }

  convertDOM() {
    const div = document.createElement("div");
    div.id = this.SiriID;
    div.setAttribute("class", "result-wrapper");

    const title = document.createElement("h1");
    title.innerText = this.name;
    
    const len = document.createElement("p");
    len.innerText = this.meterLen + " meters away";

    div.appendChild(title);
    div.appendChild(len);

    const color = getColorCode(this.meterLen);
    div.style.backgroundColor = color;
    div.style.border = `10px solid ${color}`;

    div.onclick = () => {
      window.location.href = "./data/index.html";
      window.sessionStorage.setItem("data", JSON.stringify(this));
    }
    return div;
  }
}

let coolDown = null;

function updatePos(x, y) {
  currentPos['x'] = x;
  currentPos['y'] = y;
  const data = loadAllBusStop();
  resultWrap.innerHTML = "";
  data.forEach(e => {
    resultWrap.appendChild(e.convertDOM());
  });
  
  coord.innerText = x + ", " + y;
}

function loadAllBusStop() {
  const results = [];
  for (let i = 0; i < peatused.features.length; i++) {
    const len = getLen(peatused.features[i].geometry.coordinates);
    if (i === 0) {
      results.push(new BusResult(peatused.features[0], len));
    }
    if (results.length > 0) {
      const furthest = results[results.length - 1].lengthToPos;
      if (len < furthest) {
        for (let j = 0; j < results.length; j++) {
          if (len < results[j].lengthToPos) {
            results.splice(j, 0, new BusResult(peatused.features[i], len));
            if (results.length > 10) results.length = 10;
            break;
          }
        }
      }
    }
  }
  
  return results;
}

function getLen(b) {
  return Math.sqrt(Math.pow(currentPos.x - b[1], 2) + Math.pow(currentPos.y - b[0], 2));
}

const data = loadAllBusStop();
data.forEach(e => {
  resultWrap.appendChild(e.convertDOM());
});

function getColorCode(len) {
  if (len < 100) return "#00b043";
  else if (len < 300) return "#57c200";
  else if (len < 600) return "#c2a200";
  else return "#c25400";
}
function getStopSearch(value) {
  const result = [];
  for (let i = 0; i < peatused.features.length; i++) {
    const currentStop = peatused.features[i];
    if (currentStop.properties.Name.toLowerCase().startsWith(value)) {
      result.push(new BusResult(currentStop, getLen(currentStop.geometry.coordinates)));
    }
  }
  result.sort((a, b) => a.lengthToPos - b.lengthToPos);
  return result;
}

searchBus.addEventListener("input", function() {
  const input = searchBus.value.toLowerCase();
  currentInfo.innerText = "Search Result";
  if (input.length >= 3) {
    resultWrap.innerHTML = "";
    const data = getStopSearch(input);
    if (data.length) {
      isSearchError = false;
      data.forEach(e => {
        resultWrap.appendChild(e.convertDOM());
      });
    }
  } else {
    currentInfo.innerText = "Nearest Bus Stop";
    resultWrap.innerHTML = "";
    const data = loadAllBusStop();
    data.forEach(e => {
      resultWrap.appendChild(e.convertDOM());
    });
  }
});