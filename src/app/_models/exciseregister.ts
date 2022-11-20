export interface Invoice {
  InvoceNumber: number;
}
export interface purchaseInvoice {
  Alias: string;
  bottles: number;
  SKU: string;
  SNo: number;
}

export interface salesIvoice {
  Alias: string;
  Bottles: number;
  InvoiceDate: Date;
  LicenseeID: number;
  OpenStockML: number;
  OpenStockQTY: number;
  PurchaseQTY: number;
  SKU: string;
  SalesML: number;
  SalesQTY: number;
  SubCategory: string;
  editable: boolean;
  Size: number;
}
