let nameH1;
let climateSpan;
let terrainSpan;
let populationSpan;
let residentsUl;

const baseUrl = `https://swapi2.azurewebsites.net/api`;

addEventListener('DOMContentLoaded', () => {
  nameH1 = document.querySelector('h1#name');
  climateSpan = document.querySelector('span#climate');
  terrainSpan = document.querySelector('span#terrain');
  populationSpan = document.querySelector('span#population');
  residentsUl = document.querySelector('#residents>ul');
  
  const sp = new URLSearchParams(window.location.search);
  const id = sp.get('id');
  getPlanet(id);
});

async function getPlanet(id) {
  let planet;
  try {
    planet = await fetchPlanet(id);
    planet.residents = await fetchDetails(planet.residents);
  } catch (ex) {
    console.error(`Error reading planet ${id} data.`, ex.message);
  }
  renderPlanet(planet);
}

async function fetchPlanet(id) {
  let planetUrl = `${baseUrl}/planets/${id}`;
  return await fetch(planetUrl).then(res => res.json());
}

async function fetchDetails(urls) {
  const detailPromises = urls.map(url => fetch(url).then(res => res.json()));
  return Promise.all(detailPromises);
}

const renderPlanet = planet => {
  document.title = `SWAPI - ${planet.name}`;
  nameH1.textContent = planet.name;
  climateSpan.textContent = planet.climate;
  terrainSpan.textContent = planet.terrain;
  populationSpan.textContent = planet.population;
  
  const residentsLis = planet.residents.map(resident => `<li><a href="/character.html?id=${resident.url.split('/').slice(-2, -1)[0]}">${resident.name}</a></li>`);
  residentsUl.innerHTML = residentsLis.join("");
}
