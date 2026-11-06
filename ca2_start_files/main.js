
import { ShapeCard } from './shapecard.js';

export class MemoryGame extends HTMLElement {

    connectedCallback() {

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
        const totalCards = rows * columns;

        console.log('Rows:', rows);
        console.log('Columns:', columns);
        console.log('Total cards:', totalCards);

        // Calculate the number of matching pairs
        const numberOfPairs = totalCards / 2;

        // Generate random cards in matching pairs
        const cardsHTML = ShapeCard.getUniqueRandomCardsAsHTML(
            numberOfPairs,
            true
        );

        // Display the cards in a grid
        this.innerHTML = `
            <style>
                .board {
                    display: grid;
                    grid-template-columns: repeat(${columns}, max-content);
                    gap: 12px;
                    justify-content: center;
                }
            </style>

            <div class="board">
                ${cardsHTML}
            </div>
        `;

        // Create an array to store selected cards
        this.selectedCards = [];

        // Listen for clicks on the game board
        this.addEventListener('click', (event) => {

            // Find the clicked shape-card
            const card = event.target.closest('shape-card');

            // Check if the click was outside a card
            if (!card) {
                return;
            }

            // Do not flip a card that is already face up
            if (card.isFaceUp()) {
                return;
            }

            // Allow only two cards to be selected
            if (this.selectedCards.length >= 2) {
                return;
            }

            // Flip the selected card
            card.flip();

            // Add the card to the selected cards array
            this.selectedCards.push(card);

            console.log('Cards selected:', this.selectedCards.length);

            // Check if two cards have been selected
            if (this.selectedCards.length === 2) {

                // Wait one second before turning cards back
                setTimeout(() => {

                    this.selectedCards.forEach((selectedCard) => {
                        selectedCard.flip();
                    });

                    // Empty the selected cards array
                    this.selectedCards = [];

                    console.log('Ready for the next two cards');

                }, 1000);
            }
        });
    }
}

// Register the custom element
customElements.define('memory-game', MemoryGame);
