export function randomNumber(minimum, maximum) {
    return Math.floor(Math.random() * (maximum - minimum + 1) + minimum);
}

export function randomNumbers(n, minimum, maximum) {
    const randomNumbers = [];
    for (let i = 0; i < n; i++) {
        randomNumbers.push(randomNumber(minimum, maximum));
    }
    return randomNumbers;
}

export function randomColor() {
    return ((1 << 24) * Math.random() | 0).toString(16).padStart(6, "0");
}

export async function getColors(n) {
    const colors = [];
    for (let i = 0; i < n; i++) {
        let color = randomColor();
        do {
            color = randomColor();
        }
        while (colors.find((e) => e == "#" + color) != undefined);
        colors.push("#"+color);
    }
    
    return colors;
}

export async function getSimilarColors(n) {
    const URL = `https://www.thecolorapi.com/scheme?hex=${randomColor()}&mode=analogic&count=${n}`;
    const response = await fetch(URL, {
        method: "GET",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        }
    });
    const colorData = await response.json();

    const colors = [];
    for (const colorObject of colorData.colors) {
        colors.push(colorObject.hex.value);
    }

    return colors;
}

export async function sortFunction(a, b) {
    if (a[1] == b[1])
        return a[0].toUpperCase().localeCompare(b[0].toUpperCase());
    return a[1].toUpperCase().localeCompare(b[1].toUpperCase());
}