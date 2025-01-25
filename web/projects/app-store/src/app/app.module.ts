import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ModuleWithProviders } from '@angular/core';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { LayoutModule } from '@angular/cdk/layout';
import { HttpClientModule } from '@angular/common/http';
import { AppLibModule, AppOverlayContainer } from 'app-lib';

import {
  MatAutocompleteModule,
  MatBadgeModule,
  MatBottomSheetModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatDividerModule,
  MatExpansionModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatStepperModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  MatTreeModule,
} from '@angular/material';
import { AppRoutingModule } from './app-routing.module';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { WarehousingComponent } from './warehousing/warehousing.component';
import { OrderingComponent } from './ordering/ordering.component';
import { InventorycontrolComponent } from './inventorycontrol/inventorycontrol.component';
import { InventoryprofitComponent } from './inventoryprofit/inventoryprofit.component';
import { IssueManagementComponent } from './issue-management/issue-management.component';
import { OrderingTableComponent } from './ordering/ordering-table/ordering-table.component';
import { CheckresultComponent } from './inventorycontrol/checkresult/checkresult.component';
import { InventorycontrolCheckComponent } from './inventorycontrol/check/check.component';
import { InventorycontrolCheckConfirmComponent } from './inventorycontrol/check-confirm/check-confirm.component';
import { StoreRegComponent } from './store-reg/store-reg.component';
import { MenuMgmtComponent } from './menu-mgmt/menu-mgmt.component';
import { MenuEditComponent } from './menu-mgmt/menu-cat/menu-edit/menu-edit.component';
import { MenuEditChildComponent } from './menu-mgmt/menu-cat/menu-child-edit/menu-child-edit.component';
import { MenuDetailComponent } from './menu-mgmt/menu-detail/menu-detail.component';
import { OptionEditComponent } from './menu-mgmt/menu-option/option-edit/option-edit.component';
import { OptionEditChildComponent } from './menu-mgmt/menu-option/option-child-edit/option-child-edit.component';
import { IngredientsComponent } from './ingredients/ingredients.component';
import { UserManagerComponent } from './user-manager/user-manager.component';
import { UserAddManagerComponent } from './user-manager/user-add-manager/user-add-manager.component';
import { UserEditManagerComponent } from './user-manager/user-edit-manager/user-edit-manager.component';
import { UserComponent } from './user/user.component';
import { UserAddComponent } from './user/user-add/user-add.component';
import { UserEditComponent } from './user/user-edit/user-edit.component';
import { UserGroupComponent } from './user-group/user-group.component';
import { UserAddGroupComponent } from './user-group/user-add-group/user-add-group.component';
import { SetsubiManagerComponent } from './setsubi-manager/setsubi-manager.component';
import { SetsubiErrorComponent } from './setsubi-error/setsubi-error.component';
import { UserEditGroupComponent } from './user-group/user-edit-group/user-edit-group.component';
import { IngredientsListComponent } from './ingredients/ingredients-list/ingredients-list.component';
import { IngredientsCatComponent } from './ingredients/ingredients-cat/ingredients-cat.component';
import { IngredientsEditComponent } from './ingredients/ingredients-edit/ingredients-edit.component';
import { CatRegComponent } from './ingredients/ingredients-cat/cat-reg/cat-reg.component';
import { ShopCostComponent } from './shop-cost/shop-cost.component';
import { ShopCostListComponent } from './shop-cost/shop-cost-list/shop-cost-list.component';
import { SupplierListComponent } from './shop-cost/supplier-list/supplier-list.component';
import { ShopCostCatComponent } from './shop-cost/shop-cost-cat/shop-cost-cat.component';
import { ShopCostEditComponent } from './shop-cost/shop-cost-edit/shop-cost-edit.component';
import { SupplierEditComponent } from './shop-cost/supplier-edit/supplier-edit.component';
import { ShopCostCatRegComponent } from './shop-cost/shop-cost-cat/shop-cost-cat-reg/shop-cost-cat-reg.component';
import { MenuCatComponent } from './menu-mgmt/menu-cat/menu-cat.component';
import { AddCatComponent } from './menu-mgmt/menu-cat/add-cat/add-cat.component';
import { MenuOptionComponent } from './menu-mgmt/menu-option/menu-option.component';
import { AddOptionComponent } from './menu-mgmt/menu-option/add-option/add-option.component';
import { MenuListComponent } from './menu-mgmt/menu-list/menu-list.component';
import { MenuThemeListComponent } from './menu-mgmt/menu-themelist/menu-themelist.component';
import { ChartComponent } from './chart/chart.component';
import { PaymentComponent } from './payment/payment.component';
import { PaymentListComponent } from './payment/payment-list/payment-list.component';
import { PaymentEditComponent } from './payment/payment-list/payment-edit/payment-edit.component';
import { SeatManagerComponent } from './seat-manager/seat-manager.component';
import { SeatEditComponent } from './seat-manager/seat-edit/seat-edit.component';
import { TakeoutOrderComponent } from './takeout-order/takeout-order.component';
import { MenuConfirmComponent } from './menu-mgmt/menu-confirm/menu-confirm.component';
import { QrcodeSettingComponent } from './qrcode-setting/qrcode-setting.component';
import { CounterManagerComponent } from './counter-manager/counter-manager.component';
import { NgxEchartsModule } from 'ngx-echarts';
import { MenuGiftComponent } from './menu-gift/menu-gift.component';
import { MenuGiftAddComponent } from './menu-gift/menu-gift-add/menu-gift-add.component';
import { MenuGiftEditComponent } from './menu-gift/menu-gift-edit/menu-gift-edit.component';

