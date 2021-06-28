const BASE_URL = "http://127.0.0.1:3000"
const USERS_URL = `${BASE_URL}/users`
const COMMENTS_URL = `${BASE_URL}/comments`
const HIGH_SCORE_URL = `${BASE_URL}/high_scores`

const signUpButton = document.getElementById("signUpButton");
const logInButton = document.getElementById("logInButton");
const logOutButton = document.getElementById("logOutButton")

signUpButton.addEventListener("click", (e) => {
    signUp(e);
})

logInButton.addEventListener("click", (e) => {
    logIn(e);
})

logOutButton.addEventListener("click", (e) => {
    logOut(e);
})




function loggedIn() {
    let player = document.querySelector("#current-user");

    if(!(player.innerText === "Not Logged In")) {
        return true;
    }
    else {
        return false;
    }
}

function logIn(e) {
    e.preventDefault();

    let userInput = document.querySelector("#username-login").value;

    let formData = {
        username: userInput
    }

    let configObj = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(formData)
    }

    fetch(`${BASE_URL}/login`, configObj)
    .then(resp => resp.json())
    .then(parsedResp => {
        if(parsedResp.username) {

            newComment(parsedResp.id);
            setUserId(parsedResp.id);

            const currentUser = document.querySelector("#current-user");
            currentUser.innerText = parsedResp.username;
        }
    });
}

function setUserId(user_id) {
    let hiddenUserId = document.getElementById("userId")
    hiddenUserId.value = user_id
}

function signUp(e) {
    e.preventDefault();

    let userInput = document.querySelector("#username-signup").value;

    let formData = {
        username: userInput
    }

    let configObj = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(formData)
    }

    fetch(USERS_URL, configObj)
    .then(resp => resp.json())
    .then(parsedResp => {
        if(parsedResp.username) {

            newComment(parsedResp.id);
            setUserId(parsedResp.id);

            const currentUser = document.querySelector("#current-user");
            currentUser.innerText = parsedResp.username;
        }
    });
}

function logOut(e) {
    e.preventDefault();

    let data = {
        username: document.querySelector("#current-user").innerText
    }

    let configObj = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(data)
    }

    fetch(`${BASE_URL}/logout`, configObj)
    .then(resp => resp.json())
    .then(parsedResp => {
        if(loggedIn() === true) {
            let player = document.querySelector("#current-user");
            player.innerText === "Not Logged In"
        }
    })
}

function newComment(user_id) {
    let commentButton = document.getElementById("newCommentButton");

    commentButton.addEventListener("click", (e) => {
        let user = document.querySelector("#current-user").innerText;

        e.preventDefault();
        let commentText = document.getElementById("newUserComment").value

        let formData = {
            comment: commentText
        }

        let configObj = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(formData)
        }

        fetch(`${BASE_URL}/users/${user_id}/comments`, configObj)
        .then(resp => resp.json())
        .then(parsedResp => {
            let commentsSection = document.querySelector(".comment-list");
            let commentDiv = document.createElement("div");
            commentDiv.classList.add("a-comment");
            let commentHeader = document.createElement("h5");
            let commentP = document.createElement("p");
            let commentDeleteButton = document.createElement('button');
            commentDeleteButton.classList.add("deleteButton");
            commentDeleteButton.innerText = "x"
            commentHeader.innerText = parsedResp.user.username;
            commentP.innerText = parsedResp.text;
            let commentId = parsedResp.id
            commentDeleteButton.addEventListener("click", (e) => {
                removeComment(commentId);
                commentsSection.removeChild(e.target.parentElement);
            });
            let br = document.createElement("br");
            commentsSection.appendChild(commentDiv);
            commentDiv.appendChild(commentHeader);
            commentDiv.appendChild(commentP);
            commentDiv.appendChild(commentDeleteButton)
            commentDiv.appendChild(br);
        });
    })
}

