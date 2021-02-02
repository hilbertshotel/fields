//// LAST INDEX AND LAST LINE ////
function lastIndex(line) {
    return contents[line].length-1; 
}

function lastLine() {
    return contents.length-1;
}


//// CREATE NEW LINE ////
function newLine(line) {
    let contentsTag = document.createElement("pre");
    contents.splice(line, 0, []);
    incrementTrailingLines(line);
    contentsTag.id = `lineContents${line}`;    

    let numberTag = document.createElement("pre");
    numberTag.id = `lineNumber${line}`;
    numberTag.innerHTML = addSpaces(line);

    let prevNumTag = document.getElementById(`lineNumber${line-1}`);
    let prevContTag = document.getElementById(`lineContents${line-1}`);
    prevNumTag.insertAdjacentElement("afterend", numberTag);
    prevContTag.insertAdjacentElement("afterend", contentsTag);
}


//// REFRESH LINE CONTENTS ////
function refreshLineContents(line) {
    document.getElementById(`lineContents${line}`).innerHTML = contents[line].join("");
}


//// REMOVE LINE ////
function removeLine(line) {
    document.getElementById(`lineNumber${line}`).remove();
    document.getElementById(`lineContents${line}`).remove();
    decrementTrailingLines(line);
}


//// INCREMENT TRAILING LINES ////
function incrementTrailingLines(line) {
    let lineNumber = document.getElementById(`lineNumber${line}`);
    if (lineNumber !== null) {
        incrementTrailingLines(line+1);
        let lineContents = document.getElementById(`lineContents${line}`);
        line++;
        lineNumber.id = `lineNumber${line}`;
        lineNumber.innerHTML = addSpaces(line);
        lineContents.id = `lineContents${line}`;
        refreshLineContents(line);
    }
}


//// DECREMENT TRAILING LINES ////
function decrementTrailingLines(line) {
    if (lastLine() > line) {
        line++;
        let lineNumber = document.getElementById(`lineNumber${line}`);
        lineNumber.id = `lineNumber${line-1}`;
        lineNumber.innerHTML = addSpaces(line-1);
        document.getElementById(`lineContents${line}`).id = `lineContents${line-1}`;
        decrementTrailingLines(line);
    }
}


//// ADD SPACES IN FRONT OF LINE NUMBER ////
function addSpaces(line) {
    if (line < 10) {
        return `  ${line}`;
    } else if (line < 100) {
        return ` ${line}`;
    } else {
        return `${line}`;
    }
}


//// SET CURSOR ////
function setCursor(bool) {
    char = contents[current.line][current.index];
    if (bool) {
        contents[current.line][current.index] = `<span id="cursor1">${char}</span>`;
    } else {
        contents[current.line][current.index] = `<span id="cursor2">${char}</span>`;
        saved = false;
    }
    refreshLineContents(current.line);
}


//// CLEAR CURSOR ////
function clearCursor() {
    contents[current.line][current.index] = char;
    refreshLineContents(current.line);
}


//// FIX TAGS AND TABS ON FILE LOAD ////
function fixFile(file) {
    let newFile = [];
    for (row of file) {
        let newRow = [];
        for (char of row) {
            if (char === "<") {
                newRow.push("&lt");
            } else if (char === ">") {
                newRow.push("&gt");
            } else if (char === "\t") {
                newRow.push(...[" ", " ", " ", " "]);
            } else {
                newRow.push(char);
            }
        }
        newFile.push(newRow);
    }
    return newFile;
}


//// SCROLL CURSOR INTO VIEW ////
function followCursor() {
    let cursor = document.getElementById("cursor1");
    if (cursor === null) {
        cursor = document.getElementById("cursor2");
    }
    cursor.scrollIntoView({block: "nearest"});
}
