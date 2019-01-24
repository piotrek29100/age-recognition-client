import { Injectable } from '@angular/core'; 
import {Constants, FaceInfoList} from './constants'
import {HttpClient, HttpResponse, HttpHeaders} from '@angular/common/http' 
import { viewAttached } from '@angular/core/src/render3/instructions';
 
 @Injectable()
 export class AppService {  

    public constructor(private http : HttpClient) {
    }

    uploadFile(files,canvas1, view) {
        const formData: FormData = new FormData();
        var position = files.length - 1;
        formData.append('file',files[position]);
        const url = Constants.API_ENDPOINT;
        console.log("Capture done" + new Date());

        this.http.post<FaceInfoList>(url, formData).subscribe((data: any) => {

            var img = new Image()
            img.src = files[position]
            let canvas = canvas1.nativeElement;
            let context = canvas.getContext('2d');
            view.rotate()
            context.drawImage(img,0,0)
            context.font = "20px Calibri";
            console.log(data + "date" + new Date());
            view.setRecentData(data)

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

    computeFrame(canvas1, video, canvas2, recentData, cameraWidth, cameraHeight,view) {
        view.rotate()
        canvas1.nativeElement.getContext('2d').drawImage(video.nativeElement, 0, 0/*, this.cameraWidth, this.cameraHeight*/);
        let frame = canvas1.nativeElement.getContext('2d').getImageData(0, 0, cameraWidth, cameraHeight);
        let context = canvas1.nativeElement.getContext('2d');
                context.font = "20px Calibri";
          if (recentData !== undefined) {
                for(var i = 0; i < recentData.length; i++) {
                    var face = recentData[i];
                    context.beginPath();
                    context.lineWidth = "4";
                    context.strokeStyle = "red";
                    context.fillStyle = "red";
                    context.rect(face.left, face.top, face.right - face.left, face.bottom - face.top);
                    context.stroke();
    
                    context.fillText(face.age, face.left + 3, face.top + 15);
                }
            }
        canvas2.nativeElement.getContext('2d').putImageData(frame, 0, 0);
    }
    public capture(showResults, canvas1, maxPhotos, captures, video, view) {
        if (showResults === true) {
            return;
        }
        view.rotate()
        const context = canvas1.nativeElement.getContext('2d').drawImage(video.nativeElement, 0, 0, /*this.cameraWidth, this.cameraHeight*/);
        captures.push(canvas1.nativeElement.toDataURL('image/png'));
        if(captures.length > maxPhotos) {
            captures.shift()
        }
        
        this.uploadFile(captures, canvas1, view) ///Odkomentować
    }
 } 