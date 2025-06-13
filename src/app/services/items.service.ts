import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { map, tap } from 'rxjs/operators';

interface FirebaseItem {
  OWNER_ID: number;  // Keep as number since it's stored as number in Firebase
  CATEGORY_NAME: string;  // Changed from CATEGORY to CATEGORY_NAME
  CATEGORY_ICON?: string;
  IS_PUBLISHED?: boolean;
  ITEM_NAME: string;  // Add ITEM_NAME property
  key?: string;       // Add key property
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class ItemsService {
  private readonly OWNER_ID: number = 2;

  constructor(private db: AngularFireDatabase) {
    // Add this debug check
    this.testFirebaseConnection();
  }

  private testFirebaseConnection() {
    this.db.database.ref('.info/connected').on('value', (snap) => {
      console.log('Firebase connection state:', snap.val());
    });

    // Test direct data access
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
    
    return this.db.list<FirebaseItem>('items', ref => 
      ref.orderByChild('OWNER_ID').equalTo(this.OWNER_ID)
    ).snapshotChanges().pipe(
      tap(changes => {
        const items = changes.map(c => ({
          key: c.payload.key,
          ...(c.payload.val() as FirebaseItem)
        }));
        console.log('Total items received:', items.length);
        
        // Debug items with undefined or empty categories
        items.forEach(item => {
          if (!item.CATEGORY_NAME || item.CATEGORY_NAME.trim() === '') {
            console.warn('Item with missing/empty category:', {
              key: item.key,
              OWNER_ID: item.OWNER_ID,
              CATEGORY_NAME: item.CATEGORY_NAME,
              name: item.ITEM_NAME
            });
          }
        });
      }),
      // Filter out items with undefined categories
      map(changes => 
        changes.map(c => ({
          key: c.payload.key,
          ...(c.payload.val() as FirebaseItem)
        }))
      )
    );
  }

  getAllItems() {
    return this.db.list<FirebaseItem>('items')
      .snapshotChanges()
      .pipe(
        map(changes =>
          changes.map(c => ({
            key: c.payload.key,
            ...(c.payload.val() as FirebaseItem)
          }))
        )
      );
  }
}