//// ON PAGE LOAD ////

// zooming data
let fontsize = 28;
document.body.style.fontSize = `${fontsize}px`;

// save file data
let saved = true;

// position and contents data
let current = { line: 1, index: 0 };
let contents = [[]];
load();

async function load() {
    let file = await loadFile();
    let fixedFile = fixFile(file);
    contents.push(...fixedFile);
    loadContents(fixedFile);
    setCursor(saved);
}

// event listeners
window.addEventListener("keydown", handleKey);

document.addEventListener('visibilitychange', () => {
    navigator.sendBeacon("http://127.0.0.1:5000/quit");
});


//// KEY PRESS EVENTS ////
function handleKey(event) {
    let k = event.key;

    if (k === "Tab") {
        clearCursor();
        contents[current.line].splice(current.index, 0, ...[" ", " ", " ", " "]);
        current.index += 4;
        setCursor(false);
        event.preventDefault();
    }

    // control combinations
    else if (event.ctrlKey && k === "x") {
        if (contents.length > 2) {
            removeLine(current.line);
            contents.splice(current.line, 1);
            if (current.line == lastLine()+1) {
                current.line--;
            } 
            current.index = 0;
            setCursor(false);
        } else {
            if (contents[current.line].length > 1) {
                contents = [[], [" "]];
                current.index = 0;
                setCursor(false);
            }
        }
        event.preventDefault();
    }

    else if (event.ctrlKey && k === "=") {
        fontsize++;
        document.body.style.fontSize = `${fontsize}px`;
        event.preventDefault();
    }

    else if (event.ctrlKey && k === "-") {
        fontsize--;
        document.body.style.fontSize = `${fontsize}px`;
        event.preventDefault();
    }

    else if (event.ctrlKey && k === "a") {
        event.preventDefault();
    }

    else if (event.ctrlKey && k === "ArrowRight") {
        if (current.index !== lastIndex(current.line)) {
            clearCursor();
            current.index = lastIndex(current.line);
            setCursor(saved);
        }   
        event.preventDefault();
    }

    else if (event.ctrlKey && k === "ArrowLeft") {
        if (current.index !== 0) {
            clearCursor();
            current.index = 0;
            setCursor(saved);
        }
        event.preventDefault();
    }

    // characters
    else if (k === "<") {
        clearCursor();
        contents[current.line].splice(current.index, 0, "&lt");
        current.index++;
        setCursor(false);
        event.preventDefault();
    }

    else if (k === ">") {
        clearCursor();
        contents[current.line].splice(current.index, 0, "&gt");
        current.index++;
        setCursor(false);
        event.preventDefault();
    }

    else if (k === " ") {
        clearCursor();
        contents[current.line].splice(current.index, 0, " ");
        current.index++;
        setCursor(false);
        event.preventDefault();
    }

    else if (k.length === 1) {
        clearCursor();
        contents[current.line].splice(current.index, 0, k);
        current.index++;
        setCursor(false);
        event.preventDefault();
    }

    // enter, backspace and delete
    else if (k === "Enter") {
        clearCursor();
        let tail = contents[current.line].splice(current.index);
        contents[current.line].push(" ");
        refreshLineContents(current.line);
        current.line++;

        newLine(current.line);
        contents[current.line] = tail;
        current.index = 0;
        setCursor(false);

        event.preventDefault();
    }

    else if (k === "Backspace") {
        if (current.index !== 0) {
            clearCursor();
            current.index--;
            contents[current.line].splice(current.index, 1);
            setCursor(false);
        } 

        else if (current.index === 0 && current.line > 1) {
            clearCursor();
            let previousLine = current.line-1;
            contents[previousLine].pop();
            current.index = contents[previousLine].length;
            contents[previousLine].push(...contents[current.line]);
            removeLine(current.line);
            contents.splice(current.line, 1);
            current.line--;
            setCursor(false);  
        }
        event.preventDefault();
    }

    else if (k === "Delete") {
        if (current.index < lastIndex(current.line)) {
            clearCursor();
            contents[current.line].splice(current.index, 1);
            setCursor(false);
        } 

        else if (current.line < lastLine()) {
            clearCursor();
            contents[current.line].splice(current.index, 1);
            let nextLine = current.line+1;
            contents[current.line].push(...contents[nextLine]);
            removeLine(nextLine);
            contents.splice(nextLine, 1);
            setCursor(false);
        }
        event.preventDefault();
    }

    // arrow keys
    else if (k === "ArrowRight") {
        if (current.index < lastIndex(current.line)) {
            clearCursor();
            current.index++;
            setCursor(saved);
        }
        event.preventDefault();
    }

    else if (k === "ArrowLeft") {
        if (current.index !== 0) {
            clearCursor();
            current.index--;
            setCursor(saved);
        }
        event.preventDefault();
    }

    else if (k === "ArrowUp") {
        if (current.line !== 1) {
            clearCursor();
            if (current.index > lastIndex(current.line-1)) {
                current.index = lastIndex(current.line-1);
            }
            current.line--;
            setCursor(saved);
            event.preventDefault();
        }
    }

    else if (k === "ArrowDown") {
        if (current.line < lastLine()) {
            clearCursor();
            if (current.index > lastIndex(current.line+1)) {
                current.index = lastIndex(current.line+1);
            }
            current.line++;
            setCursor(saved);
        }
        event.preventDefault();
    }

    // F keys
    else if (k === "F1") {
        clearCursor();
        saveFile(contents);
        event.preventDefault();
    }

    else if (k === "F4") {
        window.close();
        event.preventDefault();
    }

    else if (k === "F5") {
        event.preventDefault();
    }

    followCursor();
}
