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

func Handler(request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	userId := request.PathParameters["user_id"]
	likedUserId := request.PathParameters["liked_user_id"]

	if userId == "" || likedUserId == "" {
		return events.APIGatewayProxyResponse{
			StatusCode: 400,
			Body:       "user_id and liked_user_id are required",
		}, fmt.Errorf("user_id and liked_user_id are required")
	}

	like, err := db.GetLike(userId, likedUserId)
	if err != nil {
		log.Println("error getting like", err)
		return events.APIGatewayProxyResponse{
			StatusCode: 500,
			Body:       "error getting like",
		}, err
	}

	if like == nil {
		return events.APIGatewayProxyResponse{
			StatusCode: 404,
			Body:       "like not found",
		}, fmt.Errorf("like not found")
	}

	body, err := json.Marshal(like)
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