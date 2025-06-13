export class Item {
  ITEM_ID?: string | number;
  ITEM_NAME?: string;
  ITEM_PRICE?: number;
  DESCRIPTION?: string;
  IS_PUBLISHED?: boolean;
  ITEM_PHOTO?: string;
  CATEGORY_NAME?: string;  // Changed from CATEGORY to CATEGORY_NAME
  CATEGORY_ICON?: string;
  SUBCATEGORY_NAME?: string;
  SUBCATEGORY_ICON?: string;
  ITEM_SIZES?: any;
  TIMESTAMP_CREATED?: number | Date;
  OWNER_ID?: number;
}

