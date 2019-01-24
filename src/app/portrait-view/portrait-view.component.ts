import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, HostListener, ChangeDetectorRef } from '@angular/core';
import {HttpClient, HttpResponse, HttpHeaders} from '@angular/common/http'
import {Constants, FaceInfo, FaceInfoList} from '../constants'
import { interval } from 'rxjs';
import {AppService} from '../app.service'


@Component({
  providers: [AppService],
  selector: 'app-portrait-view',
  templateUrl: './portrait-view.component.html',
  styleUrls: ['./portrait-view.component.css']
})
export class PortraitViewComponent implements OnInit,AfterViewInit {

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
    setRecentData(data) {
        this.recentData = data
    }
    private recentData;

    cameraWidth = 640
    cameraHeight = 480
    navbarHeight = 30
    fontSize : any
    descHeight: any
    lastPhotoHeight: any
    maxPhotos = 4
    isRotated = false
    description = Constants.DESCRIPTION + "\n Authors: Daria Hubernatorova, Piotr Wawrzyniak, Damian Gutowski"

    @HostListener('window:resize', ['$event'])
    onResize(event) {
        this.ngAfterViewInit()
    }

    public constructor(private http : HttpClient, private appService: AppService, private cdRef:ChangeDetectorRef ) {
        this.captures = [];
    }

    public rotate() {
        if(!this.isRotated) {
            console.log("Rotate")
            const ctx = this.canvas1.nativeElement.getContext('2d')
            ctx.restore()
            ctx.save();
            ctx.translate(this.cameraWidth / 2, this.cameraWidth / 2);
            
            ctx.rotate(90 * Math.PI / 180);
            ctx.translate(-this.cameraWidth / 2, -this.cameraWidth / 2);
            this.isRotated = true
        }
    }

    public ngOnInit() { 
    }
    public ngAfterViewInit() {
      console.log("Windows width: " + window.innerWidth + " height: " + window.innerHeight) 
      var tmpCameraRealSize = {width: 640, height: 480}
      this.cameraHeight = window.innerHeight
      for(var i = 0; i < Constants.RESOLUTIONS.length; i++) {
          if(this.cameraHeight >= Constants.RESOLUTIONS[i].width) {
              tmpCameraRealSize = Constants.RESOLUTIONS[i]
          }
      }

      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          navigator.mediaDevices.getUserMedia({ video: {width: tmpCameraRealSize.width, height: tmpCameraRealSize.height} }).then(stream => {
              let {width, height} = stream.getTracks()[0].getSettings();
              console.log("Camera width: " + width + " height: " + height) 
              this.cameraWidth = height
              this.cameraHeight = width
              this.navbarHeight = window.innerHeight * 0.08;
              this.fontSize = this.navbarHeight * 0.07;
              this.descHeight = window.innerHeight * 0.43
              this.lastPhotoHeight = this.cameraHeight / 4
              this.video.nativeElement.srcObject = stream;
              this.cdRef.detectChanges()
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
    this.appService.computeFrame(this.canvas1, this.video, this.canvas2,this.recentData, this.cameraWidth, this.cameraHeight, this)
}

public capture() {
    this.appService.capture(this.showResults, this.canvas1, this.maxPhotos, this.captures, this.video, this)
}

uploadFile(files) {
    this.appService.uploadFile(files, this.canvas1, this)
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

