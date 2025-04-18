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
	chatId := request.PathParameters["chat_id"]

	if chatId == "" {
		return events.APIGatewayProxyResponse{
			StatusCode: 400,
			Body:       "chat_id is required",
		}, fmt.Errorf("chat_id is required")
	}

	messages, err := db.GetMessagesByChatId(chatId)
	if err != nil {
		log.Println("error getting messages", err)
		return events.APIGatewayProxyResponse{
			StatusCode: 500,
			Body:       "error getting messages",
		}, err
	}

	if messages == nil {
		return events.APIGatewayProxyResponse{
			StatusCode: 404,
			Body:       "messages not found",
		}, fmt.Errorf("messages not found")
	}

	body, err := json.Marshal(messages)
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