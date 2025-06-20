import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';

// Core services that should be singletons
import { ItemsService } from '../services/items.service';
import { LanguageService } from '../services/language.service';
import { MenuService } from '../services/menu.service';
import { FirebaseService } from '../services/firebase.service';

@NgModule({
  imports: [CommonModule],
  providers: [
    // Singleton services
    ItemsService,
    LanguageService,
    MenuService,
    FirebaseService
  ]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded. Import it in the AppModule only.');
    }
  }
} 