var baseURL = 'https://api.themoviedb.org/3/';
let mbaseImageURL = 'http://image.tmdb.org/t/p/w185/';

var keyword = document.getElementById('keyWards').value;

var currentPage = null;

function showdiv(theBar, objN) {

    var target = document.getElementById(theBar);
    var clicktext = document.getElementById(objN)

    if (target.style.display == "block") {
        target.style.display = "none";
        clicktext.innerText = "Start!";

    } else {
        target.style.display = "block";
        clicktext.innerText = 'Close search bar';
    }
}

document.getElementById("time").innerHTML = Date();

function init() {
    document.getElementById('keyWards').focus();
    let pages = document.querySelectorAll('.page');
    console.log(pages);
    console.log(APIKEY);

    document.querySelector('.search-button').addEventListener('click', go);
    document.querySelector('.refresh').addEventListener('click', doing)

    document.addEventListener('keypress', function (ev) {
        let char = ev.char || ev.charCode || ev.which;
        if (char == 10 || char == 13) {
            document.querySelector('.search-button').dispatchEvent(new MouseEvent('click'));
        }
    });
};


function doing(ev) {
    if (activePage == 'search') {
        window.location.reload(true);
    } else if (activePage == 'recommend') {

        let cards = document.querySelectorAll('.card');

        cards.forEach((card) => card.classList.remove('card-in'));
        document.getElementById('search-results').classList.add('active');
        setTimeout(function () {


            cards.forEach((card) => card.classList.add('card-in'))
        }, 100);
        document.getElementById('recommend-results').classList.remove('active');
        window.scrollTo(0, 0);
        let activePage = 'search';

    }

};


function going(page) {
    window.scrollTo(0, 0);
    if (page == "search") {
        let activePage = 'search';
        document.getElementById('search-results').classList.add('active');
        let cards = document.querySelectorAll('.active .card');
        cards.forEach((card) => card.classList.remove('card-in'));
        setTimeout(function () {

            cards.forEach((card) => card.classList.add('card-in'));
        }, 100);

        document.getElementById('recommend-results').classList.remove('active');
        document.querySelector('.back-button').classList.add('active-back-button');
    } else if (page == "recommend") {
        let activePage = 'recommend';
        document.getElementById('recommend-results').classList.add('active');
        let cards = document.querySelectorAll('.active .card');
        cards.forEach((card) => card.classList.remove('card-in'));
        setTimeout(function () {
            cards.forEach((card) => card.classList.add('card-in'));
        }, 100);
        document.getElementById('search-results').classList.remove('active');
    }
};

function mOver(obj) {
    obj.src = "image/rocket-lg.svg"
}

function mOut(obj) {
    obj.src = "image/magnifying-glass.svg"
}

function go() {
    let currentPage = 1;
    let url = ''.concat(baseURL, 'configuration?api_key=', APIKEY);
    console.log(url);
    let req = new Request(url, {
        method: 'GET',
        mode: 'cors'.k
    });

    var keyword = document.getElementById('keyWards').value;
    console.log(keyword);
    if (!keyword) {
        console.log('Please input keywords.');

    } else {
        fetch(req)
            .then((result) => {
                return result.json();
            })
            .then((data) => {
                console.log('config-fetch', data);
                baseImageURL = data.images.secure_base_url;
                console.log('img', baseImageURL);
                var configData = data.images;
                console.log(configData);
                runSearch(keyword);
            })
            .catch(function (err) {
                console.log(err);
            });
    }

}


function runSearch(keyword) {
    let url = ''.concat(baseURL, 'search/movie?api_key=', APIKEY, '&query=', keyword, '&page=', currentPage);
    console.log(url);
    fetch(url)
        .then(
            result => result.json()
        )
        .then(
            (data) => {
                console.log('seach-fetch', data);
                let sectionContent = document.querySelector('.content');
                console.log(sectionContent)
                while (sectionContent.hasChildNodes()) {
                    sectionContent.removeChild(sectionContent.lastChild);
                }
                movieResults(data);
            })
        .catch(function (err) {
            console.log(err);
        })
};

