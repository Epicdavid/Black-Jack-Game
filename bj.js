window.onload = function () {
    let blackjackgame = {
        'you': { 'scorespan': '#yourResult', 'div': '#player-box', 'score': 0 },
        'dealer': { 'scorespan': '#dealResult', 'div': '#dealer-box', 'score': 0 },
        'cards': ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'A', 'J', 'k', 'Q'],
        'cardmap': { '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'A': 10, 'J': 10, 'k': 10, 'Q': 10, 'A': [1, 11] },
        'wins': 0,
        'losses': 0,
        'draws': 0,
        'stand': false,
        'turnover': false,
    };

    const you = blackjackgame['you']
    const dealer = blackjackgame['dealer']

    const hitsound = new Audio('./sounds/swish.m4a');
    const winsound = new Audio('./sounds/cash.mp3')
    const lostsound = new Audio('./sounds/aww.mp3')


    document.querySelector("#hitbtn").addEventListener('click', bjhit);
    document.querySelector('#stand-btn').addEventListener('click', dealerlogic);

    document.querySelector('#deal-btn').addEventListener('click', blackjackdeal);


    function bjhit() {
        if (blackjackgame['stand'] === false) {
            let card = randomcard();
            showcard(card, you);
            console.log(card)
            updateCard(card, you)
            showscore(you)
        }
    };

    function randomcard() {
        let ranindex = Math.floor(Math.random() * 13);
        return blackjackgame['cards'][ranindex]
    }


    function showcard(card, activeplayer) {
        if (activeplayer['score'] <= 21) {
            let cardimage = document.createElement('img')
            cardimage.src = `./images/${card}.png`;
            document.querySelector(activeplayer['div']).appendChild(cardimage);
            hitsound.play()
        }
    }

    function blackjackdeal() {
        if (blackjackgame['turnover'] === true) {
            blackjackgame['stand'] = false;
            let yourimg = document.querySelector('#player-box').querySelectorAll('img');
            let dealerimg = document.querySelector('#dealer-box').querySelectorAll('img');


            for (i = 0; i < yourimg.length; i++) {
                yourimg[i].remove()
            }
            for (i = 0; i < dealerimg.length; i++) {
                dealerimg[i].remove()
            }
            you['score'] = 0;
            dealer['score'] = 0;

            document.querySelector('#yourResult').textContent = 0;
            document.querySelector('#dealResult').textContent = 0;

            document.querySelector('#yourResult').style.color = '#ffffff';
            document.querySelector('#dealResult').style.color = '#ffffff';

            document.querySelector('#bj-result').textContent = "Let's play again";
            document.querySelector('#bj-result').style.color = 'black';

            blackjackgame['turnover'] = true;
        }
    }

    function updateCard(card, activeplayer) {
        if (card === 'A') {
            if (activeplayer['score'] + blackjackgame['cardmap'][card][1] <= 21) {
                activeplayer['score'] += blackjackgame['cardmap'][card][1];
            } else {
                activeplayer['score'] += blackjackgame['cardmap'][card][0];
            }
        } else {
            activeplayer['score'] += blackjackgame['cardmap'][card];
        }


    }

    function showscore(activeplayer) {
        if (activeplayer['score'] > 21) {
            document.querySelector(activeplayer['scorespan']).textContent = 'BUST!';
            document.querySelector(activeplayer['scorespan']).style.color = 'red';
        } else {
            document.querySelector(activeplayer['scorespan']).textContent = activeplayer['score']
        }

    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function dealerlogic() {

        blackjackgame['stand'] = true;
        while (dealer['score'] < 16 && blackjackgame['stand'] === true) {
            let card = randomcard();
            showcard(card, dealer);
            updateCard(card, dealer);
            showscore(dealer);
            await sleep(1000);
        }
        blackjackgame['turnover'] = true;
        let winner = computeWinner();
        showResult(winner);
    }


    function computeWinner() {
        let winner;
        if (you['score'] <= 21) {
            if (you['score'] > dealer['score'] || (dealer['score'] > 21)) {
                blackjackgame['wins']++;
                winner = you;

            } else if (you['score'] < dealer['score']) {
                blackjackgame['losses']++;
                winner = dealer;

            } else if (you['score'] === dealer['score']) {
                blackjackgame['draws']++;
            }
        } else if (you['score'] > 21 && dealer['score'] <= 21) {
            blackjackgame['losses']++;
            winner = dealer;
        } else if (you['score'] > 21 && dealer['score'] > 21) {
            blackjackgame['draws']++;

        }
        console.log('Winner is: ', winner)
        return winner;
    }

    function showResult(winner) {
        let message, messageColor;
        if (blackjackgame['turnover'] === true) {
            if (winner === you) {
                message = 'You Won';
                messageColor = 'green';
                winsound.play();
                document.querySelector('#wins').textContent = blackjackgame['wins']
            } else if (winner === dealer) {
                message = 'You lost';
                messageColor = 'red';
                lostsound.play();
                document.querySelector('#losses').textContent = blackjackgame['losses']
            } else {
                message = 'TIE'
                messageColor = 'black';
                document.querySelector('#draws').textContent = blackjackgame['draws']
            }
            document.querySelector('#bj-result').textContent = message;
            document.querySelector('#bj-result').style.color = messageColor;




        }
    }
}
