package com.androidtutorialshub.application;

import android.content.Context;
import android.os.Build;
import android.os.SystemClock;
import android.support.annotation.RequiresApi;
import android.widget.Chronometer;
import android.widget.Toast;


/**
 * Created by Florian on 01/06/2018.
 */

public class MyChronometer extends android.widget.Chronometer implements android.widget.Chronometer.OnChronometerTickListener {

    // Threshold for chronometer
    private static final int THRESHOLD = 45000; //In milliseconds
    Chronometer myChronometer;

    @RequiresApi(api = Build.VERSION_CODES.N)
    public MyChronometer(Context context, Chronometer myChronometer) {
        super(context);
        this.myChronometer = myChronometer;
        startChronometer();
    }



    @RequiresApi(api = Build.VERSION_CODES.N)
    private void startChronometer() {
        myChronometer.setBase(SystemClock.elapsedRealtime() + THRESHOLD);
        myChronometer.setCountDown(true);
        myChronometer.start();
    }

    @RequiresApi(api = Build.VERSION_CODES.N)
    @Override
    public void onChronometerTick(android.widget.Chronometer chronometer) {

        long elapsedMillis = SystemClock.elapsedRealtime() - chronometer.getBase();
        if(elapsedMillis == 0){
            Toast.makeText(getContext(), "Trop tard", Toast.LENGTH_LONG);
        }
    }
}
