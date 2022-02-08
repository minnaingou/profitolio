// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebaseUrl:
    'https://profitolio-default-rtdb.asia-southeast1.firebasedatabase.app',
  coingeckoBaseApiUrl: 'https://api.coingecko.com/api/v3',
  coingeckoLatestPrices: '/simple/price',
  coingeckoCoinList: '/coins/list',
  authBaseUrl: 'https://identitytoolkit.googleapis.com/v1/accounts',
  loginApi: ':signInWithPassword?key=',
  signUpApi: ':signUp?key=',
  apiKey: 'AIzaSyD0XJHFDrPlfZ4otpkX3N6YxczqeVlTW80',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
