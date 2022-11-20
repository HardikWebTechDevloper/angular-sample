import { Component, OnInit } from '@angular/core';
import { DataService } from '@app/services/data.service';
import { ExcisePuchaseService } from '@app/services/excise-puchase.service';
import { SpinnerService } from '@app/services/spinner.service';
import { purchaseInvoice } from '@app/_models/exciseregister';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PurchaseSummaryComponent } from '../purchase-summary/purchase-summary.component';

@Component({
  selector: 'app-purchase-confimation',
  templateUrl: './purchase-confimation.component.html',
  styleUrls: ['./purchase-confimation.component.scss'],
})
export class PurchaseConfimationComponent implements OnInit {
  headerArray: any = [];
  digitalExciseList: any[];
  totalCount: number = 0;
  public fromParent: any;
  invoice: number;
  purchaseInvoiceList: Array<purchaseInvoice> = [];
  isLoaded: boolean = false;
  currentDate: Date = new Date();
  constructor(
    private _dataService: DataService,
    private purchaseService: ExcisePuchaseService,
    private _modalService: NgbModal,
    public activeModal: NgbActiveModal,
    private spinner: SpinnerService
  ) {}

  ngOnInit(): void {
    this._dataService.getHeaderData().subscribe((res: any) => {
      this.headerArray = res.purchaseHeader;
      console.log(this.headerArray);
    });
    this.invoice = this.fromParent.invoice;
    this.currentDate = this._dataService.getDexpDate();
    this.getPuchaseInvoiceDetails();
  }
  // Invoice details
  getPuchaseInvoiceDetails() {
    const payload = {
      InvoiceArray: this.invoice,
    };
    this.spinner.show();
    this.purchaseService.getPurchaseInfo(payload).subscribe(
      (res: any) => {
        this.spinner.hide();
        this.isLoaded = true;
        if (res.status === 200 || res.status === 'status') {
          this.purchaseInvoiceList = res.data;
          console.log(this.purchaseInvoiceList);
        } else {
          this.purchaseInvoiceList = [];
        }
      },
      (err: any) => {
        this.spinner.hide();
        this.purchaseInvoiceList = [];
        this.isLoaded = true;
      }
    );
  }
  //Purchase Summary Popup
  openSummary() {
    this.activeModal.close('close');
    const modalRef = this._modalService.open(PurchaseSummaryComponent, { size: 'lg' });
    const data = {
      invoice: this.invoice,
    };
    modalRef.componentInstance.fromParent = data;
    modalRef.result.then(
      (data) => {
        // on close
        console.log(data);
        if (data === 'saveandsubmit') {
        }
      },
      (reason) => {
        // on dismiss
        console.log(reason);
      }
    );
  }
}
