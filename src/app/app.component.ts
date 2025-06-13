import { isPlatformBrowser } from '@angular/common';
import { Component, HostListener, inject, Inject, PLATFORM_ID } from '@angular/core';
import { ChildrenOutletContexts, Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  standalone: true,
  imports: [RouterOutlet] // Add any other components/modules used in your template
})
export class AppComponent {
  title = 'area-51-website';
  screenWidth: number = 0;
  router = inject(Router);

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private contexts: ChildrenOutletContexts
  ) {}

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
