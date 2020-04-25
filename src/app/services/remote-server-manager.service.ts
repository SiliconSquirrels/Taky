import { Injectable } from '@angular/core';
import { HTTP, HTTPResponse } from '@ionic-native/http/ngx';
import { DataManagerService } from './data-manager.service';
import { ProfilePage } from '../profile/profile.page';

const LOGIN_API = '/oauth/token';
const IDENTITY_API = '/user/getIdentity';
const CHANGE_PASSWORD_API = '/user/changePassword';
const UNREGISTER_API = '/user/unregister';
const FORGOT_PASSWORD_API = '/user/forgotPassword';
const LOGOUT_API = '/user/logout';
const REGISTRATION_API = '/user/register';


@Injectable({
  providedIn: 'root'
})
export class RemoteServerManagerService {


  private ipAddress: string = '';
  private port: string = '';
  // private authPort: string = "9990";
  private clientID: string = 'bd21b69f-6e9c-4fbc-900';
  private timeout: number = 20000;

  private noAuthHeaders = {
    "Access-Control-Allow-Origin": '*',
    "Access-Control-Allow-Methods": 'POST, GET, OPTIONS, PUT',
    "Accept": 'application/json',
    "content-type": 'application/json',
  };

  private authHeaders = {
    "Access-Control-Allow-Origin": '*',
    "Access-Control-Allow-Methods": 'POST, GET, OPTIONS, PUT',
    "Accept": 'application/json',
    "content-type": 'application/json',
    "Authorization": 'Bearer ' + this.dataManager.getAccessToken(),
  };

  private documentHeaders = {
    "Access-Control-Allow-Origin": '*',
    "Access-Control-Allow-Methods": 'POST, GET, OPTIONS, PUT',
    "Accept": 'application/json',
    "content-type": 'application/json',
    "Authorization": 'Bearer ' + this.dataManager.getAccessToken(),
    "device_token": this.dataManager.getDeviceUUID()
  };




  constructor(
    private dataManager: DataManagerService,
    private http: HTTP) {
    console.log('Hello RemoteServerManagerProvider Provider');
  }

  makeUrl(arg: string): string {
    return "https://" + this.ipAddress + ":" + this.port + arg;
  }

  setIpAddress(ip: string) {
    this.ipAddress = ip;
  }

  getIpAddress() {
    return this.ipAddress;
  }

  setPort(port: string) {
    this.port = port;
  }

  getPort() {
    return this.port;
  }

  fixHeaders() {
    this.authHeaders.Authorization = 'Bearer ' + this.dataManager.getAccessToken();
    this.documentHeaders.Authorization = 'Bearer ' + this.dataManager.getAccessToken();
    this.documentHeaders.device_token = this.dataManager.getDeviceUUID();
  }

  /*async*/ login(user: string, password: string) {
    let isComplete = false;
    let url = this.makeUrl(LOGIN_API);
    // disable SSL cert checking, only meant for testing purposes, do NOT use in production!
    this.http.setServerTrustMode('nocheck').then(() => console.log('https success'), () => 'https failure');

    //Important to set the data serializer or the request gets rejected
    this.http.setDataSerializer('json');

    let headers = this.http.getHeaders('*');
    console.log('headers', headers);
    console.log('url', url);

    var credentials = {
      username: user,
      password: password,
      grant_type: "password",
      client_id: this.clientID
    };

    return new Promise((resolve, reject) => {
      // this.http.post(url, credentials, { /*"headers": headers*/ })
      this.http.post(url, credentials, this.noAuthHeaders)
        .then((res: HTTPResponse) => {
          let data = JSON.parse(res.data);
          isComplete = true;
          console.log('data', data);
          this.dataManager.setAccessToken(data.access_token);
          this.dataManager.setRefreshToken(data.refresh_token);
          this.fixHeaders();
          resolve(res);
        },
          (err: any) => {
            isComplete = true;
            // const err = JSON.parse(e);
            console.log('http err:', err);
            if ('error' in err) {
              try {
                const e = JSON.parse(err.error);
                console.log('error:', e);
                return reject('serverError.' + e.error);
              } catch (e) {
                console.log(e);
              }
              // if ('error' in err.error) {
              //   return reject('serverError.' + err.error.error);
              // }

              // if('error_description' in err.error) {
              //   return reject(err.error.error_description);
              // }
            }
            console.log('[Error]', err);
            return reject('serverError.error'); // errore generico
          });

      setTimeout(() => {
        if (!isComplete) {
          isComplete = true;
          console.log('RemoteServerManager: Timeout in connect')
          return reject('error.serverTimeout')
        }
      }, this.timeout);
    });
  }

