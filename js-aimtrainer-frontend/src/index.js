const BASE_URL = "http://127.0.0.1:3000"
const USERS_URL = `${BASE_URL}/users`
const COMMENTS_URL = `${BASE_URL}/comments`
const HIGH_SCORE_URL = `${BASE_URL}/high_scores`

const signUpButton = document.getElementById("signUpButton");
const logInButton = document.getElementById("logInButton");

signUpButton.addEventListener("click", (e) => {
    signUp(e);
})

logInButton.addEventListener("click", (e) => {
    logIn(e);
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
            const currentUser = document.querySelector("#current-user");
            currentUser.innerText = parsedResp.username;
        }
    });
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

    fetch(`${BASE_URL}/users`, configObj)
    .then(resp => resp.json())
    .then(parsedResp => {
        if(parsedResp.username) {
            const currentUser = document.querySelector("#current-user");
            currentUser.innerText = parsedResp.username;
        }
    });
}