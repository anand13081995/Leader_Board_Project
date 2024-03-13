document.addEventListener("DOMContentLoaded", function () {
    const scoreboardContainer = document.querySelector(".main_scoreboard-wrapper");
    const form = document.querySelector(".main_form");
    const errorPrompter = document.querySelector(".main_error-prompter");

    let playerDetails = []; // Initialize playerDetails array

    // Load player details from local storage on page load
    loadPlayerDetailsFromStorage();

    function savePlayerDetailsToStorage() {
        localStorage.setItem("playerDetails", JSON.stringify(playerDetails));
    }

    function createScoreboardElement(firstName, lastName, country, score) {
        const scoreboardElement = document.createElement("div");
        scoreboardElement.classList.add("main_scoreboard");
        scoreboardElement.style.backgroundColor = "green";

        const playerDetailsDiv = document.createElement("div");
        playerDetailsDiv.classList.add("main_player-details");

        const playerName = document.createElement("p");
        playerName.classList.add("main_player-name");
        playerName.textContent = `${firstName} ${lastName}`;
        playerDetailsDiv.appendChild(playerName);

        const timeStamp = document.createElement("p");
        timeStamp.classList.add("main_time-stamp");
        timeStamp.textContent = generateDateAndTime();
        playerDetailsDiv.appendChild(timeStamp);

        const countryElement = document.createElement("p");
        countryElement.classList.add("main_player-country");
        countryElement.textContent = country;
        playerDetailsDiv.appendChild(countryElement);

        const scoreElement = document.createElement("p");
        scoreElement.classList.add("main_player-score");
        scoreElement.textContent = score;
        playerDetailsDiv.appendChild(scoreElement);

        scoreboardElement.appendChild(playerDetailsDiv);

        const buttonsContainer = document.createElement("div");
        buttonsContainer.classList.add("main_scoreboard-btn-container");

        const deleteButton = document.createElement("button");
        deleteButton.classList.add("delete-btn");
        deleteButton.innerHTML = "&#x1f5d1;";
        buttonsContainer.appendChild(deleteButton);

        const plusButton = document.createElement("button");
        plusButton.textContent = "+5";
        buttonsContainer.appendChild(plusButton);

        const minusButton = document.createElement("button");
        minusButton.textContent = "-5";
        buttonsContainer.appendChild(minusButton);

        deleteButton.addEventListener("click", function () {
            const confirmDelete = confirm("Do you want to permanently delete this item?");
            if (confirmDelete) {
                scoreboardElement.remove();
                // Remove the player details from the array
                playerDetails = playerDetails.filter(player => !(player.firstName === firstName && player.lastName === lastName));
                // Save the updated player details to local storage
                savePlayerDetailsToStorage();
            }
        });

        plusButton.addEventListener("click", function () {
            let currentScore = parseInt(scoreElement.textContent);
            scoreElement.textContent = currentScore + 5;
            sortScoreBoard();
            updatePlayerScore(firstName, lastName, currentScore + 5);
        });

        minusButton.addEventListener("click", function () {
            let currentScore = parseInt(scoreElement.textContent);
            if (currentScore >= 5) {
                scoreElement.textContent = currentScore - 5;
                sortScoreBoard();
                updatePlayerScore(firstName, lastName, currentScore - 5);
            }
        });

        scoreboardElement.appendChild(buttonsContainer);

        return scoreboardElement;
    }

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const firstName = form.children[0].value.trim();
        const lastName = form.children[1].value.trim();
        const country = form.children[2].value.trim();
        const score = parseInt(form.children[3].value.trim());

        if (firstName === '' || lastName === '' || country === '' || isNaN(score)) {
            errorPrompter.textContent = "All fields are required and score must be a number.";
            errorPrompter.style.display = "block";
            return;
        }

        const scoreboardElement = createScoreboardElement(firstName, lastName, country, score);
        scoreboardContainer.appendChild(scoreboardElement);

        // Add the new player details to the array and local storage
        playerDetails.push({ firstName, lastName, country, score });
        savePlayerDetailsToStorage();

        sortScoreBoard();
        form.reset();
        errorPrompter.style.display = "none";
    });

    function loadPlayerDetailsFromStorage() {
        const savedPlayerDetails = JSON.parse(localStorage.getItem("playerDetails"));
        if (savedPlayerDetails) {
            playerDetails = savedPlayerDetails;

            // Clear existing scoreboard elements
            scoreboardContainer.innerHTML = "";

            // Loop through saved player details and create scoreboard elements
            playerDetails.forEach(player => {
                const scoreboardElement = createScoreboardElement(player.firstName, player.lastName, player.country, player.score);
                scoreboardContainer.appendChild(scoreboardElement);
            });

            sortScoreBoard(); // Update the leaderboard
        }
    }

    function sortScoreBoard() {
        const scoreboardElements = Array.from(scoreboardContainer.querySelectorAll(".main_scoreboard"));
        scoreboardElements.sort((a, b) => {
            const scoreA = parseInt(a.querySelector(".main_player-score").textContent);
            const scoreB = parseInt(b.querySelector(".main_player-score").textContent);
            return scoreB - scoreA;
        });

        scoreboardContainer.innerHTML = "";

        scoreboardElements.forEach(scoreboardElement => {
            scoreboardContainer.appendChild(scoreboardElement);
        });
    }

    function generateDateAndTime() {
        let dateObject = new Date();
        let month = dateObject.toLocaleString("default", { month: "short" });
        let day = dateObject.getDate();
        let year = dateObject.getFullYear();
        let time = dateObject.toLocaleTimeString().slice(0, 8);

        return `${month} ${day}, ${year} ${time}`;
    }

    function updatePlayerScore(firstName, lastName, newScore) {
        // Update the player score in the array and local storage
        playerDetails.forEach(player => {
            if (player.firstName === firstName && player.lastName === lastName) {
                player.score = newScore;
            }
        });
        savePlayerDetailsToStorage();
    }
});
