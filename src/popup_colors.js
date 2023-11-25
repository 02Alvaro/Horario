document.addEventListener("DOMContentLoaded", () => {
    let colorArray = [];

    const tryParseJSON = (jsonString) => {
        try {
            return JSON.parse(jsonString);
        } catch (e) {
            console.error("Error parsing JSON:", e);
            return null;
        }
    };

    const applyColors = () => {
        saveColorsToArray();
        localStorage.setItem("colorArray", JSON.stringify(colorArray));
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { action: "applyColors", colors: colorArray });
        });
    };

    const resetColors = () => {
        const defaultColors = ['#FFADAD', '#FFD6A5', '#FDFFB6', '#CAFFBF', '#9BF6FF'];
        defaultColors.forEach((color, index) => {
            const inputElement = document.getElementById(`teoria${index + 1}`);
            if (inputElement) {
                inputElement.value = color;
            }
        });
        saveColorsToArray();
        localStorage.setItem("colorArray", JSON.stringify(colorArray));
    };

    const deleteColors = () => {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { action: "deleteColors" });
        });
    };

    const saveColorsToArray = () => {
        colorArray = [];
        for (let i = 1; i <= 5; i++) {
            const color = document.getElementById(`teoria${i}`).value;
            colorArray.push(color);
        }
    };

    const loadColorsFromLocalStorage = () => {
        if (localStorage.getItem("colorArray")) {
            const parsedColorArray = tryParseJSON(localStorage.getItem("colorArray"));
            if (parsedColorArray) {
                colorArray = parsedColorArray;
                for (let i = 0; i < colorArray.length; i++) {
                    const color = colorArray[i];
                    if (color) {
                        document.getElementById(`teoria${i + 1}`).value = color;
                    }
                }
            }
        }
    };

    loadColorsFromLocalStorage();

    document.getElementById('apply').addEventListener('click', applyColors);

    document.getElementById('resetColors').addEventListener('click', resetColors);

    document.getElementById('deleteColors').addEventListener('click', deleteColors);
});