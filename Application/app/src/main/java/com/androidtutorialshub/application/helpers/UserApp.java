package com.androidtutorialshub.application.helpers;

import android.app.Application;
import android.content.Context;

import com.facebook.stetho.Stetho;
import com.pushbots.push.Pushbots;

/**
 * Created by Florian on 12/05/2018.
 */

public class UserApp extends Application {

    private static Context sContext;

    public void onCreate() {
        super.onCreate();
        sContext = getApplicationContext();

        // Initialize Stetho
        Stetho.initializeWithDefaults(this);

        // Initialize Pushbot Library
        Pushbots.sharedInstance().init(this);
    }


    public static Context getContext() {
        return sContext;
    }
}


