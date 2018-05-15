package com.androidtutorialshub.application.helpers;

import android.app.Application;

import com.facebook.stetho.Stetho;

/**
 * Created by Florian on 12/05/2018.
 */

public class UserApp extends Application {
    public void onCreate() {
        super.onCreate();
        Stetho.initializeWithDefaults(this);
    }
}
