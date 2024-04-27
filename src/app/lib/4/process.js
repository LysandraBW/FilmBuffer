'use server';
import { processCardData } from '../query/card';
import { randomNumbers } from '../general';
import { PERSON } from '../query/tmdb';
import { DB_HOST, DB_PASS, DB_USER } from '@/info';
import { MEDIA, CREW_MEMBER, WORKED_ON, STARRING } from '../query/tables';
import { sortFunction } from '../general';
import '../query/tables';

const db = require('oracledb');
db.outFormat = db.OUT_FORMAT_OBJECT;

export async function process(formData) {
    if (formData["actors"][0] == undefined || formData["weigh"] == null || formData["weigh"] == "") {
        return null;
    }

    const conn = await db.getConnection({
        user: DB_USER,
        password: DB_PASS,
        connectString: DB_HOST
    });

    let x_points = {};
    let y_points = [];

    const trendLabels = [];
    let cards = {};

    for (let i = 0; i < formData.actors.length; i++) {
        trendLabels.push(formData.actors[i][1]);

        const result = await conn.execute(`
            SELECT ReleaseYear, TotalRuntime * Weigh AS RESULT FROM (  
                SELECT m.StartYear AS ReleaseYear,
                SUM(m.Runtime) AS TotalRuntime
                FROM ${MEDIA} m
                JOIN ${WORKED_ON} wo ON m.Tconst = wo.Tconst
                JOIN ${CREW_MEMBER} cm ON wo.Nconst = cm.Nconst
                WHERE cm.PrimaryName = '${formData.actors[i][1]}'
                GROUP BY m.StartYear
                ORDER BY m.StartYear, TotalRuntime DESC
            ) a
            NATURAL JOIN (
                SELECT m.StartYear AS ReleaseYear,
                ${formData.weigh} AS Weigh
                FROM ${MEDIA} m
                JOIN ${WORKED_ON} wo ON m.Tconst = wo.Tconst
                JOIN ${CREW_MEMBER} cm ON wo.Nconst = cm.Nconst
                WHERE cm.PrimaryName = '${formData.actors[i][1]}'
                GROUP BY m.StartYear
                ORDER BY m.StartYear
            )
        `);

        let rows = result.rows;

        rows.forEach((row) => {
            x_points[row["RELEASEYEAR"]] = 0;
        });

        let y = rows.map((row) => [row["RELEASEYEAR"], row["RESULT"]]);

        const longestRuntimeResult = await conn.execute(`
            SELECT PrimaryTitle, Runtime FROM ${STARRING}
            NATURAL JOIN ${MEDIA}
            WHERE Runtime IS NOT NULL
            AND CrewMember_Nconst = '${formData.actors[i][0]}'
            ORDER BY Runtime DESC
            FETCH FIRST 1 ROWS ONLY
        `);

        
        const longestRuntime = longestRuntimeResult.rows[0]["PRIMARYTITLE"] + ", Longest Runtime: " + longestRuntimeResult.rows[0]["RUNTIME"];

        const highestRatingResult = await conn.execute(`
            SELECT PrimaryTitle, AverageRating FROM ${STARRING}
            NATURAL JOIN ${MEDIA}
            WHERE AverageRating IS NOT NULL
            AND CrewMember_Nconst = '${formData.actors[i][0]}'
            ORDER BY AverageRating DESC
            FETCH FIRST 1 ROWS ONLY
        `);

        const highestRating = highestRatingResult.rows[0]["PRIMARYTITLE"] + ", Average Rating: " + highestRatingResult.rows[0]["AVERAGERATING"];

        const mostPopularResult = await conn.execute(`
            SELECT PrimaryTitle, NumberOfVotes FROM ${STARRING}
            NATURAL JOIN ${MEDIA}
            WHERE NumberOfVotes IS NOT NULL
            AND CrewMember_Nconst = '${formData.actors[i][0]}'
            ORDER BY NumberOfVotes DESC
            FETCH FIRST 1 ROWS ONLY
        `);

        const mostPopular = mostPopularResult.rows[0]["PRIMARYTITLE"] + ", Number Votes: " + mostPopularResult.rows[0]["NUMBEROFVOTES"];

        cards[formData.actors[i][1]] =  [{
            searchName: formData.actors[i][1],
            cardName: formData.actors[i][1],
            cardInfo: [longestRuntime, highestRating, mostPopular]
        }];
   
        y_points.push(y);
    }
    
    x_points = Object.keys(x_points);

    for (const x_point of x_points) {
        y_points.forEach((trend) => {
            if (trend.find((e) => e[0] == x_point) == undefined) {
                trend.push([x_point, 0]);
            }
        });
    }

    y_points.forEach((trend) => {
        trend.sort((a, b) => {
            return a[0] - b[0];
        })
    });    
    
    const cardsData = await processCardData(PERSON, cards);

    await conn.close();

    return {
        "x_points": x_points,
        "trends": y_points,
        "trend_labels": trendLabels,
        "cards": cardsData
    }
}