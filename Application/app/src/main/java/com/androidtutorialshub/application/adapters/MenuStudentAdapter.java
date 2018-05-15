package com.androidtutorialshub.application.adapters;

import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentManager;
import android.support.v4.app.FragmentStatePagerAdapter;

import com.androidtutorialshub.application.fragments.Tab1_menu;
import com.androidtutorialshub.application.fragments.Tab2_menu;
import com.androidtutorialshub.application.fragments.Tab3_menu;

/**
 * Created by Florian on 14/05/2018.
 */

public class MenuStudentAdapter extends FragmentStatePagerAdapter {

    int indexOfTable;

    public MenuStudentAdapter(FragmentManager fm, int NumberOfTabs) {
        super(fm);
        this.indexOfTable = NumberOfTabs;
    }

    @Override
    public Fragment getItem(int position) {
        switch (position){
            case 0:
                Tab1_menu tab1_menu = new Tab1_menu();
                return tab1_menu;
            case 1:
                Tab2_menu tab2_menu = new Tab2_menu();
                return tab2_menu;
            case 2:
                Tab3_menu tab3_menu = new Tab3_menu();
                return tab3_menu;

        }
        return null;
    }

    @Override
    public int getCount() {
        return indexOfTable;
    }
}
