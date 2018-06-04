package com.androidtutorialshub.application.handler;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Chronometer;

import com.androidtutorialshub.application.MyChronometer;
import com.androidtutorialshub.application.activities.LoginActivity;
import com.androidtutorialshub.application.fragments.Tab1_menu;
import com.pushbots.push.Pushbots;
import com.pushbots.push.utils.PBConstants;

/**
 * Created by Florian on 01/06/2018.
 */

public class CustomHandler extends BroadcastReceiver
{
    private String TAG = "PB3";

    @Override
    public void onReceive(Context context, Intent intent)
    {
        String action = intent.getAction();
        Log.d(TAG, "action=" + action);

        // Handle Push Message when opened
        if (action.equals(PBConstants.EVENT_MSG_OPEN)) {

            //Bundle containing all fields of the opened notification
            Bundle bundle = intent.getExtras().getBundle(PBConstants.EVENT_MSG_OPEN);

            //Record opened notification ( Nous permet de verifier que le systeme fonctionne a grande echelle)
            Pushbots.PushNotificationOpened(context, bundle);

            Log.i(TAG, "User clicked notification with Message: " + bundle.get("message"));

            //Start Launch Activity
            String packageName = context.getPackageName();
            Intent resultIntent = new Intent(context.getPackageManager().getLaunchIntentForPackage(packageName));
            resultIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK| Intent.FLAG_ACTIVITY_CLEAR_TASK);

            resultIntent.putExtras(intent.getBundleExtra("pushData"));
            intent.getBundleExtra("pushData").getString("message");
            //Open activity with pushData.
            if(null != resultIntent) {
                context.startActivity(resultIntent);
            }

        }else if(action.equals(PBConstants.EVENT_MSG_RECEIVE)){

            //Bundle containing all fields of the notification
            Bundle bundle = intent.getExtras().getBundle(PBConstants.EVENT_MSG_RECEIVE);
            Log.i(TAG, "User received notification with Message: " + bundle.get("message"));

        }

    }
}