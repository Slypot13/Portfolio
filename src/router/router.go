package router

import (
	"log"
	"net/http"
	"os"
	"portfolio/src/controller"
	"portfolio/src/static"
	"strings"
)

func InitServ() {
	fileServer := http.FileServer(http.FS(static.Assets))

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {

		if strings.Contains(r.URL.Path, "..") {
			http.Error(w, "invalid path", http.StatusBadRequest)
			return
		}

		if r.URL.Path == "/" {
			controller.HomeHandler(w, r)
			return
		}

		fileServer.ServeHTTP(w, r)
	})

	http.HandleFunc("/todo", controller.TodoHandler)
	http.HandleFunc("/todo/add", controller.AddTodoHandler)
	http.HandleFunc("/todo/toggle", controller.ToggleTodoHandler)
	http.HandleFunc("/todo/delete", controller.DeleteTodoHandler)
	http.HandleFunc("/login", controller.LoginHandler)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
		log.Println("PORT not set, using default: " + port)
	}

	log.Println("✅ Serveur démarré sur http://localhost:" + port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}
