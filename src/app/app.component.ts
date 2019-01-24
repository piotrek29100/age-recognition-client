import { Component, OnInit, AfterViewInit, HostListener} from '@angular/core';
import {LandscapeViewComponent} from './landscape-view/landscape-view.component'
import {PortraitViewComponent} from './portrait-view/portrait-view.component'

@Component({
    providers:[LandscapeViewComponent, PortraitViewComponent],
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

    @HostListener('window:resize', ['$event'])
    onResize(event) {
        this.ngOnInit()
    }
    orientation = "landscape"

    public ngOnInit() { 
        if(window.innerHeight < window.innerWidth) {
            this.orientation = "landscape"   
        } else {
            this.orientation = "portrait"
        }
        console.log(this.orientation)
    }
}
