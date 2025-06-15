import { isPlatformBrowser } from '@angular/common';
import { Component, HostListener, inject, Inject, PLATFORM_ID } from '@angular/core';
import { ChildrenOutletContexts, Router, RouterOutlet } from '@angular/router';
import { LanguageService } from './services/language.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [RouterOutlet] // Add any other components/modules used in your template
})
export class AppComponent {
  title = 'area-51-website';
  screenWidth: number = 0;
  router = inject(Router);
  selectedLanguage = 'en';
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private contexts: ChildrenOutletContexts,
    private languageService: LanguageService
  ) {
    this.languageService.language$.subscribe(lang => {
      this.selectedLanguage = lang;
    });
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.screenWidth = window.innerWidth;
    }
    
  }
  onLanguageChange(event: Event) {
  const select = event.target as HTMLSelectElement;
  this.selectedLanguage = select.value;
  this.languageService.setLanguage(this.selectedLanguage);
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
