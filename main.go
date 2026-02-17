package main

import (
	"portfolio/src/controller"
	"portfolio/src/router"
	"portfolio/src/temps"

	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		println("No .env file found")
	}
	controller.InitDB()
	temps.InitTemps()

	router.InitServ()
}
