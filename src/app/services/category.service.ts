import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { map } from 'rxjs/operators';
import { Category } from '../Classes/category';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private readonly OWNER_ID = 2;

  constructor(private db: AngularFireDatabase) {}

  getCategories(type: 'restaurant' | 'caffeh') {
    return this.db.list<Category>('categories', ref =>
      ref.orderByChild('TYPE').equalTo(type)
    ).snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({ ...(c.payload.val() as Category), CATEGORY_ID: c.payload.key }))
      )
    );
  }
}