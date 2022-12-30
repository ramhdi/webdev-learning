package main

import (
	"net/http"
	"github.com/gin-gonic/gin"
)

// represents data about a record album
type album struct {
	ID string `json:"id"`
	Title string `json:"title"`
	Artist string `json:"artist"`
	Price float64 `json:"price"`
}

// albums slice
var albums = []album {
	{ ID: "1", Title: "Blue Train", Artist: "John Coltrane", Price: 56.99 },
	{ ID: "2", Title: "Jeru", Artist: "Gerry Mulligan", Price: 17.99 },
	{ ID: "3", Title: "Sarah Vaughan and Clifford Brown", Artist: "Sarah Vaughan", Price: 39.99 },
}

// get list of all albums
func getAlbums(c *gin.Context) {
	c.IndentedJSON(http.StatusOK, albums)
}

// add an album from JSON
func postAlbums(c *gin.Context) {
	var newAlbum album

	// bind the received JSON to newAlbum
	if err := c.BindJSON(&newAlbum); err != nil {
		return
	}

	// add new album to albums slice
	albums = append(albums, newAlbum)
	c.IndentedJSON(http.StatusCreated, newAlbum);
}

// get album by id
func getAlbumByID(c *gin.Context) {
	id := c.Param("id")

	// loop over the albums list until found album with matching ID
	for _, a := range albums {
		if a.ID == id {
			c.IndentedJSON(http.StatusOK, a)
			return
		}
	}
	c.IndentedJSON(http.StatusNotFound, gin.H{"message": "Album not found"})
}

func main() {
	router := gin.Default()
	router.GET("/albums", getAlbums)
	router.GET("/albums/:id", getAlbumByID)
	router.POST("/albums", postAlbums)

	router.Run("localhost:3001")
}
