/*
 * Create a list that holds all of your cards
 */
 let listOfCards = ['bicycle','bicycle','leaf','leaf','cube','cube','anchor','anchor','paper-plane-o',
                    'paper-plane-o','bolt','bolt','bomb','bomb','diamond','diamond'];

 var open = [];
 var match = 0;
 var moves = 0;
 var delay = 800;
 var gamesCardQty = listOfCards.length / 2;
 var oneStar = gamesCardQty + 2;
 var twoStars = gamesCardQty + 6;
 var threeStars = gamesCardQty + 10;
 var timer;
 var clicks = 0;



/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

/* Shuffle function
@array - list of  cards;
*/
function shuffle(array) {
    for(let i = array.length-1;i > 0;i--) {
        let j = Math.floor(Math.random() * (i+1));
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
 };


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

 let gameTimer = () => {
    let countDownDate = new Date().getTime();
    timer = setInterval(() => {
        let now = new Date().getTime();
        let distance = now - countDownDate;

        let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((distance % (1000 * 60)) / 1000);

        if(seconds < 10) {
            seconds = "0" + seconds;
        }

        let currentTime = minutes + ':' + seconds;

        $('#clock').text(currentTime);
    },750);
 };


 function initialGame() {
    var cards = shuffle(listOfCards);
    $('.deck').empty();
    match = 0;
    moves = 0;
    $('.moves').html('0');
    $('i').removeClass('fa-star-o').addClass('fa-star');
    for(var i = 0; i < cards.length ; i++) {
        $('.deck').append($('<li class="card"><i class="fa fa-'+ cards[i] +'"></i></li>'));
    }
    addCardListener();
    $('#clock').text("0:00");
 };

/* set Ratings and final score
@move - no of moves user has made
*/
function setRating(moves) {
    var rating = 3;
    if(moves > 10 && moves < 15) {
        $('i').eq(2).removeClass('fa-star').addClass('fa-star-o');
        rating = 3;
    }else if(moves > 15 && moves < 25) {
        $('i').eq(1).removeClass('fa-star').addClass('fa-star-o');
        rating = 2;
    }else if(moves > 25) {
        $('i').eq(0).removeClass('fa-star').addClass('fa-star-o');
        rating = 1;
    }
    return {score : rating};
};

/* End Game
@move - no of moves user has made
@score - ratings
*/
 function endGame(moves,score) {
    time = $('#clock').text();
    swal({
        title: 'Congratulation,you won the game!! in '+ time + ' minutes',
        text : 'with ' +moves+'Moves and '+ score + ' Stars \n Wooohooo!',
        confirmButtonColor: '#02ccba',
        confirmButtonText: 'Play again',
        type: 'success',
        allowEscapeKey: false,
        allowOutsideClick: false,
    }).then((isConfirm) => {
        if(isConfirm) {
            clicks = 0;
            clearInterval(timer);
            //$('#clock').text("0:00");
            initialGame();
        }
    });
 };

 //Restart Game
 $('.restart').bind('click',function(){
    swal({
        allowEscapeKey: false,
        allowOutsideClick: false,
        type: 'warning',
        title: 'Are you sure?',
        text: 'You will lost your score',
        confirmButtonText: 'Yes',
        confirmButtonColor: '#02ccba',
        showCancelButton: true,
        cancelButtonColor: '#f95c3c',
    }).then(function(isConfirm) {
        if(isConfirm) {
            clicks = 0;
            clearInterval(timer);
            //$('#clock').text("0:00");
            initialGame();
        }
    });
 });

 var addCardListener = function() {
    //flip card
    $('.deck').find('.card').bind('click',function() {
        clicks++ ;
        clicks == 1 ? gameTimer() :'';
        if($('.show').length > 1) {
            return true;
        }

        let card = $(this).context.innerHTML;
        if($(this).hasClass('open')) { return true };
        $(this).addClass('open show');
        open.push(card);

        if(open.length > 1) {
            if(card === open[0]) {
                $('.deck').find('.open').addClass('match animated infinite rubberband');
                setTimeout(function() {
                    $('.deck').find('.match').removeClass('open show animated infinite rubberband');
                },delay);
                match++;
            } else {
                $('.deck').find('.open').addClass('nomatch animated infinite wobble');
                setTimeout(function() {
                    $('.deck').find('.open').removeClass('animated infinite wobble');
                },delay/1.5);
                setTimeout(function() {
                    $('.deck').find('.open').removeClass('open show nomatch animated infinite wobble');
                },delay);
                moves ++;
            }
            open = [];
            setRating(moves);
            $('.moves').html(moves);
        }

        if(gamesCardQty === match) {
            setRating(moves);
            var score = setRating(moves).score;
            setTimeout(function() {
                clearInterval(timer);
                endGame(moves,score);
            },500);
        }
    });
 };

initialGame();