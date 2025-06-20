import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { map, tap } from 'rxjs/operators';
import { Item } from '../Classes';

@Injectable({
  providedIn: 'root'
})
export class ItemsService {
  private readonly OWNER_ID: number = 2;

  constructor(private db: AngularFireDatabase) {
    this.testFirebaseConnection();
  }

  private testFirebaseConnection() {
    this.db.database.ref('.info/connected').on('value', (snap) => {
      console.log('Firebase connection state:', snap.val());
    });

    this.db.database.ref('items').once('value')
      .then(snapshot => {
        console.log('Direct Firebase access test:');
        console.log('Total items in database:', snapshot.numChildren());

        const items = snapshot.val();
        const ownerItems = Object.values(items).filter((item: any) => item.OWNER_ID === 2);
        console.log('Items with OWNER_ID 2:', ownerItems.length);
        console.log('Sample items:', ownerItems.slice(0, 2));
      })
      .catch(error => {
        console.error('Firebase access error:', error);
      });
  }

  getItems() {
    console.log('Fetching items for OWNER_ID:', this.OWNER_ID);

    return this.db.list<Item>('items', ref =>
      ref.orderByChild('OWNER_ID').equalTo(this.OWNER_ID)
    ).snapshotChanges().pipe(
      tap(changes => {
        const items = changes.map(c => ({
          key: c.payload.key,
          ...(c.payload.val() as Item)
        }));
        console.log('Total items received:', items.length);

        items.forEach(item => {
          if (!item.CATEGORY_NAME_EN || item.CATEGORY_NAME_EN.trim() === '') {
            console.warn('Item with missing/empty category:', {
              key: item.key,
              OWNER_ID: item.OWNER_ID,
              CATEGORY_NAME_EN: item.CATEGORY_NAME_EN,
              name: item.ITEM_NAME_EN
            });
          }
        });
      }),
      map(changes =>
        changes.map(c => Object.assign(new Item(), {
          key: c.payload.key,
          ...(c.payload.val() as Item)
        }))
      )
    );
  }

  getAllItems() {
    return this.db.list<Item>('items')
      .snapshotChanges()
      .pipe(
        map(changes =>
          changes.map(c => Object.assign(new Item(), {
            key: c.payload.key,
            ...(c.payload.val() as Item)
          }))
        )
      );
  }
}