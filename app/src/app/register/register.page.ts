import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// import custom validator to validate that password and confirm password fields match
import { MustMatch } from '../_helpers/must-match.validator';
import { RemoteServerManagerService } from '../services/remote-server-manager.service';
import { async } from '@angular/core/testing';
import { LoadingController, AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

// https://github.com/Robinyo/big-top/blob/master/src/pages/validators/validator.ts
// The Angular email validator accepts an email like "rob@example", perhaps because "rob@localhost" could be valid.
// The pureEmail regex does not accept "ryan@example" as a valid email address, which I think is a good thing.
// See: EMAIL_REGEXP from https://github.com/angular/angular.js/blob/ffb6b2fb56d9ffcb051284965dd538629ea9687a/src/ng/directive/input.js#L16
const PURE_EMAIL_REGEXP = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
// Passwords should be at least 8 characters long and should contain one number, one character and one special character.
const PASSWORD_REGEXP = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

const USERNAME_REGEXP = /^[A-Za-z0-9]{6,15}$/;
// const _PHONE_REGEXP = /^\+?[0-9]+$/;
const PHONE_REGEXP = /^\(?\+[0-9]{1,3}\)? ?-?[0-9]{1,3} ?-?[0-9]{3,5} ?-?[0-9]{4}( ?-?[0-9]{3})? ?(\w{1,10}\s?\d{1,6})?$/;


@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  public credentialsForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private remoteServerManager: RemoteServerManagerService,
    private translate: TranslateService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private router: Router) {

    this.credentialsForm = this.formBuilder.group({
      email: ['', Validators.compose([
        Validators.pattern(PURE_EMAIL_REGEXP),
        Validators.required
      ])],
      password: ['', Validators.compose([
        // Validators.pattern(PASSWORD_REGEXP),
        Validators.minLength(8),
        Validators.required
      ])],
      confirmPassword: ['', Validators.compose([
        Validators.required
      ])],
      // username: ['', Validators.required],
      name: ['', Validators.required],
      surname: ['', Validators.required],
      phone: ['', Validators.compose([
        Validators.pattern(PHONE_REGEXP),
        Validators.required
      ])],
      consentGDPR: [false, Validators.pattern('true')],
      newsletter: [false]
    }, {
      validator: MustMatch('password', 'confirmPassword')
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

  async onRegister() {
    console.log('RegisterPage: onRegister()');

    const email: string = this.credentialsForm.get('email').value.trim();
    const name = this.credentialsForm.get('name').value.trim();
    const surname = this.credentialsForm.get('surname').value.trim();
    const phone = this.credentialsForm.get('phone').value.trim();
    // const username = this.credentialsForm.get('username').value;
    const password = this.credentialsForm.get('password').value;
    const spinner = await this.loadingCtrl.create({
      message: this.translate.instant('login.wait')
    });

    spinner.present();

    this.remoteServerManager.registerUser(email, name, surname,
      /*username,*/phone, password)
      .then(async () => {
        await spinner.dismiss()

        const alert = await this.alertCtrl.create({
          header: this.translate.instant('operationComplete'),
          subHeader: this.translate.instant('register.successMessage'),
          buttons: [
            {
              text: this.translate.instant('ok'),
              role: 'ok',
              handler: () => {
                this.router.navigate(['/login'], { replaceUrl: true });
              }
            }]
        });

        await alert.present();
      })
      .catch(async (err) => {
        spinner.dismiss()
        const alert = await this.alertCtrl.create({
          header: this.translate.instant('operationFailed'),
          subHeader: this.translate.instant(err),
          buttons: [this.translate.instant('ok')]
        });
        await alert.present();
      });
  }

  infoPrivacy() {
    const page = this.translate.instant('register.infoPrivacyLink');
    window.open(page);
  }

  ngOnInit() {
  }

}
