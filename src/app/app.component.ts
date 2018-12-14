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

    showResults = false;
    actualImage = null;

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
        var position = files.length - 1;
        formData.append('file',files[position]);
        const url = Constants.API_ENDPOINT;

        this.http.post<FaceInfoList>(url, formData).subscribe((data: any) => {

            var img = new Image()
            img.src = files[position]
            let canvas = this.canvas.nativeElement;
            let context = canvas.getContext('2d');
            context.drawImage(img,0,0)
            context.font = "20px Calibri";
            console.log(data);

            for(var i = 0; i < data.length; i++) {
                var face = data[i];
                context.beginPath();
                context.lineWidth = "4";
                context.strokeStyle = "red";
                console.log(face.left)
                console.log(face.top)
                console.log(face.right - face.left)
                console.log(face.bottom - face.top)
                context.rect(face.left, face.top, face.right - face.left, face.bottom - face.top);
                context.stroke();

                context.fillText(face.age, face.left + 3, face.top + 15);
            }
            
            files[position] = canvas.toDataURL()
          });
    }
    public viewImage(index) {
        this.showResults = true
        this.actualImage = this.captures[index]
        console.log(index)
    }
    public record() {
        this.showResults = false;
        this.ngAfterViewInit()
    }
}
