import { randomNumber } from "../general";

const API_KEY = "3a21a501ce611e90de4adb0202d7a97e";
const API_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzYTIxYTUwMWNlNjExZTkwZGU0YWRiMDIwMmQ3YTk3ZSIsInN1YiI6IjY2MGVlZjM3MzNhMzc2MDE3ZDg0NmRlMCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.FEluiMg7HfjmIGcKEnuxHCmFIezxPzo-RerrBjw6gYY";

export const TV = "tv";
export const MOVIE = "movie";
export const PERSON = "person";

export function getTMDBImagePath(path) {
    return `https://image.tmdb.org/t/p/original${path}`;
}

export function formatQueryParameter(parameter) {
    if (parameter == null) {
        return;
    }
    const formattedParameter = (''+parameter).replace(/ /g,"%20");
    return formattedParameter;
}

export async function randomMovieImagePath() {
    const pageNumber = randomNumber(1, 10);
    const URL = `https://api.themoviedb.org/3/movie/popular?language=en-US&page=${pageNumber}`;
    const response = await fetch(URL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
          accept: "application/json"
        }
    });
    const moviesData = await response.json();
    const movieNumber = randomNumber(0, moviesData.results.length - 1);
    return getTMDBImagePath(moviesData.results[movieNumber].poster_path);
}

export async function getImagePath(type, name, year) {
    const _name = formatQueryParameter(name);
    const _year = formatQueryParameter(year);

    const URL = `https://api.themoviedb.org/3/search/${type}?query=${_name}&include_adult=false&language=en-US${year!=null?`&primary_release_year=${_year}`:''}&page=1`;
    

    const response = await fetch(URL, {
        method: "GET",
        headers : {
            Authorization: `Bearer ${API_TOKEN}`,
            credientials: "same-origin",
            accept: "application/json"
        }
    });

    const data = await response.json();
    if (type == PERSON && data.results != undefined && data.results.length >= 1) {
        return getTMDBImagePath(data.results[0].profile_path);
    }
    else if (data.results != undefined && data.results.length >= 1) {
        return getTMDBImagePath(data.results[0].poster_path);
    }
    return "/Black.jpg";
}