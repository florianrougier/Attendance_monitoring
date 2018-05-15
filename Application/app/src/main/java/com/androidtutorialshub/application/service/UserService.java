package com.androidtutorialshub.application.service;

import com.androidtutorialshub.application.model.User;

import java.util.List;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.GET;
import retrofit2.http.POST;

/**
 * Created by Florian on 12/05/2018.
 */

// TODO CHANGE THIS INTERFACE WITH THE RIGHT USERs urls
public interface UserService {
    @GET("/rest/client")
    Call<List<User>> getUsers();

    // TODO PROBABLY REMOVE THE POST REQUEST SINCE WE MAY USE THE RASPBERRY
    @POST("/client")
    Call<Void> addUser(@Body User client);
}
