export class Category {
  CATEGORY_ID?: string | null;
  CATEGORY_NAME_EN?: string;
  CATEGORY_NAME_AR?: string;
  CATEGORY_ICON?: string;
  OWNER_ID?: number = 2;
  TIMESTAMP_CREATED?: number;
  TYPE?: 'restaurant' | 'caffeh'; // Do NOT set = 'restaurant'

  constructor() {
    this.TIMESTAMP_CREATED = Date.now();
    // Do NOT set this.TYPE here
  }
}