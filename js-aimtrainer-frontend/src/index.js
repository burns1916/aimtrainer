const BASE_URL = "http://127.0.0.1:3000/"
const USERS_URL = `${BASE_URL}/users`
const COMMENTS_URL = `${BASE_URL}/comments`
const HIGH_SCORE_URL = `${BASE_URL}/high_scores`

document.addEventListener("DOMContentLoaded", () => {

    fetch(COMMENTS_URL)
    .then(response => response.json())
    .then(json => renderComments(json));
});

function renderComments(jsonObject) {
    for (const)
}