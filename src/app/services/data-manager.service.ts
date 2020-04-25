import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataManagerService {
  private deviceUUID: string;
  private deviceModel: string;
  private accessToken: string;
  private refreshToken: string;
  private username: string;
  private password: string;
  // public tmpDoc: any;
  public tmpDoc: Uint8Array | Buffer | Blob | ArrayBuffer;

  constructor() {
    console.log('Hello DataManagerProvider Provider');
  }

  setDeviceUUID(deviceUUID) {
    this.deviceUUID = deviceUUID;
  }

  getDeviceUUID() {
    return this.deviceUUID;
  }

  setDeviceModel(deviceModel) {
    this.deviceModel = deviceModel;
  }

  getdeviceModel() {
    return this.deviceModel;
  }

  setAccessToken(accessToken) {
    this.accessToken = accessToken;
  }

  getAccessToken() {
    return this.accessToken;
  }

  setRefreshToken(refreshToken) {
    this.refreshToken = refreshToken;
  }

  getRefreshToken() {
    return this.refreshToken;
  }

  setUsername(username) {
    this.username = username;
  }

  getUsername() {
    return this.username;
  }

  setPassword(password) {
    this.password = password;
  }

  getPassword() {
    return this.password;
  }

  clearUserData() {
    this.password = '';
    this.accessToken = '';
    this.refreshToken = '';
    this.tmpDoc = null;
  }
}
