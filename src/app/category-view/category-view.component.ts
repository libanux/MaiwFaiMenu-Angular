import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ItemsService } from '../services/items.service';
import { LanguageService } from '../services/language.service';
import { Item } from '../Classes/Item';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-categoryview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './category-view.component.html',
  styleUrls: ['./category-view.component.css']
})
export class CategoryviewComponent implements OnInit {
  items: Item[] = [];
  categories: { name: string; icon: string; items: Item[] }[] = [];
  selectedLanguage: 'en' | 'ar' = 'en';
  selectedType: string = 'restaurant';
  openedCategory: string | null = null;
  loading = true;

  constructor(
    private itemsService: ItemsService,
    private languageService: LanguageService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Listen for language changes
    this.languageService.language$.subscribe(lang => {
      this.selectedLanguage = lang as 'en' | 'ar';
      this.setCategories();
      this.openedCategory = null; // Optionally close opened category on language change
    });

    // Listen for type changes (from menu navigation)
    this.route.queryParams.subscribe(params => {
      this.selectedType = params['type'] || 'restaurant';
      this.loadItems();
    });
  }

  loadItems() {
    this.loading = true;
    this.itemsService.getItems().subscribe((items: Item[]) => {
      this.items = items.filter(item => item.TYPE === this.selectedType);
      this.setCategories();
      this.loading = false;
    });
  }

  setCategories() {
    const categoryMap: { [key: string]: { name: string; icon: string; items: Item[] } } = {};
    this.items.forEach(item => {
      const catName = this.selectedLanguage === 'ar' ? item.CATEGORY_NAME_AR : item.CATEGORY_NAME_EN;
      if (catName && !categoryMap[catName]) {
        categoryMap[catName] = {
          name: catName,
          icon: item.CATEGORY_ICON,
          items: []
        };
      }
      if (catName) {
        categoryMap[catName].items.push(item);
      }
    });
    this.categories = Object.values(categoryMap);
  }

  toggleCategory(categoryName: string) {
    this.openedCategory = this.openedCategory === categoryName ? null : categoryName;
  }

  getItemName(item: Item) {
    return this.selectedLanguage === 'ar' ? item.ITEM_NAME_AR : item.ITEM_NAME_EN;
  }

  getItemDescription(item: Item) {
    return this.selectedLanguage === 'ar' ? item.DESCRIPTION_AR : item.DESCRIPTION_EN;
  }
}