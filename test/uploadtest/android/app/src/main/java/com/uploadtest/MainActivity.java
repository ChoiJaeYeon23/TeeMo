package com.uploadtest;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactApplication;
import android.os.Bundle;
import org.devio.rn.splashscreen.SplashScreen;

public class MainActivity extends ReactActivity {
  @Override
  protected String getMainComponentName() {
    return "uploadtest";
  }

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    SplashScreen.show(this);
    super.onCreate(savedInstanceState);
  }
}