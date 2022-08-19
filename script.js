function howManyCards() {
    let nCards = 0;

    do {
        nCards = prompt("Com quantas cartas deseja jogar?")
        if (nCards >= 4 && nCards <= 14 && nCards % 2 === 0){
            break;
        } else {
            alert("Somente números pares entre 4 e 14 (inclusive)!");
        }
    } while (true);

    return nCards;
}

function createCards(nCards) {
    let cards = document.querySelector(".cards");

    for(let i=0; i<nCards; i++){
        cards.innerHTML += `<div class="card">
                                <img src="./images/front.png" />
                            </div>`
    }
}

createCards(howManyCards());