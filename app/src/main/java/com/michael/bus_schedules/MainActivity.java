package com.michael.bus_schedules;

import android.Manifest;
import android.annotation.SuppressLint;
import android.content.Context;
import android.content.pm.PackageManager;
import android.location.LocationManager;
import android.net.http.SslError;
import android.os.Build;
import android.os.Bundle;

import androidx.annotation.RequiresApi;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;

import android.webkit.SslErrorHandler;
import android.webkit.WebResourceError;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.webkit.WebResourceRequest;

public class MainActivity extends AppCompatActivity {
    public WebView mainView;
    private LocationManager locationManager;
    private String URL = "file:///android_asset/index.html";
    public MyLocationListener locationListener;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Loading the index.html
        setContentView(R.layout.activity_main);
        mainView = findViewById(R.id.mainView);

        mainView.loadUrl(URL);
        mainView.getSettings().setJavaScriptEnabled(true);
        mainView.getSettings().setLoadWithOverviewMode(true);
        mainView.setWebViewClient(new WebViewClient() {
            @Override
            public void onReceivedError(WebView view, int errorCode, String description, String failingUrl) {
            }

            @Override
            public void onReceivedError(WebView view, WebResourceRequest req, WebResourceError rerr) {
            }

            @Override
            public void onReceivedSslError(WebView view, SslErrorHandler handler, SslError er) {
                handler.proceed();
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                handleLoadFinish();
            }
        });
        mainView.addJavascriptInterface(new MyJavascriptInterface(this), "Android");
    }

    @SuppressLint({"MissingPermission", "NewApi"})
    @RequiresApi(api = Build.VERSION_CODES.KITKAT)
    private void handleLoadFinish() {
        locationManager = (LocationManager) getSystemService(Context.LOCATION_SERVICE);
        locationListener = new MyLocationListener(mainView);

        if(!checkPermissions()) {
            String[] permString = new String[]{Manifest.permission.ACCESS_COARSE_LOCATION, Manifest.permission.ACCESS_FINE_LOCATION};
            ActivityCompat.requestPermissions(this, permString, 1);
        }
        locationManager.requestLocationUpdates(LocationManager.GPS_PROVIDER, 1, 0, locationListener);
        locationManager.requestLocationUpdates(LocationManager.NETWORK_PROVIDER, 1, 0, locationListener);
    }

    @RequiresApi(api = Build.VERSION_CODES.M)
    private boolean checkPermissions() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M)
            return checkSelfPermission(Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED && checkSelfPermission(Manifest.permission.ACCESS_COARSE_LOCATION) == PackageManager.PERMISSION_GRANTED;
        else
            return false;
    }
}

