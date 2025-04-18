package main

import (
	"encoding/json"
	"fmt"
	"log"
	"os"

	"vivah-backend/db"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
)

type Like struct {
	UserId      string `json:"user_id"`
	LikedUserId string `json:"liked_user_id"`
}

type Response struct {
	Message string `json:"message"`
}

func Handler(request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	var like Like
	err := json.Unmarshal([]byte(request.Body), &like)
	if err != nil {
		log.Println("error unmarshalling request", err)
		return events.APIGatewayProxyResponse{
			StatusCode: 500,
			Body:       "error unmarshalling request",
		}, err
	}

	if like.UserId == "" || like.LikedUserId == "" {
		return events.APIGatewayProxyResponse{
			StatusCode: 400,
			Body:       "user_id and liked_user_id are required",
		}, fmt.Errorf("user_id and liked_user_id are required")
	}

	likeData := map[string]interface{}{
		"user_id":        like.UserId,
		"liked_user_id": like.LikedUserId,
	}

	err = db.CreateLike(likeData)
	if err != nil {
		log.Println("error creating like", err)
		return events.APIGatewayProxyResponse{
			StatusCode: 500,
			Body:       "error creating like",
		}, err
	}

	response := Response{
		Message: "like created",
	}

	body, err := json.Marshal(response)
	if err != nil {
		log.Println("error marshalling response", err)
		return events.APIGatewayProxyResponse{
			StatusCode: 500,
			Body:       "error marshalling response",
		}, err
	}
	os.Setenv("TABLE_LIKES", "Likes")
	return events.APIGatewayProxyResponse{
		StatusCode: 200,
		Body:       string(body),
	}, nil
}

func main() {
	lambda.Start(Handler)
}