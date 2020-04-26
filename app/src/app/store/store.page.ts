// Cart: https://devdactic.com/shopping-cart-ionic-4/
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { RemoteServerManagerService } from '../services/remote-server-manager.service';
import { ModalController, AlertController, Platform } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { CartService } from '../services/cart.service';
import { CartModalPage } from '../cart-modal/cart-modal.page';

@Component({
  selector: 'app-store',
  templateUrl: './store.page.html',
  styleUrls: ['./store.page.scss'],
})
export class StorePage implements OnInit {

  public storeId: number;
  public store: any = {};
  public products: any[] = [];
  public cart = [];
  public cartItemCount = new BehaviorSubject(0);

  @ViewChild('cart', {static: false, read: ElementRef})fab: ElementRef;

  constructor(
    private remoteServerManager: RemoteServerManagerService,
    private cartService: CartService,
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
              this.initCart();
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

  addToCart(product) {
    this.cartService.addProduct(product);
    this.animateCSS('tada');
  }

  async openCart() {
    this.animateCSS('bounceOutLeft', true);
 
    let modal = await this.modalCtrl.create({
      component: CartModalPage,
      cssClass: 'cart-modal'
    });
    modal.onWillDismiss().then(() => {
      this.fab.nativeElement.classList.remove('animated', 'bounceOutLeft')
      this.animateCSS('bounceInLeft');
    });
    modal.present();
  }
 
  animateCSS(animationName, keepAnimated = false) {
    const node = this.fab.nativeElement;
    node.classList.add('animated', animationName)
    
    //https://github.com/daneden/animate.css
    function handleAnimationEnd() {
      if (!keepAnimated) {
        node.classList.remove('animated', animationName);
      }
      node.removeEventListener('animationend', handleAnimationEnd)
    }
    node.addEventListener('animationend', handleAnimationEnd)
  }


  // addItem(item) {
  //   console.log(item);
  //   let added = false;
  //   for (let p of this.cart) {
  //     if (p.id === item.id) {
  //       p.amount += 1;
  //       added = true;
  //       break;
  //     }
  //   }
  //   if (!added) {
  //     item.amount = 1;
  //     this.cart.push(item);
  //   }
  //   this.cartItemCount.next(this.cartItemCount.value + 1);
  // }

  // decreaseItem(item) {
  //   for (let [index, i] of this.cart.entries()) {
  //     if (i.id === item.id) {
  //       i.amount -= 1;
  //       if (i.amount == 0) {
  //         this.cart.splice(index, 1);
  //       }
  //     }
  //   }
  //   this.cartItemCount.next(this.cartItemCount.value - 1);
  // }

  // removeItem(item) {
  //   for (let [index, i] of this.cart.entries()) {
  //     if (i.id === item.id) {
  //       this.cartItemCount.next(this.cartItemCount.value - p.amount);
  //       this.cart.splice(index, 1);
  //     }
  //   }
  // }


  initCart() {
    this.cartService.reset();
    this.cart = this.cartService.getCart();
    this.cartItemCount = this.cartService.getCartItemCount();
  }

  ngOnInit() {
  }
}
