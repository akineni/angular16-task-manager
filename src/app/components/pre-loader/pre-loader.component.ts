import { Component } from '@angular/core';
import { PreLoaderService } from 'src/app/services/pre-loader.service';

@Component({
  selector: 'app-pre-loader',
  templateUrl: './pre-loader.component.html',
  styleUrls: ['./pre-loader.component.css']
})
export class PreLoaderComponent {

  constructor(public myService: PreLoaderService) { }

}