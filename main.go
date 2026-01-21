package main

import (
	"portfolio/src/router"
	"portfolio/src/temps"
)

func main() {
	// Initialize templates
	temps.InitTemps()

	// Initialize and start server
	router.InitServ()
}
