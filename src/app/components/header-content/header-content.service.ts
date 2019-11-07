import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

const BACKEND_URL = environment.apiUrl;

@Injectable({ providedIn: "root" })
export class HeaderService {
  private imageUser: string;

  constructor(private http: HttpClient) {}

  getImagePath() {
    this.http.get<{imagePath: string}>(BACKEND_URL);
  }

}
