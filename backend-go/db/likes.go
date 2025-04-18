package db

import (
	"context"
	"log"

	"vivah-backend/config"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/feature/dynamodb/attributevalue"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
)

func getDbClient() *dynamodb.Client {
	cfg, err := config.LoadDefaultConfig(context.Background(), config.WithRegion("us-east-1"))
	if err != nil {
		log.Fatalf("unable to load SDK config, %v", err)
	}

	return dynamodb.NewFromConfig(cfg)
}

func CreateLike(like map[string]interface{}) error {
	dbClient := getDbClient()

	item, err := attributevalue.MarshalMap(like)
	if err != nil {
		return err
	}

	input := &dynamodb.PutItemInput{
		TableName: aws.String(config.LikesTableName),
		Item:      item,
	}

	_, err = dbClient.PutItem(context.Background(), input)
	if err != nil {
		return err
	}

	return nil
}

func GetLike(userId string, likedUserId string) (map[string]interface{}, error) {
	dbClient := getDbClient()

	input := &dynamodb.GetItemInput{
		TableName: aws.String(config.LikesTableName),
		Key: map[string]types.AttributeValue{
			"user_id":        &types.AttributeValueMemberS{Value: userId},
			"liked_user_id": &types.AttributeValueMemberS{Value: likedUserId},
		},
	}

	result, err := dbClient.GetItem(context.Background(), input)
	if err != nil {
		return nil, err
	}

	if result.Item == nil {
		return nil, nil // Like not found
	}

	like := make(map[string]interface{})
	err = attributevalue.UnmarshalMap(result.Item, &like)
	if err != nil {
		return nil, err
	}

	return like, nil
}