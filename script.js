const API_KEY = 'api_key=57f09bc6d023c1414be752b373494c37';
const BASE_URL = 'https://api.themoviedb.org/3';
const API_URL = BASE_URL + '/discover/movie?sort_by=popularity.desc&'+API_KEY;
const IMG_URL = 'https://image.tmdb.org/t/p/w500';
const searchURL = BASE_URL + '/search/movie?'+API_KEY;

const genres = [
    {
      "id": 28,
      "name": "Action"
    },
    {
      "id": 12,
      "name": "Adventure"
    },
    {
      "id": 16,
      "name": "Animation"
    },
    {
      "id": 35,
      "name": "Comedy"
    },
    {
      "id": 80,
      "name": "Crime"
    },
    {
      "id": 99,
      "name": "Documentary"
    },
    {
      "id": 18,
      "name": "Drama"
    },
    {
      "id": 10751,
      "name": "Family"
    },
    {
      "id": 14,
      "name": "Fantasy"
    },
    {
      "id": 36,
      "name": "History"
    },
    {
      "id": 27,
      "name": "Horror"
    },
    {
      "id": 10402,
      "name": "Music"
    },
    {
      "id": 9648,
      "name": "Mystery"
    },
    {
      "id": 10749,
      "name": "Romance"
    },
    {
      "id": 878,
      "name": "Science Fiction"
    },
    {
      "id": 10770,
      "name": "TV Movie"
    },
    {
      "id": 53,
      "name": "Thriller"
    },
    {
      "id": 10752,
      "name": "War"
    },
    {
      "id": 37,
      "name": "Western"
    }
]

const prev = document.getElementById('prev')
const next = document.getElementById('next')
const current = document.getElementById('current')
const tagsEl = document.getElementById('tags');

var selectedGenre = []
setGenre();
function setGenre() {
    tagsEl.innerHTML= '';
    genres.forEach(genre => {
        const t = document.createElement('div');
        t.classList.add('tag');
        t.id=genre.id;
        t.innerText = genre.name;
        t.addEventListener('click', () => {
            if(selectedGenre.length == 0){
                selectedGenre.push(genre.id);
            }else{
                if(selectedGenre.includes(genre.id)){
                    selectedGenre.forEach((id, idx) => {
                        if(id == genre.id){
                            selectedGenre.splice(idx, 1);
                        }
                    })
                }else{
                    selectedGenre.push(genre.id);
                }
            }
            // console.log(selectedGenre)
            getMovies(API_URL + '&with_genres='+encodeURI(selectedGenre.join(',')))
            highlightSelection()
        })
        tagsEl.append(t);
    })
}

function highlightSelection() {
    const tags = document.querySelectorAll('.tag');
    tags.forEach(tag => {
        tag.classList.remove('highlight')
    })
    clearBtn()
    if(selectedGenre.length !=0){   
        selectedGenre.forEach(id => {
            const hightlightedTag = document.getElementById(id);
            hightlightedTag.classList.add('highlight');
        })
    }

}

function clearBtn(){
    let clearBtn = document.getElementById('clear');
    if(clearBtn){
        clearBtn.classList.add('reset')
    }else{
            
        let clear = document.createElement('div');
        clear.classList.add('reset');
        clear.id = 'clear';
        clear.innerText = 'Reset';
        clear.addEventListener('click', () => {
            selectedGenre = [];
            setGenre();            
            getMovies(API_URL);
        })
        tagsEl.append(clear);
    }
    
}

var currentPage, nextPage, prevPage, totalPages;
var lastUrl = '';

getMovies(API_URL);

function getMovies(url) {
    lastUrl=url;
    fetch(url).then(res => res.json()).then(data => {
        // console.log(data.results);
        if(data.results.length !== 0){
            showMovies(data.results);
            currentPage = data.page;
            nextPage = currentPage + 1;
            prevPage = currentPage - 1;
            totalPages = data.total_pages;

            current.innerText = currentPage;

            if(currentPage <= 1){
              prev.classList.add('disabled');
              next.classList.remove('disabled')
            }else if(currentPage>= totalPages){
              prev.classList.remove('disabled');
              next.classList.add('disabled')
            }else{
              prev.classList.remove('disabled');
              next.classList.remove('disabled')
            }

            // tagsEl.scrollIntoView({behavior : 'smooth'})

        }else{
            main.innerHTML= `<h1>No Results Found</h1>`
        }
    })
}


function showMovies(data) {
    main.innerHTML = '';

    data.forEach(movie => {
        const {title, poster_path, vote_average, id} = movie;
        const movieEl = document.createElement('div');
        movieEl.classList.add('card');
        movieEl.innerHTML = `
             <img src="${poster_path? IMG_URL+poster_path: "http://via.placeholder.com/1080x1580" }" alt="${title}">
            <div class="movie-info">
                <h3>${title}</h3>
                <span class="${getColor(vote_average)}">${vote_average}</span>
            </div>
            <div class="pop">
                <button class="details" id="${id}">Details</button>
            </div>
        
        `

        main.appendChild(movieEl);

        document.getElementById(id).addEventListener('click', ()=>{
            openNav(id);
        })
    })
}

function getColor(vote) {
    if(vote>= 8){
        return 'green'
    }else if(vote >= 5){
        return "orange"
    }else{
        return 'red'
    }
}

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const searchTerm = search.value;
    // selectedGenre=[];
    // setGenre();
    if(searchTerm) {
        getMovies(searchURL+'&query='+searchTerm)
    }else{
        getMovies(API_URL);
    }

})

// Genre
function toggleGenre() {
    const checking = document.getElementById("tags").style;
    // console.log(checking.display)
    if (checking.display == "none" || checking.display == ""){
        checking.display = "flex"
    } else {
        // console.log(checking);
        checking.display = "none"
    }
}

