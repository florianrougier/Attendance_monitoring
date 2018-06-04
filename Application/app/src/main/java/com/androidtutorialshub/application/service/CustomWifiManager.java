package com.androidtutorialshub.application.service;

import android.app.Activity;
import android.content.Context;
import android.net.wifi.ScanResult;
import android.net.wifi.WifiManager;
import android.os.Build;
import android.support.annotation.RequiresApi;
import android.util.Log;
import android.widget.Toast;


import java.util.List;

import static android.content.ContentValues.TAG;

/**
 * Created by Florian on 02/06/2018.
 */

public class CustomWifiManager extends Activity {

    @RequiresApi(api = Build.VERSION_CODES.JELLY_BEAN_MR2)
    public void getAvailableWifi(Context context) {
         WifiManager wifiManager = (WifiManager)
                context.getSystemService(Context.WIFI_SERVICE);
        List<ScanResult> results = null;
        if (wifiManager != null) {
            results = wifiManager.getScanResults();
        }
        String message = "No results. Check wireless is on";

        if (results != null) {
            final int size = results.size();
            if (size == 0) message = "No access points in range";
            else {
                ScanResult bestSignal = results.get(0);

                for (ScanResult result : results) {
                    if (WifiManager.compareSignalLevel(bestSignal.level,
                            result.level) < 0) {
                        bestSignal = result;
                    }
                }
                message = String.format(
                        "%s networks found. %s is the strongest.", size,
                        bestSignal.SSID + " : " + bestSignal.level);
            }
        }
        Toast.makeText(context, message, Toast.LENGTH_LONG).show();
    }
}
