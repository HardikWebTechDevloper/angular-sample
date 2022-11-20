import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AlertService } from '@app/services/alert.service';
import { ConfiguarationService } from '@app/services/configuaration.service';
import { DataService } from '@app/services/data.service';
import { category, RetailSKUData } from '@app/_models/skuproduct';

import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CookieService } from 'ngx-cookie-service';
import { decryptData } from 'src/helpers/crypto';
import { AddskuComponent } from './addsku/addsku.component';
import { ActivatedRoute, Router } from '@angular/router';
import { SpinnerService } from '@app/services/spinner.service';
import { NotificationPopupService } from '@app/services/notification-popup.service';
import { LicenseeService } from '@app/services/licensee.service';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss'],
})
export class ConfigurationComponent implements OnInit {
  public selectedData: string = 'T';
  public selectedPreference: string = 'L';
  page: number = 1;
  subCategoryList: Array<category>;
  skuproductList: Array<any> = [
    {
      id: 1,
      skuCode: 'KSBCL SKU Code | ALIAS',
      alias: 'alias',
      sequence: '160',
    },
    {
      id: 1,
      skuCode: 'KSBCL SKU Code | ALIAS',
      alias: 'alias',
      sequence: '170',
    },
    {
      id: 1,
      skuCode: 'KSBCL SKU Code | ALIAS',
      alias: 'alias',
      sequence: '180',
    },
    {
      id: 1,
      skuCode: 'KSBCL SKU Code | ALIAS',
      alias: 'alias',
      sequence: '190',
    },
  ];
  headerArray: any = [];
  selectedCategory: string;
  retailSKUList: Array<RetailSKUData>;
  totalCount: number = 0;
  isLoaded: boolean = false;
  reviewCategory: any = [];
  changedAliasList: any = [];
  valuesChanged: boolean = false;
  startIndex: number = 0;
  endIndex: number = 19;
  disableFields: boolean = false;
  hideCategory: boolean = false;
  constructor(
    private modalService: NgbModal,
    private dataService: DataService,
    private configuarationService: ConfiguarationService,
    private cookieService: CookieService,
    private alertService: AlertService,
    private router: Router,
    private spinner: SpinnerService,
    private route: ActivatedRoute,
    private notifiService: NotificationPopupService,
    private _licenseeService: LicenseeService
  ) {}

