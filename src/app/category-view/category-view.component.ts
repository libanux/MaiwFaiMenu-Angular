import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';
import { Subscription } from 'rxjs';

interface SubcategoryItem {
  name: string;
  icon: string;
  isExpanded: boolean;
  items: any[];
}

@Component({
  selector: 'app-category-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './category-view.component.html',
  styleUrls: ['./category-view.component.css']
})
export class CategoryViewComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private firebaseService = inject(FirebaseService);
  private subscription?: Subscription;

  categoryName: string = '';
  subcategories: SubcategoryItem[] = [];
  loading = true;

  ngOnInit() {
    this.subscription = this.route.params.subscribe(params => {
      this.categoryName = params['category'];
      this.loadSubcategories();
    });
  }

  private loadSubcategories() {
    this.firebaseService.getItems().subscribe({
      next: (items: any[]) => {
        // Filter items for this category
        const categoryItems = items.filter(item => 
          item.CATEGORY_NAME === this.categoryName && 
          item.IS_PUBLISHED !== false
        );

        // Group by subcategory
        const subcategoryMap = new Map<string, any[]>();
        categoryItems.forEach(item => {
          if (item.SUBCATEGORY_NAME) {
            if (!subcategoryMap.has(item.SUBCATEGORY_NAME)) {
              subcategoryMap.set(item.SUBCATEGORY_NAME, []);
            }
            subcategoryMap.get(item.SUBCATEGORY_NAME)?.push(item);
          }
        });

        // Convert to array and sort
        this.subcategories = Array.from(subcategoryMap.entries())
          .map(([name, items]) => ({
            name,
            icon: items[0]?.SUBCATEGORY_ICON || '',
            isExpanded: false,
            items: items.sort((a, b) => a.ITEM_NAME.localeCompare(b.ITEM_NAME))
          }))
          .sort((a, b) => a.name.localeCompare(b.name));

        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading subcategories:', error);
        this.loading = false;
      }
    });
  }

  toggleSubcategory(subcategory: SubcategoryItem) {
    subcategory.isExpanded = !subcategory.isExpanded;
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}