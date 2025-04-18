package main

import (
	"encoding/json"
	"fmt"
	"log"
	"os"

	"vivah-backend/db"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/google/uuid"
)

type Message struct {
	UserId    string `json:"user_id"`
	MessageId string `json:"message_id"`
	ChatId    string `json:"chat_id"`
	Content   string `json:"content"`
}

type Response struct {
	Message string `json:"message"`
}

func Handler(request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	var message Message
	err := json.Unmarshal([]byte(request.Body), &message)
	if err != nil {
		log.Println("error unmarshalling request", err)
		return events.APIGatewayProxyResponse{
			StatusCode: 500,
			Body:       "error unmarshalling request",
		}, err
	}

	if message.UserId == "" || message.Content == "" || message.ChatId == "" {
		return events.APIGatewayProxyResponse{
			StatusCode: 400,
			Body:       "user_id, content and chat_id are required",
		}, fmt.Errorf("user_id, content and chat_id are required")
	}

	messageData := map[string]interface{}{
		"user_id":    message.UserId,
		"message_id": uuid.New().String(),
		"chat_id":    message.ChatId,
		"content":    message.Content,
	}

	err = db.CreateMessage(messageData)
	if err != nil {
		log.Println("error creating message", err)
		return events.APIGatewayProxyResponse{
			StatusCode: 500,
			Body:       "error creating message",
		}, err
	}

	response := Response{
		Message: "message created",
	}

	body, err := json.Marshal(response)
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