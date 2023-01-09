package main

import (
	"context"
	//"fmt"
	"log"

	//"encoding/json"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/mongo/readpref"
	
	//"net/http"
	"github.com/gin-gonic/gin"
)

const host = "mongodb://localhost:27017"
const db_name = "cil-rest-api"
const collection_name = "cil-users"

type User struct {
	Username string `json:"username" bson:"username"`
	Password string `json:"password" bson:"password"`
}

// Connect to database
func GetMongoDBConnection() (*mongo.Client, error) {
	// Connect to database URI
	client, err := mongo.Connect(context.TODO(), options.Client().ApplyURI(host))
	if err != nil {
		return nil, err
	}

	// Ping database to check connectivity
	err = client.Ping(context.TODO(), readpref.Primary())
	if err != nil {
		return nil, err
	}

	return client, nil
}

// Open collection
func GetMongoDBCollection (dbName string, collectionName string) (*mongo.Collection, error) {
	// Connect to DB
	client, err := GetMongoDBConnection()
	if err != nil {
		return nil, err
	}

	// Return collection
	collection := client.Database(dbName).Collection(collectionName)
	return collection, nil
}

// Return list of all users
func GetAllUsers(c *gin.Context) {
	// Connect to DB
    collection, err := GetMongoDBCollection(db_name, collection_name)
    if err != nil {
        log.Fatal(err)
        c.String(500, err.Error())
        return
    }

	// Find all database entries
    var filter bson.M = bson.M{}
    var results []bson.M
    cur, err := collection.Find(context.TODO(), filter)
    defer cur.Close(context.TODO())
    if err != nil {
        log.Fatal(err)
        c.String(500, err.Error())
        return
    }

    cur.All(context.TODO(), &results)
    c.JSON(200, results)
}

// Return user of specified ID
func GetUser(c *gin.Context) {
	// Connect to DB
	collection, err := GetMongoDBCollection(db_name, collection_name)
	if err != nil {
		log.Fatal(err)
		c.String(500, err.Error())
		return
	}

	// Use ID as filter
	var filter bson.M = bson.M{}
	if c.Param("id") != "" {
		id := c.Param("id")
		objID, _ := primitive.ObjectIDFromHex(id)
		filter = bson.M{"_id": objID}
	}

	// Find matching database entries
	var results []bson.M
	cur, err := collection.Find(context.TODO(), filter)
	defer cur.Close(context.TODO())
	if err != nil {
		log.Fatal(err)
		c.String(500, err.Error())
		return
	}

	cur.All(context.TODO(), &results)
	c.JSON(200, results)
}

// Create new user
func PostUser(c *gin.Context) {
	// Connect to DB
	collection, err := GetMongoDBCollection(db_name, collection_name)
	if err != nil {
		log.Fatal(err)
		c.String(500, err.Error())
		return
	}

	// Parse request body (JSON) to User struct
	var newUser User
	err = c.BindJSON(&newUser)
	if err != nil {
		log.Fatal(err)
		c.String(500, err.Error())
		return
	}

	// Insert new user to DB
	_, err = collection.InsertOne(context.TODO(), newUser)
	if err != nil {
		log.Fatal(err)
		c.String(500, err.Error())
		return
	}

	c.JSON(201, gin.H{"message": "Created new user", "body": newUser});
}

// Update user data
func PatchUser(c *gin.Context) {
	// Connect to DB
	collection, err := GetMongoDBCollection(db_name, collection_name)
	if err != nil {
		log.Fatal(err)
		c.String(500, err.Error())
		return
	}

	// Parse request body (JSON) to User struct
	var updateUser User
	err = c.BindJSON(&updateUser)
	if err != nil {
		log.Fatal(err)
		c.String(500, err.Error())
		return
	}
	update := bson.M{"$set": updateUser}

	// Use ID as filter
	objID, _ := primitive.ObjectIDFromHex(c.Param("id"))
	filter := bson.M{"_id": objID}

	// Update matching database entry
	_, err = collection.UpdateOne(context.TODO(), filter, update)
	if err != nil {
		log.Fatal(err)
		c.String(500, err.Error())
		return
	}

	c.JSON(200, gin.H{"message": "Updated user", "body": updateUser})
}

// Delete user
func DeleteUser(c *gin.Context) {
	// Connect to DB
	collection, err := GetMongoDBCollection(db_name, collection_name)
	if err != nil {
		log.Fatal(err)
		c.String(500, err.Error())
		return
	}

	// Use ID as filter
	objID, _ := primitive.ObjectIDFromHex(c.Param("id"))
	filter := bson.M{"_id": objID}

	// Find matching database entries
	_, err = collection.DeleteOne(context.TODO(), filter)
	if err != nil {
		log.Fatal(err)
		c.String(500, err.Error())
		return
	}

	c.JSON(200, gin.H{"message": "Deleted user"})
}

func main() {
	router := gin.Default()
	router.GET("/user/", GetAllUsers)
	router.GET("/user/:id", GetUser)
	router.POST("/user/", PostUser)
	router.PATCH("/user/:id", PatchUser)
	router.DELETE("/user/:id", DeleteUser)

	router.Run("localhost:3001")
}
