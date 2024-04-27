'use server';
import { processCard2D } from '../query/card';
import { randomNumbers } from '../general';
import { PERSON, TV_SHOW as LOL} from '../query/tmdb';
import '../query/tables';
import './query5';
import { DB_HOST, DB_PASS, DB_USER } from '@/info';
import { getnamedTVShow } from './query5';
import { TV_SHOW, EPISODES, EPISODE_CREW } from '../query/tables';

const db = require('oracledb');
db.outFormat = db.OUT_FORMAT_OBJECT;

export async function process(formData) {
    const invalid = (val) => {
        return val == null || val == "" || val.length == 0;
    }

    if (invalid(formData["tv_show"]) || invalid(formData["crew_member"]) || invalid(formData["type"])) {
        return null;
    }

    const conn = await db.getConnection({
        user: DB_USER,
        password: DB_PASS,
        connectString: DB_HOST
    });

    let X = {};
    let Y = [];

    let TRENDLABELS = [];
    let _CARDS = {};

    for (let i = 0; i < formData.crew_member.length; i++) {
        TRENDLABELS.push(formData.crew_member[i][1]);

        const query = `
        SELECT epcrew.name as Writer_name, ep.season_number, ep.episode_number, ep.primary_Title as episode_name, ep.avg_rating as average_rating
        FROM ${TV_SHOW} tv, ${EPISODES} ep, ${EPISODE_CREW} epcrew
        Where tv.tconst = ep.ParentTV_Tconst
        AND ep.episode_tconst = epcrew.tconst
        AND tv.tconst = '${formData["tv_show"][0]}'
        AND epcrew.name = '${formData["crew_member"][i][1]}'
        ORDER BY epcrew.nconst, ep.season_number, ep.episode_number     
        `;
        
        const result = await conn.execute(query);

        let rows = result.rows;
        rows.forEach((row) => {
            
            const sznNumber = parseInt(row["SEASON_NUMBER"]) < 10 ? 0 + row["SEASON_NUMBER"] : row["SEASON_NUMBER"];
            const epiNumber = parseInt(row["EPISODE_NUMBER"]) < 10 ? 0 + row["EPISODE_NUMBER"] : row["EPISODE_NUMBER"];
            X[`S${sznNumber}E${epiNumber}`] = 0;
        });

        let _y = [];
        rows.forEach((row) => {
            
            const sznNumber = parseInt(row["SEASON_NUMBER"]) < 10 ? 0 + row["SEASON_NUMBER"] : row["SEASON_NUMBER"];
            const epiNumber = parseInt(row["EPISODE_NUMBER"]) < 10 ? 0 + row["EPISODE_NUMBER"] : row["EPISODE_NUMBER"];
            _y.push([`S${sznNumber}E${epiNumber}`, row["AVERAGE_RATING"]]);
        });

        Y.push(_y);

        rows.map((row, index) => {
            if (_CARDS[formData["crew_member"][i][1]] == null) {
                _CARDS[formData["crew_member"][i][1]] = [];
            }
            _CARDS[formData["crew_member"][i][1]][index] = [{
                searchName: formData["tv_show"][1],
                cardName: row["EPISODE_NAME"],
                cardInfo: [row["SEASON_NUMBER"], row["EPISODE_NUMBER"], row["AVERAGE_RATING"]]
            }];
        });
    }

    X = Object.keys(X);
    
    for (const x_point of X) {
        Y.forEach((trend) => {
            if (trend.find((e) => e[0] == x_point) == undefined) {
                trend.push([x_point, 0]);
            }
        });
    }

    Y.forEach((trend) => {
        trend.sort((a, b) => {
            return a[0].localeCompare(b[0]) + a[0].length - b[0].length;
        });
    });
    
    for (let i = 0; i < Y.length; i++) {
        for (let j = 0; j < Y[i].length; j++) {
            
            
            Y[i][j] = Y[i][j][1];
        }
    }

    for (let i = 0; i < formData.crew_member.length; i++) {
        X.map((row, index) => {
            if (_CARDS[formData["crew_member"][i][1]] == null) {
                _CARDS[formData["crew_member"][i][1]] = [];
            }
            if (Y[i][index] == 0) {
                _CARDS[formData["crew_member"][i][1]][index] = [{
                    searchName: formData["tv_show"][1],
                    cardName: row["EPISODE_NAME"],
                    cardInfo: [row["SEASON_NUMBER"], row["EPISODE_NUMBER"], "None"]
                }];
            }
            else {
                _CARDS[formData["crew_member"][i][1]][index] = [{
                    searchName: formData["tv_show"][1],
                    cardName: row["EPISODE_NAME"],
                    cardInfo: [row["SEASON_NUMBER"], row["EPISODE_NUMBER"], Y[i][index]]
                }];
            }
            
        });
    }
   
    const cardsData = await processCard2D("tv", _CARDS);

    await conn.close();
    return {
        "x_points": X,
        "trends": Y,
        "trend_labels": TRENDLABELS,
        "cards": cardsData
    };
}

export async function process_writers(formData) {
    //Work Flow for process_5
    const invalid = (val) => {
        return val == null || val == "";
    }

    if (invalid(formData["tv_show"]) || invalid(formData["group_by"]))  {
        return null;
    }

    const entryforTVShow = getnamedTVShow(formdata["tv_show"]);

    const writerrows = getWriters(entryforTVShow, formData["group_by"][1])


    const rowsbyWriter = {}
    writerrows.forEach((row) => {
        if (rowsByWriter[row["Writer_Name"]] == null) {
            rowsByWriter[row["Writer_Name"]] = [];
        }
        rowsByWriter[row["Writer_Name"]].push(row);
    });
    
    return writerrows// this should return the list of names of writers for use in the enter writers part

}
export async function process_graph(formData)
{
    //Work Flow for process_5
    const invalid = (val) => {
        return val == null || val == "";
    }

    if (invalid(formData["tv_show"]) || invalid(formData["group_by"]) || invalid(formData["crew_memb"]))  {
        return null;
    }

    const entryforTVShow = getnamedTVShow(formdata["tv_show"]);

    const writerrows = getWriters(entryforTVShow, formData["group_by"][1])

    const finalquery = query5(entryforTVShow, writerrows);

    const X_points  = finalquery["Writer_name"];
    const Y_points = finalquery["average_rating"];
    
    //need to add additional information for the season number, episode number and title

}