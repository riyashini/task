import { Component, OnInit } from '@angular/core';
import { interval, Subject, PartialObserver, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css']
})
export class TimerComponent implements OnInit {  
  private progressNum = 0;
  progress!: string;
  isRunning = true;
  isComplete = false;
  timer$!: Observable<number>;
  timerObserver!: PartialObserver<number>;
  stopClick$ = new Subject();
  pauseClick$ = new Subject();
  private getProgress() {
    this.progress = `${this.progressNum}%`;
  }

  ngOnInit() {
    this.getProgress();

    this.timer$ = interval(1000)
      .pipe(
        takeUntil(this.pauseClick$),
        takeUntil(this.stopClick$)
      );

    this.timerObserver = {
      next: (_: number) => {
        if (this.progressNum < 100) {
          this.progressNum += 25;
          this.getProgress();
        } else {
          this.stopClick$.next();
          this.isRunning = false;
          this.isComplete = true;
        }
      }
    };

    this.timer$.subscribe(this.timerObserver);
  }

  pauseClick() {
    this.pauseClick$.next();
    this.isRunning = false;
  }

  restartClick() {
    this.isRunning = true;
    if (this.isComplete) {
      this.isComplete = false;
      this.progressNum = 0;
      this.getProgress();
    }

    this.timer$.subscribe(this.timerObserver);
  }

  stopClick() {
    this.progressNum = 0;
    this.getProgress();
    this.stopClick$.next();
    this.isRunning = false;
  }

}
