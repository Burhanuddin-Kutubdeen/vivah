package main

import (
	"encoding/json"
	"fmt"
	"log"

	"vivah-backend/db"
	"os"
	"vivah-backend/utils"import "vivah-backend/config"
)

// Credentials struct to hold email and password
type Credentials struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}


type Response struct {
	Message string `json:"message"`
	Token   string `json:"token"`
}

func Handler(request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	var creds Credentials
	err := json.Unmarshal([]byte(request.Body), &creds)
	if err != nil {
		log.Println("error unmarshalling request", err)
		return events.APIGatewayProxyResponse{
			StatusCode: 500,
			Body:       "error unmarshalling request",
		}, err
	}

	if creds.Email == "" || creds.Password == "" {
		return events.APIGatewayProxyResponse{
			StatusCode: 400,
			Body:       "email and password are required",
		}, fmt.Errorf("email and password are required")
	}

	user, err := db.GetUserByEmail(creds.Email)
	if err != nil {
		log.Println("error getting user", err)
		return events.APIGatewayProxyResponse{
			StatusCode: 500,
			Body:       "error getting user",
		}, err
	}

	if user == nil {
		log.Println("user not found", err)
		return events.APIGatewayProxyResponse{
			StatusCode: 404,
			Body:       "user not found",
		}, fmt.Errorf("user not found")
	}

	err = utils.ComparePassword(creds.Password, user["password"].(string))
	if err != nil {
		log.Println("invalid credentials", err)
		return events.APIGatewayProxyResponse{
			StatusCode: 401,
			Body:       "invalid credentials",
		}, fmt.Errorf("invalid credentials")
	}

	token, err := utils.GenerateToken(user)
	if err != nil {
		log.Println("error generating token", err)
		return events.APIGatewayProxyResponse{
			StatusCode: 500,
			Body:       "error generating token",
		}, err
	}

	response := Response{
		Message: "login successful",
		Token:   token,
	}

	body, err := json.Marshal(response)
	if err != nil {
		log.Println("error marshalling response", err)
		return events.APIGatewayProxyResponse{
			StatusCode: 500,
			Body:       "error marshalling response",
		}, err
	}

	os.Setenv("TABLE_USERS", "Users")
	return events.APIGatewayProxyResponse{
		StatusCode: 200,
		Body:       string(body),
	}, nil
}

func main() {
	lambda.Start(Handler)
}