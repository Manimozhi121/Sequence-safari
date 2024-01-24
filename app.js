//highest score problem;
//lives problem

const gameboard=document.querySelector('.gameboard');
const scoreElement=document.querySelector('.score');
const highscoreElement=document.querySelector('.highestscore');
const controlElement=document.querySelectorAll('.controls i');
const timer=document.querySelector('.time');
const boxwrapper=document.querySelector('.boxwrapper');
const round=document.querySelector('.round');
const l1=document.querySelector('.l1');
const l2=document.querySelector('.l2');
const l3=document.querySelector('.l3');

let gameover=false;
let foodX=[],foodY=[];
let snakeX=5, snakeY=10;
let snakeBody=[];
let velocityX=0, velocityY=0;
let setIntervelId;
let score=0;
let timeleft=30;
let f_n=0;
let r=1;
let _score=0;
let lives=3;
let color=["E5CE4F","39CDA2","BD0FEC","E371D4","BAB989","D8754F"];
let highscore=localStorage.getItem("high-score")||0;
highscoreElement.innerText=`Highest Score=${highscore}`;
round.innerHTML=`Round:${r}`;

function playgameOverSound() {
  var gameOverSound = new Audio("wrong-answer-sound-effect.mp3");
  gameOverSound.play();
}

function arrangefoodposition(){
    for(let i=0;i<3;i++){     
    foodX[i]=Math.floor(Math.random()*25)+1;
    foodY[i]=Math.floor(Math.random()*25)+1;
    } 
 
}

function shuffle(color){
    for(let i=color.length-1;i>0;i--){
       const j=Math.floor(Math.random()*(i+1));
       const temp=color[i].slice();
       color[i]=color[j].slice();
       color[j]=temp.slice();
    }
}

function playEatSound() {
    var eatSound = new Audio("discord-notification.mp3");
    eatSound.play();
}

const changeDirection= (e) => {
    if(e.key === "ArrowUp" && velocityY!=1){
        velocityX=0;
        velocityY=-1;
    }
    else if(e.key === "ArrowDown" && velocityY!=-1){
        velocityX=0;
        velocityY=1;
    }
    else if(e.key === "ArrowRight" && velocityX!=-1){
        velocityX=1;
        velocityY=0;
    }
    else if(e.key === "ArrowLeft" && velocityX!=1){
        velocityX=-1;
        velocityY=0;
    }
    initgame();
}

controlElement.forEach(key => {
    //calling change direction on each click and passing key data set value as an object
    addEventListener("click",()=>changeDirection({key:key.dataset.key}));
})

function checkLives(){
    lives--;
    if(lives==-1) {return handlegameover();}
    if(lives==2) l1.style.color='rgb(64, 97, 127)';
    if(lives==1) l2.style.color='rgb(64, 97, 127)';
    if(lives==0) l3.style.color='rgb(64, 97, 127)';
    handlelifeCompletion();
}

function handlelifeCompletion(){
    alert("One life over");
    foodX=[],foodY=[]; snakeX=5, snakeY=10; snakeBody=[];
    velocityX=0, velocityY=0;
    score=0; timeleft=30; f_n=0; r=1; _score=0;
    round.innerHTML=`Round:${r}`;
    scoreElement.innerText=`Score=${score}`;
    timer.innerHTML=`Time left: ${timeleft}s`;
    shuffle(color); arrangefoodposition();
    initgame();
}
  
function handlegameover(){
    playgameOverSound();
    alert("Game Over!!! Press ok to replay");
    //clears time and reloads the page-----------------------------------------
    clearInterval(setIntervelId);
    location.reload();
    shuffle(color);
    startGame(e);
}

function handleroundcompletion(){
   alert("Press ok to continue to next round");
   score+=10; _score=score; r++; timeleft=30; f_n=0;
   round.innerHTML=`Round:${r}`;
   shuffle(color); arrangefoodposition();
}

function handleEat(){
    //changefoodposition();
    snakeBody.push([foodX[f_n],foodY[f_n]]);//pushing food into snake
    if (f_n>=0 && f_n<3) {delete foodX[f_n]; delete foodY[f_n];}
    f_n++;
    score++;
    highscore=score>=highscore?score:highscore ;
    localStorage.setItem("high-score",highscore);
    scoreElement.innerText=`Score=${score}`;
    highscoreElement.innerText=`Highest Score=${highscore}`;
}

function initgame(){
let htmlMarkup=``;
let htmlmarkup=``;
for(let i=0;i<3;i++){
    htmlMarkup+=`<div class="food${i+1}" style="grid-area: ${foodY[i]} / ${foodX[i]};background-color:#${color[i]};"></div>`;
}
for(let i=0;i<3;i++){
    htmlmarkup+=`<div class="Food${i+1}" style="background-color:#${color[i]};"></div>`;
}

//checking if snake hit food
    if (snakeX===foodX[f_n]&&snakeY===foodY[f_n]){
        playEatSound(); handleEat(); 
    }

    for(let i=snakeBody.length-1;i>0;i--){
        //shifting the array elements by one----????
        snakeBody[i]=snakeBody[i-1];
    }

    //initialising the snakebody with its current head position
    snakeBody[0]=[snakeX,snakeY];

    //updating the position of snake
    snakeX+=velocityX;
    snakeY+=velocityY;

    

    for (let i=0;i<snakeBody.length;i++){
        htmlMarkup+=`<div class="shead" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
    }
    
    gameboard.innerHTML=htmlMarkup;
    boxwrapper.innerHTML=htmlmarkup;
    //ROUND COMPLETION CONDITIONS
    if(score==(_score+3)) handleroundcompletion();
    //GAMEOVER CONDITIONS
    for(let i=0;i<snakeBody.length;i++){
        if (i!=0 && snakeY===snakeBody[i][1] && snakeX===snakeBody[i][0]){
            checkLives();
        }
    }
    if(snakeX < 0 || snakeX > 26 || snakeY < 0 || snakeY > 26){
       checkLives();
    }

}

function myTimer() {
    timeleft--;
    if (timeleft == -1) {
        clearInterval(time);
        alert("Time out!! :(");
        handlegameover();
    }
    timer.innerHTML=`Time left: ${timeleft}s`;
}

var time = setInterval(myTimer, 1000);

function startGame(e){
    if(e.keyCode===9){
        e.preventDefault();
        shuffle(); arrangefoodposition();
        setIntervelId=setInterval(initgame,175);
        document.addEventListener("keydown",changeDirection);
    }
}