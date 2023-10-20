const applyColors = (colors) => {
    const savedColors = {};
    let colorIndex = 0;
    const defaultColors = colors;

    document.querySelectorAll('td[class^="td_tipologia_"]').forEach((cell) => {
        const subjectCode = getSubjectCode(cell);
        if (subjectCode) {
            if (savedColors[subjectCode]) {
                cell.style.backgroundColor = savedColors[subjectCode];
            } else {
                const nextColor = defaultColors[colorIndex % defaultColors.length];
                savedColors[subjectCode] = nextColor;
                cell.style.backgroundColor = nextColor;
                colorIndex++;
            }
        }
    });
};

// Función auxiliar para obtener el código del tema tanto si hay un enlace "a" como si no lo hay
const getSubjectCode = (cell) => {
    let subjectCode;
    const link = cell.querySelector('a');
    if (link) {
        subjectCode = RegExp(/, (\d+)/).exec(link.textContent)?.[1];
    } else {
        subjectCode = RegExp(/, (\d+)/).exec(cell.textContent)?.[1];
    }
    return subjectCode;
};


const resetColors = () => {
    const defaultColors = ['#FFADAD', '#FFD6A5', '#FDFFB6', '#CAFFBF', '#9BF6FF', '#A0C4FF', '#BDB2FF', '#FFC6FF'];
    document.querySelectorAll('input[id^="teoria"]').forEach((inputElement, index) => {
        inputElement.value = defaultColors[index % defaultColors.length];
    });
};

const deleteColors = () => {
    document.querySelectorAll('td[class^="td_tipologia_"]').forEach((cell) => {
        cell.style.backgroundColor = '';
    });
};