  getIdentity() {
    return this.get(IDENTITY_API, this.authHeaders);
  }

  logout() {
    return this.get(LOGOUT_API, this.authHeaders);
  }

  unregister() {
    return this.delete(UNREGISTER_API, {}, this.authHeaders);
  }

  changePassword(oldPassword: string, newPassword: string) {
    let body = {
      "old_password": oldPassword,
      "new_password": newPassword
    };
    return this.post(CHANGE_PASSWORD_API, body, this.authHeaders);
  }

  forgotPassword(email: string) {
    let body = {
      "email": email
    };
    return this.post(FORGOT_PASSWORD_API, body, this.noAuthHeaders);
  }

  registerUser(email: string,
    name: string,
    surname: string,
    phone: string,
    // username: string,
    password: string) {
    let body = {
      "email": email,
      "name": name,
      "surname": surname,
      "phone": phone,
      // "username": username,
      "password": password,
    };
    return this.post(REGISTRATION_API, body, this.noAuthHeaders);
  }

  /*async*/ post(api: string, body: Object, headers: object) {
    let isComplete = false;
    let url = this.makeUrl(api);

    // disable SSL cert checking, only meant for testing purposes, do NOT use in production!
    this.http.setServerTrustMode('nocheck').then(() => console.log('https success'), () => 'https failure');

    //Important to set the data serializer or the request gets rejected
    this.http.setDataSerializer('json');

    return new Promise((resolve, reject) => {
      this.http.post(url, body, headers)
        .then((res: any) => {
          let data = JSON.parse(res.data);
          isComplete = true;
          resolve(data);
        },
          (err) => {
            isComplete = true;

            console.log('http err:', err);
            if ('error' in err) {
              try {
                const e = JSON.parse(err.error);
                console.log('error:', e);
                return reject('serverError.' + e.error.replace(/ /g, ''));
              } catch (e) {
                console.log(e);
              }
            }
            console.log('[Error]', err);
            return reject('serverError.error'); // errore generico
          });

      setTimeout(() => {
        if (!isComplete) {
          isComplete = true;
          console.log('RemoteServerManager: Timeout in connect')
          return reject('error.serverTimeout')
        }
      }, this.timeout);
    });
  }

  /*async*/ get(api: string, headers: object) {
    let isComplete = false;
    let url = this.makeUrl(api);

    // disable SSL cert checking, only meant for testing purposes, do NOT use in production!
    this.http.setServerTrustMode('nocheck').then(() => console.log('https success'), () => 'https failure');

    //Important to set the data serializer or the request gets rejected
    this.http.setDataSerializer('json');

    return new Promise((resolve, reject) => {
      this.http.get(url, {}, headers)
        .then((res: any) => {
          isComplete = true;
          let data = JSON.parse(res.data);
          resolve(data);
        },
          (err) => {
            isComplete = true;
            console.log('http err:', err);
            if ('error' in err) {
              try {
                const e = JSON.parse(err.error);
                console.log('error:', e);
                return reject('serverError.' + e.error.replace(/ /g, ''));
              } catch (e) {
                console.log(e);
              }
            }
            console.log('[Error]', err);
            return reject('serverError.error'); // errore generico
          });

      setTimeout(() => {
        if (!isComplete) {
          isComplete = true;
          console.log('RemoteServerManager: Timeout in connect');
          return reject("error.serverTimeout");
        }
      }, this.timeout);
    });
  }

