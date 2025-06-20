import { Component, inject, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class ButtonComponent {

  @Input() text = ""
  @Input() redirect = ""
  @Input() redirectOnSamePage = ""

  router = inject(Router)

  GoToRedirection() {
    if(this.redirectOnSamePage == "true") {
      this.router.navigate(['/menu'])
    } else {
      // window.location.href = `${this.redirect()}`
    }
  }
}
