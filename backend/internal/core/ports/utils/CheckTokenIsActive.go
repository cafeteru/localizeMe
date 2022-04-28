package utils

import (
	"errors"
	"github.com/go-chi/jwtauth/v5"
	"gitlab.com/HP-SCDS/Observatorio/2021-2022/localizeme/uniovi-localizeme/constants"
	"gitlab.com/HP-SCDS/Observatorio/2021-2022/localizeme/uniovi-localizeme/internal/core/domain"
	"gitlab.com/HP-SCDS/Observatorio/2021-2022/localizeme/uniovi-localizeme/internal/core/service"
	"log"
	"net/http"
)

func CheckUserIsActive(w http.ResponseWriter, r *http.Request, u service.UserService) *domain.User {
	log.Printf("%s: start", r.Context())
	_, tokenParts, _ := jwtauth.FromContext(r.Context())
	value, exists := tokenParts["email"]
	if !exists {
		err := errors.New(constants.InvalidToken)
		CreateErrorResponse(w, err, http.StatusUnprocessableEntity)
		return nil
	}
	user, err := u.FindByEmail(value.(string))
	if err != nil || user == nil {
		err := errors.New(constants.FindUserByEmail)
		CreateErrorResponse(w, err, http.StatusUnprocessableEntity)
		return nil
	}
	if !user.Active {
		err := errors.New(constants.UserNoActive)
		CreateErrorResponse(w, err, http.StatusUnprocessableEntity)
		return nil
	}
	return user
}

func CheckUserIsAdmin(w http.ResponseWriter, r *http.Request, u service.UserService) *domain.User {
	user := CheckUserIsActive(w, r, u)
	if user == nil {
		return nil
	}
	if user != nil && user.Admin {
		return user
	}
	err := errors.New(constants.UserNoAdmin)
	CreateErrorResponse(w, err, http.StatusUnauthorized)
	return nil
}
