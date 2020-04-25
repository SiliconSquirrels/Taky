import { Component, OnInit } from '@angular/core';
import { RemoteServerManagerService } from '../services/remote-server-manager.service';
import { ModalController, AlertController, Platform } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Router, ParamMap, ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-store',
  templateUrl: './store.page.html',
  styleUrls: ['./store.page.scss'],
})
export class StorePage implements OnInit {

  public storeId: number;
  public store: any = {};
  public products: any[] = [];

  constructor(
    private remoteServerManager: RemoteServerManagerService,
    private route: ActivatedRoute,
    private platform: Platform,
    private router: Router,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private translate: TranslateService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StorePage');
  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter StorePage');

    // this.storeId = this.route.paramMap.pipe(switchMap((params: ParamMap) => {
    //   return params.get('storeId');
    // });


    this.route.params.subscribe(params => {
      this.storeId = params['storeId'];
      this.remoteServerManager.getStoreByIdDebug(this.storeId)
        .then(store => {
          this.store = store;
          console.log(store);

          this.remoteServerManager.getProductsDebug(this.storeId)
            .then(data => {
              console.log(data);
              this.products = data;
            })
            .catch(err => {
              console.log('[ERROR] getMarketsDebug:', err);
              this.products = [];
            })
        })
        .catch(err => {
          console.log('[ERROR] getStoreByIdDebug:', err);
          this.products = [];
        });
    });
  }

  addItem(item) {
    console.log(item);
  }

  ngOnInit() {
  }
}
