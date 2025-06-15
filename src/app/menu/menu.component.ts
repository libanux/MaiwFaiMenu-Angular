import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ItemsService } from '../services/items.service';
import { Item } from '../Classes/Item';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  allItems: Item[] = [];

  constructor(
    private router: Router,
    private itemsService: ItemsService
  ) {}

  ngOnInit() {
    this.itemsService.getAllItems().subscribe((items: Item[]) => {
      this.allItems = items;
    });
  }

  goToCategory(type: string) {
    this.router.navigate(['/category'], { queryParams: { type } });
  }
}