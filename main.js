import { ShapeCard } from './shapecard.js';

export class MemoryGame extends HTMLElement {

    connectedCallback() {

        // Listen for clicks on the game
        this.addEventListener('click', (event) => {

            // Check if the Play Again button was clicked
            const playAgainButton = event.target.closest('.play-again');

            if (playAgainButton) {
                this.startGame();
                return;
            }

            // Find the clicked shape-card
            const card = event.target.closest('shape-card');

            // Check if the click was outside a card
            if (!card) {
                return;
            }

            // Prevent clicking while checking two cards
            if (this.isChecking) {
                return;
            }

            // Do not flip a card that is already face up
            if (card.isFaceUp()) {
                return;
            }

            // Count the click
            this.clickCount++;

            // Flip the selected card
            card.flip();

            // Add the card to the selected cards array
            this.selectedCards.push(card);

            // Check if two cards have been selected
            if (this.selectedCards.length === 2) {

                const firstCard = this.selectedCards[0];
                const secondCard = this.selectedCards[1];

                // Get the type and colour of both cards
                const firstType = firstCard.getAttribute('type');
                const secondType = secondCard.getAttribute('type');

                const firstColour = firstCard.getAttribute('colour');
                const secondColour = secondCard.getAttribute('colour');

                // Compare both cards
                const isMatch =
                    firstType === secondType &&
                    firstColour === secondColour;

                // Check if the cards match
                if (isMatch) {

                    // Add two to the matched card count
                    this.matchedCards += 2;

                    // Clear the selected cards
                    this.selectedCards = [];

                    // Check if all cards are matched
                    if (this.matchedCards === this.totalCards) {
                        this.showResult();
                    }

                } else {

                    // Prevent selecting more cards
                    this.isChecking = true;

                    // Wait one second before turning cards back
                    setTimeout(() => {

                        firstCard.flip();
                        secondCard.flip();

                        // Empty the selected cards array
                        this.selectedCards = [];

                        // Allow selecting cards again
                        this.isChecking = false;

                    }, 1000);
                }
            }
        });

        // Start the game
        this.startGame();
    }

    startGame() {

        // Get the board size from HTML
        const size = this.getAttribute('size');

        // Split the size into rows and columns
        const dimensions = size.split('x');

        // Convert the values into numbers
        const rows = Number(dimensions[0]);
        const columns = Number(dimensions[1]);

        // Store the board dimensions
        this.rows = rows;
        this.columns = columns;

        // Calculate total number of cards
        this.totalCards = rows * columns;

        // Calculate the number of matching pairs
        const numberOfPairs = this.totalCards / 2;

        // Generate random cards in matching pairs
        const cardsHTML = ShapeCard.getUniqueRandomCardsAsHTML(
            numberOfPairs,
            true
        );

        // Reset game values
        this.selectedCards = [];
        this.matchedCards = 0;
        this.clickCount = 0;
        this.isChecking = false;

        // Display the cards in a grid
        this.innerHTML = `
            <style>
                .board {
                    display: grid;
                    grid-template-columns: repeat(${columns}, max-content);
                    gap: 12px;
                    justify-content: center;
                }

                .result {
                    text-align: center;
                    font-size: 20px;
                    margin-top: 15px;
                }

                .play-again {
                    display: block;
                    margin: 25px auto;
                    padding: 8px 12px;
                    font-size: 16px;
                    cursor: pointer;
                }
            </style>

            <div class="board">
                ${cardsHTML}
            </div>
        `;
    }

    showResult() {

        // Display the final number of clicks
        this.innerHTML = `
            <style>
                .result {
                    text-align: center;
                    font-size: 20px;
                    margin-top: 15px;
                }

                .play-again {
                    display: block;
                    margin: 25px auto;
                    padding: 8px 12px;
                    font-size: 16px;
                    cursor: pointer;
                }
            </style>

            <p class="result">
                You completed the game in ${this.clickCount} clicks!
            </p>

            <button class="play-again">
                Play Again
            </button>
        `;
    }
}

// Register the custom element
customElements.define('memory-game', MemoryGame);
