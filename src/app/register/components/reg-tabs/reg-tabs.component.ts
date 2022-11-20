import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-reg-tabs',
  templateUrl: './reg-tabs.component.html',
  styleUrls: ['./reg-tabs.component.scss'],
})
export class RegTabsComponent implements OnInit {
  @Input() activePuchase: boolean = false;
  @Input() activeSales: boolean = false;
  @Input() activeStock: boolean = false;
  @Input() stock: boolean = false;
  constructor() {}

  ngOnInit(): void {}
}
