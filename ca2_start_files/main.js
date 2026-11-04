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
    }
}

// Register the custom element
customElements.define('memory-game', MemoryGame);