// Pagination
prev.addEventListener('click', () => {
    if(prevPage > 0)
      pageCall(prevPage);
})
  
next.addEventListener('click', () => {
    if(nextPage <= totalPages)
      pageCall(nextPage);
})
  
function pageCall(page){
    let urlSplit = lastUrl.split('?');
    let queryParams = urlSplit[1].split('&');
    let key = queryParams[queryParams.length -1].split('=');
    if(key[0] != 'page'){
      let url = lastUrl + '&page='+page
      getMovies(url);
    }else{
      key[1] = page.toString();
      let a = key.join('=');
      queryParams[queryParams.length -1] = a;
      let b = queryParams.join('&');
      let url = urlSplit[0] +'?'+ b
      getMovies(url);
    }
}

/* Open when someone clicks on the span element */
function openNav(id) {
  document.getElementById("myNav").style.width = "100%";
  
  // ActorList
  var actList=[];
  var actPic=[];

  fetch(BASE_URL+'/movie/'+id+'/credits?'+API_KEY+'&language=en-us').then(act => act.json()).then(actor => {
      for (var i = 0; i < 5; i++) {
          actList.push(actor.cast[i].name)
          actPic.push(actor.cast[i].profile_path)
      }
  })

  // videoList
  var embed = [];
  var dots = [];
  var trailer = [];

  fetch(BASE_URL + '/movie/'+id+'/videos?'+API_KEY).then(res => res.json()).then(videoData => {
    // console.log(videoData);
    if(videoData.results.length > 0){

      
      videoData.results.forEach((video, idx) => {
        let {name, key, site, type, official} = video

        if(site == 'YouTube'){
          // console.log(videoData)  
          embed.push(`
            <iframe width="560" height="315" src="https://www.youtube.com/embed/${key}" title="${name}" class="embed hide" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        
        `)

          dots.push(`
            <span class="dot">${idx + 1}</span>
          `)
        }

        
        if(site=='YouTube' && type=='Trailer' && official==true){
          trailer.push(`
            <iframe width="560" height="315" src="https://www.youtube.com/embed/${key}" title="${name}" class="embed hide" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        
        `)
          
        }
      })
    }
    else{
      trailer.push(`
      <img src="http://via.placeholder.com/315x560">
      `)
    }
  })
    

  // MovieDetails within Overlay
  var gen = [];
  var col = '';

  fetch(BASE_URL+'/movie/'+id+'?'+API_KEY+'&language=en-us').then(resp => resp.json()).then(detail => {
      // console.log(detail);
      const {title, poster_path, adult, original_language, overview, runtime, release_date, genres, status, vote_average} = detail;
      genres.forEach(id =>{
          gen.push(id.name)
      })
      var content = document.getElementById("overlay-content");

      col = getColor(vote_average);
      content.innerHTML=`

      <div class="grid">
        <div class="top">
            <div class="left">
                <h1 id="title">${title}</h1>
                <h3 id="status">${status}, ${release_date}, ${adult}</h3>
                <h4 class="navGenre" id="navGenre">${gen.join(', ')}</h4>
                <span class="number ${col}">${vote_average}</span>
                <span class="number">${parseInt(runtime/60)} Hours ${runtime%60} Minutes</span>
        
                <p id="navOverview">${overview}</p>
            </div>
            <div class="right">
                <!-- <img src="picture.jpg" alt=""> -->
                <div>${trailer[0]}</div>
            </div>
            <!-- <div class="left">
                <h4 class="navGenre" id="navGenre">gen.join(', '</h4>
                <span class="number">vote_averag</span>
                <span class="number">____runtime/6</span>
        
                <p id="navOverview">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nihil voluptas, placeat voluptatibus aspernatur deserunt culpa quas, iste corrupti ipsum architecto reiciendis est assumenda nulla quis et, vero vitae sint incidunt? Obcaecati, facere. Sapiente, corporis iste. Eligendi laborum amet impedit dolorum? Iusto cumque tempora, dolore sunt modi molestiae. Odio, nisi sunt!</p>
            </div> -->
        </div>

        <div class="bottom">
            <div id="actorlist">
              <img src="${actPic[0]? IMG_URL+actPic[0]: "http://via.placeholder.com/650x580" }">
              <a class="cast" href="https://en.wikipedia.org/wiki/${actList[0]}">${actList[0]}</a>
              <img src="${actPic[1]? IMG_URL+actPic[1]: "http://via.placeholder.com/650x580" }">
              <a class="cast" href="https://en.wikipedia.org/wiki/${actList[1]}">${actList[1]}</a>
              <img src="${actPic[2]? IMG_URL+actPic[2]: "http://via.placeholder.com/650x580" }">
              <a class="cast" href="https://en.wikipedia.org/wiki/${actList[2]}">${actList[2]}</a>
              <img src="${actPic[3]? IMG_URL+actPic[3]: "http://via.placeholder.com/650x580" }">
              <a class="cast" href="https://en.wikipedia.org/wiki/${actList[3]}">${actList[3]}</a>
              <img src="${actPic[4]? IMG_URL+actPic[4]: "http://via.placeholder.com/650x580" }">
              <a class="cast" href="https://en.wikipedia.org/wiki/${actList[4]}">${actList[4]}</a>
            </div>
            <a class="link" href="#"> Link to view in amazon video</a>
            <a class="link" href="#"> Link to view in netflix video</a>
        </div>
    </div>
      
      `;
  })
}

/* Close when someone clicks on the "x" symbol inside the overlay */
function closeNav() {
  document.getElementById("myNav").style.width = "0%";
  var content = document.getElementById("overlay-content");
  content.innerHTML="";
}
