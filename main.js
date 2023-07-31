// create a simple fetch request that gets the astronauts in space
const astrosUrl = 'http://api.open-notify.org/astros.json';
const wikiUrl = 'https://en.wikipedia.org/api/rest_v1/page/summary/';


// create a function that populates the page with the data from the fetch request
function populatePage(personData) {
    let output = '';
    if (personData.type == 'standard') {
        output += `
                    <article class='article'>
                        <h2 class='title'>${personData.title}</h2>
                        <h3 class='subtitle'>${personData.description}</h3>
                        <p class='description'>${personData.extract}</p>
                        <img class='image' src="${personData.thumbnail.source}">
                    </article>
                    `;
    }
    const container = document.querySelector('#container');
    container.innerHTML += output;
}


// create a function that gets the wikipedia summary for each astronaut
async function getWiki(name) {
    try {
        let personData = await fetch(wikiUrl + name);
        let personJson = await personData.json();
        return personJson;
    } catch (err) {
        throw err;
    }
};


// create a function that gets the names of the astronauts in space
async function getAstros(url) {
    try {
        const response = await fetch(astrosUrl);
        const nameData = await response.json();
        return nameData;
    } catch (err) {
        throw err;
    }
}


// on page load get the button and attach an event listener to it that calls the getAstros function
window.addEventListener('load', () => {
    const button = document.querySelector('#button');
    button.addEventListener('click', async (e) => {
        try {
            let nameData = await getAstros(astrosUrl);
            let people = nameData.people;
            people.forEach(async (person) => {
                let personData = await getWiki(person.name);
                populatePage(personData);
            });
        } catch (err) {
            console.log(err);
        }
        e.target.remove();
    });
});
