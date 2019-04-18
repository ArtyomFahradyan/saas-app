import { Component, OnInit } from '@angular/core';
import {UserService} from '../../services/user.service';
import * as moment from 'moment';

@Component({
  selector: 'app-users-services',
  templateUrl: './users-services.component.html',
  styleUrls: ['./users-services.component.scss']
})
export class UsersServicesComponent implements OnInit {
  displayedColumns = ['platform', 'contract', 'difference', 'daysUntilRenewal'];
  services = [];
  defLimit = {
    offset: 0,
    size: 5
  };
  constructor(private userService: UserService) { }

  ngOnInit() {
    this.getServices();
  }
  getServices() {
    this.userService.getServices(this.defLimit.offset, this.defLimit.size)
      .subscribe(data => {
        this.services = this.services.concat(data['contracts']);
      });
  }
  loadMore() {
    this.defLimit.offset += 5;
    this.getServices();
  }
  avgPrice(platform, usage) {
    let avg;
    switch (usage) {
      case 'Small':
        avg = platform.avgSmallPrice;
        break;
      case 'Medium':
        avg = platform.avgMediumPrice;
        break;
      case 'Large':
        avg = platform.avgLargePrice;
        break;
    }
    return Math.round(avg);
  }
  renewalDays(elem) {
    if (!elem) {
      return;
    }
    if (elem.renewalAt) {
      const date1 = new Date(moment(elem.renewalAt).format('YYYY-MM-DD')),
            date2 = new Date(moment(new Date()).format('YYYY-MM-DD')),
            timeDiff = Math.abs(date2.getTime() - date1.getTime()),
            diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
      return diffDays;
    }
  }
  difference(platform, usage, price) {
    const avg = this.avgPrice(platform, usage);
    return Math.round(((avg - price) * 100) / price);
  }
}
