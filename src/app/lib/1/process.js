'use server';
import { processCard2D } from '../query/card';
import { randomNumbers } from '../general';
import { MOVIE, PERSON } from '../query/tmdb';
import { DB_HOST, DB_PASS, DB_USER } from '@/info';
import { MEDIA, CREW_MEMBER, WORKED_ON, GENRES } from '../query/tables';
import { sortFunction } from '../general';
import '../query/tables';

const db = require('oracledb');
db.outFormat = db.OUT_FORMAT_OBJECT;

export async function process(formData) {
    const invalid = (val) => {
        return val == null || val == "";
    }

    if (invalid(formData["runtime"]) || invalid(formData["number_votes"]) || invalid(formData["genre"]) || 
        invalid(formData["interval"]) || invalid(formData["min_year"]) || invalid(formData["max_year"]) ||
        invalid(formData["metric"])) {
        return null;
    }

    const conn = await db.getConnection({
        user: DB_USER,
        password: DB_PASS,
        connectString: DB_HOST
    });

    const result = await conn.execute(`
        SELECT DECADE, t.genre, AVG(t.runtime) AS AVERAGERUNTIME, AVG(t.numVotes) AS AVERAGENUMVOTES, AVG(avgrating) AS AVERAGERATING
        FROM (
            SELECT FLOOR(m.startyear/${formData["interval"]})*${formData["interval"]} as DECADE, m.runtime as runtime, m.numberofvotes as numvotes, m.averagerating as avgrating, g.genre as genre
            FROM ${MEDIA} m, ${GENRES} g
            WHERE m.tconst = g.tconst
            AND m.runtime > ${formData["runtime"]}
            AND m.numberofvotes > ${formData["number_votes"]}
            AND m.startyear >= ${formData["min_year"]}
            AND m.startyear <= ${formData["max_year"]}
            ORDER BY FLOOR(m.startyear/${formData["min_year"]}),
            g.genre, m.runtime
        ) t
        GROUP BY t.decade, t.genre
        ORDER BY t.decade, AVG(t.runtime)
    `);
    

    const rows = result.rows;

    // Sort by genre
    let allDecades = {};
    const rowsByGenre = {};
    rows.forEach((row) => {
        if (rowsByGenre[row["GENRE"]] == null) {
            rowsByGenre[row["GENRE"]] = [];
        }
        rowsByGenre[row["GENRE"]].push(row);
        allDecades[row["DECADE"]] = {};
    });
    
    allDecades = Object.keys(allDecades);
    Object.keys(rowsByGenre).forEach((genre) => {
        allDecades.forEach((decade) => {
            let found = false;
            rowsByGenre[genre].forEach((gDecade) => {
                if (gDecade["DECADE"] == decade) {
                    found = true;
                }
            });
            if (!found) {
                rowsByGenre[genre].push({
                    "DECADE": decade,
                    "GENRE": genre,
                    "AVERAGERUNTIME": 0,
                    "AVERAGENUMVOTES": 0,
                    "AVERAGERATING": 0
                });
            }
        });
    })

    const x_points = allDecades;
    const y_points = [];
    const trendLabels = [];
    const cards = {};

    for (const genre of Object.keys(rowsByGenre)) {
        let trend = [];
        if (formData["genre"].find((e) => e[0] == genre) != undefined || formData["genre"].find((e) => e[1] == "All")) {
            rowsByGenre[genre].sort((a, b) => a["DECADE"] - b["DECADE"]);
            rowsByGenre[genre].forEach((decade) => {
                trend.push(Math.round(decade[`${formData.metric}`]));
            });
            trendLabels.push(genre);
            y_points.push(trend);

            for (const decade of rowsByGenre[genre]) {
                const res = await conn.execute(`
                    SELECT *
                    FROM ${MEDIA}
                    NATURAL JOIN ${GENRES}
                    WHERE startYear >= ${decade["DECADE"]}
                    AND startYear <= ${parseInt(decade["DECADE"]) + parseInt(formData["interval"]) - 1}
                    AND genre = '${genre}'
                    AND titleType = 'movie'
                    ORDER BY numberOfVotes DESC, averageRating DESC
                    FETCH FIRST 10 ROWS ONLY
                `);

                let rows = res.rows;

                if (cards[genre] == undefined) {
                    cards[genre] = {};
                }

                cards[genre][decade["DECADE"]] = rows.map((row) => (
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

    const cardsData = await processCard2D(MOVIE, cards);
    await conn.close();

    return {
        "x_points": x_points,
        "trends": y_points,
        "trend_labels": trendLabels,
        "cards": cardsData
    }
}