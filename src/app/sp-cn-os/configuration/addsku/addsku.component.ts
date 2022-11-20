import { Component, OnInit } from '@angular/core';
import { AlertService } from '@app/services/alert.service';
import { ConfiguarationService } from '@app/services/configuaration.service';
import { DataService } from '@app/services/data.service';
import { NotificationPopupService } from '@app/services/notification-popup.service';
import { SpinnerService } from '@app/services/spinner.service';
import { category, MasterSKUData, SkuProduct } from '@app/_models/skuproduct';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { OwlOptions } from 'ngx-owl-carousel-o';
const leftArrow: string = 'assets/images/left-arrow-white.png';
const rightArrow: string = 'assets/images/right-arrow-white.png';
@Component({
  selector: 'app-addsku',
  templateUrl: './addsku.component.html',
  styleUrls: ['./addsku.component.scss'],
})
export class AddskuComponent implements OnInit {
  customOptions: OwlOptions = {
    loop: false,
    autoplay: false,
    center: false,
    dots: false,

    margin: 20,
    navText: ['<img src="' + leftArrow + '">', '<img src="' + rightArrow + '">'],
    responsive: {
      0: {
        items: 1,
      },
      600: {
        items: 4,
      },
      1000: {
        items: 9,
      },
    },
    nav: true,
  };
  fromParent: any;
  selectedCategory: string;
  subCategoryList: Array<category>;
  searchString: string = '';
  defaultSearch: string = '';
  masterSKUList: Array<SkuProduct> = [];
  headerArray: any = [];
  selectedSKUCount: number = 0;
  public selectedData: string = 'T';
  public selectedPreference: string = 'L';
  totalCount: number = 0;
  reviewCategory: any = [];
  selectedSKUS: Array<SkuProduct> = [];
  isLoaded: boolean = false;
  constructor(
    private configuarationService: ConfiguarationService,
    private dataService: DataService,
    public activeModal: NgbActiveModal,
    private alertService: AlertService,
    private spinner: SpinnerService,
    private notifiService: NotificationPopupService
  ) {}

  ngOnInit(): void {
    this.selectedData = this.fromParent.selectedDatas;
    this.selectedPreference = this.fromParent.selectedPreference;
    this.getAllCategory();
    this.dataService.getHeaderData().subscribe((res: any) => {
      this.headerArray = res.AddNewSKUHeader;
    });
  }
  // To get All categories
  getAllCategory() {
    this.dataService.getAllSubCategory().subscribe(
      (response: any) => {
        if (response['status'] === 200 || response['status'] === 'success') {
          this.subCategoryList = response.data;
          this.subCategoryList.forEach((item) => {
            const obj = {};
            obj[item.SubCategory] = [];
            this.reviewCategory.push(obj);
          });
          this.selectedCategory = this.subCategoryList[0].SubCategory;
          this.totalCount = this.subCategoryList[0].TotalSKUs;
          this.getAllMasterSKU();
        } else {
          this.subCategoryList = [];
        }
      },
      (err: any) => {
        this.subCategoryList = [];
      }
    );
  }
  // To get SKU based on the selected category
  getAllMasterSKU() {
    this.isLoaded = false;
    this.defaultSearch = '';
    this.spinner.show();
    const payload = {
      SubCategory: this.selectedCategory ? this.selectedCategory : 'Rum',
      SKU: this.searchString ? this.searchString : '',
    };
    this.reviewCategory.forEach((element: any) => {
      if (element[this.selectedCategory]) {
        if (element[this.selectedCategory].length === 0) {
          this.configuarationService.getAllMasterSKU(payload).subscribe(
            (res: any) => {
              this.spinner.hide();

              if (res['status'] === 200 || res['status'] === 'success') {
                // this.masterSKUList = res.data;
                element[this.selectedCategory] = res.data;
                this.masterSKUList = res.data;
              } else {
                this.selectedSKUCount = 0;
                this.masterSKUList = [];
              }
              this.isLoaded = true;
            },
            (err: any) => {
              this.spinner.hide();
              this.masterSKUList = [];
              this.isLoaded = true;
            }
          );
        } else {
          this.searchString = '';
          this.masterSKUList = element[this.selectedCategory];

          setTimeout(() => {
            this.defaultSearch = '';
            this.isLoaded = true;
            this.spinner.hide();
          }, 0);
        }
        this.totalCount = element[this.selectedCategory].length;
      }
    });
  }
  // To search the SKU by string
  searchSKUbyString(searchString: string) {
    this.searchString = searchString;
    this.getAllMasterSKU();
  }
  // To select the SKU
  onSKUSelection(sku: SkuProduct) {
    const index = this.selectedSKUS.findIndex((item: any) => item.SKU === sku.SKU);
    if (index === -1) {
      this.selectedSKUS.push(sku);
    } else {
      this.selectedSKUS.splice(index, 1);
    }

    this.selectedSKUCount = this.selectedSKUS.length;
  }
  // To add the selected SKU's
  addSKU() {
    // const filteredArray = this.masterSKUList.filter((item) => item?.isSelected);
    const filteredArray = this.selectedSKUS;
    const payload = {
      SKUData: filteredArray,
    };
    this.configuarationService.addSKUData(payload).subscribe(
      (res: any) => {
        if (res['status'] === 200 || res['status'] === 'success') {
          this.spinner.hide();
          // this.alertService.success('SKU added successfully', { keepAfterRouteChange: true, autoClose: true });
          setTimeout(() => {
            this.activeModal.close('success');
          }, 0);
          const alertObj = {
            title: '',
            text: 'SKU added successfully',
            icon: 'success',
            showCancelButton: false,
            confirmButtonText: 'OK',
          };
          this.notifiService.openAlert(alertObj);
        } else {
          const alertObj = {
            title: '',
            text: res.data.error,
            icon: 'error',
            showCancelButton: false,
            confirmButtonText: 'OK',
          };
          this.notifiService.openAlert(alertObj);
          // this.alertService.error(res.data.error, { keepAfterRouteChange: true, autoClose: true });
        }
      },

      (err: any) => {
        this.spinner.hide();
        if (err.error.status == 'error') {
          const alertObj = {
            title: '',
            text: err.error.error,
            icon: 'error',
            showCancelButton: false,
            confirmButtonText: 'OK',
          };
          this.notifiService.openAlert(alertObj);
          // this.alertService.error(err.error.error, { keepAfterRouteChange: true, autoClose: true });
        }
      }
    );
  }
  // Called when category selection changes
  onCategorySelection(event: category) {
    this.selectedCategory = event.SubCategory;
    this.searchString = '';
    this.defaultSearch = '';
    setTimeout(() => {
      this.defaultSearch = '';
    }, 0);

    this.totalCount = event.TotalSKUs;
    this.getAllMasterSKU();
  }
}
