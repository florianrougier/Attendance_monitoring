package com.androidtutorialshub.application.adapters;

import android.content.ContentResolver;
import android.content.Context;
import android.support.design.widget.Snackbar;
import android.support.design.widget.TextInputEditText;
import android.support.design.widget.TextInputLayout;
import android.support.v7.widget.AppCompatButton;
import android.support.v7.widget.AppCompatEditText;
import android.support.v7.widget.AppCompatTextView;
import android.support.v7.widget.RecyclerView;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.Toast;

import com.androidtutorialshub.application.R;
import com.androidtutorialshub.application.data.DatabaseHelper;
import com.androidtutorialshub.application.helpers.InputValidation;
import com.androidtutorialshub.application.model.User;

import java.util.List;

/**
 * Created by Florian on 10/10/2016.
 */

public class UsersRecyclerAdapter extends RecyclerView.Adapter<UsersRecyclerAdapter.UserViewHolder>
                                  implements View.OnClickListener{

    private List<User> listUsers;
    private User user;
    private InputValidation inputValidation;
    private DatabaseHelper databaseHelper;
    private UserViewHolder userViewHolder;

    //To get the context and show a message via toast
    private Context context;


    public UsersRecyclerAdapter(List<User> listUsers) {
        this.listUsers = listUsers;
    }

    public UsersRecyclerAdapter(User user) {this.user = user;}

    @Override
    public UserViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        // inflating recycler item view
        View itemView = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.item_user_recycler, parent, false);
        context = parent.getContext();
        inputValidation = new InputValidation(context);
        databaseHelper = new DatabaseHelper(context);
        user = new User();
        userViewHolder = new UserViewHolder(itemView);

        return userViewHolder;
    }

    @Override
    public void onBindViewHolder(UserViewHolder holder, int position) {
        holder.textViewName.setText(listUsers.get(position).getName());
        holder.textViewEmail.setText(listUsers.get(position).getEmail());
        holder.textViewPassword.setText(listUsers.get(position).getPassword());

        //Set listener to the button, so that we can update user password
        holder.confirmEditPassword.setOnClickListener(this);
    }

    @Override
    public int getItemCount() {
        Log.v(UsersRecyclerAdapter.class.getSimpleName(),""+listUsers.size());
        return listUsers.size();
    }

    // In this method, we first check if the inputs are valid and if it's the case, we call the
    // method in DatabaseHelper class to update the current user using the email attribute.
    @Override
    public void onClick(View view) {
        if (view.getId() == R.id.confirmEditPassword) {
            if (!inputValidation.isInputEditTextFilled(userViewHolder.editViewPassword,
                    userViewHolder.textInputLayout,
                    "Password required")) {
                return;
            }
            else if (!inputValidation.isInputEditTextMatches(userViewHolder.editViewPassword,
                    userViewHolder.editViewPassword2,
                    userViewHolder.textInputLayout2,
                    "Password does not match")) {
                return;
            }
            user.setName(userViewHolder.textViewName.getText().toString().trim());
            user.setEmail(userViewHolder.textViewEmail.getText().toString().trim());
            user.setPassword(userViewHolder.editViewPassword.getText().toString().trim());

            databaseHelper.updateUser(user);

            // Toast text to show success message that update user password correctly
            Toast.makeText(context, "Password successfully updated", Toast.LENGTH_SHORT).show();
            // Replace the current password by the new one directly from the view
            userViewHolder.textViewPassword.setText(userViewHolder.editViewPassword.getText());
            // Call the method to get rid of text inside editText fields
            emptyInputEditText();
        }
    }

    /**
     * This method is to empty all input edit text
     */
    private void emptyInputEditText() {
        userViewHolder.editViewPassword.setText(null);
        userViewHolder.editViewPassword2.setText(null);
    }

    /**
     * ViewHolder class
     */
    public class UserViewHolder extends RecyclerView.ViewHolder {

        public AppCompatTextView textViewName;
        public AppCompatTextView textViewEmail;
        public AppCompatTextView textViewPassword;
        public TextInputLayout textInputLayout;
        public TextInputEditText editViewPassword;
        public TextInputLayout textInputLayout2;
        public TextInputEditText editViewPassword2;
        public Button confirmEditPassword;

        public UserViewHolder(View view) {
            super(view);
            textViewName =  view.findViewById(R.id.textViewName);
            textViewEmail = view.findViewById(R.id.textViewEmail);
            textViewPassword = view.findViewById(R.id.textViewPassword);
            textInputLayout = view.findViewById(R.id.textInputPasswordLayout);
            editViewPassword = view.findViewById(R.id.editViewPassword);
            textInputLayout2 = view.findViewById(R.id.textInputPasswordLayout2);
            editViewPassword2 = view.findViewById(R.id.editViewPassword2);
            confirmEditPassword = view.findViewById(R.id.confirmEditPassword);
        }


    }


}
