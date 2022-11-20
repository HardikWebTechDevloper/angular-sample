import { Injectable } from '@angular/core';
import { NotificationPopupComponent } from '@app/@shared/components/notification-popup/notification-popup.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class NotificationPopupService {
  constructor(private _modalService: NgbModal) {}

  openPopUp(
    title: string,
    message: string,
    btnOkText: string = 'OK',
    btnCancelText: string = 'Cancel',
    dialogSize: 'sm' | 'lg' = 'sm'
  ) {
    const modalRef = this._modalService.open(NotificationPopupComponent, { size: dialogSize });
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.message = message;
    modalRef.componentInstance.btnOkText = btnOkText;
    modalRef.componentInstance.btnCancelText = btnCancelText;

    return modalRef.result;

    // modalRef.componentInstance.fromParent = data;
    // modalRef.result.then(
    //   (data) => {
    //     // on close
    //     console.log(data, 'data---');
    //     if (data === 'yes') {

    //     }
    //     if(data==='no'){
    //     }
    //   },
    //   (reason) => {
    //     // on dismiss
    //     console.log(reason);
    //   }
    // );
  }

  openAlert(alertObj: any) {
    return Swal.fire(alertObj);
    Swal.fire(alertObj).then((result) => {
      if (result.value) {
        // Swal.fire(
        //   'Deleted!',
        //   'Your imaginary file has been deleted.',
        //   'success'
        // )
        // For more information about handling dismissals please visit
        // https://sweetalert2.github.io/#handling-dismissals
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // Swal.fire(
        //   'Cancelled',
        //   'Your imaginary file is safe :)',
        //   'error'
        // )
      }
    });
  }
}
