import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import {HttpClient, HttpResponse, HttpHeaders} from '@angular/common/http'
import {Constants, FaceInfo, FaceInfoList} from './constants'

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {

    @ViewChild('video')
    public video: ElementRef;

    @ViewChild('canvas')
    public canvas: ElementRef;

    public captures: Array<any>;

    public constructor(private http : HttpClient) {
        this.captures = [];
    }

    public ngOnInit() { }

    public ngAfterViewInit() {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
                this.video.nativeElement.src = window.URL.createObjectURL(stream);
                this.video.nativeElement.play();
            });
        }
    }

    public capture() {
        const context = this.canvas.nativeElement.getContext('2d').drawImage(this.video.nativeElement, 0, 0, 640, 480);
        this.captures.push(this.canvas.nativeElement.toDataURL('image/png'));
        this.uploadFile(this.captures)
    }

    uploadFile(files) {
        const formData: FormData = new FormData();
        formData.append("file", files[0]);
        let url = Constants.API_ENDPOINT;

        this.http.post<FaceInfoList>(url,formData).subscribe((data: any) => {
            console.log(data);
          });
    }
}
