// https://devdactic.com/shopping-cart-ionic-4/
import { Component, OnInit } from '@angular/core';
import { CartService } from '../services/cart.service';
import { ModalController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-cart-modal',
  templateUrl: './cart-modal.page.html',
  styleUrls: ['./cart-modal.page.scss'],
})
export class CartModalPage implements OnInit {

  cart: any[] = [];

  constructor(private cartService: CartService,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController) { }

  ngOnInit() {
    this.cart = this.cartService.getCart();
  }

  decreaseCartItem(product) {
    this.cartService.decreaseProduct(product);
  }

  increaseCartItem(product) {
    this.cartService.addProduct(product);
  }

  removeCartItem(product) {
    this.cartService.removeProduct(product);
  }

  getTotal() {
    return this.cart.reduce((i, j) => i + j.price * j.amount, 0);
  }

  close() {
    this.modalCtrl.dismiss();
  }

  async checkout() {
    // Perfom PayPal or Stripe checkout process

    let alert = await this.alertCtrl.create({
      header: 'Thanks for your Order!',
      message: '...............',
      buttons: ['OK']
    });
    alert.present().then(() => {
      this.modalCtrl.dismiss();
      this.cartService.reset();
    });
  }

}
