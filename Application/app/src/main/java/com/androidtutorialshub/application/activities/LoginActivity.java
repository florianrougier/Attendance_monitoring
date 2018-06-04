package com.androidtutorialshub.application.activities;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.preference.Preference;
import android.support.design.widget.Snackbar;
import android.support.design.widget.TextInputEditText;
import android.support.design.widget.TextInputLayout;
import android.support.v4.widget.NestedScrollView;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.AppCompatButton;
import android.support.v7.widget.AppCompatTextView;
import android.util.Log;
import android.view.View;

import com.androidtutorialshub.application.handler.CustomHandler;
import com.androidtutorialshub.application.R;
import com.androidtutorialshub.application.helpers.InputValidation;
import com.androidtutorialshub.application.data.DatabaseHelper;
import com.pushbots.push.Pushbots;

public class LoginActivity extends AppCompatActivity implements View.OnClickListener {
    private static final String TAG = "aaa" ;
    private final AppCompatActivity activity = LoginActivity.this;

    private NestedScrollView nestedScrollView;

    private TextInputLayout textInputLayoutEmail;
    private TextInputLayout textInputLayoutPassword;

    private TextInputEditText textInputEditTextEmail;
    private TextInputEditText textInputEditTextPassword;

    private AppCompatButton appCompatButtonLogin;

    private AppCompatTextView textViewLinkRegister;

    private InputValidation inputValidation;
    private DatabaseHelper databaseHelper;

    private Bundle bundleNotif;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);
        getSupportActionBar().hide();

        // Register for Push Notifications
        Pushbots.sharedInstance().registerForRemoteNotifications();
        // To handle received notifications
        Pushbots.sharedInstance().setCustomHandler(CustomHandler.class);

        //Retrieve bundle if exist from notification
        Intent intent = getIntent();

        if (intent.getBundleExtra("pushData") != null) {
            Log.i(TAG, intent.getBundleExtra("pushData").getString("message"));
            bundleNotif = intent.getBundleExtra("pushData");
        }
        else Log.i(TAG, "not working");
        // Select the starting activity (check cache and rights)
        startActivityFromCache();
    }

    /**
     * This method is to initialize views
     */
    private void initViews() {

        nestedScrollView = findViewById(R.id.nestedScrollView);

        textInputLayoutEmail = findViewById(R.id.textInputLayoutEmail);
        textInputLayoutPassword = findViewById(R.id.textInputLayoutPassword);

        textInputEditTextEmail = findViewById(R.id.textInputEditTextEmail);
        textInputEditTextPassword = findViewById(R.id.textInputEditTextPassword);

        appCompatButtonLogin = findViewById(R.id.appCompatButtonLogin);

        textViewLinkRegister = findViewById(R.id.textViewLinkRegister);

    }

    /**
     * This method is to initialize listeners
     */
    private void initListeners() {
        appCompatButtonLogin.setOnClickListener(this);
        textViewLinkRegister.setOnClickListener(this);
    }

    /**
     * This method is to initialize objects to be used
     */
    private void initObjects() {
        databaseHelper = new DatabaseHelper(activity);
        inputValidation = new InputValidation(activity);

    }

    /**
     * This implemented method is to listen the click on view
     *
     * @param v
     */
    @Override
    public void onClick(View v) {
        switch (v.getId()) {
            case R.id.appCompatButtonLogin:
                //Intent intent = new Intent(this, SynchroService.class);
                //startService(intent); TODO UNCOMMENT THIS
                verifyFromSQLite();
                break;
            case R.id.textViewLinkRegister:
                // Navigate to RegisterActivity
                Intent intentRegister = new Intent(getApplicationContext(), RegisterActivity.class);
                startActivity(intentRegister);
                break;
        }
    }

    public void startActivityFromCache(){
        // Check if there is something in the cache and log in automatically if it is the case
        SharedPreferences preferences = getApplicationContext().getSharedPreferences("PREF", MODE_PRIVATE);
        if (!preferences.getString("email", "null").equals("null") && !preferences.getString("password", "null").equals("null")){
            checkRights(preferences);
        }
        else {
            initViews();
            initListeners();
            initObjects();
        }
    }
    public void checkRights(SharedPreferences preferences) {
        Intent intent;
        if(preferences.getString("droit", "null").equals("Professeur")) {
            intent = new Intent(activity, MenuTeacherActivity.class);
        }
        else  {
            intent = new Intent(activity, MenuStudentActivity.class);
        }
        intent.putExtra("EMAIL", preferences.getString("email", "null").toString().trim());
        if (bundleNotif != null) {
            intent.putExtra("bundleNotif", bundleNotif);
        }
        startActivity(intent);
    }

    /**
     * This method is to validate the input text fields and verify login credentials from SQLite
     */
    private void verifyFromSQLite() {
        if (!inputValidation.isInputEditTextFilled(textInputEditTextEmail, textInputLayoutEmail, getString(R.string.error_valid_email_password))) {
            return;
        }
        if (!inputValidation.isInputEditTextEmail(textInputEditTextEmail, textInputLayoutEmail, getString(R.string.error_valid_email_password))) {
            return;
        }
        if (!inputValidation.isInputEditTextFilled(textInputEditTextPassword, textInputLayoutPassword, getString(R.string.error_valid_email_password))) {
            return;
        }

        if (databaseHelper.checkUser(textInputEditTextEmail.getText().toString().trim()
                , textInputEditTextPassword.getText().toString().trim())) {

            startActivityfromButton();

        } else {
            // Snack Bar to show success message that record is wrong
            Snackbar.make(nestedScrollView, getString(R.string.error_valid_email_password), Snackbar.LENGTH_LONG).show();
        }
    }

    public void startActivityfromButton(){
        Intent accountsIntent = new Intent();

        // Select the intention depending on the user rights (teacher or student)
        if(databaseHelper.getUser(textInputEditTextEmail.getText().toString().trim()).get(0).isTeacher().equals("Professeur"))
            accountsIntent = new Intent(activity, MenuTeacherActivity.class);
        else if (databaseHelper.getUser(textInputEditTextEmail.getText().toString().trim()).get(0).isTeacher().equals("Eleve"))
            accountsIntent = new Intent(activity, MenuStudentActivity.class);
        else Snackbar.make(nestedScrollView, "Vous n'avez aucun droit", Snackbar.LENGTH_LONG).show();

        accountsIntent.putExtra("EMAIL", textInputEditTextEmail.getText().toString().trim());
        if (bundleNotif != null) {
            accountsIntent.putExtra("bundleNotif", bundleNotif);
        }
        // Set alias on pushbots server, so that this device could receive the notification
        // Here we need to retrieve the card id of the corresponding user with a get request

        // Put the login information of the user logged in
        addToCache();
        String UID= "test";

        // Send UID of the NFC card to PushBots server
        Pushbots.sharedInstance().setAlias(UID);

        emptyInputEditText();
        startActivity(accountsIntent);
    }

    private void addToCache() {
        SharedPreferences preferences = getApplicationContext().getSharedPreferences("PREF", MODE_PRIVATE);
        preferences.edit().putString("email", textInputEditTextEmail.getText().toString()).apply();
        preferences.edit().putString("password", textInputEditTextPassword.getText().toString()).apply();
        preferences.edit().putString("droit", databaseHelper.getUser(textInputEditTextEmail.getText().toString().trim()).get(0).isTeacher()).apply();
    }

    /**
     * This method is to empty all input edit text
     */
    private void emptyInputEditText() {
        textInputEditTextEmail.setText(null);
        textInputEditTextPassword.setText(null);
    }
}
