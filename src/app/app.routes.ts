import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MenuComponent } from './menu/menu.component';
import { CategoryviewComponent } from './category-view/category-view.component';

export const routes: Routes = [
  { 
    path: '', 
    component: MenuComponent,
    title: 'Menu'
  },
  { 
    path: 'category',
    component: CategoryviewComponent,
    title: 'Category'
  },
  
  { 
    path: '**', 
    component: HomeComponent 
  }
];