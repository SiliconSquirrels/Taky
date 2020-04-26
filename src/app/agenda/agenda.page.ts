// https://devdactic.com/ionic-4-calendar-app/
import { CalendarComponent } from 'ionic2-calendar/calendar';
import { Component, ViewChild, OnInit, Inject, LOCALE_ID } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { formatDate } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.page.html',
  styleUrls: ['./agenda.page.scss'],
})
export class AgendaPage implements OnInit {

  event = {
    title: '',
    desc: '',
    startTime: '',
    endTime: '',
    allDay: false
  };

  minDate = new Date().toISOString();

  eventSource = [];
  viewTitle;

  calendar = {
    mode: 'month',
    currentDate: new Date(),
  };

  // @ViewChild(CalendarComponent) myCal: CalendarComponent;
  @ViewChild('cal', { static: false, read: CalendarComponent }) myCal: CalendarComponent;

  constructor(private alertCtrl: AlertController,
    private translate: TranslateService,
    private router: Router,
    @Inject(LOCALE_ID) private locale: string) { }

  ngOnInit() {
    this.resetEvent();
  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter AgendaPage');
    this.loadFakeEvents();
  }

  resetEvent() {
    this.event = {
      title: '',
      desc: '',
      startTime: new Date().toISOString(),
      endTime: new Date().toISOString(),
      allDay: false
    };
  }

  // Create the right event format and reload source
  addEvent() {
    console.log("event", this.event);
    console.log("startTime", this.event.startTime);
    console.log("endTime", this.event.startTime);

    let eventCopy = {
      title: this.event.title,
      startTime: new Date(this.event.startTime),
      endTime: new Date(this.event.endTime),
      allDay: this.event.allDay,
      desc: this.event.desc
    }

    if (eventCopy.allDay) {
      let start = eventCopy.startTime;
      let end = eventCopy.endTime;

      eventCopy.startTime = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate()));
      eventCopy.endTime = new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), end.getUTCDate() + 1));
    }

    console.log(eventCopy);
    this.eventSource.push(eventCopy);
    this.myCal.loadEvents();
    this.resetEvent();
  }

  // Change current month/week/day
  next() {
    var swiper = document.querySelector('.swiper-container')['swiper'];
    swiper.slideNext();
  }

  back() {
    var swiper = document.querySelector('.swiper-container')['swiper'];
    swiper.slidePrev();
  }

  // Change between month/week/day
  changeMode(mode) {
    this.calendar.mode = mode;
  }

  // Focus today
  today() {
    this.calendar.currentDate = new Date();
  }

  // Selected date reange and hence title changed
  onViewTitleChanged(title) {
    this.viewTitle = title;
  }

  // Calendar event was clicked
  async onEventSelected(event) {

    // Use Angular date pipe for conversion
    let start = formatDate(event.startTime, 'medium', this.locale);
    let end = formatDate(event.endTime, 'medium', this.locale);

    const alert = await this.alertCtrl.create({
      header: 'Confirm slot',
      subHeader: event.title,
      // subHeader: event.desc,
      message: 'From: ' + start + '<br><br>To: ' + end,
      buttons: [
        {
          text: this.translate.instant('ok'),
          role: 'ok',
          handler: async () => {
            await this.presentOkAlert();
          }
        },
        {
          text: this.translate.instant('cancel'),
          role: 'cancel',
        }],
      backdropDismiss: false
    });
    alert.present();
  }

  // Time slot was clicked
  onTimeSelected(ev) {
    let selected = new Date(ev.selectedTime);
    this.event.startTime = selected.toISOString();
    selected.setHours(selected.getHours() + 1);
    this.event.endTime = (selected.toISOString());
  }

  async presentOkAlert() {
    const alert = await this.alertCtrl.create({
      header: this.translate.instant('operationComplete'),
      // subHeader: this.translate.instant(''),
      buttons: [
        {
          text: this.translate.instant('ok'),
          role: 'ok',
          handler: () => {
            this.router.navigate(['/home'], { replaceUrl: true });
          }
        }],
      backdropDismiss: false
    });
    await alert.present();
  }

  loadFakeEvents() {
    let start = new Date();
    start.setTime(start.getTime() + (2 * 60 * 60 * 1000)); // +2h
    start.setMinutes(0);
    start.setSeconds(0);

    let end = new Date(start);
    end.setTime(end.getTime() + (30 * 60 * 1000)); // +30m


    for (let i = 1; i <= 5; ++i) {
      this.event.title = 'Slot ' + i;
      this.event.startTime = start.toISOString();
      this.event.endTime = end.toISOString();
      this.addEvent();

      start.setTime(start.getTime() + (30 * 60 * 1000)); // +30m
      end.setTime(end.getTime() + (30 * 60 * 1000)); // +30m
    }

  }
}
