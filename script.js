let url_list = [
"http://localhost:8000/api/v1/titles/?sort_by=-votes,-imdb_score",
"http://localhost:8000/api/v1/titles/?page=2&-sort_by=-votes,-imdb_score",
"http://localhost:8000/api/v1/titles/?sort_by=-votes,-imdb_score&genre=Fantasy", 
"http://localhost:8000/api/v1/titles/?page=2&sort_by=-votes,-imdb_score&genre=Fantasy" ,
"http://localhost:8000/api/v1/titles/?sort_by=-votes,-imdb_score&genre=Sci-Fi",
"http://localhost:8000/api/v1/titles/?page=2&sort_by=-votes,-imdb_score&genre=Sci-Fi",
"http://localhost:8000/api/v1/titles/?sort_by=-votes,-imdb_score&genre=Comedy", 
"http://localhost:8000/api/v1/titles/?page=2&sort_by=-votes,-imdb_score&genre=Comedy" 
];

//Obtain all informations about movies
//list -->best-->best_next-->fantasy-->fantasy_next-->SciF-->Scif_next-->Comedie-->Comedie_next
function getAllMovies(){
let jsonList =[]
let jsonList2 =[]
let allUrls =[]
let requests = url_list.map(url =>fetch(url));
Promise.all(requests)
  .then (function(responses){
      for (let response of responses){
        console.log(response.status)
        jsonList.push(response.json())
      }
      return Promise.all(jsonList)
    })
  .then(function(value){
    for (let i=0;i<8;i++){
      for (let j=0;j<5;j++){
        allUrls.push(value[i].results[j].url)
      }
    }
    let requests = allUrls.map(url =>fetch(url));
    Promise.all(requests)
      .then (function(responses){
        for (let response of responses){
          console.log(response.status)
          jsonList2.push(response.json())
        }
        return Promise.all(jsonList2)
      })
      
      .then(function(value){
        display(value)
    })
  })
}  
getAllMovies()


function display(value){
  let urls = value
  document.getElementById("bestFilm_title").innerHTML = urls[0].original_title;
  document.getElementById("bestFilm_description").innerHTML += urls[0].long_description;
  document.getElementById("affiche_film").getElementsByTagName("img")[0].setAttribute("src", urls[0].image_url);
  addEventListener("clic",modal(document.getElementById("bestFilm_buttonInfo"),urls[0]));
  //infos modals
  for(let j=0;j<4;j++){
    for(let i=0;i<10;i++){
      let picture_id = document.querySelectorAll(".mover")[j].getElementsByTagName("img")[i];
      picture_id.setAttribute("src", urls[i+10*j].image_url);
      addEventListener("clic",modal(picture_id,urls[i+10*j]));
    };
  };
  let delta = [0,0,0,0,0]
      for(let i=0;i<4;i++){
        let tocTocLeft = document.querySelectorAll(".navigationL")[i].getElementsByTagName("img")[0];
        let tocTocRight = document.querySelectorAll(".navigationR")[i].getElementsByTagName("img")[0];

        //if click right
        tocTocRight.onclick = function(){
          if (delta[i]<5){
            document.querySelectorAll(".mover")[i].getElementsByTagName("img")[delta[i]].setAttribute("style","display:none");
            document.querySelectorAll(".mover")[i].getElementsByTagName("img")[delta[i]+5].setAttribute("style","display:inline-block");
            delta[i] ++;
          }; 
        };
        //if click left
        tocTocLeft.onclick = function(){
          if (delta[i]>0){
            document.querySelectorAll(".mover")[i].getElementsByTagName("img")[delta[i]+4].setAttribute("style","display:none");
            document.querySelectorAll(".mover")[i].getElementsByTagName("img")[delta[i]-1].setAttribute("style","display:inline-block");
            delta[i] --;
          }; 
        };
      };
};
function modal(clic_here,array_id){
  // Get the modal
  var modal = document.getElementById("myModal");

  // Get the button that opens the modal
  var btn = clic_here;
  var picture_modale = array_id.image_url;
  var title = array_id.original_title;
  var imdb_score = array_id.imdb_score;
  var realisator =array_id.directors[0];
  var duration = array_id.duration;
  var year = array_id.year;
  var list_actor = array_id.actors;
  var actors = list_actor[0];
  for(i=1;i<list_actor.length;i++){
    actors += ", " + list_actor[i]
  }
  var Box_office = array_id.worldwide_gross_income;
  var country = array_id.countries;
  var resume = array_id.long_description;
  var genres = array_id.genres;
  var score = array_id.avg_vote;

  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close")[0];

  // When the user clicks the button, open the modal 
  btn.onclick = function() {
    modal.style.display = "block";
    document.getElementById("img-modale").setAttribute("src",picture_modale)
    document.getElementById("titre_movie").innerHTML ="titre: "+title;
    items = document.querySelectorAll(".modal-body>p")
    items[0].innerHTML = "Genres:" + genres;
    items[1].innerHTML = "Score IMDB: " + imdb_score;
    items[2].innerHTML = "Réalisateur:" + realisator;
    items[3].innerHTML = "Acteurs: " + actors;
    items[4].innerHTML = "Durée:" + duration;
    items[5].innerHTML = "Date de sortie:" + year;
    items[6].innerHTML = "Pays d'origine: " + country;
    items[7].innerHTML = "Box Office:" + Box_office;
    items[8].innerHTML = "score:" + score;
    document.getElementById("resum").innerHTML ="Résumé: " + resume;
    
  }

  // When the user clicks on <span> (x), close the modal
  span.onclick = function() {
    modal.style.display = "none";
  }

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }
}
