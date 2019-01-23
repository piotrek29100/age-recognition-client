import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, HostListener } from '@angular/core';
import {HttpClient, HttpResponse, HttpHeaders} from '@angular/common/http'
import {Constants, FaceInfo, FaceInfoList} from './constants'
import { interval } from 'rxjs';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {

    @ViewChild('video')
    public video: ElementRef;

    @ViewChild('canvas1')
    public canvas1: ElementRef;

    @ViewChild('canvas2')
    public canvas2: ElementRef;

    public captures: Array<any>;

    showResults = false;
    actualImage = null;
    private timer;
    private recentData;

    cameraWidth : any
    cameraHeight : any
    navbarHeight = 30
    fontSize : any
    descHeight: any
    lastPhotoHeight: any
    maxPhotos = 6

    @HostListener('window:resize', ['$event'])
    onResize(event) {
        this.ngAfterViewInit()
    }

    public constructor(private http : HttpClient) {
        this.captures = [];
    }

    public ngOnInit() { 
    }

    public ngAfterViewInit() {
        console.log("Windows width: " + window.innerWidth + " height: " + window.innerHeight) 
        var tmpCameraRealSize = {width: 640, height: 480}
        this.cameraWidth = window.innerWidth / 2
        for(var i = 0; i < Constants.RESOLUTIONS.length; i++) {
            if(this.cameraWidth >= Constants.RESOLUTIONS[i].width) {
                tmpCameraRealSize = Constants.RESOLUTIONS[i]
            }
        }

        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: {width: tmpCameraRealSize.width, height: tmpCameraRealSize.height} }).then(stream => {
                let {width, height} = stream.getTracks()[0].getSettings();
                console.log("Camera width: " + width + " height: " + height) 
                this.cameraWidth = width
                this.cameraHeight = height
                this.navbarHeight = window.innerHeight * 0.08;
                this.fontSize = this.navbarHeight * 0.07;
                this.descHeight = window.innerHeight * 0.43
                this.lastPhotoHeight = this.cameraHeight / 4
                this.video.nativeElement.srcObject = stream;
                this.video.nativeElement.addEventListener('play', function() {
        self.timerCallback();
      }, false);
                this.video.nativeElement.play();
                let self = this;
                this.timer = interval(2000); ///Odkomentować
                this.timer.subscribe((t) => this.capture());
            });
        }
    }

    timerCallback() {
        if (this.video === undefined || this.video.nativeElement.paused || this.video.nativeElement.ended) {
      return;
    }
    this.computeFrame();
    let self = this;
    setTimeout(function() {
        self.timerCallback();
      }, 0);
    }

    computeFrame() {
    this.canvas1.nativeElement.getContext('2d').drawImage(this.video.nativeElement, 0, 0/*, this.cameraWidth, this.cameraHeight*/);
    let frame = this.canvas1.nativeElement.getContext('2d').getImageData(0, 0, this.cameraWidth, this.cameraHeight);
    let context = this.canvas1.nativeElement.getContext('2d');
            context.font = "20px Calibri";
      if (this.recentData !== undefined) {
            for(var i = 0; i < this.recentData.length; i++) {
                var face = this.recentData[i];
                context.beginPath();
                context.lineWidth = "4";
                context.strokeStyle = "red";
                context.fillStyle = "red";
                context.rect(face.left, face.top, face.right - face.left, face.bottom - face.top);
                context.stroke();

                context.fillText(face.age, face.left + 3, face.top + 15);
            }
        }
    this.canvas2.nativeElement.getContext('2d').putImageData(frame, 0, 0);
  }

    public capture() {
        if (this.showResults === true) {
            return;
        }
        const context = this.canvas1.nativeElement.getContext('2d').drawImage(this.video.nativeElement, 0, 0, /*this.cameraWidth, this.cameraHeight*/);
        this.captures.push(this.canvas1.nativeElement.toDataURL('image/png'));
        if(this.captures.length > this.maxPhotos) {
            this.captures.shift()
        }
        
        //this.uploadFile(this.captures) ///Odkomentować
    }

    uploadFile(files) {
        const formData: FormData = new FormData();
        var position = files.length - 1;
        formData.append('file',files[position]);
        const url = Constants.API_ENDPOINT;
        console.log("Capture done" + new Date());

        this.http.post<FaceInfoList>(url, formData).subscribe((data: any) => {

            var img = new Image()
            img.src = files[position]
            let canvas = this.canvas1.nativeElement;
            let context = canvas.getContext('2d');
            context.drawImage(img,0,0)
            context.font = "20px Calibri";
            console.log(data + "date" + new Date());
            this.recentData = data;

            for(var i = 0; i < data.length; i++) {
                var face = data[i];
                context.beginPath();
                context.lineWidth = "4";
                context.strokeStyle = "red";
                context.fillStyle = "red";
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
