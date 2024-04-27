import { getSimilarColors } from "../general";

export async function organize({x_points, trends, trend_labels, cards}) {
    let data = {};
    data["x_points"] = x_points;
    data["cards"] = cards;

    // We need a color for each set of y-points (each trend).
    const colors = await getSimilarColors(trends.length);

    // Here, we're transforming the set of y-points (each trend)
    // so that a trend is associated with a label and a color.
    let formatted_trends = [];
    for (let i = 0; i < trends.length; i++) {
        const formatted_trend = {
            name: trend_labels[i],
            color: colors[i],
            yPoints: trends[i]
        }
        formatted_trends.push(formatted_trend);
    }
    
    data["trends"] = formatted_trends;
    return data;
}