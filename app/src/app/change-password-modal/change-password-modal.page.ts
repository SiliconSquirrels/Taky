import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import custom validator to validate that password and confirm password fields match
import { MustMatch } from '../_helpers/must-match.validator';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-change-password-modal',
  templateUrl: './change-password-modal.page.html',
  styleUrls: ['./change-password-modal.page.scss'],
})
export class ChangePasswordModalPage implements OnInit {
  public passwordsForm: FormGroup;


  public showOldPassword = false;
  public showNewPassword = false;
  public showConfirmPassword = false;

  constructor(private modalCtrl: ModalController,
    private formBuilder: FormBuilder) {

    this.passwordsForm = this.formBuilder.group({
      oldPassword: [
        '', Validators.compose([
          // Validators.pattern(PASSWORD_REGEXP),
          Validators.minLength(8),
          Validators.required
        ])
      ],
      password: [
        '', Validators.compose([
          // Validators.pattern(PASSWORD_REGEXP),
          Validators.minLength(8),
          Validators.required
        ])
      ],
      confirmPassword: [
        '', Validators.compose([
          // Validators.pattern(PASSWORD_REGEXP),
          Validators.minLength(8),
          Validators.required
        ])
      ],
    }, {
      validator: MustMatch('password', 'confirmPassword')
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChangePasswordModalPage');
  }

  isValid() {
    return this.passwordsForm.valid;
  }

  confirm() {
    if (this.isValid()) {
      let ret = {
        newPassword: this.passwordsForm.get('password').value,
        oldPassword: this.passwordsForm.get('oldPassword').value
      };
      console.log('ret:', ret);
      this.modalCtrl.dismiss(ret);
    }
  }

  dismissModal() {
    this.modalCtrl.dismiss(null);
  }

  hideShowOldPassword() {
    this.showOldPassword = !this.showOldPassword;
  }

  hideShowNewPassword() {
    this.showNewPassword = !this.showNewPassword;
  }

  hideShowConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  ngOnInit() {
  }

}
