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

func CreateMessage(message map[string]interface{}) error {
	dbClient := getDbClient()

	item, err := attributevalue.MarshalMap(message)
	if err != nil {
		return err
	}

	input := &dynamodb.PutItemInput{
		TableName: aws.String(config.MessagesTableName),
		Item:      item,
	}

	_, err = dbClient.PutItem(context.Background(), input)
	if err != nil {
		return err
	}

	return nil
}

func GetMessage(userId string, messageId string) (map[string]interface{}, error) {
	cfg, err := config.LoadDefaultConfig(context.TODO())
	if err != nil {
		log.Println("error loading config:", err)
		return nil, err
	}

	client := dynamodb.NewFromConfig(cfg)

	input := &dynamodb.GetItemInput{
		TableName: aws.String(config.MessagesTableName),
		Key: map[string]types.AttributeValue{
			"user_id":    &types.AttributeValueMemberS{Value: userId},
			"message_id": &types.AttributeValueMemberS{Value: messageId},
		},
	}

	output, err := client.GetItem(context.TODO(), input)
	if err != nil {
		log.Println("error getting message", err)
		return nil, err
	}

	if output.Item == nil {
		log.Println("message not found")
		return nil, nil
	}

	var message map[string]interface{}
	err = attributevalue.UnmarshalMap(output.Item, &message)
	if err != nil {
		log.Println("error unmarshalling message", err)
		return nil, err
	}

	return message, nil
}

func GetMessagesByChatId(chatId string) ([]map[string]interface{}, error) {
	dbClient := getDbClient()

	input := &dynamodb.QueryInput{
		TableName: &config.MessagesTableName,
		KeyConditionExpression: aws.String("chat_id = :chat_id"),
		ExpressionAttributeValues: map[string]types.AttributeValue{
			":chat_id": &types.AttributeValueMemberS{Value: chatId},
		},
	}

	result, err := dbClient.Query(context.Background(), input)
	if err != nil {
		return nil, err
	}

	var messages []map[string]interface{}
	for _, item := range result.Items {
		msg := make(map[string]interface{})
		err = attributevalue.UnmarshalMap(item, &msg)
		if err != nil {
			return nil, err
		}
		messages = append(messages, msg)
	}

	return messages, nil
}