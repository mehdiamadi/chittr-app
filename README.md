# Chittr

Chittr is a totally original, unique and non-plagiarised platform for microblogging. Users who sign up
for an account can publish ‘Chits’ – short, textual based posts of no more than 141 characters. Users
can also follow their friends and peers to keep updated with what their friends are Chitting about.

## Requirements
Node, Python2, JDK, Android Studio

All of which can be installed by following [React Native Getting Started](https://reactnative.dev/docs/getting-started.html) guide (Choose tab **React Native CLI Quickstart**)
   

## Installation

### Setting up the App

1. Clone this repo
2. `cd` into project directory
3. `npm install` or `yarn install`
4. Ensure emulator is ready or mobile device is connected to your machine
5. Run `npx react-native run-android`

### Setting up server

1. Navigate to the server directory with `cd chittr_server_v6`
2.  Run `npm install` (If you get any errors, try running it twice)
3.  Open the `./config/configs.js` file. You need to edit this file to point at your Mudfoot database
4.  Save the config file and run `npm start`
5.  You can test if the server is running by navigating to `http://localhost:3333/api/v0.0.5` in your browser, you should see `{"msg":"Server up"}`

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)