function getComments() {
    fetch(`${BASE_URL}/comments`)
    .then(resp => resp.json())
    .then(parsedResp => {
        parsedResp.sort((a,b) => a.user.username < b.user.username ? -1: a.user.username === b.user.username ? 0 : 1)
        parsedResp.forEach( e => {
            let commentsSection = document.querySelector(".comment-list");
            let commentDiv = document.createElement("div");
            commentDiv.classList.add("a-comment");
            let commentHeader = document.createElement("h5");
            let commentP = document.createElement("p");
            let commentDeleteButton = document.createElement('button');
            commentDeleteButton.classList.add("deleteButton");
            commentDeleteButton.innerText = "x"
            commentHeader.innerText = e.user.username;
            commentP.innerText = e.text;
            let commentId = e.id
            let commentAuthor = e.user.username;
            let user = document.querySelector("#current-user").innerText;
            commentDeleteButton.addEventListener("click", (e) => {
                if(commentAuthor === user) {
                removeComment(commentId);
                commentsSection.removeChild(e.target.parentElement);
                }
            });
            commentsSection.appendChild(commentDiv);
            commentDiv.appendChild(commentHeader);
            commentDiv.appendChild(commentP);
            commentDiv.appendChild(commentDeleteButton);
            let br = document.createElement("br");
            commentDiv.appendChild(br);
        });
    })
}

function removeComment(commentId) {
    let configObj = { method: "DELETE" };
    fetch(COMMENTS_URL + "/" + commentId, configObj);
}

let aimCanvas = new canvas('game-canvas');
let cursor = new mouse();

aimCanvas.setSize(800, 400);

run();

