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

func CreateMatch(match map[string]interface{}) error {
	dbClient := getDbClient()

	item, err := attributevalue.MarshalMap(match)
	if err != nil {
		return err
	}

	input := &dynamodb.PutItemInput{
		TableName: &config.MatchesTableName,
		Item:      item,
	}

	_, err = dbClient.PutItem(context.Background(), input)
	if err != nil {
		return err
	}

	return nil
}

func GetMatch(userId string, matchId string) (map[string]interface{}, error) {
	dbClient := getDbClient()

	input := &dynamodb.GetItemInput{
		TableName: &config.MatchesTableName,
		Key: map[string]types.AttributeValue{
			"user_id":  &types.AttributeValueMemberS{Value: userId},
			"match_id": &types.AttributeValueMemberS{Value: matchId},
		},
	}

	result, err := dbClient.GetItem(context.Background(), input)
	if err != nil {
		return nil, err
	}

	if result.Item == nil {
		return nil, nil // Match not found
	}

	match := make(map[string]interface{})
	err = attributevalue.UnmarshalMap(result.Item, &match)
	if err != nil {
		return nil, err
	}

	return match, nil
}

func UpdateMatch(match map[string]interface{}) error {
	dbClient := getDbClient()

	item, err := attributevalue.MarshalMap(match)
	if err != nil {
		return err
	}

	input := &dynamodb.PutItemInput{
		TableName: &config.MatchesTableName,
		Item:      item,
	}

	_, err = dbClient.PutItem(context.Background(), input)
	if err != nil {
		return err
	}

	return nil
}

func GetMatchesByUser(userId string) ([]map[string]interface{}, error) {
	dbClient := getDbClient()

	input := &dynamodb.QueryInput{
		TableName: &config.MatchesTableName,
		KeyConditionExpression: aws.String("user_id = :user_id"),
		ExpressionAttributeValues: map[string]types.AttributeValue{
			":user_id": &types.AttributeValueMemberS{Value: userId},
		},
	}

	result, err := dbClient.Query(context.Background(), input)
	if err != nil {
		return nil, err
	}

	matches := []map[string]interface{}{}
	for _, item := range result.Items {
		match := make(map[string]interface{})
		err = attributevalue.UnmarshalMap(item, &match)
		if err != nil {
			return nil, err
		}
		matches = append(matches, match)
	}

	return matches, nil
}