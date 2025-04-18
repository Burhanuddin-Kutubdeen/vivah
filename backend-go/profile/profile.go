package profile

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

func getDbClient() *dynamodb.Client {
	cfg, err := config.LoadDefaultConfig(context.Background(), config.WithRegion("us-east-1"))
	if err != nil {
		log.Fatalf("unable to load SDK config, %v", err)
	}

	return dynamodb.NewFromConfig(cfg)
}

func CreateProfile(profile map[string]interface{}) error {
	dbClient := getDbClient()

	item, err := attributevalue.MarshalMap(profile)
	if err != nil {
		return err
	}

	input := &dynamodb.PutItemInput{
		TableName: &config.ProfilesTableName,
		Item:      item,
	}

	_, err = dbClient.PutItem(context.Background(), input)
	if err != nil {
		return err
	}

	return nil
}

func GetProfile(userId string) (map[string]interface{}, error) {
	dbClient := getDbClient()

	input := &dynamodb.GetItemInput{
		TableName: &config.ProfilesTableName,
		Key: map[string]types.AttributeValue{
			"user_id": &types.AttributeValueMemberS{Value: userId},
		},
	}

	result, err := dbClient.GetItem(context.Background(), input)
	if err != nil {
		return nil, err
	}

	if result.Item == nil {
		return nil, nil // Profile not found
	}

	profile := make(map[string]interface{})
	if err := attributevalue.UnmarshalMap(result.Item, &profile); err != nil {
		return nil, err
	}

	return profile, nil
}

func UpdateProfile(profile map[string]interface{}) error {
	dbClient := getDbClient()

	item, err := attributevalue.MarshalMap(profile)
	if err != nil {
		return err
	}

	input := &dynamodb.PutItemInput{
		TableName: &config.ProfilesTableName,
		Item:      item,
	}

	_, err = dbClient.PutItem(context.Background(), input)
	if err != nil {
		return err
	}

	return nil
}