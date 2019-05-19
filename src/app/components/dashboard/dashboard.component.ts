import {Component, OnInit} from '@angular/core';
import {Chart} from '../../../assets/js/chart/Chart.min';
import {HttpRequestsService} from '../../services/http-requests.service';
import {Contract} from '../../models/contract';
import {HelpersService} from '../../services/helpers.service';
import {Summary} from '../../models/summary';
import {Router} from '@angular/router';
import {MeGlobal} from '../me';
import {CHART_OPTIONS, MONTHS, CHART_DEF_DATA, CHART_FONT} from '../../constants/chart';
import {TranslateService} from '@ngx-translate/core';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  renewals: Contract[] = [];
  fiscalYear = 0;
  summary: Summary = <Summary>{};
  ifLogdIn = true;
  chartData = CHART_DEF_DATA;
  monthlySummary = [];
  offset = 0;
  myLineChart: Chart;
  year = new Date().getFullYear();
  chartOptions = CHART_OPTIONS;
  constructor(private httpRequests: HttpRequestsService,
              public meGlobal: MeGlobal,
              private translate: TranslateService,
              private router: Router,
              public helper: HelpersService) {
    translate.setDefaultLang('en');
    if (!localStorage.getItem('loggedIn')) {
      this.ifLogdIn = false;
    }
  }
  ngOnInit() {
    if (this.ifLogdIn) {
      this.getContracts();
    } else {
      this.createChart();
    }
  }
  changeYear(nextOrPrev) {
    if (nextOrPrev === 'next') {
      this.year += 1;
      this.offset += 1;
      this.getContracts();
    } else {
      this.year -= 1;
      this.offset -= 1;
      this.getContracts();
    }
  }
  goToServicePage(contract) {
    this.router.navigate([`stack/${contract._id}`]);
  }
  getContracts() {
    this.httpRequests.renevalClosest(this.offset)
      .subscribe(data => {
        if (data) {
          this.renewals = data.renewals;
          this.summary = <Summary>data.summary;
          this.monthlySummary = data.chart;
          this.chartData = data.monthlySummary;
          this.meGlobal.data.subscribe(val => {
            if (val) {
              this.fiscalYear = val.account.fiscalYearStartAt;
              if (this.router.url === '/dashboard') {
                if (this.myLineChart) {
                  this.updateChart();
                } else {
                  this.createChart();
                }
              }
            }
          });
        }
      });
  }
  updateChart() {
    this.myLineChart.data.datasets[0].data = this.chartData;
    this.helper.setCallBack(this.myLineChart);
    this.myLineChart.update();
  }
  createChart() {
    Chart.defaults.global.defaultFontFamily = CHART_FONT;
    Chart.defaults.global.defaultFontColor = '#87838e';
    const draw = Chart.controllers.line.prototype.draw;
    Chart.controllers.line = Chart.controllers.line.extend({
      draw: function() {
        const ctx = this.chart.chart.ctx;
        ctx.save();
        ctx.shadowColor = 'rgba(96, 47, 234, 0.6)';
        ctx.shadowBlur = 40;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 12;
        ctx.stroke();
        draw.apply(this, arguments);
        ctx.restore();
      }
    });
    // Area Chart
    const labels = MONTHS.slice(),
          labelsWithFiscal = labels.splice(0, this.fiscalYear - 1),
          ctx = document.getElementById('myAreaChart');
    this.chartOptions.data.labels = labels.concat(labelsWithFiscal);
    this.chartOptions.options['tooltips'] = {
      displayColors: false,
        callbacks: {
        label: (tooltipItem, data) => {
          const labelsArr = [];
          let label = data.datasets[tooltipItem.datasetIndex].label || '';

          if (label) {
            label += ': ';
          }
          label += Math.round(tooltipItem.yLabel);
          labelsArr.push(label);
          this.monthlySummary[tooltipItem.index].forEach(item => {
            const val = item.name + ': ' + Math.floor(item.cost);
            labelsArr.push(val);
          });
          return labelsArr;
        }
      }
    };
    this.chartOptions.data.datasets[0]['data'] = this.chartData;
    this.myLineChart = new Chart(ctx, this.chartOptions);
    this.helper.setCallBack(this.myLineChart);
  }
}
