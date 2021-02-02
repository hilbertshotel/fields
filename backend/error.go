package backend

import "fmt"

func Check(e error) {
	if e != nil {
		panic(e)
	}
}

var e = "\x1B[1m\x1B[31merror:\x1B[0m"
var ErrorArgs = fmt.Sprintf("%s Planum takes only one argument", e)

func ErrorFileOpen(filename string) string {
	return fmt.Sprintf("%s no such file or directory `%s`", e, filename)
}
