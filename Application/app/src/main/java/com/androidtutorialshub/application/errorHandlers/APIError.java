package com.androidtutorialshub.application.errorHandlers;

/**
 * Created by Florian on 12/05/2018.
 */

public class APIError {

    private int statusCode;
    private String message;

    public APIError() {
    }

    public int status() {
        return statusCode;
    }

    public String message() {
        return message;
    }
}
