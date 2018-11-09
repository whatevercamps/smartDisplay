import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { map } from 'rxjs/operators';

@Injectable()
export class ImagesService {

  constructor(private http: Http) { }


  getImages() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.get('http://192.168.0.7:3000/users/images', { headers: headers }).pipe(
      map(res => res.json()));
  }

  eliminarImagen(id) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.delete('http://192.168.0.7:3000/users/removeImage?idImage=' + id, { headers: headers }).pipe(
      map(res => res.json())
    );
  }

}
