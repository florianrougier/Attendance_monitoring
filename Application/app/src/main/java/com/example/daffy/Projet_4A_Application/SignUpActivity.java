package com.example.daffy.Projet_4A_Application;

import android.app.Activity;
import android.os.Bundle;

public class SignUpActivity extends Activity {
    DatabaseHelper helper = new DatabaseHelper(this);
    @Override
    protected void onCreate(Bundle savedInstanceState){
        super.onCreate(savedInstanceState);
        setContentView(R.layout.signupmodulefragment);

    }
}
