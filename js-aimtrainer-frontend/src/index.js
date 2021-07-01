const BASE_URL = "http://127.0.0.1:3000"
const USERS_URL = `${BASE_URL}/users`
const COMMENTS_URL = `${BASE_URL}/comments`
const HIGH_SCORES_URL = `${BASE_URL}/high_scores`

const signUpButton = document.getElementById("signUpButton");
const logInButton = document.getElementById("logInButton");
const logOutButton = document.getElementById("logOutButton")

document.addEventListener("DOMContentLoaded", () => {
    getComments();
    getHighScores();
})

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

function logOut() {

    fetch(`${BASE_URL}/logout`)
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
            commentHeader.innerText = parsedResp.user.username + " said:";
            commentP.innerText = parsedResp.text;
            let commentId = parsedResp.id
            let commentAuthor = parsedResp.user.username;
            commentDeleteButton.addEventListener("click", (e) => {
                let user = document.querySelector("#current-user").innerText;
                if(commentAuthor === user) {
                removeComment(commentId);
                commentsSection.removeChild(e.target.parentElement);
                }
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
    fetch(COMMENTS_URL)
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
            commentHeader.innerText = e.user.username + " said:";
            commentP.innerText = e.text;
            let commentId = e.id
            let commentAuthor = e.user.username;
            commentDeleteButton.addEventListener("click", (e) => {
                let user = document.querySelector("#current-user").innerText;
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

function getHighScores() {
    fetch(HIGH_SCORES_URL)
    .then(resp => resp.json())
    .then(parsedResp => {
        parsedResp.sort((a,b) => b.score - a.score )
        parsedResp.forEach(e => {
            let highScoreSection = document.querySelector(".high-scores");
            let highScoreDiv = document.createElement("div");
            let user = document.createElement("h5");
            let userHighScore = document.createElement("p")
            let userAccuracy = document.createElement("p")
            let accuracyRounded = e.accuracy.toFixed(2)
            user.innerText = e.user.username;
            userHighScore.innerText = "Targets Hit: " + e.score;
            userAccuracy.innerText = "Accuracy: " + accuracyRounded + "%";
            highScoreSection.appendChild(highScoreDiv);
            highScoreDiv.appendChild(user);
            highScoreDiv.appendChild(userHighScore);
            highScoreDiv.appendChild(userAccuracy)

        })
    })
}

function removeComment(commentId) {
    let configObj = { method: "DELETE" };
    fetch(`${BASE_URL}/comments/${commentId}`, configObj);
}
