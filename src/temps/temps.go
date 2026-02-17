package temps

import (
	"html/template"
	"log"
)

var Temps *template.Template

func InitTemps() {
	   var err error
    Temps, err = template.ParseGlob("src/temps/*.html")
    if err != nil {
        log.Fatalf("Erreur lors du parsing des templates : %v", err)
    }
}
