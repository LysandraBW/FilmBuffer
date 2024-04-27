'use server';
import { processCardData } from '../query/card';
import { randomNumbers } from '../general';
import { PERSON } from '../query/tmdb';
import '../query/tables';

export async function cleanRows(rows) {
    // Use this function to clean up the rows.
    // For now, just return the rows.
    return rows;
}

export async function process(formData) {
    // Maybe you get the x-values given form data.
    // For now, we'll just use random data.
    // I call it xPoints because it looks better than xValues.
    const xPoints = [...randomNumbers(10, 0, 10)];

    // Create query using formData
    // const query = "";
    // const result = await conn.execute(query);    
    // const conn = await db.getConnection({
    //     user: `${user}`,
    //     password: `${pass}`,
    //     connectString: process.env.DB_HOST
    // });

    // const result = await conn.execute("SELECT * FROM voigtc.Starring WHERE characterPlayed = 'Travis Bickle'");

    // Transform data into something more manageable.
    // The data would likely be an array of arrays, where each array represents a trend.
    // It's called trends, but remember that this is a set of sets of y-points, or a set of rows.
    // Think of it whichever way helps.
    // const rows = result.rows;
    const rows = [randomNumbers(10, 0, 100), randomNumbers(10, 0, 100), randomNumbers(10, 0, 100)];
    const trends = await cleanRows(rows);

    // Get the labels for each trend, in the same order of the rows.
    // Not sure how, but you must.
    const trendLabels = ["Trend 1", "Trend 2", "Trend 3"];

    // Now, this is optional. But if you wanted to have a card to show some more
    // information about a trend, this is your opportunity to do so.
    // Since we can't download an image for each and every movie/actor/show, we
    // use an API (TMDB). We also transform the data so that we can immediately
    // insert it into the page, this is all handled in the processCardData function.
    // Provide enough information so that the correct image will be found.
    // I'm not exactly sure of the process of actually getting this data,
    // but this should be the end.
    const cardsData = await processCardData(PERSON, {
        "Trend 1": [
            {
                searchName: "Zendaya",
                cardName: "Zendaya",
                cardInfo: ["20h 15m", 10, 3]
            },
            {
                searchName: "Pedro Pascal",
                cardName: "Pedro Pascal",
                cardInfo: ["50h 06m", 12, 6]
            },
            {
                searchName: "Paul Newman",
                cardName: "Paul Newman",
                cardInfo: ["80h 06m", 18, 1]
            }
        ],
        "Trend 2": [
            {
                searchName: "Robert de Niro",
                cardName: "Robert de Niro",
                cardInfo: ["102h 10m", 30, 0]
            }
        ],
        "Trend 3": [
            {
                searchName: "Marlon Brando",
                cardName: "Marlon Brando",
                cardInfo: ["40h 44m", 26, 0]
            }
        ]
    });

    // Presumably, we've gathered all the required data, and we're ready to
    // spit it back out.
    return {
        "x_points": xPoints,
        "trends": trends,
        "trend_labels": trendLabels,
        "cards": cardsData
    }
}