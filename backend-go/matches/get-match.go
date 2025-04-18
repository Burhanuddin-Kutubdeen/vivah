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
	matchId := request.PathParameters["match_id"]
	if userId == "" || matchId == "" {
		return events.APIGatewayProxyResponse{
			StatusCode: 400,
			Body:       "user_id and match_id are required",
		}, fmt.Errorf("user_id and match_id are required")
	}

	match, err := db.GetMatch(userId, matchId)
	if err != nil {
		log.Println("error getting match", err)
		return events.APIGatewayProxyResponse{
			StatusCode: 500,
			Body:       "error getting match",
		}, err
	}

	if match == nil {
		return events.APIGatewayProxyResponse{
			StatusCode: 404,
			Body:       "match not found",
		}, fmt.Errorf("match not found")
	}

	body, err := json.Marshal(match)
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