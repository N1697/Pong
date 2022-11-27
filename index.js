const gameBoard = document.querySelector("#gameBoard");
const context = gameBoard.getContext("2d");
const scoreText = document.querySelector("#scoreText");
const resetBtn = document.querySelector("#resetBtn");

const gameWidth = gameBoard.width;
const gameHeight = gameBoard.height;

const boardBackground = "black";
const paddle1Color = "red";
const paddle2Color = "blue";
const paddleBorderColor = "white";
const ballColor = "lightgreen";
const ballBorderColor = "white";
const ballRadius = 12.5; //Radius = 12.5 => Diameter = 25

const paddleSpeed = 100; //How far we want our paddle to move when we press down a button

let intervalID;

let ballSpeed = 1;
let xBall = gameWidth / 2;
let yBall = gameHeight / 2;
let xBallDirection = 0; //The direction in which the ball is headed on the x-axis
let yBallDirection = 0; //The direction in which the ball is headed on the y-axis

let player1Score = 0;
let player2Score = 0;

let paddle1 = {
    width: 10,
    height: 100,
    x: 0, //The starting x-coordinate: top-left corner
    y: 0 //The starting y-coordinate: top-left corner
}
let paddle2 = {
    width: 10,
    height: 100,
    x: gameWidth - 10, //The starting x-coordinate: bottom-right corner
    y: gameHeight - 100 //The starting y-coordinate: bottom-right corner
}

window.addEventListener("keydown", changeDirection);
resetBtn.addEventListener("click", resetGame);

gameStart();

//////////////////////////////////////////////////////////////////////////////
function gameStart(){
    createBall();
    nextTick();
}
function nextTick(){
    intervalID = setTimeout(() => {
        clearBoard();
        drawPaddles();
        moveBall();
        drawCenterLine();
        drawBall(xBall, yBall);
        checkCollision();
        nextTick(); //continuously repeat the functions above every 10ms
    }, 10);
}
function clearBoard(){
    //Every time we clear the board, we'll re-draw the board
    context.fillStyle = boardBackground;
    context.fillRect(0, 0, gameWidth, gameHeight);
}
function drawPaddles(){
    context.setStrokeStyle = paddleBorderColor; //draw the paddles's border

    context.fillStyle = paddle1Color;
    context.fillRect(paddle1.x, paddle1.y, paddle1.width, paddle1.height);
    context.strokeRect(paddle1.x, paddle1.y, paddle1.width, paddle1.height);

    context.fillStyle = paddle2Color;
    context.fillRect(paddle2.x, paddle2.y, paddle2.width, paddle2.height);
    context.strokeRect(paddle2.x, paddle2.y, paddle2.width, paddle2.height);
}
function drawBall(xBall, yBall){
    context.fillStyle = ballColor;
    context.strokeStyle = ballBorderColor;
    context.lineWidth = 2; //border line
    context.beginPath();
    context.arc(xBall, yBall, ballRadius, 0, 2 * Math.PI);
    context.stroke();
    context.fill();
}
function createBall(){
    ballSpeed = 1;
    if(Math.round(Math.random()) == 1){
        //if the random number is 1, move to the right, else, move to the left
        xBallDirection = 1;
    }
    else{
        xBallDirection = -1;
    }
    if(Math.round(Math.random()) == 1){
        //if the random number is 1, move down, else, move up
        yBallDirection = Math.random() * 1; //more random directions;
    }
    else{
        yBallDirection = Math.random() * -1; //more random directions;
    }

    //place the ball in the middle when it's created
    xBall = gameWidth / 2;
    yBall = gameHeight / 2;

    drawBall(xBall, yBall);
}
function moveBall(){
    xBall = xBall + (ballSpeed * xBallDirection);
    yBall = yBall + (ballSpeed * yBallDirection);
}
function checkCollision(){
    //Check collision with the borders
    //if we touch the top/bottom-border, change y-direction
    if(yBall <= 0 + ballRadius){ //top-border
        yBallDirection *= -1;
    }
    if(yBall >= gameHeight - ballRadius){ //bottom-border
        yBallDirection *= -1;
    }
    //if we touch the right/left-border, change x-direction and update player's scores
    if(xBall <= 0){ //left-border
        player2Score++;
        updateScore();
        createBall();
        return;
    }
    if(xBall >= gameWidth){ //right-border
        player1Score++;
        updateScore();
        createBall();
        return;
    }

    //Check collision with the paddles
    //paddle1
    if(xBall <= (paddle1.x + paddle1.width + ballRadius)){
        if((yBall > paddle1.y) && (yBall < (paddle1.y + paddle1.height))){
            xBall = (paddle1.x + paddle1.width) + ballRadius; // if ball gets stuck
            xBallDirection *= -1;
            ballSpeed += 1;
        }
    }
    if(xBall >= (paddle2.x - ballRadius)){
        if((yBall > paddle2.y) && (yBall < (paddle2.y + paddle2.height))){
            xBall = paddle2.x - ballRadius; // if ball gets stuck
            xBallDirection *= -1;
            ballSpeed += 1;
        }
    }
}
function changeDirection(event){ //in charge of moving the paddles
    const keyPressed = event.keyCode;

    const W = 87; //paddle 1 goes up
    const S = 83; //paddle 1 goes down

    const UP = 38; //paddle 2 goes up
    const DOWN = 40; //paddle 2 goes down

    switch(keyPressed){
        case(W):
            if(paddle1.y > 0){
                paddle1.y -= paddleSpeed;
            }
            break;
        case(S):
            if(paddle1.y < gameHeight - paddle1.height){
                paddle1.y += paddleSpeed;
            }
            break;
        case(UP):
            if(paddle2.y > 0){
                paddle2.y -= paddleSpeed;
            }
            break;
        case(DOWN):
            if(paddle2.y < gameHeight - paddle2.height){
                paddle2.y += paddleSpeed;
            }
            break;
    }


}
function updateScore(){
    scoreText.textContent = `${player1Score} : ${player2Score}`;
}
function resetGame(){
    player1Score = 0;
    player2Score = 0;

    paddle1 = {
        width: 10,
        height: 100,
        x: 0, //The starting x-coordinate: top-left corner
        y: 0 //The starting y-coordinate: top-left corner
    }
    paddle2 = {
        width: 10,
        height: 100,
        x: gameWidth - 10, //The starting x-coordinate: bottom-right corner
        y: gameHeight - 100 //The starting y-coordinate: bottom-right corner
    }

    ballSpeed = 1;
    xBall = 0;
    yBall = 0;
    xBallDirection = 0;
    yBallDirection = 0;
    updateScore();
    clearInterval(intervalID);
    gameStart();
}

function drawCenterLine(){
    let centerLineColor = "white";
    context.strokeStyle = centerLineColor;
    context.lineWidth = 5;
    //context.setLineDash([10, 2]);
    context.beginPath();
    context.moveTo(gameWidth / 2, 0);
    context.lineTo(gameWidth / 2, gameHeight);
    context.stroke();
}