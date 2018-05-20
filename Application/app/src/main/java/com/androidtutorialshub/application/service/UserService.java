package com.androidtutorialshub.application.service;

import com.androidtutorialshub.application.model.User;

import java.util.List;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.GET;
import retrofit2.http.POST;
import retrofit2.http.PUT;

/**
 * Created by Florian on 12/05/2018.
 */

// TODO CHANGE THIS INTERFACE WITH THE RIGHT USERs urls
public interface UserService {

    // HTTP request to retrieve the logged in user
    @GET("/rest/client")
    Call<List<User>> getUsers();

    // HTTP request to update users information (password)
    @POST("/client")
    Call<Void> updateUser(@Body User client);
}
