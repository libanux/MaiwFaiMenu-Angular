import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MenuComponent } from './menu/menu.component';
import { CategoryViewComponent } from './category-view/category-view.component';
import { SubcategoryViewComponent } from './subcategory-view/subcategory-view.component';

export const routes: Routes = [
  { 
    path: '', 
    component: HomeComponent,
    title: 'Home'
  },
  { 
    path: 'menu', 
    component: MenuComponent,
    title: 'Menu'
  },
  { 
    path: 'category/:category',
    component: CategoryViewComponent,
    title: 'Category'
  },
  {
    path: 'category/:category/subcategory/:subcategory',
    component: SubcategoryViewComponent,
    title: 'Subcategory'
  },
  { 
    path: '**', 
    component: HomeComponent 
  }
];