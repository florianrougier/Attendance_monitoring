package com.androidtutorialshub.application.helpers;

import android.app.Application;
import com.facebook.stetho.Stetho;
import com.pushbots.push.Pushbots;

/**
 * Created by Florian on 12/05/2018.
 */

public class UserApp extends Application {
    public void onCreate() {
        super.onCreate();

        // Initialize Stetho
        Stetho.initializeWithDefaults(this);

        // Initialize Pushbot Library
        Pushbots.sharedInstance().init(this);
    }
}

