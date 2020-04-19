import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-dashboard-page',
    templateUrl: './dashboard-page.component.html',
    styleUrls: ['./dashboard-page.component.scss']
})

export class DashboardPageComponent implements OnInit {
    public dashCard = [
        { colorDark: '#5C6BC0', colorLight: '#7986CB', number: 1221, title: 'PENDING', icon: 'assignments' },
        { colorDark: '#42A5F5', colorLight: '#64B5F6', number: 1221, title: 'IN PROGRESS', icon: 'assignments' },
        { colorDark: '#26A69A', colorLight: '#4DB6AC', number: 1221, title: 'FINISHED', icon: 'assignments' },
        { colorDark: '#66BB6A', colorLight: '#81C784', number: 1221, title: 'CLOSED', icon: 'assignments' }
    ];

    constructor() { }

    ngOnInit() {
    }

}
