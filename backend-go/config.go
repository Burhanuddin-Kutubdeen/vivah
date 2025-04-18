package main

import "os"

var SecretKey = []byte(getEnv("JWT_SECRET", "your-secret-key"))
var UsersTableName = "Users"
var ProfilesTableName = "Profiles"
var MatchesTableName = "Matches"
var LikesTableName = "Likes"
var MessagesTableName = "Messages"

func getEnv(key, defaultValue string) string {
	value := os.Getenv(key)
	if value == "" {
		return defaultValue
	}
	return value
}