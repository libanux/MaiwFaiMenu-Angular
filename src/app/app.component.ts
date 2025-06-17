import { isPlatformBrowser } from '@angular/common';
import { Component, HostListener, inject, Inject, PLATFORM_ID } from '@angular/core';
import { ChildrenOutletContexts, Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { LanguageService } from './services/language.service';
import { NgClass } from '@angular/common';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [RouterOutlet, NgClass] // Add NgClass here
})
export class AppComponent {
  title = 'area-51-website';
  screenWidth: number = 0;
  router = inject(Router);
  selectedLanguage = 'en';
  isMenuPage = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private contexts: ChildrenOutletContexts,
    private languageService: LanguageService
  ) {
    this.languageService.language$.subscribe(lang => {
      this.selectedLanguage = lang;
    });

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
    console.log('Navigation URL:', event.urlAfterRedirects);
    this.isMenuPage = event.urlAfterRedirects === '/';
    console.log('isMenuPage:', this.isMenuPage);
  }
    });
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.screenWidth = window.innerWidth;
    }
    
  }
 

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = window.innerWidth;
  }

  reloadPage() {
    this.router.navigate(['/']);
  }

  getRouteAnimationData() {
    return this.contexts.getContext('primary')?.route?.snapshot?.data?.['animation'];
  }
}
