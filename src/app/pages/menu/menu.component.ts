import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ItemsService } from '../../services';
import { Item } from '../../Classes';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class MenuComponent implements OnInit, AfterViewInit, OnDestroy {
  allItems: Item[] = [];

  @ViewChild('itemScroller', { static: false }) itemScrollerRef!: ElementRef<HTMLDivElement>;
  autoScrollInterval: any;
  currentIndex = 0;

  constructor(
    private router: Router,
    private itemsService: ItemsService
  ) {}

  ngOnInit() {
    this.itemsService.getAllItems().subscribe((items: Item[]) => {
      this.allItems = items;
    });
  }

  ngAfterViewInit() {
    this.startInfiniteScroll();
  }

  ngOnDestroy() {
    if (this.autoScrollInterval) {
      clearInterval(this.autoScrollInterval);
    }
  }

  startInfiniteScroll() {
    const scroller = this.itemScrollerRef?.nativeElement;
    if (!scroller) return;

    // Clear any existing interval to avoid duplicates
    if (this.autoScrollInterval) {
      clearInterval(this.autoScrollInterval);
    }

    const scrollStep = () => {
      const boxes = scroller.querySelectorAll('.scroller-image-box');
      if (!boxes.length) return;

      const box = boxes[0] as HTMLElement;
      const gap = parseFloat(getComputedStyle(scroller).gap || '0');
      const isMobile = window.innerWidth <= 600;
      const visibleCount = isMobile ? 1 : 2;
      const scrollBy = (box.offsetWidth + gap) * visibleCount;

      // If at or past halfway, reset instantly (no animation)
      if (scroller.scrollLeft + scrollBy >= scroller.scrollWidth / 2) {
        scroller.scrollLeft = 0;
      } else {
        scroller.scrollBy({ left: scrollBy, behavior: 'smooth' });
      }
    };

    // Scroll every 2.5 seconds (adjust as needed)
    this.autoScrollInterval = setInterval(scrollStep, 2500);
  }

  goToCategory(type: string) {
    this.router.navigate(['/category'], { queryParams: { type } });
  }

  scrollImages(direction: 'left' | 'right') {
    const scroller = this.itemScrollerRef?.nativeElement;
    if (!scroller) return;

    const boxes = scroller.querySelectorAll('.scroller-image-box');
    if (!boxes.length) return;

    const isMobile = window.innerWidth <= 600;
    const visibleCount = isMobile ? 1 : 2;
    const box = boxes[0] as HTMLElement;
    const gap = parseFloat(getComputedStyle(scroller).gap || '0');
    const boxWidth = box.offsetWidth + gap;
    const maxIndex = boxes.length - visibleCount;

    // Update index
    if (direction === 'right') {
      this.currentIndex = Math.min(this.currentIndex + visibleCount, maxIndex);
    } else {
      this.currentIndex = Math.max(this.currentIndex - visibleCount, 0);
    }

    scroller.scrollTo({
      left: this.currentIndex * boxWidth,
      behavior: 'smooth'
    });
  }
}