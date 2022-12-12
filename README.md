# FlatMeta.io

## Prepare Environment
To get started with This Porject, requirements are as follow:

### Prerequisites:

- [Install and Setup Nodejs](https://nodejs.org/en/)
```
$ node --version
$ npm --version
```

### Ionic CLI Installation:

- [Ionic CLI](https://ionicframework.com/docs/cli)
```
$ npm install -g @ionic/cli
$ ionic -v 
```

### Download and Clone: 

```
$ git clone https://github.com/ffaady/
```

### Go to cloned folder and Install dependencies:

```
$ npm i
```

### Run Project:

```
$ ionic serve
```

## Contributing

Thanks for your interest in contributing! Read up on our guidelines for
[contributing](https://github.com/ffaady/flatmeta.io/blob/main/.github/CONTRIBUTING.md)
and then look through our issues with a [help wanted](ttps://github.com/ffaady/flatmeta.io/issues?q=is%3Aopen+is%3Aissue+label%3A%22help+wanted%22)
label.



### Android Development Setup:

- [Android Setup](https://ionicframework.com/docs/developing/android)

### IOS Development Setup:

- [IOS Setup](https://ionicframework.com/docs/developing/ios)

## Generate Release Builds:

### Web Build and Deployment:

Next, make Web build:

```$ ionic build --prod ```

Copy `www` folder to upload on web Server

### Android Play Store Deployment:

To generate a release build for Android, build your web app and then run the following cli command:

```$ npx cap copy && npx cap sync```

This will copy all web assets and sync any plugin changes.

Next, open Android studio:

```$ ionic cap build android --prod```

### Follow Guide to generate Signed AAB:
- [Android Signed AAB](https://ionicframework.com/docs/deployment/play-store#signing-an-apk)

### iOS App Store Deployment:

To generate a release build for Android, build your web app and then run the following cli command:

```$ npx cap copy && npx cap sync```

This will copy all web assets and sync any plugin changes.

Next, open Xcode:

```$ ionic cap build ios --prod```

### Follow Guide to generate xcode build:
- [XCODE build](https://ionicframework.com/docs/deployment/app-store)


## Install Plugins from here:

### Capacitor Plugins for Capacitor App:

- [Capacitor Plugins](https://capacitorjs.com/docs/plugins)

### Cordova Plugins for Capacitor App:

- [Cordova Plugins](https://ionicframework.com/docs/native)
