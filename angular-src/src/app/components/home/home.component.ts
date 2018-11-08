import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ImagesService } from '../../services/images.service';
import { interval } from 'rxjs';
var images = [];
var image: String;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  tam = 0;
  n3 = 0;

  constructor(private imagesService: ImagesService, private router: Router) { }

  subirContador = function () {
    if (this.n3 >= this.tam - 1) {
      this.n3 = 0;
    } else {
      this.n3 += this.n3 + 1;
    }
    console.log(this.n3);
  }


  cargarImagenes = function () {
    this.imagesService.getImages().subscribe(res => {

      var imgsTemp = res.imgs;

      if (this.images != undefined) {
        console.log(this.images[this.n3]);
        if (this.images[this.n3] != undefined) {
          this.image = this.images[this.n3];
          console.log(this.image);
        }
      }

      if (this.images !== undefined && imgsTemp !== undefined) {
        if (this.tam == imgsTemp.length) {
          return true;
        }
      }
      if (imgsTemp !== undefined) {
        this.images = imgsTemp;
        this.tam = this.images.length;
        return true;
      }
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
    const secondsCounter2 = interval(7000);
    // Subscribe to begin publishing values
    secondsCounter.subscribe(n => this.cargarImagenes());
    // Subscribe to begin publishing values
    secondsCounter2.subscribe(n2 => this.subirContador());
  }

}
