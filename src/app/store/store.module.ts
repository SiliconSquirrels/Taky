import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StorePageRoutingModule } from './store-routing.module';
import { TranslateModule } from '@ngx-translate/core';

import { StorePage } from './store.page';
import { CartModalPageModule } from '../cart-modal/cart-modal.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StorePageRoutingModule,
    TranslateModule,
    CartModalPageModule
  ],
  declarations: [StorePage]
})
export class StorePageModule {}
