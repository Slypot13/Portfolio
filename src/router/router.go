package router

import (
	"log"
	"net/http"
	"portfolio/src/controller"
	"portfolio/src/static"
	"strings"
)

// InitServ initializes the router and starts the server
func InitServ() {
	fileServer := http.FileServer(http.FS(static.Assets))

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		// Security check
		if strings.Contains(r.URL.Path, "..") {
			http.Error(w, "invalid path", http.StatusBadRequest)
			return
		}

		// Serve index for root path
		if r.URL.Path == "/" {
			controller.HomeHandler(w, r)
			return
		}

		// Serve static files for other paths
		fileServer.ServeHTTP(w, r)
	})

	log.Println("✅ Serveur démarré sur http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
