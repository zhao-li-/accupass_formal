#!/usr/bin  
#user fortunezhang  
packagename="com.a.b.c"  
apkname="abc-debug.apk"  
  
echo 'auto running'  
echo 'building...'  
gen  
mdclean  
mdbuild  
  
echo 'turn to app'  
cd ..  
cd app  
adb clean  
  
echo 'uninstall app...'  
adb uninstall $packagename  
  
echo 'app build...'  
ant debug  
adb install -r bin/$apkname  
  
echo 'running activity'  
adb shell am start -n  $packagename/$packagename.activity.MainActivity  
  
echo 'backing...'  
cd ..  
cd www  
  
echo 'please see your phone'  
