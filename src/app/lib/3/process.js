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

export async function processNonGroup(formData) {
    
    const conn = await db.getConnection({
        user: DB_USER,
        password: DB_PASS,
        connectString: DB_HOST
    });

    const result = await conn.execute(`
        SELECT m.StartYear AS ReleaseYear,
        m.Tconst AS TitleIdentifier,
        m.PrimaryTitle AS TitleName,
        m.AverageRating AS AVERAGERATING,
        m.NumberOfVotes AS AVERAGENUMVOTES,
        m.runtime AS AVERAGERUNTIME
        FROM ${WORKED_ON} wo1
        JOIN ${WORKED_ON} wo2 ON wo1.Tconst = wo2.Tconst
        JOIN ${MEDIA} m ON m.Tconst = wo1.Tconst
        JOIN ${CREW_MEMBER} cm1 ON wo1.Nconst = cm1.Nconst
        JOIN ${CREW_MEMBER} cm2 ON wo2.Nconst = cm2.Nconst
        WHERE cm1.PrimaryName = '${formData["name1"][1]}' AND cm2.PrimaryName = '${formData["name2"][1]}'
        GROUP BY m.StartYear, m.Tconst, m.PrimaryTitle, m.AverageRating, m.NumberOfVotes, m.runtime
        ORDER BY m.StartYear, m.Tconst
    `);

    const rows = result.rows;

    const x_points = [];
    const y_points = [];

    rows.forEach((row) => {
        x_points.push(row["RELEASEYEAR"]);
        y_points.push(row[`${formData.metric}`]);
    });

    const cards = {};
    cards["Collab"] = [];
    rows.forEach((row) => {
        cards["Collab"].push({
            searchName: row["TITLENAME"],
            cardName: row["TITLENAME"],
            searchYear: row["RELEASEYEAR"],
            cardInfo: [`${row["AVERAGERUNTIME"]}m`, `${row["AVERAGERATING"]}/10`, row["RELEASEYEAR"]]
        });
    });

    const trendLabels = ["Collab"];
    
    const cardsData = await processCardData(MOVIE, cards);
    await conn.close();
    return {
        "x_points": x_points,
        "trends": [y_points],
        "trend_labels": trendLabels,
        "cards": cardsData
    }
}

export async function processGroup(formData) {
    const invalid = (val) => {
        return val == null || val == "" || val.length == 0;
    }

    if (invalid(formData["genre"])) {
        return null;
    }

    const conn = await db.getConnection({
        user: DB_USER,
        password: DB_PASS,
        connectString: DB_HOST
    });


    const query = `
        SELECT a.ReleaseYear, AVG(a.TitleRating) AS AVERAGERATING, AVG(b.Runtime) AS AVERAGERUNTIME, AVG(b.NumberOfVotes) AS AVERAGENUMVOTES, c.Genre FROM 
        (
            SELECT m.StartYear AS ReleaseYear,
            m.Tconst AS TitleIdentifier,
            m.PrimaryTitle AS TitleName,
            m.AverageRating AS TitleRating
            FROM ${WORKED_ON} wo1
            JOIN ${WORKED_ON} wo2 ON wo1.Tconst = wo2.Tconst
            JOIN ${MEDIA} m ON m.Tconst = wo1.Tconst
            JOIN ${CREW_MEMBER} cm1 ON wo1.Nconst = cm1.Nconst
            JOIN ${CREW_MEMBER} cm2 ON wo2.Nconst = cm2.Nconst
            WHERE cm1.PrimaryName = '${formData["name1"][1]}' AND cm2.PrimaryName = '${formData["name2"][1]}'
            GROUP BY m.StartYear, m.Tconst, m.PrimaryTitle, m.AverageRating
            ORDER BY m.StartYear, m.Tconst
            ) a
        JOIN ${MEDIA} b ON a.TitleIdentifier = b.Tconst
        JOIN ${GENRES} c ON a.TitleIdentifier = c.Tconst
        GROUP BY a.ReleaseYear, c.Genre
        ORDER BY a.ReleaseYear
    `;

    const result = await conn.execute(query);
    

    const rows = result.rows;

    // Sort by genre
    let allYears = {};
    const rowsByGenre = {};
    rows.forEach((row) => {
        if (rowsByGenre[row["GENRE"]] == null) {
            rowsByGenre[row["GENRE"]] = [];
        }
        rowsByGenre[row["GENRE"]].push(row);
        allYears[parseInt(row["RELEASEYEAR"])] = {};
    });

    allYears = Object.keys(allYears);
    Object.keys(rowsByGenre).forEach((genre) => {
        allYears.forEach((year) => {
            let found = false;
            rowsByGenre[genre].forEach((gyear) => {
                if (gyear["RELEASEYEAR"] == year) {
                    found = true;
                }
            });
            if (!found) {
                rowsByGenre[genre].push({
                    "RELEASEYEAR": year,
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
            rowsByGenre[genre].sort((a, b) => a["RELEASEYEAR"] - b["RELEASEYEAR"]);
            rowsByGenre[genre].forEach((year) => {
                trend.push(Math.round(year[`${formData.metric}`]));
            });
            trendLabels.push(genre);
            y_points.push(trend);

            
            
            for (const year of rowsByGenre[genre]) {
                const res = await conn.execute(`
                    SELECT m.StartYear AS ReleaseYear,
                    m.Tconst AS TitleIdentifier,
                    m.PrimaryTitle AS TitleName,
                    m.AverageRating AS TitleRating,
                    m.runtime AS Runtime,
                    c.Genre AS Genre
                    FROM ${WORKED_ON} wo1
                    JOIN ${WORKED_ON} wo2 ON wo1.Tconst = wo2.Tconst
                    JOIN ${MEDIA} m ON m.Tconst = wo1.Tconst
                    JOIN ${CREW_MEMBER} cm1 ON wo1.Nconst = cm1.Nconst
                    JOIN voigtc.CrewMember cm2 ON wo2.Nconst = cm2.Nconst
                    JOIN ${GENRES} c ON m.Tconst = c.Tconst
                    WHERE cm1.PrimaryName = '${formData.name1[1]}' AND cm2.PrimaryName = '${formData.name2[1]}'
                    AND c.genre = '${genre}'
                    AND m.StartYear = ${year["RELEASEYEAR"]}
                    GROUP BY m.StartYear, m.Tconst, m.PrimaryTitle, m.AverageRating, c.Genre, m.runtime
                    ORDER BY m.StartYear, m.Tconst
                `);

                let rows = res.rows;

                
                if (cards[genre] == undefined) {
                    cards[genre] = {};
                }

                if (rows.length == 0) {
                    cards[genre][year["RELEASEYEAR"]] = [{
                        searchName: "",
                        cardName: "No Content",
                        searchYear: "",
                        cardInfo: ["-", "-", "-", "-"]
                    }];
                }
                else {
                    cards[genre][year["RELEASEYEAR"]] = rows.map((row) => (
                        {
                            searchName: row["TITLENAME"],
                            cardName: row["TITLENAME"],
                            searchYear: row["RELEASEYEAR"],
                            cardInfo: [`${row["RUNTIME"]}m`, `${row["TITLERATING"]}/10`, row["GENRE"], row["RELEASEYEAR"]]
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

export async function process(formData) {
    const invalid = (val) => {
        return val == null || val == "" || val.length == 0;
    }

    if (invalid(formData["name1"][1]) || invalid(formData["name2"][1]) || invalid(formData["metric"])) {
        return null;
    }

    if (formData["group"] == "Y") {
        
        return processGroup(formData);
    }
    return processNonGroup(formData);
}