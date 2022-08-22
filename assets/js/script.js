let cardsDealt = [];
let previousSelected;
let nCardSelected;
let clicks;
let found;
let time;
let idSetInterval;

function updateDisplay() {
    time += 0.1;
    const turns = document.querySelector(".clock-score :nth-child(1) p")
    const timer = document.querySelector(".clock-score :nth-child(3) p");
    turns.innerHTML = clicks;
    timer.innerHTML = time.toFixed(1);
  }

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
    document.querySelector(".website > div").classList.remove("block-on");
}

function resolved(card1, card2) {
    card1.classList.add("resolved");
    card2.classList.add("resolved");
}

function checkEnd() {
    const website = document.querySelector(".website")
    let answer;
    found += 2;
    
    if (found === cardsDealt.length) {
        clearInterval(idSetInterval);
        alert(`Você ganhou em ${clicks} jogadas!`);
        do {
            answer = prompt("Deseja jogar novamente?");
            if (answer === "sim") {
                init();
                break;
            } else if (answer === "não") {
                website.classList.add("start");
                website.querySelector("header p").innerHTML = "CLIQUE PARA RECOMEÇAR!";
                website.setAttribute("onclick","init()");
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
        document.querySelector(".website > div").classList.add("block-on");
        if (checkParity(previousSelectedIndex, index)) {
            setTimeout(checkEnd, 1000);
            setTimeout(resolved, 500, figure, previousSelectedFigure);
            setTimeout(unblock, 500);

        } else {
            setTimeout(turn, 1500, previousSelectedFigure);
            setTimeout(turn, 1500, figure);
            previousSelectedFigure.setAttribute("onclick", `select(this, ${previousSelectedIndex})`);
            figure.setAttribute("onclick", `select(this, ${index})`);
            setTimeout(unblock, 2000);
        }
        nCardSelected = 0;

    } else {
        previousSelectedFigure = figure;
        previousSelectedIndex = index;
    } 
}

function removeStart() {
    document.querySelectorAll('section .start').forEach(n => n.classList.remove('start'));
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

function createCards(nCards) {
    const section = document.querySelector("main section");
    let cards = ["bobross", "explody", "fiesta", "metal", "revertit", "triplets", "unicorn"];

    cards = shuffle(cards);
    cards = cards.slice(0, nCards/2);
    cards = cards.concat(cards);
    cardsDealt = shuffle(cards);

    section.innerHTML = "";

    for(let i=1; i<=nCards; i++){
        section.innerHTML += `<figure class="start" onclick="select(this, ${i-1})">
                                  <img src="./assets/images/front.png" alt="${i}-th carta"/>
                                  <img class="ocult" src="./assets/images/${cardsDealt[i-1]}parrot.gif" alt="${i}-th carta, imagem ${cardsDealt[i-1]}parrot"/>
                              </figure>`;
    }

    setTimeout(removeStart, 1000);
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

function init() {
    nCardSelected = 0;
    clicks = 0;
    found = 0;
    time = 0;
    const website = document.querySelector(".website");
    const nCards = howManyCards();
    
    if (nCards === 0) {
        website.setAttribute("onclick","init()");
        website.querySelector("header p").innerHTML = "CLIQUE PARA RECOMEÇAR!";
    } else {
        website.removeAttribute("onclick");
        createCards(nCards);
        website.classList.remove("start");
        idSetInterval = setInterval(updateDisplay, 100);
    }
}

setTimeout(init, 1000);