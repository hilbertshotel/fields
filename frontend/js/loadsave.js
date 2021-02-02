const IP = "http://127.0.0.1:5000"

// LOAD FILE ////
async function loadContents(file) {
    let line = 1;
    for (row of file) {
        let numberTag = document.createElement("pre");
        numberTag.id = `lineNumber${line}`;
        numberTag.innerHTML = addSpaces(line);
        document.getElementById("lineNumber").appendChild(numberTag);
        
        let contentsTag = document.createElement("pre");
        contentsTag.id = `lineContents${line}`;
        contentsTag.innerHTML = row.join("");
        document.getElementById("lineContents").appendChild(contentsTag);
        
        line++;
    }
}


//// LOAD ////
async function loadFile() {
    let url = `${IP}/load`;
    let response = await fetch(url);
    if (response.ok) {
        let file = await response.json();
        return file;
    }
}


//// SAVE ////
async function saveFile(file) {
    let url = `${IP}/save`;
    let package = {
        method: "POST",
        header: {"content-type": "application/json"},
        body: JSON.stringify(file)
    };

    try {
        let response = await fetch(url, package);
        if (response.ok) {
            let data = await response.json();
            if (data === "ok") {
                saved = true;
            }
        }
    }

    catch(err) {
        console.log(err)
    }

    setCursor(saved);
}
