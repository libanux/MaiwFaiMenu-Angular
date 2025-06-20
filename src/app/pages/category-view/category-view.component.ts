import { Component, OnInit, ViewChild, ElementRef, HostListener, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ItemsService, LanguageService } from '../../services';
import { Item } from '../../Classes';
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
  categories: { name: string; icon: string; items: Item[] }[] = [];
  selectedLanguage: 'en' | 'ar' = 'en';
  selectedType: string = 'restaurant';
  openedCategory: string | null = null;
  loading = true;
  backArrowBlack = false;
  afterMenuBanner = false;
  atStart = true;
  atEnd = false;

  @ViewChild('carousel', { static: false }) carouselRef!: ElementRef<HTMLDivElement>; // added for carousel
  @ViewChild('menuBanner', { static: false }) menuBannerRef!: ElementRef;

  constructor(
    private itemsService: ItemsService,
    private languageService: LanguageService,
    private route: ActivatedRoute,
     private router: Router
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

  ngAfterViewInit() {
    this.onWindowScroll(); // Initialize scroll position
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

  onLanguageChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.selectedLanguage = select.value as 'en' | 'ar';
    this.languageService.setLanguage(this.selectedLanguage);
  }

  // ===== Carousel logic below =====

  scrollCarousel(direction: 'left' | 'right') {
    const carousel = this.carouselRef?.nativeElement;
    if (carousel) {
      const scrollAmount = 120; // Adjust based on box width
      carousel.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  }

  onCarouselCategoryClick(categoryName: string) {
    this.openedCategory = categoryName;
    setTimeout(() => {
      const el = document.getElementById('cat-' + this.slugify(categoryName));
      if (el) {
        // Get the fixed header height
        const header = document.querySelector('.top-fixed-buttons') as HTMLElement;
        const headerOffset = header ? header.offsetHeight : 112; // fallback

        // Get the element's position relative to the document
        const rect = el.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const offsetTop = rect.top + scrollTop - headerOffset;

        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    }, 400); // Increase timeout if your card expands/collapses
  }

  slugify(str: string): string {
    return str.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
  }

  goBackToMenu() {
  // If using Angular router:
  this.router.navigate(['']); // Adjust '/menu' to your actual menu route
}

@HostListener('window:scroll', [])
onWindowScroll() {
  if (this.menuBannerRef) {
    console.log(this.afterMenuBanner)
    const bannerBottom = this.menuBannerRef.nativeElement.getBoundingClientRect().bottom;
    this.afterMenuBanner = bannerBottom <= 0;
  }
}
}