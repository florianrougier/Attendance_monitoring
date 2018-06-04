package com.androidtutorialshub.application.service;

import android.app.IntentService;
import android.content.Intent;
import android.os.Bundle;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.util.Log;
import android.widget.Toast;

import com.androidtutorialshub.application.errorHandlers.APIError;
import com.androidtutorialshub.application.errorHandlers.ErrorUtils;
import com.androidtutorialshub.application.model.User;


import okhttp3.OkHttpClient;
import okhttp3.logging.HttpLoggingInterceptor;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

/**
 * Created by Florian on 20/05/2018.
 */

public class UpdateUserService extends IntentService {
    private static final String TAG = "UpdateUserService";
    public static Retrofit retrofit;
    private User user;

    private String email;
    private String password;
    private String name;


    public UpdateUserService() {
        super(TAG);
    }


    @Override
    protected void onHandleIntent(@Nullable Intent intent) {
        Log.d(TAG,"Debut de la synchro");
        email = intent.getStringExtra("email");
        name = intent.getStringExtra("name");
        password = intent.getStringExtra("password");
        user = new User();
        user.setEmail(email);
        user.setName(name);
        user.setPassword(password);

        HttpLoggingInterceptor httpLoggingInterceptor = new HttpLoggingInterceptor();
        httpLoggingInterceptor.setLevel(HttpLoggingInterceptor.Level.BODY);

        OkHttpClient client = new OkHttpClient.Builder()
                .addInterceptor(httpLoggingInterceptor)
                .build();

        retrofit = new Retrofit.Builder()
                .baseUrl("https://mincheck.herokuapp.com/")
                .addConverterFactory(GsonConverterFactory.create())
                .client(client)
                .build();

        UserService userService = retrofit.create(UserService.class);

        Call<Void> result = userService.updateUser(user);

        result.enqueue(new Callback<Void>() {
            @Override
            public void onResponse(@NonNull Call<Void> call, @NonNull Response<Void> response) {
                if (response.isSuccessful()) {
                    Log.d(TAG,"SUCCESS");
                    assert response.body() != null;
                    Log.d(TAG, response.message());
                    }
                else {
                    // parse the response body …
                    APIError error = ErrorUtils.parseError(response);
                    // … and use it to show error information
                    Toast.makeText(UpdateUserService.this, error.message(), Toast.LENGTH_SHORT).show();
                    // … or just log the issue like we’re doing :)
                    Log.d("error message", error.message());
                }

            }

            @Override
            public void onFailure(@NonNull Call<Void> call, Throwable t) {
                Toast.makeText(UpdateUserService.this, "Failed to connect to the server", Toast.LENGTH_SHORT).show();
                Log.d(TAG,t.getMessage());
            }
        });
    }
}
