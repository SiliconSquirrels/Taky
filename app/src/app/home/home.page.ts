import { Component, OnInit } from '@angular/core';
import { RemoteServerManagerService } from '../services/remote-server-manager.service';
import { ModalController, AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  public markets: any [] = [];

  constructor(
    private remoteServerManager: RemoteServerManagerService,
    private router: Router,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private translate: TranslateService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter HomePage');
    this.remoteServerManager.getMarketsDebug()
      .then(data => {
        this.markets = data;
      })
      .catch(err => {
        console.log('[ERROR] getMarketsDebug:', err);
        this.markets = [];
      })
  }

  goToStore(store) {
    console.log(store);
    this.router.navigate(['/store', { storeId: store.id }]);
  }

  ngOnInit() {
  }

}
