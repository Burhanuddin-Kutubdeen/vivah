<<<<<<< Updated upstream
package main

import (
	"encoding/json"
	"fmt"
	"os"
	"vivah-backend/config"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/google/uuid"
	"github.com/golang-jwt/jwt/v5"
	"vivah-backend/db"
	"vivah-backend/utils"
)

type Credentials struct {
	Email    string `json:"email"`    // Email address of the user
	Password string `json:"password"` // Password for the user account
}

// Response struct for API responses
type Response struct {
	Message string `json:"message"` // Message describing the outcome
	Token   string `json:"token"`   // JWT token for authentication
}

type Claims struct {
	Email string `json:"email"`
	jwt.RegisteredClaims
}

// Handler function for the Lambda
func Handler(request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	var creds Credentials

	// Unmarshal the request body into a Credentials struct
	err := json.Unmarshal([]byte(request.Body), &creds)
	if err != nil {
		// Return an error if the input is invalid
		return events.APIGatewayProxyResponse{
			StatusCode: 400,
			Body:       `{"message":"Invalid input"}`,
		}, fmt.Errorf("invalid input: %w", err)
	}

	// Check if email or password is empty
	if creds.Email == "" || creds.Password == "" {
		return events.APIGatewayProxyResponse{
			StatusCode: 400,
			Body:       `{"message":"Email and password are required"}`,
		}, fmt.Errorf("email and password are required")
	}

	// Create a new user map with necessary information
	user := map[string]interface{}{
		"user_id": uuid.New().String(), // Generate a new UUID for the user
		"email":   creds.Email,          // Use the provided email
	}

	// Hash the password before storing it
	passwordHash, err := utils.HashPassword(creds.Password)
	if err != nil {
		// Return an error if password hashing fails
		return events.APIGatewayProxyResponse{
			StatusCode: 500,
			Body:       `{"message":"Internal server error"}`,
		}, fmt.Errorf("error hashing password: %w", err)
	}
	user["password_hash"] = passwordHash // Add the hashed password to the user map

	// Create the user in the database
	err = db.CreateUser(user)
	if err != nil {
		// Return an error if user creation fails
		return events.APIGatewayProxyResponse{
			StatusCode: 500,
			Body:       `{"message":"Internal server error"}`,
		}, fmt.Errorf("error creating user in database: %w", err)
	}

	// Generate a JWT token for the new user
	claims := Claims{
		creds.Email,
		jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(utils.GetTokenExpirationTime()),
			Issuer:    "vivah-api",
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	tokenString, err := token.SignedString([]byte(config.JWTSecret))

	//token, err := utils.GenerateToken(user)
	// token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
	// 	"email": user["email"],
	// 	"exp":   time.Now().Add(time.Hour * 24).Unix(),
	// })
	// tokenString, err := token.SignedString([]byte(utils.JWTSecret))
	if err != nil {
		// Return an error if token generation fails
		return events.APIGatewayProxyResponse{
			StatusCode: 500,
			Body:       `{"message":"Internal server error"}`,
		}, fmt.Errorf("error generating JWT token: %w", err)
	}

	// Create a response struct with a success message and the token
	resp := Response{
		Message: "User registered successfully",
		Token:   token,
	}

	// Marshal the response into a JSON string
	responseBody, err := json.Marshal(resp)
	if err != nil {
		// Return an error if marshaling fails
		return events.APIGatewayProxyResponse{
			StatusCode: 500,
			Body:       `{"message":"Internal server error"}`,
		}, fmt.Errorf("error marshaling response: %w", err)
	}

	// Return a success response with the JSON body and a 200 status code
	return events.APIGatewayProxyResponse{
		StatusCode: 200,
		Body:       string(responseBody),
		Headers:    map[string]string{"Content-Type": "application/json"},
	}, nil
}

// Main function to start the Lambda handler
func main() {
	lambda.Start(Handler)
}
=======
>>>>>>> Stashed changes