  ngOnInit(): void {
    const licenseeData = this.cookieService.get('licenseeDetails');
    console.log(licenseeData);
    this.checkLicensee();
    if (licenseeData) {
      const descyptedData = JSON.parse(licenseeData);
      this.selectedData = descyptedData?.DataEntry;
      this.selectedPreference = descyptedData?.EntryPreference;
      console.log(this.disableFields, ' this.disableFields');
    }

    this.getAllCategories();
  }
  // To get configuaration header of Grid table
  getHeader() {
    this.dataService.getHeaderData().subscribe((res: any) => {
      this.headerArray = res.configuarationHeader;
      if (this.disableFields) {
        this.headerArray = res.configuarationDisabledHeader;
      }
    });
  }
  // To disable Alias and Add SKU button
  checkLicensee() {
    this.dataService.checkLicenseeConfigured().subscribe(
      (res: any) => {
        if (res.status === 200 || res.status === 'success') {
        } else {
          this.disableFields = true;
        }
        this.getHeader();
      },
      (err: any) => {}
    );
  }
  // Licensee details
  getLicenseeDetails() {
    const licensee$ = this._licenseeService.getLicenseeById().subscribe(
      (res: any) => {
        if (res.status === 'success' || res.status === 200) {
          this.selectedData = res.data?.DataEntry;
          this.selectedPreference = res.data?.EntryPreference;
          this.cookieService.set('licenseeDetails', JSON.stringify(res.data));
        }
      },
      (err) => {}
    );
  }
  //To get Retail Category list
  getAllCategories() {
    this.configuarationService.getRetailCategory().subscribe(
      (response: any) => {
        if (response.status === 200) {
          this.subCategoryList = response.data;
          this.subCategoryList.forEach((item) => {
            const obj = {};
            obj[item.SubCategory] = [];
            this.reviewCategory.push(obj);
          });
          for (let i = 0; i < this.subCategoryList.length; i++) {
            if (this.subCategoryList[i].TotalSKUs > 0) {
              this.selectedCategory = this.subCategoryList[i].SubCategory;
              this.totalCount = this.subCategoryList[i].TotalSKUs;
              break;
            }
          }
          if (this.totalCount === 0) {
            this.selectedCategory = this.subCategoryList[0].SubCategory;
            this.totalCount = this.subCategoryList[0].TotalSKUs;
          }

          this.getAllRetailSKUList();
        } else {
          this.subCategoryList = [];
        }
      },
      (err: any) => {
        this.subCategoryList = [];
      }
    );
  }
  // Based on the category getting SKU list
  getAllRetailSKUList() {
    this.spinner.show();
    // to get all master sku
    const payload = {
      SubCategory: this.selectedCategory,
      // "SubCategory": "Rum",
      // Page: this.page,
      allSKUs: 'yes',
    };
    this.isLoaded = false;
    this.configuarationService.getAllRetailSKU(payload).subscribe(
      (res: any) => {
        this.spinner.hide();
        if (res['status'] === 200 || res['status'] === 'success') {
          this.retailSKUList = res.data;
          this.totalCount = this.retailSKUList.length;
          // this.reviewCategory.forEach((element: any) => {
          //   if (element[this.selectedCategory]) {
          //     if (element[this.selectedCategory].length === 0) {
          //       element[this.selectedCategory] = res.data;
          //       this.retailSKUList = res.data;
          //     } else {
          //       this.retailSKUList = element[this.selectedCategory];
          //     }
          //     this.totalCount = element[this.selectedCategory].length;
          //   }
          // });
          this.isLoaded = true;
        } else {
          this.retailSKUList = [];
          this.totalCount = 0;
          this.isLoaded = false;
        }
      },
      (err: any) => {
        this.isLoaded = false;
        this.totalCount = 0;
        this.spinner.hide();
      }
    );
  }
  //called on page changes
  onpageChanges(pageno: number) {
    this.page = pageno;
    // this.getAllRetailSKUList();
  }
  //called When category changes
  onCategorySelection(event: category) {
    if (this.changedAliasList.length > 0) {
      this.selectedCategory = this.selectedCategory;
      this.totalCount = this.totalCount;
      const alertObj = {
        title: '',
        text: 'You have made changes please save it or changes will be lost',
        icon: 'error',
        showCancelButton: true,
        confirmButtonText: 'Save',
        denyButtonText: `Don't save`,
      };
      this.notifiService.openAlert(alertObj).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        console.log(result, 'kkkk');
        if (result.isConfirmed) {
          this.updateRetialAlias();
          console.log('Saved!');
        } else if (result.isDismissed) {
          // this.valuesChanged=false;
          this.changedAliasList = [];
          this.selectedCategory = event.SubCategory;
          this.totalCount = event.TotalSKUs;
          this.startIndex = 0;
          this.endIndex = 19;
          this.page = 1;
          this.getAllRetailSKUList();
        }
      });
    } else {
      this.selectedCategory = event.SubCategory;
      this.totalCount = event.TotalSKUs;
      this.startIndex = 0;
      this.endIndex = 19;
      this.page = 1;
      this.getAllRetailSKUList();
    }
  }
  // called When category changes
  updateCategoryFn(event: any) {
    setTimeout(() => {
      this.onCategorySelection(event);
    }, 100);
  }
  // To change the Data entry
  selectData(selectedType: string) {
    this.selectedData = selectedType;
    this.valuesChanged = true;
  }

  // To change the Entry preference
  selectPreference(selectedType: string) {
    this.selectedPreference = selectedType;
    this.valuesChanged = true;
  }
  // To open the ADD SKU popup
  openAddSKUPopup() {
    this.hideCategory = true;
    const modalRef = this.modalService.open(AddskuComponent, { size: 'xl' });

    let data = {
      selectedPreference: this.selectedPreference,
      selectedDatas: this.selectedData,
    };

    modalRef.componentInstance.fromParent = data;
    modalRef.result.then(
      (data) => {
        // on close
        this.hideCategory = false;
        this.getAllCategories();
      },
      (reason) => {
        // on dismiss
        this.hideCategory = false;
      }
    );
  }

  // Called when Alias get updated
  onInputEditfn(dataEdited: any) {
    const indexvalue = this.changedAliasList.findIndex((item: any) => item.SKU === dataEdited.editedObject.SKU);
    const obj = {
      SKU: dataEdited.editedObject.SKU,
      Alias: dataEdited.editedObject.Alias,
    };
    if (indexvalue === -1) {
      if (dataEdited.editedObject.Alias) {
        this.changedAliasList.push(obj);
      }
    } else {
      this.changedAliasList[indexvalue] = obj;
    }
    console.log(this.changedAliasList, 'this.changedAliasList');
  }
  // To save the updated Alias
  updateFn() {
    setTimeout(() => {
      this.updateRetialAlias();
    }, 100);
  }

  // To save the updated Alias
  updateRetialAlias() {
    this.spinner.show();

    const payload = {
      DataEntry: this.selectedData,
      EntryPreference: this.selectedPreference,
      updateData: this.changedAliasList,
    };
    this.configuarationService.updateRetailSKU(payload).subscribe(
      (response: any) => {
        this.spinner.hide();
        if (response.status === 200 || response.status === 'succees') {
          // this.alertService.success('Data updated successfully', { keepAfterRouteChange: true, autoClose: true });
          // this.router.navigate(['opening-stock'])\
          this.changedAliasList = [];
          this.getAllRetailSKUList();
          this.getLicenseeDetails();
          const alertObj = {
            title: '',
            text: 'Data updated successfully',
            icon: 'success',
            showCancelButton: false,
            confirmButtonText: 'OK',
          };
          this.notifiService.openAlert(alertObj);
        } else {
          // this.alertService.error('Error in updating details', { keepAfterRouteChange: true, autoClose: true });
          const alertObj = {
            title: '',
            text: response.data.error,
            icon: 'error',
            showCancelButton: false,
            confirmButtonText: 'OK',
          };
          this.notifiService.openAlert(alertObj);
        }
      },
      (err: any) => {
        this.spinner.hide();
        if (err.error.status === 'error') {
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
  // To check duplicate Alias
  checkSKUAlias() {
    const payload = {
      Alias: '',
    };
    this.configuarationService.checkSKUAlias(payload).subscribe(
      (res: any) => {
        if (res.status === 'success' || res.status === 200) {
        } else {
        }
      },
      (err: any) => {}
    );
  }
}
