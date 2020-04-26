import { Component, OnInit } from '@angular/core';
import { RemoteServerManagerService } from '../services/remote-server-manager.service';
import { AlertController, ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { ChangePasswordModalPage } from '../change-password-modal/change-password-modal.page';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  public user: any = {};

  constructor(
    private remoteServerManager: RemoteServerManagerService,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private translate: TranslateService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter ProfilePage');
    this.remoteServerManager.getIdentity()
      .then(data => {
        this.user = data;
      })
      .catch(err => {
        console.log('[ERROR] getIdentity:', err);
        this.user = {};
      })
  }

  async changePasswordModal() {
    let modal = await this.modalCtrl.create({ component: ChangePasswordModalPage });
    await modal.present();
    let modalData = await modal.onDidDismiss();
    let data = modalData.data;
    if (data == null) {
      let alert = await this.alertCtrl.create({
        header: this.translate.instant('operationCanceled'),
        buttons: [this.translate.instant('ok')],
        backdropDismiss: false
      });
      alert.present();
    } else {
      this.remoteServerManager.changePassword(data.oldPassword, data.newPassword)
        .then(async (res) => {
          console.log('Change pass', res);
          let alert = await this.alertCtrl.create({
            header: this.translate.instant('operationComplete'),
            buttons: [this.translate.instant('ok')],
            backdropDismiss: false
          });
          alert.present();
        })
        .catch(async (err) => {
          console.log(err);
          let alert = await this.alertCtrl.create({
            header: this.translate.instant('error'),
            subHeader: err,
            buttons: [this.translate.instant('ok')],
            backdropDismiss: false
          });
          alert.present();
        });
    }
  }

  ngOnInit() {
  }

}
