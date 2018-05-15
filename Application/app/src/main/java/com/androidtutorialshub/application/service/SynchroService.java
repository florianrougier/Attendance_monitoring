package com.androidtutorialshub.application.service;

import android.annotation.SuppressLint;
import android.app.IntentService;
import android.content.Context;
import android.content.Intent;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.util.Log;
import android.widget.Toast;

import com.androidtutorialshub.application.data.DatabaseHelper;
import com.androidtutorialshub.application.errorHandlers.APIError;
import com.androidtutorialshub.application.errorHandlers.ErrorUtils;
import com.androidtutorialshub.application.model.User;

import java.util.List;

import okhttp3.OkHttpClient;
import okhttp3.logging.HttpLoggingInterceptor;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

/**
 * Created by Florian on 12/05/2018.
 */

@SuppressLint("Registered")
public class SynchroService extends IntentService {
    private static final String TAG = "SynchroService";
    public static Retrofit retrofit;
    private DatabaseHelper databaseHelper;
    private final Context context = SynchroService.this;



    public SynchroService() {
        super(TAG);
        databaseHelper = new DatabaseHelper(context);

    }

    @Override
    protected void onHandleIntent(@Nullable Intent intent) {
        Log.d(TAG,"Debut de la synchro");

        HttpLoggingInterceptor httpLoggingInterceptor = new HttpLoggingInterceptor();
        httpLoggingInterceptor.setLevel(HttpLoggingInterceptor.Level.BODY);

        OkHttpClient client = new OkHttpClient.Builder()
                .addInterceptor(httpLoggingInterceptor)
                .build();

        retrofit = new Retrofit.Builder()
                .baseUrl("https://ama-gestion-clients.appspot.com/") // TODO: ADD THE RIGHT URL !
                .addConverterFactory(GsonConverterFactory.create())
                .client(client)
                .build();

        UserService userService = retrofit.create(UserService.class);

        Call<List<User>> result = userService.getUsers();

        result.enqueue(new Callback<List<User>>() {
            @Override
            public void onResponse(@NonNull Call<List<User>> call, @NonNull Response<List<User>> response) {
                    if (response.isSuccessful()) {
                        Log.d(TAG,"SUCCESS");
                        List<User> users = response.body();
                        assert users != null;
                        Log.d(TAG, users.size() + " users");
                        Log.d(TAG, response.message());
                        for (User u : users) {
                            Log.d(TAG, "user name: " + u.getName());
                            Log.d(TAG, "user email: " + u.getEmail());
                            Log.d(TAG, "user password: " + u.getPassword());
                            Log.d(TAG, "user id: " + u.getId());
                            databaseHelper.addUser(u);
                        }
                    } else {
                        // parse the response body …
                        APIError error = ErrorUtils.parseError(response);
                        // … and use it to show error information
                        Toast.makeText(SynchroService.this, error.message(), Toast.LENGTH_SHORT).show();
                        // … or just log the issue like we’re doing :)
                        Log.d("error message", error.message());
                    }

            }

            @Override
            public void onFailure(@NonNull Call<List<User>> call, Throwable t) {
                Toast.makeText(SynchroService.this, "Failed to connect to the server", Toast.LENGTH_SHORT).show();
                Log.d(TAG,t.getMessage());
            }
        });
    }
}
