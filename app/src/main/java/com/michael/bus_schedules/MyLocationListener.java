package com.michael.bus_schedules;

import android.location.Location;
import android.location.LocationListener;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;
import android.webkit.WebView;

import androidx.annotation.RequiresApi;

public class MyLocationListener implements LocationListener {
    private  WebView myWebView;
    public MyLocation currentPos;

    @RequiresApi(api = Build.VERSION_CODES.KITKAT)
    public MyLocationListener(WebView webView) {
        super();
        myWebView = webView;
        currentPos = new MyLocation(0.0, 0.0);
    }

    @Override
    @RequiresApi(api = Build.VERSION_CODES.KITKAT)
    public void onLocationChanged(Location location) {
        double posX = location.getLatitude();
        double posY = location.getLongitude();
        if (currentPos.testSame(posX, posY)) return;
        currentPos.updatePos(posX, posY);
        myWebView.evaluateJavascript(String.format("updatePos(%f, %f)", posX, posY), null);
    }

    @Override
    public void onStatusChanged(String provider, int status, Bundle extras) {

    }

    @Override
    public void onProviderEnabled(String provider) {

    }

    @Override
    public void onProviderDisabled(String provider) {

    }
}

class MyLocation {
    public double posX;
    public double posY;

    public MyLocation(double x, double y) {
        this.posX = x;
        this.posY = y;
    }

    public boolean testSame(double x, double y) {
        return this.posX == x && this.posY == y;
    }

    public void updatePos(double x, double y) {
        this.posX = x;
        this.posY = y;
    }
}