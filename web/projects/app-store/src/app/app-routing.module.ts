import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WarehousingComponent } from './warehousing/warehousing.component';
import { OrderingComponent } from './ordering/ordering.component';
import { InventorycontrolComponent } from './inventorycontrol/inventorycontrol.component';
import { InventoryprofitComponent } from './inventoryprofit/inventoryprofit.component';
import { IssueManagementComponent } from './issue-management/issue-management.component';
import { OrderingTableComponent } from './ordering/ordering-table/ordering-table.component';
import { CheckresultComponent } from './inventorycontrol/checkresult/checkresult.component';
import { InventorycontrolCheckComponent } from './inventorycontrol/check/check.component';
import { StoreRegComponent } from './store-reg/store-reg.component';
import { MenuMgmtComponent } from './menu-mgmt/menu-mgmt.component';
import { MenuEditComponent } from './menu-mgmt/menu-cat/menu-edit/menu-edit.component';
import { MenuEditChildComponent } from './menu-mgmt/menu-cat/menu-child-edit/menu-child-edit.component';
import { MenuDetailComponent } from './menu-mgmt/menu-detail/menu-detail.component';
import { AddCatComponent } from './menu-mgmt/menu-cat/add-cat/add-cat.component';
import { OptionEditComponent } from './menu-mgmt/menu-option/option-edit/option-edit.component';
import { OptionEditChildComponent } from './menu-mgmt/menu-option/option-child-edit/option-child-edit.component';
import { IngredientsComponent } from './ingredients/ingredients.component';
import { UserManagerComponent } from './user-manager/user-manager.component';
import { UserAddManagerComponent } from './user-manager/user-add-manager/user-add-manager.component';
import { UserEditManagerComponent } from './user-manager/user-edit-manager/user-edit-manager.component';
import { UserComponent } from './user/user.component';
import { UserAddComponent } from './user/user-add/user-add.component';
import { UserEditComponent } from './user/user-edit/user-edit.component';
import { IngredientsEditComponent } from './ingredients/ingredients-edit/ingredients-edit.component';
import { UserGroupComponent } from './user-group/user-group.component';
import { UserAddGroupComponent } from './user-group/user-add-group/user-add-group.component';
import { UserEditGroupComponent } from './user-group/user-edit-group/user-edit-group.component';
import { SetsubiManagerComponent } from './setsubi-manager/setsubi-manager.component';
import { SetsubiErrorComponent } from './setsubi-error/setsubi-error.component';
import { ShopCostComponent } from './shop-cost/shop-cost.component';
import { ShopCostEditComponent } from './shop-cost/shop-cost-edit/shop-cost-edit.component';
import { ChartComponent } from './chart/chart.component';
import { CatRegComponent } from './ingredients/ingredients-cat/cat-reg/cat-reg.component';
import { ShopCostCatRegComponent } from './shop-cost/shop-cost-cat/shop-cost-cat-reg/shop-cost-cat-reg.component';
import { PaymentComponent } from './payment/payment.component';
import { PaymentListComponent } from './payment/payment-list/payment-list.component';
import { PaymentEditComponent } from './payment/payment-list/payment-edit/payment-edit.component';
import { SeatManagerComponent } from './seat-manager/seat-manager.component';
import { InventorycontrolCheckConfirmComponent } from './inventorycontrol/check-confirm/check-confirm.component';
import { MenuConfirmComponent } from './menu-mgmt/menu-confirm/menu-confirm.component';
import { TakeoutOrderComponent } from './takeout-order/takeout-order.component';
import { QrcodeSettingComponent } from './qrcode-setting/qrcode-setting.component';
import { CounterManagerComponent } from './counter-manager/counter-manager.component';
import { MenuGiftComponent } from './menu-gift/menu-gift.component';
import { MenuGiftAddComponent } from './menu-gift/menu-gift-add/menu-gift-add.component';
import { MenuGiftEditComponent } from './menu-gift/menu-gift-edit/menu-gift-edit.component';


const routes: Routes = [
  {
    path: 'menu-mgmt',
    component: MenuMgmtComponent
  },
  {
    path: 'menu-edit',
    component: MenuEditComponent
  },
  {
    path: 'counter-manager',
    component: CounterManagerComponent
  },
  {
    path: 'menu-child-edit',
    component: MenuEditChildComponent
  },
  {
    path: 'menu-detail',
    component: MenuDetailComponent
  },
  {
    path: 'add-cat',
    component: AddCatComponent
  },
  {
    path: 'option-edit',
    component: OptionEditComponent
  },
  {
    path: 'option-child-edit',
    component: OptionEditChildComponent
  },
  {
    path: 'store-reg',
    component: StoreRegComponent
  },
  {
    path: 'warehousing',
    component: WarehousingComponent
  },
  {
    path: 'ordering',
    component: OrderingComponent
  },
  {
    path: 'ordering-table',
    component: OrderingTableComponent
  },
  {
    path: 'inventory-control',
    component: InventorycontrolComponent
  },
  {
    path: 'inventory-profit',
    component: InventoryprofitComponent
  },
  {
    path: 'checkresult',
    component: CheckresultComponent
  },
  {
    path: 'check',
    component: InventorycontrolCheckComponent
  },
  {
    path: 'issue-management',
    component: IssueManagementComponent
  },
  {
    path: 'ingredients',
    component: IngredientsComponent
  },
  {
    path: 'user-manager',
    component: UserManagerComponent
  },
  {
    path: 'user-add-manager',
    component: UserAddManagerComponent
  },
  {
    path: 'user',
    component: UserComponent
  },
  {
    path: 'user-add',
    component: UserAddComponent
  },
  {
    path: 'user-edit',
    component: UserEditComponent
  },
  {
    path: 'user-group',
    component: UserGroupComponent
  },
  {
    path: 'user-add-group',
    component: UserAddGroupComponent
  },
  {
    path: 'user-edit-group',
    component: UserEditGroupComponent
  },
  {
    path: 'setsubi-manager',
    component: SetsubiManagerComponent
  },
  {
    path: 'setsubi-error',
    component: SetsubiErrorComponent
  },
  {
    path: 'user-edit-manager',
    component: UserEditManagerComponent
  },
  {
    path: 'ingredients-edit',
    component: IngredientsEditComponent
  },
  {
    path: 'cat-reg',
    component: CatRegComponent
  },
  {
    path: 'shop-cost',
    component: ShopCostComponent
  },
  {
    path: 'shop-cost-edit',
    component: ShopCostEditComponent
  },
  {
    path: 'shop-cost-cat-reg',
    component: ShopCostCatRegComponent
  },
  {
    path: 'chart',
    component: ChartComponent
  },
  {
    path: 'payment',
    component: PaymentComponent
  },
  {
    path: 'payment-list',
    component: PaymentListComponent
  },
  {
    path: 'payment-edit',
    component: PaymentEditComponent
  },
  {
    path: 'inventorycontrol-check-confirm',
    component: InventorycontrolCheckConfirmComponent
  },
  {
    path: 'takeout-order',
    component: TakeoutOrderComponent
  },
  {
    path: 'menu-confirm',
    component: MenuConfirmComponent
  },
  {
    path: 'qrcode-setting',
    component: QrcodeSettingComponent
  },
  {
    path: 'menu-gift',
    component: MenuGiftComponent
  },
  {
    path: 'menu-gift-add',
    component: MenuGiftAddComponent
  },
  {
    path: 'menu-gift-edit',
    component: MenuGiftEditComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
