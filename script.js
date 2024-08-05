const apiKey = 'k0ciqCRRGTRVLBd5Tawo7i3tO6mr0e1WJv5XBL7b';
const currentDate = new Date().toISOString().split("T")[0];

document.addEventListener("DOMContentLoaded", () => {
    getCurrentImageOfTheDay();
    displaySearchHistory();

    document.getElementById("search-form").addEventListener("submit", (event) => {
        event.preventDefault();
        const date = document.getElementById("search-input").value;
        if (date) {
            getImageOfTheDay(date);
        }
    });
});

function getCurrentImageOfTheDay() {
    fetch(`https://api.nasa.gov/planetary/apod?api_key=${apiKey}&date=${currentDate}`)
        .then(response => response.json())
        .then(data => {
            document.querySelector('#current-image-container h1').textContent = "NASA Picture of the Day";
            displayImage(data);
        })
        .catch(error => {
            displayError(error);
        });
}

function getImageOfTheDay(date) {
    fetch(`https://api.nasa.gov/planetary/apod?api_key=${apiKey}&date=${date}`)
        .then(response => response.json())
        .then(data => {
            document.querySelector('#current-image-container h1').textContent = `Picture On ${date}`;
            displayImage(data);
            saveSearch(date);
            addSearchToHistory(date);
        })
        .catch(error => {
            displayError(error);
        });
}

function saveSearch(date) {
    let searches = JSON.parse(localStorage.getItem("searches")) || [];
    if (!searches.includes(date)) {
        searches.push(date);
        localStorage.setItem("searches", JSON.stringify(searches));
    }
}

function addSearchToHistory(date) {
    const searchHistory = document.getElementById("search-history");
    const listItem = document.createElement("li");
    listItem.textContent = date;
    listItem.addEventListener("click", () => {
        getImageOfTheDay(date);
    });
    searchHistory.appendChild(listItem);
}

function displaySearchHistory() {
    const searches = JSON.parse(localStorage.getItem("searches")) || [];
    searches.forEach(date => addSearchToHistory(date));
}

function displayImage(data) {
    const container = document.getElementById("current-image-container");
    container.innerHTML = `
        <h1>${document.querySelector('#current-image-container h1').textContent}</h1>
        <img src="${data.url}" alt="${data.title}">
        <h3>${data.title}</h3>
        <p>${data.explanation}</p>
    `;
}

function displayError(error) {
    const container = document.getElementById("current-image-container");
    container.innerHTML = `<p>Error: ${error.message}</p>`;
}
