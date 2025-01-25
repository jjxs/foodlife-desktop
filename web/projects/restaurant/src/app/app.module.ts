// Module
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, TRANSLATIONS, TRANSLATIONS_FORMAT, LOCALE_ID, Injectable } from '@angular/core';

import { AppRoutingModule } from './app.routing';
import { LayoutModule } from '@angular/cdk/layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxEchartsModule } from 'ngx-echarts';
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
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CdkTableModule } from '@angular/cdk/table';
import { DragDropModule } from '@angular/cdk/drag-drop';

// //ng-bootstrap
// import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// flex-layout
import { FlexLayoutModule, BREAKPOINT } from '@angular/flex-layout';
const PRINT_BREAKPOINTS = [{
  alias: 'xs.print',
  suffix: 'XsPrint',
  mediaQuery: 'print and (max-width: 297px)',
  overlapping: false
}];
// Component
import { AppComponent } from './app.component';
import { SeatViewComponent } from './seat-view/seat-view.component';
import { HomeComponent } from './home/home.component';
import { CmpModule } from './cmp/cmp.module';
import { CounterComponent } from './counter/counter.component';
import { OrderComponent } from './order/order.component';
import { SeatsComponent } from './seats/seats.component';
import { SeatManagerComponent } from './seats/seat-manager/seat-manager.component';
import { CompanyManagerComponent } from './company/company-manager.component';
import { CompanyEditManagerComponent } from './company/company-edit-manager/company-edit-manager.component';
import { SeatEditManagerComponent } from './seats/seat-manager/seat-edit-manager/seat-edit-manager.component';
import { SettingsComponent } from './settings/settings.component';
import { KitchenComponent } from './kitchen/kitchen.component';
import { MenuComponent } from './menu/menu.component';
import { ChartsComponent } from './charts/charts.component';
// shared
import { StyleManager } from './shared/style.manager';

import { DialogOverviewExample, DialogOverviewExampleDialog } from './temp/dialog-overview-example';
import { ReservationComponent } from './reservation/reservation.component';

import { LanguagePipe } from './language.pipe';

/* ami-lib */
import { AmiModule } from 'ami'

