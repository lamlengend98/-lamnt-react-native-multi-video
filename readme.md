
  

# react-native-multiple-video-player

  

This package contains a simple set of GUI controls and support playing multiple videos in a queue that work with the [react-native-video](https://github.com/react-native-community/react-native-video) `<Video>` component. This includes a back button, volume bar, fullscreen toggle, play/pause toggle, seekbar, title, error handling and timer toggle that can switch between time remaining and current time when tapped.

  

## Table of Contents  

*  [Installation](#installation)
	*  [iOS](#ios-installation)
	*  [Android](#android-installation)
*  [Usage](#usage)
*  [Contributing](#contributing)
*  [Todos](#todos)

## Installation
 

Using npm:

  

```shell

npm install react-native-multiple-video-player

```

or using yarn:

```shell

yarn add react-native-multiple-video-player

```

Then follow the instructions for your platform to link react-native-video into your project:

  

### iOS installation

<details>

<summary>iOS details</summary>

  

**React Native 0.60 and above**

  

Run `npx pod-install`. Linking is not required in React Native 0.60 and above.

  

Add the following to your project's `AppDelegate.m`:

  

```diff
+#import "Orientation.h"
 

@implementation AppDelegate
  

// ...

  

+- (UIInterfaceOrientationMask)application:(UIApplication *)application supportedInterfaceOrientationsForWindow:(UIWindow *)window {

+ return [Orientation getOrientation];

+}

  

@end

```

  

**React Native 0.59 and below**

Run `react-native link` to link the react-native-video library.

  

</details>

  

### Android installation

<details>

<summary>Android details</summary>

**React Native 0.60 and above**

  

Will work fine with React Native 0.60.

  

**React Native 0.59 and below**

  

Add following to android/app/src/main/AndroidManifest.xml

  

```diff
<activity
....
+ android:configChanges="keyboard|keyboardHidden|orientation|screenSize"
android:windowSoftInputMode="adjustResize">
....
</activity>
```
Implement onConfigurationChanged method (in `MainActivity.java`)
```diff
// ...
+import android.content.Intent;
+import android.content.res.Configuration;

public class MainActivity extends ReactActivity {
+ @Override
+ public void onConfigurationChanged(Configuration newConfig) {
+ super.onConfigurationChanged(newConfig);
+ Intent intent = new Intent("onConfigurationChanged");
+ intent.putExtra("newConfig", newConfig);
+ this.sendBroadcast(intent);
+ }
// ......
}

```

  

Add following to MainApplication.java

(This will be added automatically by auto link. If not, please manually add the following )

  

```diff
//...
+import org.wonday.orientation.OrientationPackage;
  @Override
protected List<ReactPackage> getPackages() {
@SuppressWarnings("UnnecessaryLocalVariable")
List<ReactPackage> packages = new PackageList(this).getPackages();
// Packages that cannot be autolinked yet can be added manually here, for example:
// packages.add(new MyReactNativePackage());
+ packages.add(new OrientationPackage());
return packages;
}

//...
```
</details>

  
  
  

## Usage

```python

import React from  'react';
import VideoPlayer from  "react-native-multiple-video-player"

const DATA = [
	{
		uri: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
		title: "Elephant Dream"
	},
	{
		uri: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
		title: "For Bigger Blazes"
	},
]

const App = () => {

return (<VideoPlayer
			data={DATA}
	/>)
}
```

### Configurable props

*  [autoPlay](#autoplay)

*  [autoPlayNextVideo](#autoplaynextvideo)

*  [controlTimeout](#controltimeout)

*  [data](#data)

*  [defaultVideoIndex](#defaultvideoindex)

*  [fullscreenOrientation](#fullscreenorientation)

*  [loop](#loop)

*  [posterResizeMode](#posterresizemode)

*  [rate](#rate)

*  [resizeMode](#resizemode)

*  [showBottomProgresssBar](#showbottomprogresssbar)

*  [showLockOrientationIcon](#showlockorientationicon)

  

### Event props

*  [onBack](#onback)

*  [onEnd](#onend)

*  [onLoad](#onload)

*  [onLoadStart](#onloadstart)

*  [onPause](#onpause)

*  [onPlay](#onplay)

  

### Configurable props

  

#### autoPlay

on load whether the video should be played automatically or not.

*  **true (default)** - auto play video on load

*  **false** - disable auto play

Type: bollean

Platforms: all

  

#### autoPlayNextVideo

on load whether the video should be played automatically or not.

*  **true (default)** - plays the next video automatically on end of currently playing

*  **false** - will not plays the next video on end of currently playing

Type: bollean

Platforms: all

  

#### controlTimeout

Hide controls after X amount of time in milliseconds

Default valye: 2000

Platforms: all

  

#### data

Sets the media source. You can pass an array of objects as shown below. The media source can be local as well

  

Example:

```

data={[

{

uri: "https://www.example.com/video.mp4",

title:"Sample video title"

},

{

uri: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",

title: "For Bigger Blazes"

}

]}

```

Type: array

Platforms: all

  

#### defaultVideoIndex

Sets the index of the video to be played by default. Default value is 0.

Type: number

Platforms: all

  
  

#### fullscreenOrientation

  

*  **all (default)**

*  **landscape**

*  **portrait**

  

Platforms: all

  

#### loop

  

*  **all (default)**

*  **one**

*  **none**

  

Platforms: all

  

#### posterResizeMode

  

*  **contain (default)**

*  **cover**

*  **stretch**

*  **none**

  

#### rate

Speed at which the media should play.

*  **0.0** - Pauses the video

*  **1.0** - Play at normal speed

*  **Other values** - Slow down or speed up playback

  

Platforms: all

  

#### resizeMode

  

*  **contain (default)**

*  **cover**

*  **stretch**

*  **none**

  #### showBottomProgresssBar
  determines should the progress bar should be visible or not.
*  **true (default)**

*  **false**

#### showLockOrientationIcon
determines should the orientation lock icon should be visible or not.
*  **true (default)**

*  **false**

  

Platforms: all

  

### Event props

  

#### onBack

Callback function that is called when back button is pressed, override if using custom navigation.

  

Payload: none

  

Platforms: all

  

#### onEnd

Callback function that is called when the player reaches the end of the media.

  

Payload: none

  

Platforms: all

  

#### onLoad

Callback function that is called when the media is loaded and ready to play.

  

Payload:

  

Property | Type | Description

--- | --- | ---

currentPosition | number | Time in seconds where the media will start

duration | number | Length of the media in seconds

naturalSize | object | Properties:<br> * width - Width in pixels that the video was encoded at<br> * height - Height in pixels that the video was encoded at<br> * orientation - "portrait" or "landscape"

audioTracks | array | An array of audio track info objects with the following properties:<br> * index - Index number<br> * title - Description of the track<br> * language - 2 letter [ISO 639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) or 3 letter [ISO639-2](https://en.wikipedia.org/wiki/List_of_ISO_639-2_codes) language code<br> * type - Mime type of track

textTracks | array | An array of text track info objects with the following properties:<br> * index - Index number<br> * title - Description of the track<br> * language - 2 letter [ISO 639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) or 3 letter [ISO 639-2](https://en.wikipedia.org/wiki/List_of_ISO_639-2_codes) language code<br> * type - Mime type of track

videoTracks | array | An array of video track info objects with the following properties:<br> * trackId - ID for the track<br> * bitrate - Bit rate in bits per second<br> * codecs - Comma separated list of codecs<br> * height - Height of the video<br> * width - Width of the video

  

Example:

```

{

"audioTracks":[],

"canPlayFastForward":false,

"canPlayReverse":false,

"canPlaySlowForward":false,

"canPlaySlowReverse":false,

"canStepBackward":false,

"canStepForward":false,

"currentTime":0,

"duration":5.567999839782715,

"naturalSize":{

"height":320,

"orientation":"landscape",

"width":560

},

"target":3,

"textTracks":[]

}

```

  

Platforms: all

  

#### onLoadStart

Callback function that is called when the media starts loading.

  

Payload:

  

Property | Description

--- | ---

isNetwork | boolean | Boolean indicating if the media is being loaded from the network

type | string | Type of the media. Not available on Windows

uri | string | URI for the media source. Not available on Windows

  

Example:

```

{

isNetwork: true,

type: '',

uri: 'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8'

}

```

Platforms: all

  

#### onPause

Callback function that is called when the track is paused.

  

Payload: none

  

Platforms: all

  

#### onPlay

Callback function that is called when the track is played.

  

Payload: none

  

Platforms: all

  

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

  

Please make sure to update the tests as appropriate.

  

## Todos

- [ ] More customization in the video progress seeker.

- [ ] Skip video on double tap.

---

  

**MIT Licensed**