import { Routes } from '@angular/router';
import { MenuComponent, CategoryviewComponent } from './pages';

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
  
  
];