/* Http */
import { HttpClientModule } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { WebInterceptor } from './shared/web.interceptor';
import { LoginComponent } from './home/login/login.component';
import { SeatListComponent } from './seats/seat-list.component';
import { SeatMapComponent } from './seats/seat-map/seat-map.component';
import { ManagerComponent } from './manager/manager.component';
import { MenuCategoryComponent } from './manager/menu-category/menu-category.component';
import { MenuPreviewComponent } from './manager/menu-preview/menu-preview.component';
import { TopManageComponent } from './manager/top-manage/top-manage.component';
import { TopManageItemComponent } from './manager/top-manage-item/top-manage-item.component';
import { CourseManageComponent } from './manager/course-manage/course-manage.component';
import { RankingManageComponent } from './manager/ranking-manage/ranking-manage.component';
import { ShopManageComponent } from './manager/shop-manage/shop-manage.component';
import { LanguageManageComponent } from './manager/language-manage/language-manage.component';
import { LanguageItemEditComponent } from './manager/language-item-edit/language-item-edit.component';
import { MenuBindComponent } from './manager/menu-bind/menu-bind.component';
import { MenuBindEditComponent } from './manager/menu-bind-edit/menu-bind-edit.component';
import { MenuFreeComponent } from './manager/menu-free/menu-free.component';
import { MenuTop3Component } from './manager/menu-top3/menu-top3.component';
import { CourseManageEditComponent } from './manager/course-manage-edit/course-manage-edit.component';
import { CourseManageAbcComponent } from './manager/course-manage-abc/course-manage-abc.component';
import { MenuFreeEditComponent } from './manager/menu-free-edit/menu-free-edit.component';
import { MenuTabComponent } from './menu/menu-tab/menu-tab.component';
import { MenuPageComponent } from './menu/menu-page/menu-page.component';
import { ThemeMenuTopComponent } from './menu/theme-menu-top/theme-menu-top.component';
import { ThemeMenuTop2Component } from './menu/theme-menu-top2/theme-menu-top2.component';
import { ThemeToriaezuComponent } from './menu/theme-toriaezu/theme-toriaezu.component';
import { TopComponent } from './menu/top/top.component';
import { Top2Component } from './menu/top2/top2.component';
import { AccountingComponent } from './menu/accounting/accounting.component';
import { FooterBarComponent } from './menu/footer-bar/footer-bar.component';
import { ThemeMenuTopImageComponent } from './menu/theme-menu-top-image/theme-menu-top-image.component';
import { ThemeMenuTopNewComponent } from './menu/theme-menu-top-new/theme-menu-top-new.component';
import { ThemeMenuTopRankingComponent } from './menu/theme-menu-top-ranking/theme-menu-top-ranking.component';
import { ThemeMenuKosuComponent } from './menu/theme-menu-kosu/theme-menu-kosu.component';
import { ThemeMenuDoubleComponent } from './menu/theme-menu-double/theme-menu-double.component';
import { ThemeMenuThirdComponent } from './menu/theme-menu-third/theme-menu-third.component';
import { ThemeMenuTwocolumnComponent } from './menu/theme-menu-twocolumn/theme-menu-twocolumn.component';
import { ThemeDialogImageComponent } from './menu/theme-dialog-image/theme-dialog-image.component';
import { StaffChangeSeatComponent } from './staff/staff-change-seat/staff-change-seat.component';
import { MenuViewComponent } from './menu/menu-view/menu-view.component';
import { MenuLanguageComponent } from './menu/menu-language/menu-language.component';
import { MenuImageComponent } from './menu/menu-image/menu-image.component';
import { MenuListComponent } from './menu/menu-list/menu-list.component';
import { MenufreeComponent } from './menu/menufree/menufree.component';
import { OrderHistoryComponent } from './order/order-history/order-history.component';
import { KitchenSettingComponent } from './kitchen/kitchen-setting/kitchen-setting.component';
import { TaskDetailComponent } from './kitchen/task-detail/task-detail.component';
import { TaskComponent } from './kitchen/task/task.component';
import { ChartWeekComponent } from './charts/chart-week/chart-week.component';
import { ChartDayComponent } from './charts/chart-day/chart-day.component';
import { ChartMonthComponent } from './charts/chart-month/chart-month.component';
import { ChartTopComponent } from './charts/chart-top/chart-top.component';
import { ChartMenuComponent } from './charts/chart-menu/chart-menu.component';
import { ChartCatComponent } from './charts/chart-cat/chart-cat.component';
import { ChartProfitComponent } from './charts/chart-profit/chart-profit.component';
import { ChartTableComponent } from './charts/chart-table/chart-table.component';
import { ChartInventoryProfitComponent } from './charts/chart-inventory-profit/chart-inventory-profit.component';

// touch 对应
import { HAMMER_GESTURE_CONFIG, HammerGestureConfig } from '@angular/platform-browser';
import { OrderCardComponent } from './order/order-card/order-card.component';
import { OrderCardMenufreeComponent } from './order/order-card-menufree/order-card-menufree.component';
import { MonitorComponent } from './counter/monitor/monitor.component';
import { CounterPanelComponent } from './counter/counter-panel/counter-panel.component';
import { CounterOrdersDetailPanelComponent } from './counter/counter-orders-detail-panel/counter-orders-detail-panel.component';
import { CounterSplitPanelComponent } from './counter/counter-split-panel/counter-split-panel.component';
import { CounterAveragePanelComponent } from './counter/counter-average-panel/counter-average-panel.component';
import { OrderSearchComponent } from './order/order-search/order-search.component';
import { CounterSearchComponent } from './counter/counter-search/counter-search.component';
import { CounterDetailsComponent } from './counter/counter-details/counter-details.component';
import { StaffComponent } from './staff/staff.component';
import { StaffTopComponent } from './staff/staff-top/staff-top.component';
import { StaffMenuComponent } from './staff/staff-menu/staff-menu.component';
import { StaffOrderComponent } from './staff/staff-order/staff-order.component';
import { StaffCounterComponent } from './staff/staff-counter/staff-counter.component';
import { StaffSettingComponent } from './staff/staff-setting/staff-setting.component';
import { MenuHistoryComponent } from './menu/menu-history/menu-history.component';
import { MenuGroupComponent } from './menu/menu-group/menu-group.component';
import { CounterDetailsConfirmComponent } from './counter/counter-details-confirm/counter-details-confirm.component';
import { SeatOrderComponent } from './seats/seat-order/seat-order.component';
import { SeatFreeMenuComponent } from './seats/seat-free-menu/seat-free-menu.component';

@Injectable({
  providedIn: 'root'
})
export class SkydeskHammerConfig extends HammerGestureConfig {

  //　禁止监听纵向滚动
  overrides = <any>{
    'pinch': { enable: false },
    'rotate': { enable: false }
  }
}


