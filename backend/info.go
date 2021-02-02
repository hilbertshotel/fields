package backend

func Info() string {
	return `Planum is a simple text editor running on 'localhost:5000'
	
Usage:
    planum <path>

Editor shortcuts:
    F1              -> save file
    F4              -> quit editor
    ctrl x          -> delete line
    ctrl =          -> zoom in
    ctrl -          -> zoom out
    ctrl ArrowRight -> jump right
    ctrl ArrowLeft  -> jump left

Compatibility:
    - Mint/Firefox
    - Win10/Firefox
`
}
