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

type Match struct {
	UserId  string `json:"user_id"`
	MatchId string `json:"match_id"`
}

type Response struct {
	Message string `json:"message"`
}

func Handler(request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	var match Match
	err := json.Unmarshal([]byte(request.Body), &match)
	if err != nil {
		log.Println("error unmarshalling request", err)
		return events.APIGatewayProxyResponse{
			StatusCode: 500,
			Body:       "error unmarshalling request",
		}, err
	}

	if match.UserId == "" || match.MatchId == "" {
		return events.APIGatewayProxyResponse{
			StatusCode: 400,
			Body:       "user_id and match_id are required",
		}, fmt.Errorf("user_id and match_id are required")
	}

	matchData := map[string]interface{}{
		"user_id":  match.UserId,
		"match_id": uuid.New().String(),
	}

	err = db.CreateMatch(matchData)
	if err != nil {
		log.Println("error creating match", err)
		return events.APIGatewayProxyResponse{
			StatusCode: 500,
			Body:       "error creating match",
		}, err
	}

	response := Response{
		Message: "match created",
	}

	body, err := json.Marshal(response)
	if err != nil {
		log.Println("error marshalling response", err)
		return events.APIGatewayProxyResponse{
			StatusCode: 500,
			Body:       "error marshalling response",
		}, err
	}

	os.Setenv("TABLE_MATCHES", "Matches")

	return events.APIGatewayProxyResponse{
		StatusCode: 200,
		Body:       string(body),
	}, nil
}

func main() {
	lambda.Start(Handler)
}