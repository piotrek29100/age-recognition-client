import { Component, OnInit, AfterViewInit } from '@angular/core';
import {LandscapeViewComponent} from './landscape-view/landscape-view.component'

@Component({
    providers:[LandscapeViewComponent],
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
    public ngOnInit() { 
    }

    public ngAfterViewInit() {
    }
}
