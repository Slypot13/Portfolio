package controller

import (
	"net/http"
	"portfolio/src/temps"
)

// HomeHandler serves the main HTML page
func HomeHandler(w http.ResponseWriter, r *http.Request) {
	if temps.HtmlContent == nil {
		http.Error(w, "Template not initialized", http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	w.Write(temps.HtmlContent)
}
