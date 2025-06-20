import { Injectable } from '@angular/core';
import { ItemsService } from './items.service';
import { map } from 'rxjs/operators';

interface Item {
  OWNER_ID: number;
  CATEGORY: string;
  CATEGORY_ICON?: string;
  IS_PUBLISHED?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  constructor(private itemsService: ItemsService) {}

  getItems() {
    return this.itemsService.getItems().pipe(
      map((items: any[]) => {
        return items.filter(item => item.IS_PUBLISHED !== false);
      })
    );
  }
}
