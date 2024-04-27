'use server';
import { getImagePath } from "./tmdb";

export async function processCardData(type, cardsData) {
    const pCardsData = {};

    for (const cardsName of Object.keys(cardsData)) {
        const cards = cardsData[cardsName];
        pCardsData[cardsName] = [];

        for (const card of cards) {
            const imagePath = await getImagePath(type, card.searchName, card.searchYear);
            pCardsData[cardsName].push({
                name: card.cardName,
                image: imagePath,
                info: card.cardInfo
            });
        }
    }
    return pCardsData;
}

export async function processCard2D(type, cardsData) {
    const CARDS = {};
    
    for (const cardName of Object.keys(cardsData)) {
        CARDS[cardName] = [];
        const cards = cardsData[cardName];
        let subCards = [];
        for (const cardType of Object.keys(cards)) {
            subCards = [];
            for (const card of cards[cardType]) {
                const imagePath = await getImagePath(type, card.searchName, card.searchYear);
                subCards.push({
                    name: card.cardName,
                    image: imagePath,
                    info: card.cardInfo
                });
            }
            CARDS[cardName].push(subCards);
        }
    }

    return CARDS;
}