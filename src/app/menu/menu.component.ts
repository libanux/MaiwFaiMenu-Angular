import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class MenuComponent implements OnInit, OnDestroy {
  private firebaseService = inject(FirebaseService);
  private router = inject(Router);
  private subscription?: Subscription;

  categories: { name: string; icon: string; }[] = [];
  loading = true;

  ngOnInit() {
    this.loadCategories();
  }

  private loadCategories() {
    this.subscription = this.firebaseService.getItems().subscribe({
      next: (items: any[]) => {
        console.log('Raw items:', items); // Debug log

        // Create a Map to store unique categories with their icons
        const categoryMap = new Map<string, string>();
        
        items.forEach(item => {
          if (item && item.CATEGORY_NAME) {  // Changed from CATEGORY to CATEGORY_NAME
            categoryMap.set(item.CATEGORY_NAME, item.CATEGORY_ICON || '');
          }
        });

        // Convert Map to array of category objects
        this.categories = Array.from(categoryMap.entries())
          .map(([name, icon]) => ({ name, icon }))
          .sort((a, b) => a.name.localeCompare(b.name));
        
        this.loading = false;
        console.log('Processed categories:', this.categories); // Debug log
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.loading = false;
      }
    });
  }

  navigateToCategory(categoryName: string) {
    console.log('Navigating to category:', categoryName);
    this.router.navigate(['/category', categoryName]);
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
