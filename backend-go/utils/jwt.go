package utils

import (
	"context"
	"time"

	"vivah-backend/config"

	"github.com/golang-jwt/jwt/v5"
)

func GenerateToken(user map[string]interface{}) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"userId": user["user_id"],
		"email":  user["email"],
		"exp":    time.Now().Add(time.Hour * 1).Unix(), // TODO: Check this line
	})

	tokenString, err := token.SignedString(config.SecretKey)
	if err != nil {
		return "", err
	}

	return tokenString, nil
}
func VerifyToken(tokenString string) (map[string]interface{}, error) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, jwt.ErrSignatureInvalid
		}
		return config.SecretKey, nil
	})

	if err != nil {
		return nil, err
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok || !token.Valid {
		return nil, jwt.ErrSignatureInvalid
	}
	return claims, nil
}