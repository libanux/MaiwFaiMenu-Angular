import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';
import { Subscription } from 'rxjs';

interface MenuItem {
  ITEM_NAME: string;
  ITEM_PRICE: number;
  DESCRIPTION?: string;
  ITEM_PHOTO?: string;
  IS_PUBLISHED?: boolean;
}

@Component({
  selector: 'app-subcategory-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './subcategory-view.component.html',
  styleUrls: ['./subcategory-view.component.css']
})
export class SubcategoryViewComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private firebaseService = inject(FirebaseService);
  private subscription?: Subscription;

  categoryName: string = '';
  subcategoryName: string = '';
  items: MenuItem[] = [];
  loading = true;

  ngOnInit() {
    this.subscription = this.route.params.subscribe(params => {
      this.categoryName = params['category'];
      this.subcategoryName = params['subcategory'];
      this.loadItems();
    });
  }

  private loadItems() {
    this.firebaseService.getItems().subscribe({
      next: (items: any[]) => {
        this.items = items.filter(item => 
          item.CATEGORY_NAME === this.categoryName &&
          item.SUBCATEGORY_NAME === this.subcategoryName &&
          item.IS_PUBLISHED !== false
        );
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading items:', error);
        this.loading = false;
      }
    });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}