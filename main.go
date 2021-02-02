package main

import (
	"fmt"
	"os"
	"net/http"
	"io/ioutil"
	"encoding/json"
	"planum/backend"
	"github.com/pkg/browser"
    "github.com/gobuffalo/packr/v2"
)

const PORT = "5000"
var filename string


func load(w http.ResponseWriter, r *http.Request) {
	response := backend.LoadAndParse(filename)
	w.Header().Set("content-type", "application/json")
	output, err := json.Marshal(response)
	backend.Check(err)
	w.Write(output)
}


func save(w http.ResponseWriter, r *http.Request) {
	var file [][]string
	request, err := ioutil.ReadAll(r.Body)
	backend.Check(err)
	json.Unmarshal(request, &file)

	var response string 
	err = backend.ParseAndSave(file, filename)
	if err != nil {
		fmt.Fprintln(os.Stderr, backend.ErrorFileOpen(filename))
		response = "x"
	} else {
		response = "ok"
	}

	w.Header().Set("content-type", "application/json")
	output, err := json.Marshal(response)
	backend.Check(err)
	w.Write(output)
}


func quit(w http.ResponseWriter, r *http.Request) {
	os.Exit(0)
}


func startEditor() {
	box := packr.New("frontend", "./frontend")
	http.Handle("/", http.FileServer(box))

	http.HandleFunc("/load", load)
	http.HandleFunc("/save", save)
	http.HandleFunc("/quit", quit)

	browser.OpenURL("http://127.0.0.1:" + PORT)
	http.ListenAndServe("127.0.0.1:" + PORT, nil)
}


func main() {
	arguments := os.Args
	switch len(arguments) {
	case 1: fmt.Println(backend.Info())
	case 2:
		filename = arguments[1]
		startEditor()
	case 3: fmt.Println(backend.ErrorArgs)
	}	
}
