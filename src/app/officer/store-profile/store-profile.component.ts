import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OfficerStoreprofileService } from '@app/services/officer-storeprofile.service';
import { licenseeDetails } from '@app/_models/officer';

@Component({
  selector: 'app-store-profile',
  templateUrl: './store-profile.component.html',
  styleUrls: ['./store-profile.component.scss'],
})
export class StoreProfileComponent implements OnInit {
  licenseeId = '';
  licenseeDetails: licenseeDetails;
  onLoad: boolean;
  constructor(
    private route: ActivatedRoute,
    private _storeProfileService: OfficerStoreprofileService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: any) => {
      this.licenseeId = params.LID;
      this.getLicenseeById();
    });
  }
  getLicenseeById() {
    this.onLoad = false;
    const payload = {
      LicenseeID: this.licenseeId,
    };
    this._storeProfileService.getLicenseeByID(payload).subscribe(
      (res: any) => {
        console.log(res, 'ressss');
        if (res.status === 200 || res.status === 'success') {
          this.licenseeDetails = res.data;
        } else {
        }
        this.onLoad = true;
      },
      (err: any) => {
        this.onLoad = true;
      }
    );
  }
  openGoogleMap() {
    this.router.navigateByUrl('https://maps.google.com/?q=-37.866963,144.980615');
  }
}
