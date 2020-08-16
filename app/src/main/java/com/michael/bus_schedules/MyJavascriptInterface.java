package com.michael.bus_schedules;

import android.content.Context;
import android.webkit.JavascriptInterface;

public class MyJavascriptInterface {
    MainActivity myContext;

    public MyJavascriptInterface(Context c) {
        myContext = (MainActivity)c;
    }

    @JavascriptInterface
    public void getCurrentPos(MyLocation loc) {
        loc = myContext.locationListener.currentPos;
    }
}
