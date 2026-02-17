package controller

import (
	"database/sql"
	"log"
	"net/http"
	"os"
	"portfolio/src/temps"
	"strconv"
	"time"

	_ "github.com/go-sql-driver/mysql"
)

func HomeHandler(w http.ResponseWriter, r *http.Request) {
	err := temps.Temps.ExecuteTemplate(w, "index", nil)
	if err != nil {
		http.Error(w, "Erreur lors du rendu du template", http.StatusInternalServerError)
	}
}

func getDB() *sql.DB {
	databaseURL := os.Getenv("DATABASE_URL")
	db, err := sql.Open("mysql", databaseURL)
	if err != nil {
		log.Fatal(err)
	}

	if err := db.Ping(); err != nil {
		log.Fatal("Impossible de se connecter à la base de données: ", err)
	}
	return db
}

type Todo struct {
	ID    int
	Title string
	Done  bool
}

func InitDB() {
	db := getDB()
	defer db.Close()

	query := `
	CREATE TABLE IF NOT EXISTS todos (
		id INT AUTO_INCREMENT PRIMARY KEY,
		title VARCHAR(255) NOT NULL,
		done BOOLEAN DEFAULT FALSE
	);`

	_, err := db.Exec(query)
	if err != nil {
		log.Fatal("Erreur lors de l'initialisation de la BDD: ", err)
	}
}

func AddTodo(title string) error {
	db := getDB()
	defer db.Close()

	_, err := db.Exec("INSERT INTO todos (title) VALUES (?)", title)
	return err
}

func GetTodos() ([]Todo, error) {
	db := getDB()
	defer db.Close()

	rows, err := db.Query("SELECT id, title, done FROM todos")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var todos []Todo
	for rows.Next() {
		var t Todo
		if err := rows.Scan(&t.ID, &t.Title, &t.Done); err != nil {
			return nil, err
		}
		todos = append(todos, t)
	}
	return todos, nil
}

func ToggleTodo(id int) error {
	db := getDB()
	defer db.Close()

	_, err := db.Exec("UPDATE todos SET done = NOT done WHERE id = ?", id)
	return err
}

func DeleteTodo(id int) error {
	db := getDB()
	defer db.Close()

	_, err := db.Exec("DELETE FROM todos WHERE id = ?", id)
	return err
}

func isAuthenticated(r *http.Request) bool {
	cookie, err := r.Cookie("auth")
	if err != nil {
		return false
	}
	return cookie.Value == "true"
}

func LoginHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodGet {
		temps.Temps.ExecuteTemplate(w, "login.html", nil)
		return
	}

	if r.Method == http.MethodPost {
		password := r.FormValue("password")
		expectedPassword := os.Getenv("TODO_PASSWORD")

		if password == expectedPassword {
			http.SetCookie(w, &http.Cookie{
				Name:    "auth",
				Value:   "true",
				Expires: time.Now().Add(24 * time.Hour),
				Path:    "/",
			})
			http.Redirect(w, r, "/todo", http.StatusSeeOther)
			return
		}

		temps.Temps.ExecuteTemplate(w, "login.html", "Mot de passe incorrect")
	}
}

func TodoHandler(w http.ResponseWriter, r *http.Request) {
	if !isAuthenticated(r) {
		http.Redirect(w, r, "/login", http.StatusSeeOther)
		return
	}

	todos, err := GetTodos()
	if err != nil {
		http.Error(w, "Erreur lors de la récupération des tâches", http.StatusInternalServerError)
		return
	}
	temps.Temps.ExecuteTemplate(w, "todo.html", todos)
}

func AddTodoHandler(w http.ResponseWriter, r *http.Request) {
	if !isAuthenticated(r) {
		http.Redirect(w, r, "/login", http.StatusSeeOther)
		return
	}
	if r.Method == http.MethodPost {
		title := r.FormValue("title")
		if title != "" {
			AddTodo(title)
		}
		http.Redirect(w, r, "/todo", http.StatusSeeOther)
	}
}

func ToggleTodoHandler(w http.ResponseWriter, r *http.Request) {
	if !isAuthenticated(r) {
		http.Redirect(w, r, "/login", http.StatusSeeOther)
		return
	}
	if r.Method == http.MethodPost {
		idStr := r.FormValue("id")
		id, err := strconv.Atoi(idStr)
		if err == nil {
			ToggleTodo(id)
		}
		http.Redirect(w, r, "/todo", http.StatusSeeOther)
	}
}

func DeleteTodoHandler(w http.ResponseWriter, r *http.Request) {
	if !isAuthenticated(r) {
		http.Redirect(w, r, "/login", http.StatusSeeOther)
		return
	}
	if r.Method == http.MethodPost {
		idStr := r.FormValue("id")
		id, err := strconv.Atoi(idStr)
		if err == nil {
			DeleteTodo(id)
		}
		http.Redirect(w, r, "/todo", http.StatusSeeOther)
	}
}
