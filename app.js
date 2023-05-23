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
//see if j logic works
let f_n=0,a=false;
let r=1;
let _score=0;
let lives=3;
let color=["E5CE4F","39CDA2","BD0FEC","E371D4","BAB989","D8754F"];
let highscore=localStorage.getItem("high-score")||0;
highscoreElement.innerText=`Highest Score=${highscore}`;
round.innerHTML=`Round:${r}`;

function playgameOverSound() {
  // Create an audio element
  var gameOverSound = new Audio("wrong-answer-sound-effect.mp3");

  // Play the sound
  gameOverSound.play();
}


const handlegameover=()=>{
  playgameOverSound();
  alert("Game Over!!! Press ok to replay");
    //clears time and reloads the page
    clearInterval(setIntervelId);
   location.reload();
    shuffle(color);
  
}

function playEatSound() {
  // Create an audio element
  var eatSound = new Audio("discord-notification.mp3");

  // Play the sound
  eatSound.play();
}


const handleroundcompletion=()=>{
alert("Press ok to continue to next round");
score+=10;
_score=score;
r++;
round.innerHTML=`Round:${r}`;
timeleft=30;
shuffle(color);
f_n=0;
arrangefoodposition();
}

const shuffle=(color)=>{
    for(let i=color.length-1;i>0;i--){
       const j=Math.floor(Math.random()*(i+1));
       const temp=color[i].slice();
       color[i]=color[j].slice();
       color[j]=temp.slice();
    }
}

const initgame= () => {
let htmlMarkup=`<div class="food1" style="grid-area: ${foodY[0]} / ${foodX[0]};background-color:#${color[0]};"></div>`;
htmlMarkup+=`<div class="food2" style="grid-area: ${foodY[1]} / ${foodX[1]};background-color:#${color[1]};"></div>`;
htmlMarkup+=`<div class="food3" style="grid-area: ${foodY[2]} / ${foodX[2]};background-color:#${color[2]};"></div>`;

let htmlmarkup=`<div class="Food1" style="background-color:#${color[0]};"></div>`;
htmlmarkup+=`<div class="Food2" style="background-color:#${color[1]};"></div>`;
htmlmarkup+=`<div class="Food3" style="background-color:#${color[2]};"></div>`;

//checking if snake hit food
    if (snakeX===foodX[f_n]&&snakeY===foodY[f_n])
     {a=true; playEatSound(); }
    if(a){
        //changefoodposition();
        snakeBody.push([foodX[f_n],foodY[f_n]]);//pushing food into snake
        if (f_n==0) {delete foodX[0]; delete foodY[0];}
        if (f_n==1) {delete foodX[1]; delete foodY[1];}
        if (f_n==2) {delete foodX[2]; delete foodY[2];}
        f_n++;
        a=false;
        score++;
        if(score==(_score+3)) handleroundcompletion();
        highscore=score>=highscore?score:highscore ;
        localStorage.setItem("high-score",highscore);
        scoreElement.innerText=`Score=${score}`;
        highscoreElement.innerText=`Highest Score=${highscore}`;
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
        if (i!=0 && snakeBody[0][1]===snakeBody[i][1] && snakeBody[0][0]===snakeBody[i][0]){
           /* lives--;
         if(lives==2) l1.style.color='rgb(64, 97, 127)';
         if(lives==1) l2.style.color='rgb(64, 97, 127)';
         if(lives==0) l3.style.color='rgb(64, 97, 127)';
        if (lives==-1){return handlegameover();}*/
         handlegameover();
        }
    }
    
    // checking if snake is out of wall
    if(snakeX < 0 || snakeX > 26 || snakeY < 0 || snakeY > 26){
       handlegameover();
  
  }
  
    gameboard.innerHTML=htmlMarkup;
    boxwrapper.innerHTML=htmlmarkup;
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

const arrangefoodposition=() => {
for(let i=0;i<3;i++){     
foodX[i]=Math.floor(Math.random()*25)+1;
foodY[i]=Math.floor(Math.random()*25)+1;
} 

}


var time = setInterval(myTimer, 1000);

function myTimer() {
    
    timeleft--;
    if (timeleft == -1) {
        clearInterval(time);
        alert("Time out!! :(");
        handlegameover();
    }
    timer.innerHTML=`Time left: ${timeleft}s`;
}


arrangefoodposition();
setIntervelId=setInterval(initgame,175);
document.addEventListener("keydown",changeDirection);