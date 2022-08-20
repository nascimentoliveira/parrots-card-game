let cardsDealt = [];
let previousSelected;
let nCardSelected;
let clicks;
let found;

function checkParity(index1, index2){
    if (cardsDealt[index1] === cardsDealt[index2]) {
        return true;
    } else {
        return false;
    }
}

function ocultElement(element) {
    element.querySelector(":nth-child(1)").classList.toggle("ocult");
    element.querySelector(":nth-child(2)").classList.toggle("ocult");
}

function turn(figure) {
    figure.classList.toggle("upturned");
    setTimeout(ocultElement, 500, figure);
}

function unblock(){
    document.querySelector(".block").classList.remove("block-on");
}

function checkEnd() {
    found += 2;
    let answer;
    if (found === cardsDealt.length) {
        alert(`Você ganhou em ${clicks} jogadas!`);
        do {
            answer = prompt("Deseja jogar novamente?");
            if (answer === "sim") {
                init();
                break;
            } else if (answer === "não") {
                break;
            } else {
                alert("Esta pergunta aceita a 'sim' ou 'não' como resposta!");
            }
       } while (true);
    }
}

function select(figure, index) {
    nCardSelected++;
    clicks++;
    figure.removeAttribute("onclick");
    turn(figure); 
    
    if (nCardSelected == 2){
        document.querySelector(".website div").classList.add("block-on");
        if (checkParity(previousSelectedIndex, index)) {
            setTimeout(checkEnd, 1000);
            previousSelectedFigure.classList.add("resolved");
            figure.classList.add("resolved");
            setTimeout(unblock, 500)

        } else {
            setTimeout(turn, 1500, previousSelectedFigure);
            setTimeout(turn, 1500, figure);
            previousSelectedFigure.setAttribute("onclick", `select(this, ${previousSelectedIndex})`);
            figure.setAttribute("onclick", `select(this, ${index})`);
            setTimeout(unblock, 2000)
        }
        nCardSelected = 0;

    } else {
        previousSelectedFigure = figure;
        previousSelectedIndex = index;
    } 
}

function howManyCards() {
    let nCards;

    do {
        nCards = Number(prompt("Com quantas cartas deseja jogar?"));
        if ((nCards >= 4 && nCards <= 14 && nCards % 2 === 0) || nCards ===  0) {
            break;
        } else {
            alert("Somente números pares entre 4 e 14 (inclusive)!");
        }
    } while (true);

    return nCards;
}

function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
  
    while (currentIndex != 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
  
    return array;
}

function removeStart() {
    document.querySelectorAll('section .start').forEach(n => n.classList.remove('start'))
}

function createCards(nCards) {
    const section = document.querySelector("main section");
    let cards = ["bobross", "explody", "fiesta", "metal", "revertit", "triplets", "unicorn"];

    cards = shuffle(cards);
    cards = cards.slice(0, nCards/2);
    cards = cards.concat(cards);
    cardsDealt = shuffle(cards);
    console.log(cardsDealt);

    section.innerHTML = "";

    for(let i=0; i<nCards; i++){
        section.innerHTML += `<figure class="start" onclick="select(this, ${i})">
                                  <img src="./assets/images/front.png" alt="${i+1}-th carta"/>
                                  <img class="ocult" src="./assets/images/${cardsDealt[i]}parrot.gif" alt="${i+1}-th carta, imagem ${cardsDealt[i]}parrot"/>
                              </figure>`;
    }

    setTimeout(removeStart, 1000);
}

function init() {
    const website = document.querySelector(".website");
    const nCards = howManyCards();
    nCardSelected = 0;
    clicks = 0;
    found = 0;

    if (nCards === 0) {
        website.setAttribute("onclick","init()");
        website.querySelector("header p").innerHTML = "Clique para recomeçar!";
    } else {
        website.removeAttribute("onclick");
        createCards(nCards);
        website.classList.remove("start");
        website.querySelector("header").innerHTML = "PARROT CARD GAME";
    }
}

setTimeout(init, 3000);