const providers = [];

@NgModule({
  declarations: [
    AppComponent,
    WarehousingComponent,
    OrderingComponent,
    InventorycontrolComponent,
    InventoryprofitComponent,
    IssueManagementComponent,
    OrderingTableComponent,
    CheckresultComponent,
    InventorycontrolCheckComponent,
    InventorycontrolCheckConfirmComponent,
    StoreRegComponent,
    MenuMgmtComponent,
    MenuEditComponent,
    MenuEditChildComponent,
    MenuDetailComponent,
    OptionEditComponent,
    OptionEditChildComponent,
    IngredientsComponent,
    UserManagerComponent,
    UserAddManagerComponent,
    UserComponent,
    UserAddComponent,
    UserEditComponent,
    UserGroupComponent,
    UserAddGroupComponent,
    SetsubiManagerComponent,
    SetsubiErrorComponent,
    UserEditGroupComponent,
    UserEditManagerComponent,
    IngredientsListComponent,
    IngredientsCatComponent,
    IngredientsEditComponent,
    CatRegComponent,
    ShopCostComponent,
    ShopCostListComponent,
    SupplierListComponent,
    ShopCostCatComponent,
    ShopCostEditComponent,
    SupplierEditComponent,
    ShopCostCatRegComponent,
    MenuCatComponent,
    AddCatComponent,
    MenuOptionComponent,
    AddOptionComponent,
    MenuListComponent,
    MenuThemeListComponent,
    ChartComponent,
    PaymentComponent,
    CounterManagerComponent,
    PaymentListComponent,
    PaymentEditComponent,
    SeatManagerComponent,
    SeatEditComponent,
    TakeoutOrderComponent,
    QrcodeSettingComponent,
    MenuConfirmComponent,
    MenuGiftComponent,
    MenuGiftAddComponent,
    MenuGiftEditComponent
  ],
  imports: [
    AppLibModule,
    BrowserModule,
    BrowserAnimationsModule,
    LayoutModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatAutocompleteModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatStepperModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTreeModule,
    FlexLayoutModule,
    CdkAccordionModule,
    NgxEchartsModule
  ],
  providers: [
  ],
  entryComponents: [
    AddCatComponent,
    AddOptionComponent,
    SupplierEditComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

@NgModule({})
export class AppStoreSharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: AppModule,
      providers
    };
  }
}
