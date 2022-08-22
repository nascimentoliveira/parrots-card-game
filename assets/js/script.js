let cardsDealt = [];        //drawn cards
let previousSelectedFigure; //face-up card (first of pair)
let previousSelectedIndex;  //face-up card index (first of pair)
let nCardSelected;          //how many cards are face up
let moves;                  //number of movements
let found;                  //number of cards found 
let time;                   //elapsed time
let idSetInterval;          //generated setInterval id

const turningTime = 800;
const observationTime = 1000;
const animationTime = 1000;
const watchInterval = 0.1;
const decimalPlace = 1;
const secondXMiliseconds = 1000;

function updateDisplay(score, timer) {

    time += watchInterval;
    score.innerHTML = moves;
    timer.innerHTML = `${time.toFixed(decimalPlace)} s`;
  }

function checkParity(index1, index2) {

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
    setTimeout(ocultElement, turningTime/2, figure);
}

function unblock() {

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
        alert(`Você ganhou com ${moves} jogadas em ${time.toFixed(decimalPlace)} segundos!`);

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
                alert("Esta pergunta aceita 'sim' ou 'não' como resposta!");
            }

       } while (true);
    }
}

function select(figure, index) {

    nCardSelected++;
    moves++;

    figure.removeAttribute("onclick");
    turn(figure); 
    
    if (nCardSelected == 2){
        document.querySelector(".website > div").classList.add("block-on");
        if (checkParity(previousSelectedIndex, index)) {
            setTimeout(checkEnd, turningTime + turningTime/2);
            setTimeout(resolved, turningTime, figure, previousSelectedFigure);
            setTimeout(unblock, turningTime);
        } else {
            setTimeout(turn, observationTime + turningTime, previousSelectedFigure);
            setTimeout(turn, observationTime + turningTime, figure);
            previousSelectedFigure.setAttribute("onclick", `select(this, ${previousSelectedIndex})`);
            figure.setAttribute("onclick", `select(this, ${index})`);
            setTimeout(unblock, observationTime + turningTime);
        }
        nCardSelected = 0;

    } else {
        previousSelectedFigure = figure;
        previousSelectedIndex = index;
    } 
}

function removeStart(cards) {

    for (let i=0; i<cards.length; i++){
        cards[i].classList.remove('start');
    }
}

//https://stackoverflow.com/a/2450976/15506353
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
    const cards = ["bobross", "explody", "fiesta", "metal", "revertit", "triplets", "unicorn"];

    cardsDealt = shuffle(cards);
    cardsDealt = cardsDealt.slice(0, nCards/2);
    cardsDealt = cardsDealt.concat(cardsDealt);
    cardsDealt = shuffle(cardsDealt);
    section.innerHTML = "";

    for(let i=0; i<nCards; i++){
        section.innerHTML += `<figure class="start" onclick="select(this, ${i})">
                                  <img src="./assets/images/front.png" alt="${i+1}-th carta"/>
                                  <img class="ocult" src="./assets/images/${cardsDealt[i]}parrot.gif" alt="${i+1}-th carta, imagem ${cardsDealt[i]}parrot"/>
                              </figure>`;
    }

    setTimeout(removeStart, animationTime, section.querySelectorAll('.start'));
}

function howManyCards() {

    const minNCards = 4;
    const maxNCards = 14;
    let nCards;

    do {
        nCards = Number(prompt("Com quantas cartas deseja jogar?"));

        if ((nCards >= minNCards && nCards <= maxNCards && nCards % 2 === 0) || nCards ===  0) {
            break;
        } else {
            alert("Somente números pares entre 4 e 14 (inclusive)!");
        }

    } while (true);

    return nCards;
}

function init() {

    cardsDealt = [];
    nCardSelected = 0;
    moves = 0;
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
        idSetInterval = setInterval(updateDisplay, 
                                    watchInterval*secondXMiliseconds, 
                                    website.querySelector(".clock-score :nth-child(1) p"), 
                                    website.querySelector(".clock-score :nth-child(3) p"));
    }
}

setTimeout(init, animationTime);