@NgModule({
  declarations: [
    DialogOverviewExample, DialogOverviewExampleDialog,
    LanguagePipe,
    AppComponent,
    SeatViewComponent,
    HomeComponent,
    CounterComponent,
    OrderComponent,
    SeatListComponent,
    SeatMapComponent,
    SeatsComponent,
    SeatManagerComponent,
    CompanyManagerComponent,
    CompanyEditManagerComponent,
    SeatEditManagerComponent,
    SettingsComponent,
    KitchenComponent,
    MenuComponent,
    ChartsComponent,
    ReservationComponent,
    ManagerComponent,
    MenuCategoryComponent,
    MenuPreviewComponent,
    TopManageComponent,
    TopManageItemComponent,
    CourseManageComponent,
    RankingManageComponent,
    LanguageManageComponent,
    LanguageItemEditComponent,
    ShopManageComponent,
    MenuBindComponent,
    MenuFreeComponent,
    MenuTop3Component,
    CourseManageEditComponent,
    CourseManageAbcComponent,
    MenuFreeEditComponent,
    MenuBindEditComponent,
    LoginComponent,
    MenuTabComponent,
    MenuPageComponent,
    ThemeMenuTopComponent,
    ThemeMenuTop2Component,
    ThemeToriaezuComponent,
    TopComponent,
    Top2Component,
    AccountingComponent,
    FooterBarComponent,
    ThemeMenuTopImageComponent,
    ThemeMenuTopNewComponent,
    ThemeMenuTopRankingComponent,
    ThemeMenuKosuComponent,
    ThemeMenuDoubleComponent,
    ThemeMenuThirdComponent,
    ThemeMenuTwocolumnComponent,
    ThemeDialogImageComponent,
    StaffChangeSeatComponent,
    MenuViewComponent,
    MenuLanguageComponent,
    MenuImageComponent,
    MenuListComponent,
    MenufreeComponent,
    OrderHistoryComponent,
    KitchenSettingComponent,
    TaskComponent,
    TaskDetailComponent,
    OrderCardComponent,
    OrderCardMenufreeComponent,
    MonitorComponent,
    CounterPanelComponent,
    CounterOrdersDetailPanelComponent,
    CounterSplitPanelComponent,
    CounterAveragePanelComponent,
    OrderSearchComponent,
    CounterSearchComponent,
    CounterDetailsComponent,
    StaffComponent,
    StaffTopComponent,
    StaffMenuComponent,
    StaffOrderComponent,
    StaffCounterComponent,
    StaffSettingComponent,
    MenuHistoryComponent,
    MenuGroupComponent,
    CounterDetailsConfirmComponent,
    SeatOrderComponent,
    SeatFreeMenuComponent,
    ChartWeekComponent,
    ChartDayComponent,
    ChartMonthComponent,
    ChartMenuComponent,
    ChartCatComponent,
    ChartTopComponent,
    ChartProfitComponent,
    ChartTableComponent,
    ChartInventoryProfitComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,

    LayoutModule,
    CdkTableModule,
    DragDropModule,
    CmpModule,
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
    HttpClientModule,
    /* ami-lib */
    AmiModule,
    NgxEchartsModule,
  ],
  providers: [
    StyleManager,
    { provide: HTTP_INTERCEPTORS, useClass: WebInterceptor, multi: true },
    { provide: BREAKPOINT, useValue: PRINT_BREAKPOINTS, multi: true },
    { provide: TRANSLATIONS_FORMAT, useValue: 'xlf' },
    { provide: LOCALE_ID, useValue: 'ja' },
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: SkydeskHammerConfig
    }

  ],
  bootstrap: [
    AppComponent
  ],
  entryComponents: [
    DialogOverviewExample,
    DialogOverviewExampleDialog,
    MenuViewComponent,
    MenuLanguageComponent,
    ThemeDialogImageComponent,
    StaffChangeSeatComponent,
    TaskDetailComponent,
    TopManageItemComponent,
    CourseManageEditComponent,
    CourseManageAbcComponent,
    LanguageItemEditComponent,
    MenuFreeEditComponent,
    MenuBindEditComponent,
    SeatListComponent,
    LoginComponent,
    MenufreeComponent,
    MenuHistoryComponent,
    KitchenSettingComponent,
    CounterDetailsComponent,
    CounterSearchComponent,
    CounterDetailsConfirmComponent,
    SeatOrderComponent,
    SeatFreeMenuComponent
  ]
})
export class AppModule { }
