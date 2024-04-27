'use server';
import {PRIMARY_PROFESSION, CREW_MEMBER, GENRES, MEDIA, WORKED_ON} from '../lib/query/tables';
import { DB_HOST, DB_PASS, DB_USER } from '@/info';
const db = require('oracledb');
db.outFormat = db.OUT_FORMAT_OBJECT;

export async function getActors() {
    const conn = await db.getConnection({
        user: DB_USER,
        password: DB_PASS,
        connectString: DB_HOST
    });

    const result = await conn.execute(`
        SELECT * 
        FROM ${PRIMARY_PROFESSION} 
        NATURAL JOIN 
        ${CREW_MEMBER} 
        WHERE profession = 'actor' OR profession = 'actress'
    `);
    
    let rows = result.rows;
    rows = rows.map((row) => (
        [row["NCONST"], row["PRIMARYNAME"]]
    ));

    await conn.close();
    return rows;
}

export async function getGenres() {
    const conn = await db.getConnection({
        user: DB_USER,
        password: DB_PASS,
        connectString: DB_HOST
    });

    const result = await conn.execute(`
        SELECT DISTINCT Genre
        FROM ${GENRES}
    `);

    let rows = result.rows;
    rows = rows.map((row) => (
        [row["GENRE"], row["GENRE"]]
    ));

    await conn.close();
    return rows;
}

export async function getCrewMembers() {
    const conn = await db.getConnection({
        user: DB_USER,
        password: DB_PASS,
        connectString: DB_HOST
    });

    const result = await conn.execute(`
        SELECT Nconst, PrimaryName
        FROM ${CREW_MEMBER}
    `);

    let rows = result.rows;
    rows = rows.map((row) => (
        [row["NCONST"], row["PRIMARYNAME"]]
    ));

    await conn.close();
    return rows;
}

export async function getTVShows() {
    const conn = await db.getConnection({
        user: DB_USER,
        password: DB_PASS,
        connectString: DB_HOST
    });

    const result = await conn.execute(`
        SELECT Tconst, primaryTitle
        FROM ${MEDIA} m
        WHERE m.titleType = 'tvSeries'
    `);

    let rows = result.rows;
    rows = rows.map((row) => (
        [row["TCONST"], row["PRIMARYTITLE"]]
    ));

    await conn.close();
    return rows;
}

export async function getMovies() {
    const conn = await db.getConnection({
        user: DB_USER,
        password: DB_PASS,
        connectString: DB_HOST
    });

    const result = await conn.execute(`
        SELECT Tconst, primaryTitle
        FROM ${MEDIA} m
        WHERE m.titleType = 'movie'
    `);

    let rows = result.rows;
    rows = rows.map((row) => (
        [row["TCONST"], row["PRIMARYTITLE"]]
    ));

    await conn.close();
    return rows;
}

export async function getWorks(name) {
    const conn = await db.getConnection({
        user: DB_USER,
        password: DB_PASS,
        connectString: DB_HOST
    });

    const result = await conn.execute(`
        SELECT *
        FROM ${CREW_MEMBER}
        NATURAL JOIN ${WORKED_ON}
        NATURAL JOIN ${MEDIA}
        WHERE primaryName = '${name}'
    `);

    let rows = result.rows;
    rows = rows.map((row) => (
        [row["TCONST"], row["PRIMARYTITLE"]]
    ));

    await conn.close();
    return rows;
}