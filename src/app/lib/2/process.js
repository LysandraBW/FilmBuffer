'use server';
import { processCardData, processCard2D } from '../query/card';
import { randomNumbers } from '../general';
import { PERSON, MOVIE } from '../query/tmdb';
import { DB_HOST, DB_PASS, DB_USER } from '@/info';
import { MEDIA, CREW_MEMBER, WORKED_ON, GENRES } from '../query/tables';
import { sortFunction } from '../general';
import '../query/tables';

const db = require('oracledb');
db.outFormat = db.OUT_FORMAT_OBJECT;

export async function process(formData) {
    const invalid = (val) => {
        return val == null || val == "" || val.length == 0;
    }

    if (invalid(formData["genre"]) || invalid(formData["metric"]) || invalid(formData["name"])) {
        return null;
    }

    const conn = await db.getConnection({
        user: DB_USER,
        password: DB_PASS,
        connectString: DB_HOST
    });

    const result = await conn.execute(`
        SELECT m.StartYear, AVG(m.AverageRating) AS AverageRating, AVG(m.runtime) AS AverageRuntime, AVG(m.NumberOfVotes) AS AverageNumVotes, g.genre
        FROM ${MEDIA} m 
        NATURAL JOIN ${WORKED_ON} wo
        NATURAL JOIN ${CREW_MEMBER} cm
        NATURAL JOIN ${GENRES} g
        WHERE cm.PrimaryName = '${formData.name[1]}' 
        GROUP BY m.StartYear, g.genre
        ORDER BY m.StartYear 
    `);
    
    const rows = result.rows;

    // Sort by genre
    let allYears = {};
    const rowsByGenre = {};
    rows.forEach((row) => {
        if (rowsByGenre[row["GENRE"]] == null) {
            rowsByGenre[row["GENRE"]] = [];
        }
        rowsByGenre[row["GENRE"]].push(row);
        allYears[parseInt(row["STARTYEAR"])] = {};
    });

    allYears = Object.keys(allYears);
    Object.keys(rowsByGenre).forEach((genre) => {
        allYears.forEach((year) => {
            let found = false;
            rowsByGenre[genre].forEach((gyear) => {
                if (gyear["STARTYEAR"] == year) {
                    found = true;
                }
            });
            if (!found) {
                rowsByGenre[genre].push({
                    "STARTYEAR": year,
                    "GENRE": genre,
                    "AVERAGERUNTIME": 0,
                    "AVERAGENUMVOTES": 0,
                    "AVERAGERATING": 0
                });
            }
        });
    });

    const x_points = allYears;
    const y_points = [];
    const trendLabels = [];
    const cards = {};

    for (const genre of Object.keys(rowsByGenre)) {
        let trend = [];

        if (formData["genre"].find((e) => e[0] == genre) != undefined || formData["genre"].find((e) => e[1] == "All")) {
            rowsByGenre[genre].sort((a, b) => a["STARTYEAR"] - b["STARTYEAR"]);
            rowsByGenre[genre].forEach((year) => {
                trend.push(Math.round(year[`${formData.metric}`]));
            });
            trendLabels.push(genre);
            y_points.push(trend);
            
            for (const year of rowsByGenre[genre]) {
                const res = await conn.execute(`
                    SELECT *
                    FROM ${MEDIA}
                    NATURAL JOIN ${WORKED_ON}
                    NATURAL JOIN ${GENRES}
                    WHERE startYear = ${year["STARTYEAR"]}
                    AND genre = '${genre}'
                    AND titleType = 'movie'
                    AND nconst = '${formData.name[0]}'
                    ORDER BY numberOfVotes DESC, averageRating DESC
                    FETCH FIRST 2 ROWS ONLY
                `);

                let rows = res.rows;

                if (cards[genre] == undefined) {
                    cards[genre] = {};
                }

                if (rows.length == 0) {
                    cards[genre][year["STARTYEAR"]] = [{
                        searchName: "",
                        cardName: "No Content",
                        searchYear: "",
                        cardInfo: ["-", "-", "-", "-"]
                    }];
                }
                else {
                    cards[genre][year["STARTYEAR"]] = rows.map((row) => (
                        {
                            searchName: row["PRIMARYTITLE"],
                            cardName: row["PRIMARYTITLE"],
                            searchYear: row["STARTYEAR"],
                            cardInfo: [`${row["RUNTIME"]}m`, `${row["AVERAGERATING"]}/10`, row["GENRE"], row["STARTYEAR"]]
                        }
                    ));
                }
            }
        }
    }

    const cardsData = await processCard2D(MOVIE, cards);
    
    await conn.close();
    return {
        "x_points": x_points,
        "trends": y_points,
        "trend_labels": trendLabels,
        "cards": cardsData
    }
}