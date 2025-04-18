package main

import (
	"vivah-backend/config"
	"context"
	"log"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/feature/dynamodb/attributevalue"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
)

func CreateUser(user map[string]interface{}) error {
	cfg, err := config.LoadDefaultConfig(context.TODO(), config.WithRegion("us-east-1"))
	if err != nil {
		log.Fatalf("unable to load SDK config, %v", err)
	}

	dbClient := dynamodb.NewFromConfig(cfg)

	item, err := attributevalue.MarshalMap(user)
	if err != nil {
		return err
	}

	input := &dynamodb.PutItemInput{
		TableName: &config.UsersTableName,
		Item:      item,
	}

	_, err = dbClient.PutItem(context.TODO(), input)
	if err != nil {
		return err
	}

	return nil
}

func GetUserByEmail(email string) (map[string]interface{}, error) {
	cfg, err := config.LoadDefaultConfig(context.TODO(), config.WithRegion("us-east-1"))
	if err != nil {
		log.Fatalf("unable to load SDK config, %v", err)
	}

	dbClient := dynamodb.NewFromConfig(cfg)

	input := &dynamodb.QueryInput{
		TableName:              &config.UsersTableName,
		IndexName:              aws.String("EmailIndex"), // Assuming you have a GSI named EmailIndex
		KeyConditionExpression: aws.String("email = :email"),
		ExpressionAttributeValues: map[string]types.AttributeValue{
			":email": &types.AttributeValueMemberS{Value: email},
		},
	}

	result, err := dbClient.Query(context.TODO(), input)
	if err != nil {
		return nil, err
	}

	if len(result.Items) == 0 {
		return nil, nil // User not found
	}

	// Unmarshal the first item into a map
	user := make(map[string]interface{})
	if err := attributevalue.UnmarshalMap(result.Items[0], &user); err != nil {
		return nil, err
	}

	return user, nil
}