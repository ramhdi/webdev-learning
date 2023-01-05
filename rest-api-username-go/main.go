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
	id			string	`json:"_id" bson:"_id"`
	username	string	`json:"username" bson:"username"`
	password	string	`json:"password" bson:"password"`
}

func GetMongoDBConnection() (*mongo.Client, error) {
	//fmt.Println("GetMongoDBConnection")
	client, err := mongo.Connect(context.TODO(), options.Client().ApplyURI(host))
	if err != nil {
		return nil, err
	}

	err = client.Ping(context.TODO(), readpref.Primary())
	if err != nil {
		return nil, err
	}

	return client, nil
}

func GetMongoDBCollection (dbName string, collectionName string) (*mongo.Collection, error) {
	//fmt.Println("GetMongoDBCollection")
	client, err := GetMongoDBConnection()
	if err != nil {
		return nil, err
	}

	collection := client.Database(dbName).Collection(collectionName)
	return collection, nil
}

func GetAllUsers(c *gin.Context) {
    collection, err := GetMongoDBCollection(db_name, collection_name)
    if err != nil {
        log.Fatal(err)
        c.String(500, err.Error())
        return
    }

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
    //json, _ := json.Marshal(results)
    c.JSON(200, results)
}

func GetUser(c *gin.Context) {
	//fmt.Println("GetUser")
	collection, err := GetMongoDBCollection(db_name, collection_name)
	if err != nil {
		log.Fatal(err)
		c.String(500, err.Error())
		return
	}

	var filter bson.M = bson.M{}
	if c.Param("id") != "" {
		id := c.Param("id")
		objID, _ := primitive.ObjectIDFromHex(id)
		filter = bson.M{"_id": objID}
	}

	var results []bson.M
	cur, err := collection.Find(context.TODO(), filter)
	defer cur.Close(context.TODO())
	if err != nil {
		log.Fatal(err)
		c.String(500, err.Error())
		return
	}

	cur.All(context.TODO(), &results)
	//json, _ := json.Marshal(results)
	c.JSON(200, results)
}

func main() {
	router := gin.Default()
	router.GET("/user/", GetAllUsers)
	router.GET("/user/:id", GetUser)
	
	router.Run("localhost:3001")
}
