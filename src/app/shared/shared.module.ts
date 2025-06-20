import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Import all reusable components
import { ButtonComponent } from '../components/button/button.component';
import { MenuItemComponent } from '../components/menu-item/menu-item.component';

// Import all services
import { ItemsService } from '../services/items.service';
import { LanguageService } from '../services/language.service';
import { MenuService } from '../services/menu.service';
import { FirebaseService } from '../services/firebase.service';

@NgModule({
  imports: [
    CommonModule,
    // Import standalone components
    ButtonComponent,
    MenuItemComponent
  ],
  exports: [
    CommonModule,
    // Export components for use in other modules
    ButtonComponent,
    MenuItemComponent
  ],
  providers: [
    // Provide all services
    ItemsService,
    LanguageService,
    MenuService,
    FirebaseService
  ]
})
export class SharedModule { } 