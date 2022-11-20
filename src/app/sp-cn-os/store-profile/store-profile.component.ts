import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@app/@core';
import { AlertService } from '@app/services/alert.service';
import { LicenseeService } from '@app/services/licensee.service';
import { NotificationPopupService } from '@app/services/notification-popup.service';
import { SpinnerService } from '@app/services/spinner.service';
import { response } from 'express';
import { CookieService } from 'ngx-cookie-service';
import { finalize } from 'rxjs/operators';
import { encrytServerData } from 'src/helpers/crypto';

@UntilDestroy()
@Component({
  selector: 'app-store-profile',
  templateUrl: './store-profile.component.html',
  styleUrls: ['./store-profile.component.scss'],
  providers: [DatePipe],
})
export class StoreProfileComponent implements OnInit {
  storeProfileFormGroup: FormGroup;
  profileData: any;
  isLoading: boolean;
  submitted: boolean = false;
  validPattern = '^-?([1-8]?[1-9]|[1-9]0).{1}d{1,6}$';
  constructor(
    private _licenseeService: LicenseeService,
    private alertService: AlertService,
    private router: Router,
    private cookieService: CookieService,
    private spinner: SpinnerService,
    private datePipe: DatePipe,
    private notifiService: NotificationPopupService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this._buildForm();
    this.getLicenseeById();
    // let apiTest = this._licenseeService.samplePost({ data: 'test' });
    // apiTest.subscribe((data) => console.log(data));
  }
  // Returns form controls of the form
  get storeProfileFormControl() {
    return this.storeProfileFormGroup.controls;
  }

  _buildForm() {
    this.storeProfileFormGroup = this.formBuilder.group({
      licenseeName: [''],
      licenseeHolderName: [''],
      address: [''],
      street: [''],
      city: [''],
      contactNumber: [''],
      emailId: [
        '',
        [Validators.required, Validators.email, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-z]{2,4}$')],
      ],
      licenseeKSBCLCode: [''],
      licenseeValidity: [''],
      panNumber: [''],
      latitude: ['', [Validators.required, Validators.pattern(/^-?([1-8]?[1-9]|[1-9]0)\.{1}\d{1,6}$/)]],
      longitude: ['', [Validators.required, Validators.pattern(/^-?([1-8]?[1-9]|[1-9]0)\.{1}\d{1,6}$/)]],
    });
    // this._licenseeService.
  }
  // To save licensee details
  saveStoreProfile() {
    console.log(this.storeProfileFormGroup.value);
    const payload = {
      Name: this.storeProfileFormGroup.value.licenseeName,
      LicenseHolderName: this.storeProfileFormGroup.value.licenseeHolderName,
      Address: this.storeProfileFormGroup.value.address,
      Street: this.storeProfileFormGroup.value.street,
      City: this.storeProfileFormGroup.value.city,
      email: this.storeProfileFormGroup.value.emailId,
      StoreLocationLAT: this.storeProfileFormGroup.value.latitude,
      StoreLocationLON: this.storeProfileFormGroup.value.longitude,
      PAN: this.storeProfileFormGroup.value.panNumber,
      Phone_Number: this.storeProfileFormGroup.value.contactNumber,
    };
    console.log(payload);
    this.spinner.show();
    this._licenseeService.updateLicensee(payload).subscribe(
      (respose: any) => {
        this.spinner.hide();
        console.log(respose, 'resposjjjje');
        if (respose['status'] === 200) {
          const alertObj = {
            title: '',
            text: 'Licensee details updated successfully',
            icon: 'success',
            showCancelButton: false,
            confirmButtonText: 'OK',
          };
          this.notifiService.openAlert(alertObj);
          // this.alertService.success('Licensee details updated successfully');
          // this.router.navigate(['configuaration']);
        } else {
          const alertObj = {
            title: '',
            text: respose.data.error,
            icon: 'error',
            showCancelButton: false,
            confirmButtonText: 'OK',
          };
          this.notifiService.openAlert(alertObj);
          // this.alertService.error('Error in updating details');
        }
      },
      (err: any) => {
        this.spinner.hide();
        if (err.error.status == 'error') {
          console.log('ERROR');
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
  // On keypress to check  the input values meet the below regex
  keyPressAlphaNumeric(event: any) {
    var inp = String.fromCharCode(event.keyCode);

    const validPattern = /^-?([1-8]?[1-9]|[1-9]0)\.{1}\d{1,6}$/;
    // const validPattern = /[0-9.]/;

    if (validPattern.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  // Patching the licensee data to the form
  _setStoreProfile(licenseeData: any) {
    console.log(licenseeData, 'licenseeData');
    const data = {
      licenseeName: licenseeData.Name,
      licenseeHolderName: licenseeData.OwnerName,
      address: licenseeData.Address,
      city: licenseeData.City,
      contactNumber: licenseeData.Phone_Number,
      emailId: licenseeData.Email,
      licenseeKSBCLCode: licenseeData.LicenseeID,
      licenseeValidity: this.datePipe.transform(licenseeData.ValidityEndDate, 'MM/yyyy'),
      panNumber: licenseeData.PAN,
      street: licenseeData.Street,
      latitude: licenseeData.StoreLocationLAT,
      longitude: licenseeData.StoreLocationLON,
    };

    this.storeProfileFormGroup.patchValue(data);
  }
  // To get the licensee details
  getLicenseeById() {
    const licensee$ = this._licenseeService.getLicenseeById();
    licensee$
      .pipe(
        finalize(() => {
          this.storeProfileFormGroup.markAsPristine();
          this.isLoading = false;
        }),
        untilDestroyed(this)
      )
      .subscribe(
        (response: any) => {
          this._setStoreProfile(response.data);
          //  const encryptedData = encrytServerData(response.data,'lincensee_api_response')
          this.cookieService.set('licenseeDetails', JSON.stringify(response.data));
        },
        (error) => {
          console.log(error);
        }
      );
  }
}
