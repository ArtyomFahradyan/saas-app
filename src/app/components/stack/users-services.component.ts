import { Component, OnInit } from '@angular/core';
import {UserService} from '../../services/user.service';
import {HelpersService} from '../../services/helpers.service';

@Component({
  selector: 'app-users-services',
  templateUrl: './users-services.component.html',
  styleUrls: ['./users-services.component.scss']
})
export class UsersServicesComponent implements OnInit {
  services = [];
  searchTerm = '';
  platform = 'name';
  dir: 'asc' | 'desc' = 'asc';
  servicesCount = 0;
  defLimit = {
    offset: 0,
    size: 5
  };
  constructor(private userService: UserService,
              public helper: HelpersService) { }

  ngOnInit() {
    this.getServices();
  }
  getServices(change = null) {
    if (change) {
      this.defLimit.offset = 0;
      this.services.length = 0;
    }
    this.userService.getServices(this.defLimit.offset, this.defLimit.size, this.searchTerm, this.platform, this.dir)
      .subscribe(data => {
        this.servicesCount = data['count'];
        this.services = this.services.concat(data['contracts']);
      });
  }
  loadMore() {
    this.defLimit.offset += 5;
    this.getServices();
  }
  descOrAsc() {
    if (this.dir === 'asc') {
      this.dir = 'desc';
    } else if (this.dir === 'desc') {
      this.dir = 'asc';
    }
    this.getServices('change');
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
  difference(platform, usage, price) {
    const avg = this.avgPrice(platform, usage);
    return Math.round(((avg - price) * 100) / price);
  }
}
