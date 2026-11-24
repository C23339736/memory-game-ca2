// Mock Firebase so the tests do not connect to the real database
jest.mock('firebase/app', () => ({
    initializeApp: jest.fn(() => ({}))
}));

jest.mock('firebase/firestore', () => ({
    getFirestore: jest.fn(() => ({})),
    collection: jest.fn(() => 'gameResultsCollection'),
    addDoc: jest.fn(() => Promise.resolve()),
    getDocs: jest.fn(),
    serverTimestamp: jest.fn(() => 'SERVER_TIMESTAMP')
}));

import { MemoryGame } from '../main.js';
import { ShapeCard } from '../shapecard.js';
import { addDoc } from 'firebase/firestore';


// Create HTML for the shape-card template
const templateHTML = `
    <template id="shape-card-template">
        <div class="card card-face-down">
            <svg>
                <circle r="40" cx="50" cy="50"></circle>
                <rect height="80" width="80" x="10" y="10"></rect>
                <polygon points="50,11 5,89 95,89"></polygon>
            </svg>
        </div>
    </template>
`;


// Create HTML for four matching cards
const fourCardsHTML = `
    <shape-card type="circle" colour="red"></shape-card>
    <shape-card type="circle" colour="red"></shape-card>
    <shape-card type="square" colour="blue"></shape-card>
    <shape-card type="square" colour="blue"></shape-card>
`;


// Helper function to click a card
function clickCard(card) {
    card.dispatchEvent(new MouseEvent('click', {
        bubbles: true,
        composed: true
    }));
}


// Prepare the game before each test
beforeEach(() => {

    jest.clearAllMocks();

    document.body.innerHTML = templateHTML;

    // Use predictable cards instead of random cards
    jest.spyOn(
        ShapeCard,
        'getUniqueRandomCardsAsHTML'
    ).mockReturnValue(fourCardsHTML);

});


// Restore mocks after each test
afterEach(() => {
    jest.restoreAllMocks();
});


// TEST 1: Check that the correct number of cards is created
test('creates the correct number of cards', () => {

    const game = document.createElement('memory-game');

    game.setAttribute('size', '2x2');

    document.body.appendChild(game);

    const cards = game.querySelectorAll('shape-card');

    expect(cards.length).toBe(4);

});


// TEST 2: Check that clicking a card increases the click counter
test('increases the click counter when a card is clicked', () => {

    const game = document.createElement('memory-game');

    game.setAttribute('size', '2x2');
    document.body.appendChild(game);

    const firstCard = game.querySelector('shape-card');
    
    clickCard(firstCard);
    expect(game.clickCount).toBe(1);

});


// TEST 3: Check that matching cards increase the matched card count
test('increases matched card count when two cards match', () => {

    const game = document.createElement('memory-game');

    game.setAttribute('size', '2x2');
    document.body.appendChild(game);

    const cards = game.querySelectorAll('shape-card');

    clickCard(cards[0]);
    clickCard(cards[1]);

    expect(game.matchedCards).toBe(2);

    expect(cards[0].isFaceUp()).toBe(true);
    expect(cards[1].isFaceUp()).toBe(true);

});


// TEST 4: Check that a completed game is saved to Firestore
test('saves the completed game result to Firestore', () => {

    const game = document.createElement('memory-game');

    game.setAttribute('size', '1x2');

    // Use two matching cards
    jest.spyOn(
        ShapeCard,
        'getUniqueRandomCardsAsHTML'
    ).mockReturnValue(`
        <shape-card type="circle" colour="red"></shape-card>
        <shape-card type="circle" colour="red"></shape-card>
    `);

    document.body.appendChild(game);

    const cards = game.querySelectorAll('shape-card');

    clickCard(cards[0]);
    clickCard(cards[1]);

    expect(addDoc).toHaveBeenCalledWith(
        'gameResultsCollection',
        expect.objectContaining({
            clickCount: 2,
            completedAt: 'SERVER_TIMESTAMP'
        })
    );

});