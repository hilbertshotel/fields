package backend

import (
	"io/ioutil"
	"strings"
	"runtime"
)


func LoadAndParse(filename string) [][]string {
	file, err := ioutil.ReadFile(filename)
    if err != nil {
		return [][]string{{" "}}
	}

	contents := string(file)
	if contents == "" {
		return [][]string{{" "}}
	}

	var output [][]string
	lines := strings.Split(contents, lineFeed())
	for _, line := range lines {
		line = line + " "
		slice := strings.Split(line, "")
		output = append(output, slice)
	}

	return output
}


func ParseAndSave(file [][]string, filename string) error {
	var output string

	for _, line := range file[1:] {
		newLine := handleTagBrackets(line)
		str := strings.Join(newLine, "")
		str = strings.TrimSuffix(str, " ")
		output += str + lineFeed()
	}

	output = output[:len(output)-len(lineFeed())]
	data := []byte(output)
	err := ioutil.WriteFile(filename, data, 0644)
	return err
}


func handleTagBrackets(line []string) []string {
	var newLine []string
	for _, char := range line {
		if char == "&lt" {
			newLine = append(newLine, "<")
		} else if char == "&gt" {
			newLine = append(newLine, ">")
		} else {
			newLine = append(newLine, char)
		}
	}
	return newLine
}


func lineFeed() string {
	os := runtime.GOOS
    switch os {
	case "windows": return "\r\n"
	default: return "\n"
	}
}
