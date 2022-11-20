export class SkuProduct {
  LicenseeID: Number;
  SKU: String;
  ItemCode: Number;
  BaseUOM: String;
  Size: Number;
  Pack: Number;
  MajorCategory: String;
  SubCategory: String;
  Brand: String;
  Manufacturer: String;
  Slab: String;
  DisplayFlag: String;
  GroupSKU: String;
  GroupCode: String;
  isSelected: true;
  Alias: string;
}

export interface category {
  SubCategory: string;
  DisplaySequence: Number;
  TotalSKUs: any;
}

export interface RetailSKUData {
  LicenseeID: Number;
  SKU: String;
  ItemCode: Number;
  BaseUOM: String;
  Size: Number;
  Pack: Number;
  MajorCategory: String;
  SubCategory: String;
  Brand: String;
  Manufacturer: String;
  Slab: String;
  DisplayFlag: String;
  GroupSKU: String;
  GroupCode: String;
  Alias: String;
}

export interface MasterSKUData {
  LicenseeID: Number;
  SKU: String;
  ItemCode: Number;
  BaseUOM: String;
  Size: Number;
  Pack: Number;
  MajorCategory: String;
  SubCategory: String;
  Brand: String;
  Manufacturer: String;
  Slab: String;
  DisplayFlag: String;
  GroupSKU: String;
  GroupCode: String;
}

export interface digitalExcise {
  SKU: string;
  Alias: string;
  OpenStockQTY: number;
  OpenStockML: number;
  Size: number;
}
export interface changeddigitalExcise {
  SKU: string;
  oStockQTY: number;
  oStockML: number;
}
export interface totalExcise {
  SubCategory: string;
  sum_qty: number;
  sum_ml: number;
}

export interface reviewPopup {
  reviewCategory: any;
}
