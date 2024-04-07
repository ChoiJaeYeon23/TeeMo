package com.teemov1;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactApplication;
import android.os.Bundle;
import org.devio.rn.splashscreen.SplashScreen;

import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.content.pm.Signature;
import android.os.Bundle;
import android.util.Base64;
import android.util.Log;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

/**
 * MainActivity 클래스입니다.
 * 
 * 앱 실행 시 Splash Screen을 show
 * Key Hash를 받아오는 코드 추가 요함
 */
public class MainActivity extends ReactActivity {
  @Override
  protected String getMainComponentName() {
    return "teemoV1";
  }

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    getHashKey();
    SplashScreen.show(this);
  }

  private void getHashKey() {
    PackageInfo packageInfo = null;

    try {
      packageInfo = getPackageManager().getPackageInfo(getPackageName(), PackageManager.GET_SIGNATURES);
    } catch (PackageManager.NameNotFoundException e) {
      e.printStackTrace();
    }

    if(packageInfo == null) {
      Log.e("KeyHash", "KeyHash:null");
    }

    for (Signature signature : packageInfo.signatures) {
      try {
        MessageDigest md = MessageDigest.getInstance("SHA");
        md.update(signature.toByteArray());
        Log.d("KeyHash", Base64.encodeToString(md.digest(), Base64.DEFAULT));
      } catch (NoSuchAlgorithmException e) {
        Log.e("KeyHash", "Unable to get MessageDigest. signature=" + signature, e);
      }
    }
  }
}
