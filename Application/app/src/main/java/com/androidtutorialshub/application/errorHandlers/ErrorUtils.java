package com.androidtutorialshub.application.errorHandlers;

import com.androidtutorialshub.application.service.SynchroService;
import com.androidtutorialshub.application.service.UpdateUserService;

import java.io.IOException;
import java.lang.annotation.Annotation;

import okhttp3.ResponseBody;
import retrofit2.Converter;
import retrofit2.Response;
import retrofit2.Retrofit;

/**
 * Created by Florian on 12/05/2018.
 */

public class ErrorUtils {


    public static APIError parseError(Response<?> response) {
        Converter<ResponseBody, APIError> converter =
                SynchroService.retrofit
                        .responseBodyConverter(APIError.class, new Annotation[0]);

        APIError error;

        try {
            error = converter.convert(response.errorBody());
        } catch (IOException e) {
            return new APIError();
        }

        return error;
    }
}