function canvas(canvasId){

    this.canvas = document.querySelector('#' + canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.centerLeft;
    this.centerTop;

    this.cursorX = -50;
    this.cursorY = -50;
    this.cursorSound = [];


    this.currentView = "menu";
    this.mode;

    this.canvas.addEventListener('mousemove', function(e){

        this.boundingClientRect = this.getBoundingClientRect();
        aimCanvas.cursorX = e.clientX - this.boundingClientRect.left;
        return aimCanvas.cursorY = e.clientY - this.boundingClientRect.top;

    })

    this.canvas.addEventListener('mousedown', function(){

        aimCanvas.cursorSound.push(new sound());
        aimCanvas.cursorSound[aimCanvas.cursorSound.length-1].play();

        if(aimCanvas.currentView === "menu"){

            if(aimCanvas.cursorX > aimCanvas.centerLeft - 75
                && aimCanvas.cursorX < aimCanvas.centerLeft + 75
                && aimCanvas.cursorY > aimCanvas.centerTop - 50
                && aimCanvas.cursorY < aimCanvas.centerTop + 100){

                aimCanvas.mode = new targetMode();
                return aimCanvas.currentView = "targetMode";

            }

        }

        if(aimCanvas.currentView === "targetMode"){

            aimCanvas.mode.shootFail += 1;

            aimCanvas.mode.targets.find(function(e, index){

                this.dx = aimCanvas.cursorX - e.x;
                this.dy = aimCanvas.cursorY - e.y;
                this.dist = Math.abs(Math.sqrt(this.dx*this.dx + this.dy*this.dy));

                if(this.dist <= e.size){

                    aimCanvas.mode.shootFail -= 1;
                    aimCanvas.mode.score += 1;
                    return aimCanvas.mode.targets.splice(index, 1);

                }

            })

        }

        setTimeout(function(){

            aimCanvas.cursorSound.splice(aimCanvas.cursorSound[aimCanvas.cursorSound.length-1], 1);

        }, 2000);

    })

    document.addEventListener('keydown', function(e){

        if(e.code === "Escape"){

            aimCanvas.mode = null;
            return aimCanvas.currentView = "menu";

        }

    })

    this.setSize = function(x, y){

        this.canvas.width = x;
        this.canvas.height = y;
        this.centerLeft = this.canvas.width / 2;
        return this.centerTop = this.canvas.height / 2;

    }

    this.clear = function(){

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    }

    this.controller = function(){

        if(this.currentView === "menu"){




        }

        if(this.currentView === "targetMode"){

            if(this.mode.life <= 0){

            }

            this.mode.addTarget();

        }

        return this.view(this.currentView);

    }

    this.view = function(type){

        this.clear();

        if(type === "menu"){

            aimCanvas.ctx.fillStyle = "#e40700";
            aimCanvas.ctx.textAlign = "center";
            aimCanvas.ctx.textBaseline = "center";
            aimCanvas.ctx.font = "75px Open Sans";
            aimCanvas.ctx.fillText("Start", this.centerLeft, this.centerTop + 40);


        }else if(type === "targetMode"){

            if(this.mode.life === 0){

                aimCanvas.ctx.fillStyle = "#404040";
                aimCanvas.ctx.textAlign = "center";
                aimCanvas.ctx.textBaseline = "center";
                aimCanvas.ctx.font = "50px Open Sans";
                aimCanvas.ctx.fillText("End", this.centerLeft, this.centerTop - 20);
                aimCanvas.ctx.font = "30px Open Sans";
                aimCanvas.ctx.fillText("Score : " + this.mode.score, this.centerLeft, this.centerTop + 20);
                aimCanvas.ctx.fillText("Press ESCAPE", this.centerLeft, this.centerTop + 200);

                aimCanvas.ctx.fillStyle = "#e40700";
                aimCanvas.ctx.textAlign = "center";
                aimCanvas.ctx.textBaseline = "center";
                aimCanvas.ctx.font = "75px Open Sans";
                aimCanvas.ctx.fillText("Start", this.centerLeft, this.centerTop + 40);
                postHighScore();

                
            

                let gameHighScore = this.mode.score;
                let gameAccuracy = this.mode.score/this.mode.shootFail
                let gameUser = document.querySelector("#current-user").innerText
                let currentGameUserId = document.getElementById("userId").value
                let parsedGameUserId = parseInt(currentGameUserId)

                function postHighScore() {

                    
                document.addEventListener('keydown', function(e) {
                    e.preventDefault();
                
                    if(e.code === "Enter") {

                    let formData = {
                        high_score: gameHighScore,
                        accuracy: gameAccuracy
                    }
            
                    let configObj = {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Accept": "application/json"
                        },
                        body: JSON.stringify(formData)
                    }

                    fetch(`${BASE_URL}/users/${parsedGameUserId}/high_scores`, configObj)
                    .then(resp => resp.json())
                    .then(parsedResp => {

                        let highScoreSection = document.querySelector(".high-scores");
                        let highScoreDiv = document.createElement("div");
                        let user = document.createElement("h5");
                        let userHighScore = document.createElement("p")
                        let userAccuracy = document.createElement("p")
                        user.innerText = gameUser;
                        userHighScore.innerText = parsedResp.score;
                        userAccuracy.innerText = parsedResp.accuracy;
                        highScoreSection.appendChild(highScoreDiv);
                        highScoreDiv.appendChild(user);
                        highScoreDiv.appendChild(userHighScore);
                        highScoreDiv.appendChild(userAccuracy)
                    });
                    };
                    aimCanvas.mode = null;
                    return aimCanvas.currentView = "menu";
                });
                };

            }else{

                this.ctx.fillStyle = "#e40700";
                this.ctx.textAlign = "center";
                this.ctx.textBaseline = "center";
                this.ctx.font = "80px Open Sans";
                this.ctx.fillText('♥'.repeat(this.mode.life), 700, 50);

                aimCanvas.ctx.font = "30px Open Sans";
                aimCanvas.ctx.fillText("Score : " + this.mode.score, 100, 50);
                aimCanvas.ctx.fillText("Miss : " + this.mode.shootFail, 100, 75);

                this.mode.getTargets();

            }

        }

        return cursor.show();

    }

}
function mouse(){

    this.color = "green";

    this.show = function(){

        aimCanvas.ctx.fillStyle = this.color;
        aimCanvas.ctx.beginPath();
        aimCanvas.ctx.fillRect(aimCanvas.cursorX, aimCanvas.cursorY, 3, 3);
        aimCanvas.ctx.fillRect(aimCanvas.cursorX, aimCanvas.cursorY - 15, 3, 10);
        aimCanvas.ctx.fillRect(aimCanvas.cursorX + 8, aimCanvas.cursorY, 10, 3);
        aimCanvas.ctx.fillRect(aimCanvas.cursorX, aimCanvas.cursorY+8, 3, 10);
        aimCanvas.ctx.fillRect(aimCanvas.cursorX - 15, aimCanvas.cursorY, 10, 3);
        aimCanvas.ctx.closePath();


    }

}

