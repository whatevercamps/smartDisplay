import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ImagesService } from '../../services/images.service';
import { FileUploader, FileSelectDirective } from 'ng2-file-upload/ng2-file-upload';
import { interval } from 'rxjs';
const URL = 'http://192.168.10.113:3000/users/upload';
var images = [];


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  tam = 0;
  user: Object;
  public uploader: FileUploader = new FileUploader({ url: URL, itemAlias: 'photo' });

  constructor(private imagesService: ImagesService, private authService: AuthService, private router: Router) { }


  cargarImagenes = function () {
    if (this.images !== undefined) {
      if (this.tam == this.images.length) {
        return true;
      }
    }
    this.imagesService.getImages().subscribe(res => {
      this.images = res.imgs;
      this.tam = this.images.length;
    },
      err => {
        console.log(err);
        return false;
      });

  }



  cargarSubidor = function () {
    this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false; };
    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      try {
        var resp = JSON.parse(response);
      } catch (err) {
        console.log(response);
        console.log(err);
      }

      if (resp.success === true) {
        console.log('ImageUpload:uploaded:', item, status, response);
        alert('Imagen subida correctamente.');
        this.router.navigate(['']);
      } else {
        console.log(response);
        alert(resp.msg);
        this.uploader = new FileUploader({ url: URL, itemAlias: 'photo' });
        this.cargarSubidor();
      }
    };
  };

  onEliminarClick(id) {
    console.log(id);
    this.imagesService.eliminarImagen(id).subscribe(data => {
      if (data.success) {
        this.tam--;
      } else {

      }
    });
  };


  ngOnInit() {
    // Create an Observable that will publish a value on an interval
    const secondsCounter = interval(1000);
    // Subscribe to begin publishing values
    secondsCounter.subscribe(n => this.cargarImagenes());
    this.authService.getProfile().subscribe(profile => {
      this.user = profile.user;
    },
      err => {
        console.log(err);
        return false;
      });
    this.cargarSubidor();
  }
}
