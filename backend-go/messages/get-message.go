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
	messageId := request.PathParameters["message_id"]

	if userId == "" || messageId == "" {
		return events.APIGatewayProxyResponse{
			StatusCode: 400,
			Body:       "user_id and message_id are required",
		}, fmt.Errorf("user_id and message_id are required")
	}

	message, err := db.GetMessage(userId, messageId)
	if err != nil {
		log.Println("error getting message", err)
		return events.APIGatewayProxyResponse{
			StatusCode: 500,
			Body:       "error getting message",
		}, err
	}

	if message == nil {
		return events.APIGatewayProxyResponse{
			StatusCode: 404,
			Body:       "message not found",
		}, fmt.Errorf("message not found")
	}

	body, err := json.Marshal(message)
	if err != nil {
		log.Println("error marshalling response", err)
		return events.APIGatewayProxyResponse{
			StatusCode: 500,
			Body:       "error marshalling response",
		}, err
	}
	os.Setenv("TABLE_MESSAGES", "Messages")
	return events.APIGatewayProxyResponse{
		StatusCode: 200,
		Body:       string(body),
	}, nil
}

func main() {
	lambda.Start(Handler)
}