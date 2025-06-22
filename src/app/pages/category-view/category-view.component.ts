import { Component, OnInit, ViewChild, ElementRef, HostListener, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ItemsService, LanguageService } from '../../services';
import { CategoryService } from '../../services/category.service';
import { Item } from '../../Classes';
import { Category } from '../../Classes/category';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-categoryview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './category-view.component.html',
  styleUrls: ['./category-view.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CategoryviewComponent implements OnInit, AfterViewInit {
  items: Item[] = [];
  categories: Category[] = [];
  selectedLanguage: 'en' | 'ar' = 'en';
  selectedType: 'restaurant' | 'caffeh' = 'restaurant';
  openedCategory: string | null = null;
  loading = true;
  afterMenuBanner = false;

  @ViewChild('carousel', { static: false }) carouselRef!: ElementRef<HTMLDivElement>;
  @ViewChild('menuBanner', { static: false }) menuBannerRef!: ElementRef;

  constructor(
    private itemsService: ItemsService,
    private categoryService: CategoryService,
    private languageService: LanguageService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const type = params['type'];
      this.selectedType = (type === 'restaurant' || type === 'caffeh') ? type : 'restaurant';
      this.loadCategoriesAndItems();
    });

    this.languageService.language$.subscribe(lang => {
      this.selectedLanguage = lang as 'en' | 'ar';
      this.loadCategoriesAndItems();
      this.openedCategory = null;
    });
  }

  ngAfterViewInit() {
    this.onWindowScroll();
  }

  loadCategoriesAndItems() {
    this.loading = true;
    this.categoryService.getCategories(this.selectedType).subscribe(categories => {
      this.categories = categories;
      this.itemsService.getItems().subscribe((items: Item[]) => {
        this.items = items.filter(item => item.TYPE === this.selectedType);
        this.loading = false;
      });
    });
  }

  getCategoryName(category: Category): string {
    return this.selectedLanguage === 'ar'
      ? category.CATEGORY_NAME_AR || ''
      : category.CATEGORY_NAME_EN || '';
  }

  getItemsForCategory(category: Category): Item[] {
    return this.items.filter(item => item.CATEGORY_ID === category.CATEGORY_ID);
  }

  toggleCategory(category: Category) {
    const name = this.getCategoryName(category);
    this.openedCategory = this.openedCategory === name ? null : name;
  }

  getItemName(item: Item) {
    return this.selectedLanguage === 'ar' ? item.ITEM_NAME_AR : item.ITEM_NAME_EN;
  }

  getItemDescription(item: Item) {
    return this.selectedLanguage === 'ar' ? item.DESCRIPTION_AR : item.DESCRIPTION_EN;
  }

  onLanguageChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.selectedLanguage = select.value as 'en' | 'ar';
    this.languageService.setLanguage(this.selectedLanguage);
  }

  scrollCarousel(direction: 'left' | 'right') {
    const carousel = this.carouselRef?.nativeElement;
    if (carousel) {
      const scrollAmount = 120;
      carousel.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  }

  onCarouselCategoryClick(category: Category) {
    const name = this.getCategoryName(category);
    this.openedCategory = name;
    setTimeout(() => {
      const el = document.getElementById('cat-' + this.slugify(name));
      if (el) {
        const header = document.querySelector('.top-fixed-buttons') as HTMLElement;
        const headerOffset = header ? header.offsetHeight : 112;
        const rect = el.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const offsetTop = rect.top + scrollTop - headerOffset;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    }, 400);
  }

  slugify(str: string): string {
    return str.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
  }

  goBackToMenu() {
    this.router.navigate(['']);
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (this.menuBannerRef) {
      const bannerBottom = this.menuBannerRef.nativeElement.getBoundingClientRect().bottom;
      this.afterMenuBanner = bannerBottom <= 0;
    }
  }
}