  /*async*/ delete(api: string, parameters: object, headers: object) {
    let isComplete = false;
    let url = this.makeUrl(api);

    // disable SSL cert checking, only meant for testing purposes, do NOT use in production!
    this.http.setServerTrustMode('nocheck').then(() => console.log('https success'), () => 'https failure');

    //Important to set the data serializer or the request gets rejected
    this.http.setDataSerializer('json');

    return new Promise((resolve, reject) => {
      // this.http.delete(url, parameters, { /*"headers": headers*/ })
      this.http.delete(url, parameters, headers)
        .then((res: any) => {
          isComplete = true;
          let data = JSON.parse(res.data);
          resolve(data);
        },
          (err) => {
            isComplete = true;
            console.log('http err:', err);
            if ('error' in err) {
              try {
                const e = JSON.parse(err.error);
                console.log('error:', e);
                return reject('serverError.' + e.error.replace(/ /g, ''));
              } catch (e) {
                console.log(e);
              }
            }
            console.log('[Error]', err);
            return reject('serverError.error'); // errore generico
          });

      setTimeout(() => {
        if (!isComplete) {
          isComplete = true;
          console.log('RemoteServerManager: Timeout in connect')
          return reject("error.serverTimeout")
        }
      }, this.timeout);
    });
  }

  ////////////////////////////////////////////////////
  //// DEBUG FUNCTIONS
  ////////////////////////////////////////////////////
  getIdentityDebug() {
    return new Promise((resolve) => {
      let user = {
        name: "Nome",
        surname: "Cognome",
        // username: "username",
        email: "user@example.com",
        phone: "3334445556",
      };
      resolve(user);
    });
  }

  markets = [{
    id: 1,
    name: "Grocery",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
    img: "assets/imgs/markets/market-5043879_960_720.png"
  },
  {
    id: 2,
    name: "Bakery",
    description: "",
    img: "assets/imgs/markets/bread-306914_960_720.png"
  },
  {
    id: 3,
    name: "Clothing",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
    img: "assets/imgs/markets/jacket-fashion-male-style.jpg"
  },
  {
    id: 4,
    name: "Shoes",
    description: "",
    img: "assets/imgs/markets/box-2864334_960_720.png"
  },
  {
    id: 5,
    name: "Bakery",
    description: "",
    img: "assets/imgs/markets/pitr_bakery_buns.png"
  },
  {
    id: 6,
    name: "Records",
    description: "",
    img: "assets/imgs/markets/masonmouse_45_Record_Album.png"
  }];

  getMarketsDebug(): Promise<any[]> {
    return new Promise((resolve) => {
      resolve(this.markets);
    });
  }


  getStoreByIdDebug(marketId: number): Promise<any> {
    let market = this.markets.find(m => m.id == marketId);
    return new Promise((resolve) => {
      resolve(market);
    });
  }

  getProductsDebug(marketId: number): Promise<any[]> {
    let products = [];
    console.log(marketId);

    products = [{
      id: 1,
      name: "Pasta",
      description: "Spaghetti n.5, 1kg",
      price: 1.4,
      img: "assets/imgs/markets/market-5043879_960_720.png"
    },
    {
      id: 2,
      name: "Tomato sauce",
      description: "Home made sauce, 500g",
      price: 4.5,
      img: "assets/imgs/markets/market-5043879_960_720.png"
    },
    {
      id: 3,
      name: "Olive oil",
      description: "Extra virgin olive oil, 1l",
      price: 8.5,
      img: "assets/imgs/markets/market-5043879_960_720.png"
    }];

    return new Promise((resolve) => {
      resolve(products);
    });
  }

  changePasswordDebug(oldPassword: string, newPassword: string) {
    return new Promise((resolve, reject) => {
      let success = true;
      if (oldPassword == null || oldPassword == undefined)
        success = false;
      else if (newPassword == null || newPassword == undefined)
        success = false;
      else if (oldPassword.length < 8 || newPassword.length < 8)
        success = false;

      if (success) {
        resolve(true);
      }
      else {
        reject("Errore! Controllare i dati inseriti");
      }
    });
  }

}