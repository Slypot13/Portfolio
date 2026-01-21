package temps

import (
	"embed"
	"io/fs"
	"log"
)

//go:embed index.html
var content embed.FS

var HtmlContent []byte

func InitTemps() {
	var err error
	HtmlContent, err = fs.ReadFile(content, "index.html")
	if err != nil {
		log.Fatal("Failed to load index.html template:", err)
	}
}