function targetMode(){

    this.life = 3;
    this.score = 0;
    this.shootFail = 0;
    this.targets = [];
    this.targetsMaxSize = 30;
    this.targetsRapidity = 0.4;
    this.targetsTime = 500 - (this.score * 5);
    this.targetsLastAdd = Date.now();

    this.addTarget = function(){

        if(this.targets.length < 5 && Date.now() > this.targetsLastAdd + this.targetsTime){

            this.targets.push(new target());
            return this.targetsLastAdd = Date.now();

        }

    }

    this.getTargets = function(){

        this.targets.forEach(function(value, index){

            if(value.reset === true && value.size <= 0){

                aimCanvas.mode.targets.splice(index, 1);
                return aimCanvas.mode.life -= 1;

            }

            return value.draw();

        });

    }

}

function target(){

    this.x = rand(aimCanvas.mode.targetsMaxSize, aimCanvas.canvas.width - aimCanvas.mode.targetsMaxSize);
    this.y = rand(aimCanvas.mode.targetsMaxSize, aimCanvas.canvas.height - aimCanvas.mode.targetsMaxSize);
    this.size = 0;
    this.reset = false;




    this.draw = function(){


        if(this.size < aimCanvas.mode.targetsMaxSize && this.reset === false) {

            this.size += aimCanvas.mode.targetsRapidity;

        }else{

            this.reset = true;

            if(this.size - aimCanvas.mode.targetsRapidity < 0){
                return this.size = 0;
            }

            this.size -= aimCanvas.mode.targetsRapidity;

        }

        aimCanvas.ctx.fillStyle = "red";
        aimCanvas.ctx.beginPath();
        aimCanvas.ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        aimCanvas.ctx.closePath();
        aimCanvas.ctx.fill();

        aimCanvas.ctx.fillStyle = "white";
        aimCanvas.ctx.beginPath();
        aimCanvas.ctx.arc(this.x, this.y, this.size/1.5, 0, 2 * Math.PI);
        aimCanvas.ctx.closePath();
        aimCanvas.ctx.fill();

        aimCanvas.ctx.fillStyle = "red";
        aimCanvas.ctx.beginPath();
        aimCanvas.ctx.arc(this.x, this.y, this.size/2.5, 0, 2 * Math.PI);
        aimCanvas.ctx.closePath();
        aimCanvas.ctx.fill();

        
        aimCanvas.ctx.fillStyle = "white";
        aimCanvas.ctx.beginPath();
        aimCanvas.ctx.arc(this.x, this.y, this.size/4, 0, 2 * Math.PI);
        aimCanvas.ctx.closePath();
        aimCanvas.ctx.fill();

        }

}


function rand(min, max){

    return Math.round(Math.random() * (max - min) + min);

}
function sound(){

    this.sound = document.createElement("audio");
    this.sound.src = "gunshot.mp3";
    this.sound.setAttribute("preload", "auto");

    this.play = function(){

        this.sound.play();

    }

}
function run(){

    aimCanvas.controller();
    window.requestAnimationFrame(run);

}


