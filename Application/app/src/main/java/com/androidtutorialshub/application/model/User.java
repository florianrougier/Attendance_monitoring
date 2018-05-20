package com.androidtutorialshub.application.model;

import com.google.gson.annotations.SerializedName;

/**
 * Created by Florian on 9/12/2016.
 */
public class User {


    private long id;

    @SerializedName("nom")
    private String name;
    private String email;
    private boolean isTeacher;

    public boolean isTeacher() {
        return isTeacher;
    }

    public void setTeacher(boolean teacher) {
        isTeacher = teacher;
    }

    @SerializedName("prenom")
    private String password;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
