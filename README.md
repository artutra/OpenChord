# OpenChord
Cross-platform chordpro reader app for Android and iOS written with React Native.

# Features
Open Chord is a React Native application for both Android and iOS that allows you to organize your chord charts, lyric sheets and songbooks with a simple app on your tablet or smartphone. Open Chord easily allows you to get rid of all that paper by displaying your music in a flexible, easy to read format.

A few features include:

| Feature                          | Support            |
|:-------------------------------- |:------------------:|
| Render song with chordpro format | :heavy_check_mark: |
| Create/edit song                 | :clock2:           |
| Transpose song                   | :clock2:           |
| Build playlists                  | :clock2:           |
| Search saved songs               | :clock2:           |
| Slide with touch                 | :clock2:           |
| Slide with volume button         | :clock2:           |
| Show/hide responsive tabs        | :clock2:           |
| Multiple columns visualization   | :clock2:           |
| Configure font size              | :clock2:           |
| Import songs from the web        | :clock2:           |
| Show guitar chord diagrams       | :clock2:           |
| Multiple languages support       | :clock2:           |
| Chord dictionary                 | :clock2:           |
| Playlist presentation mode       | :clock2:           |

:heavy_check_mark: = supported
:clock2: = will be supported in a future version
:heavy_multiplication_x: = currently no plans to support it in the near future

## Try it yourself

### 1. Clone and Install

```bash
# clone the repo
git clone https://github.com/artutra/OpenChord.git

# Open the folder and install dependencies
cd OpenChord && npm install
```

### 2. Run it on both iOS and Android
```bash
# Run on iOS
npm run build:ios

# Run on Android
npm run build:android
```
### Or use Docker (for Android)
```bash
# Build the container and run the build scripts inside it
docker-compose run --service-ports android bash
```
Obs: The docker container can't attatch to the device via USB. You have to build the app-debug.apk using `npm run build:android`, copy the generated file inside `./android/app/build/outputs/apk/debug/app-debug.apk` and install it manually on the device.


## Built With

* [React Native v0.60](https://facebook.github.io/react-native/) - The framework for building native apps using React
* [Realm v3.0](https://github.com/realm/realm-js) - Realm is a mobile database that runs directly inside phones, tablets or wearables
* [React Navigation v4.0](https://reactnavigation.org) - React Native module support navigation
* [ChordSheetJS](https://github.com/martijnversluis/ChordSheetJS) - A JavaScript library for parsing and formatting chord sheets
* [ChordPro](https://www.chordpro.org/chordpro/index.html) - A text file format to write lead sheets, songs with lyrics and chords

## How can you help
If you find any problems, feature requests, please open an issue or submit a fix as a pull request.

## License
[GNU General Public License v3.0](LICENSE)

## Supported ChordPro directives

:heavy_check_mark: = supported

:clock2: = will be supported in a future version

:heavy_multiplication_x: = currently no plans to support it in the near future