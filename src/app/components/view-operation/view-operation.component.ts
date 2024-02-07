import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-view-operation',
  templateUrl: './view-operation.component.html',
  styleUrls: ['./view-operation.component.scss']
})
export class ViewOperationComponent {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource!: any;
  operation: any;
  constructor(@Inject(MAT_DIALOG_DATA) public _operation: any) {
    console.log(_operation);
    switch (_operation._operation) {
      case 'domesticTravels':
        this.operation = 'Domestic Travels';
        break;
      case 'internationalTravels':
        this.operation = 'International Travels';
        break;
      case 'visaExtensionApplications':
        this.operation = 'Visa Extension Applications';
        break;
      case 'guesthouseServices':
        this.operation = 'Guesthouse Services';
        break;
      case 'allFlightsInformation':
        this.operation = 'Flights Information';
        break;
      case 'visaApplications':
        this.operation = 'Visa Applications';
        break;
      default:
        break;
    }
    console.log(this.operation)
  }
}
