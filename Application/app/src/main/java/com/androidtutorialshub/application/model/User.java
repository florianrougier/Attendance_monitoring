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
    private String droit;
    private String card_id;

    public User() {

    }

    public User(String name, String email, String droit, String card_id) {
        this.name = name;
        this.email = email;
        this.droit = droit;
        this.card_id = card_id;
    }

    public String getCard_id() {
        return card_id;
    }

    public void setCard_id(String card_id) {
        this.card_id = card_id;
    }

    public String isTeacher() {
        return droit;
    }

    public void setTeacher(String teacher) {
        droit = teacher;
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
