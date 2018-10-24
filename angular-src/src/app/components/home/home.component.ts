import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ImagesService } from '../../services/images.service';
import { interval } from 'rxjs';
var images = [];

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  tam = 0;

  constructor(private imagesService: ImagesService, private router: Router) { }

  cargarImagenes = function () {
    this.imagesService.getImages().subscribe(res => {

      var imgsTemp = res.imgs;

      if (this.images !== undefined && imgsTemp !== undefined) {
        if (this.tam == imgsTemp.length) {
          console.log('sigue igual');
          return true;
        }
      }
      console.log('no es igual');
      if (imgsTemp !== undefined) {
        console.log('cambiando!');
        this.images = imgsTemp;
        this.tam = this.images.length;
        return true;
      }
      console.log('no es dif a undefind');
      console.log(imgsTemp);

    },
      err => {
        console.log(err);
        return false;
      });

  }


  showNavigationArrows = false;
  showNavigationIndicators = false;
  images = this.cargarImagenes();





  ngOnInit() {
    // Create an Observable that will publish a value on an interval
    const secondsCounter = interval(1000);
    // Subscribe to begin publishing values
    secondsCounter.subscribe(n => this.cargarImagenes());

  }

}