function movieResults(data) {
    let df = new DocumentFragment();
    let resultContent = document.querySelector('.search-results-content')
    let searchMessage = document.createElement('h2');
    let pageTitle = document.querySelector('#search-results>.title');
    var totalPages = data.total_pages;
    if (pageTitle.hasChildNodes()) {
        pageTitle.removeChild(pageTitle.lastChild);
    }
    searchMessage.innerHTML = 'The keyword is " ' +
        document.querySelector("#keyWards").value +
        ' ". <br>This is the page ' + data.page +
        '.&nbsp&nbsp Total pages: ' + data.total_pages + '.';
    pageTitle.appendChild(searchMessage);
    console.log(resultContent);
    console.log(data)
    data.results.forEach((movie) => {
        let resultElement = document.createElement('div');
        let imgcontainer = document.createElement('div'); //

        resultElement.setAttribute('id', movie.id);
        let img = document.createElement('img'); 
        let pTitle = document.createElement('p');
        let pReleaseDate = document.createElement('p'); 
        let pRating = document.createElement('p'); 
        let pOverview = document.createElement('p'); 
        pTitle.textContent = movie.title;
        pTitle.className = 'movietitle';
        pReleaseDate.textContent = ''.concat('Release Date: ', movie.release_date);
        pRating.textContent = ''.concat('Average Rating: ', movie.vote_average);
        if (movie.poster_path != null) {
            img.src = ''.concat(baseImageURL, 'w500', movie.poster_path);
            img.alt = 'Poster of movie ' + movie.title;

        } else {
            img.alt = 'No Poster Information';

        };
        imgcontainer.appendChild(img);
        imgcontainer.className = 'imgcontainer';
        resultElement.appendChild(imgcontainer);
        if (movie.overview.length == 0 || movie.overview == null) {
            pOverview.textContent = 'Overview: No Overview Information.'
        } else if (movie.overview.length > 250) {
            pOverview.textContent = ''.concat('Overview: ', movie.overview.substr(0, 250), '......')
        } else {
            pOverview.textContent = ''.concat('Overview: ', movie.overview)
        };
        console.log(img.src);

        resultElement.appendChild(pTitle);
        resultElement.appendChild(pReleaseDate);
        resultElement.appendChild(pRating);
        resultElement.appendChild(pOverview);
        df.appendChild(resultElement);
    });
    console.log(resultContent)
    resultContent.appendChild(df);
    let props = document.querySelectorAll('.search-results-content>div');
    makeMovieElement(props);
    document.querySelector('h1').style.display = 'none';


    makeCards();
};

function makeMovieElement(props) {
    console.log(props);
    props.forEach((makeCard) => {
        makeCard.className = 'card pointer';
        console.log('addlistener');
        makeCard.addEventListener('click', fetchRecommendations);
    })

};

function fetchRecommendations(ev) {
    let currentPage = 1;
    let movieId = ev.target.getAttribute('id');
    title = ev.target.children[1].textContent;
    console.log(ev.target);
    console.log(movieId);
    console.log(title);
    let url = ''.concat(baseURL, 'movie/', movieId, '/recommendations?api_key=', APIKEY);
    console.log(url);
    fetch(url)
        .then(result => result.json())
        .then(
            (data) => {
                theReconmmendations(data);
                doing('recommend');
            })
        .catch(function (err) {
            console.log(err);
        })
};



function theReconmmendations(data) {
    console.log('rec', data)
    let resultContent = document.querySelector('.recommend-results-content')
    if (data.total_results == 0) {
        resultContent.textContent = 'Sorry, there is no recommendations based on movie "' + title + '".';
    } else {
        let df = new DocumentFragment();
        while (resultContent.hasChildNodes()) {
            resultContent.removeChild(resultContent.lastChild);
        }
        let searchMessage = document.createElement('h2');
        let pageTitle = document.querySelector('#recommend-results>.title');
        if (pageTitle.hasChildNodes()) {
            pageTitle.removeChild(pageTitle.lastChild);
        }
        totalPages = data.total_pages;
        if (pageTitle.hasChildNodes()) {
            pageTitle.removeChild(pageTitle.lastChild);
        }
        searchMessage.innerHTML = 'Recommendations based on movie " ' +
            title + ' ". <br>Current Page: ' + currentPage +
            '.&nbsp&nbsp Total result pages: ' + totalPages + '.';

        pageTitle.appendChild(searchMessage);

        data.results.forEach((movie) => {
            let resultElement = document.createElement('div');
            let imgcontainer = document.createElement('div'); //add

            let img = document.createElement('img'); //Get image
            let pTitle = document.createElement('p');
            let pReleaseDate = document.createElement('p'); //Get release date
            let pRating = document.createElement('p'); //Get average rating
            let pOverview = document.createElement('p'); //Get Overview describtion
            pTitle.textContent = movie.title;
            pTitle.className = 'movietitle';
            pReleaseDate.textContent = ''.concat('Release Date: ', movie.release_date);
            pRating.textContent = ''.concat('Average Rating: ', movie.vote_average);

            if (movie.poster_path != null) {
                img.src = ''.concat(baseImageURL, 'w500', movie.poster_path);
                imgcontainer.appendChild(img); //change
                resultElement.appendChild(imgcontainer); //add
                imgcontainer.className = 'imgcontainer';
            };
            if (movie.overview == null || movie.overview.length == 0) {
                pOverview.textContent = 'Overview: No Overview Information.'
            } else if (movie.overview.length > 250) {
                pOverview.textContent = ''.concat('Overview: ', movie.overview.substr(0, 250), '......')
            } else {
                pOverview.textContent = ''.concat('Overview: ', movie.overview)
            };
            console.log(img.src);

            resultElement.appendChild(pTitle);
            resultElement.appendChild(pReleaseDate);
            resultElement.appendChild(pRating);
            resultElement.appendChild(pOverview);
            df.appendChild(resultElement);
        });
        resultContent.appendChild(df);
        let props = document.querySelectorAll('.recommend-results-content>div');

        makeRecommendElement(props);

    }
};


function makeRecommendElement(props) {
    props.forEach((makeCard) => {
        makeCard.className = 'card';

    })
};


document.addEventListener('DOMContentLoaded', init);
console.log(baseURL);


//const APIKEY ="10bdfcd13094172ecbe658e45f36b60d";
//let baseURL = 'https://api.themoviedb.org/3/';