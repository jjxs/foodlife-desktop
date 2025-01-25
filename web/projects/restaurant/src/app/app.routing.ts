import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SeatViewComponent } from './seat-view/seat-view.component';
import { HomeComponent } from './home/home.component';
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
import { ChartTopComponent } from './charts/chart-top/chart-top.component';
import { ChartWeekComponent } from './charts/chart-week/chart-week.component';
import { ChartDayComponent } from './charts/chart-day/chart-day.component';
import { ChartMonthComponent } from './charts/chart-month/chart-month.component';
import { ChartCatComponent } from './charts/chart-cat/chart-cat.component';
import { ChartMenuComponent } from './charts/chart-menu/chart-menu.component';
import { ChartProfitComponent } from './charts/chart-profit/chart-profit.component';
import { ChartTableComponent } from './charts/chart-table/chart-table.component';
import { ChartInventoryProfitComponent } from './charts/chart-inventory-profit/chart-inventory-profit.component';
import { TopComponent } from './menu/top/top.component';
import { ManagerComponent } from './manager/manager.component';
import { MenuCategoryComponent } from './manager/menu-category/menu-category.component';
import { MenuPreviewComponent } from './manager/menu-preview/menu-preview.component';
import { TopManageComponent } from './manager/top-manage/top-manage.component';
import { CourseManageComponent } from './manager/course-manage/course-manage.component';
import { RankingManageComponent } from './manager/ranking-manage/ranking-manage.component';
import { LanguageManageComponent } from './manager/language-manage/language-manage.component';
import { ShopManageComponent } from './manager/shop-manage/shop-manage.component';
import { MenuBindComponent } from './manager/menu-bind/menu-bind.component';
import { MenuFreeComponent } from './manager/menu-free/menu-free.component';
import { MenuTop3Component } from './manager/menu-top3/menu-top3.component';
import { MonitorComponent } from './counter/monitor/monitor.component';
import { StaffComponent } from './staff/staff.component';
import { StaffTopComponent } from './staff/staff-top/staff-top.component';
import { StaffMenuComponent } from './staff/staff-menu/staff-menu.component';
import { StaffOrderComponent } from './staff/staff-order/staff-order.component';
import { StaffCounterComponent } from './staff/staff-counter/staff-counter.component';
import { StaffSettingComponent } from './staff/staff-setting/staff-setting.component';
import { environment } from '../environments/environment';
import { AppStoreSharedModule } from 'projects/app-store/src/app/app.module';


const appRoutes: Routes = [
    {
        path:   'store',
        loadChildren: () => import('../../../app-store/src/app/app.module').then(mod => mod.AppStoreSharedModule)
    },
    { path: 'start', component: SeatViewComponent },
    { path: 'seat-manager', component: SeatManagerComponent },
    { path: 'company-manager', component: CompanyManagerComponent },
    { path: 'company-edit-manager', component: CompanyEditManagerComponent },
    { path: 'seat-edit-manager', component: SeatEditManagerComponent },
    { path: 'settings', component: SettingsComponent },
    { path: 'charts', component: ChartsComponent},
    { path: 'top', component: TopComponent },
    { path: 'counter', component: TopComponent },
    {
        path: 'manager', component: ManagerComponent,
        children: [
            {
                path: 'menu-category',
                component: MenuCategoryComponent
            },
            {
                path: 'menu-preview',
                component: MenuPreviewComponent
            },
            {
                path: 'top',
                component: TopManageComponent
            },
            {
                path: 'course',
                component: CourseManageComponent
            },
            {
                path: 'menu-free',
                component: MenuFreeComponent
            },
            {
                path: 'menu-top3',
                component: MenuTop3Component
            },
            {
                path: 'ranking',
                component: RankingManageComponent
            },
            {
                path: 'menu-bind',
                component: MenuBindComponent
            },
            {
                path: 'shop',
                component: ShopManageComponent
            },
            {
                path: 'language',
                component: LanguageManageComponent
            }
        ]
    },
    {
        path: 'charts', component: ChartsComponent,
        children: [
            {
                path: 'chart-top',
                component: ChartTopComponent
            },
            {
                path: 'chart-week',
                component: ChartWeekComponent
            },
            {
                path: 'chart-day',
                component: ChartDayComponent
            },
            {
                path: 'chart-month',
                component: ChartMonthComponent
            },
            {
                path: 'chart-cat',
                component: ChartCatComponent
            },
            {
                path: 'chart-menu',
                component: ChartMenuComponent
            },
            {
                path: 'chart-profit',
                component: ChartProfitComponent
            },
            {
                path: 'chart-table',
                component: ChartTableComponent
            },
            {
                path: 'chart-inventory-profit',
                component: ChartInventoryProfitComponent
            }
            
        ]
    },
    { path: 'home', component: HomeComponent }
];

// export const AppRoutes: ModuleWithProviders = RouterModule.forRoot(appRoutes);
@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes),
    AppStoreSharedModule.forRoot()
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
