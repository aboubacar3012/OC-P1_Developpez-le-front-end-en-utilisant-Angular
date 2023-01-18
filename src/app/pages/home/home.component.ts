import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { Observable, of } from 'rxjs';
import { Olympic } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  olympics$: Observable<Olympic[]> = of([]);
  destroy$: Subject<boolean> = new Subject();

  data: any;
  labels!: string[];
  medalsCount!: number[];

  numberOfJOs!: number;
  numberOfCountries!: number;

  constructor(private olympicService: OlympicService, private router: Router) {}

  ngOnInit(): void {
    this.olympics$ = this.olympicService.getOlympics();

    this.olympics$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (object: Olympic[]) => {
        console.log(object);
        this.numberOfJOs = object[0]?.participations.length;
        this.numberOfCountries = object.length;

        this.labels = object.map((value) => value.country);
        this.medalsCount = object
          .map((value) => value.participations)
          .map((value, index) =>
            value.reduce((prev, current) => current.medalsCount + prev, 0)
          );

        this.data = {
          labels: this.labels,
          datasets: [
            {
              data: this.medalsCount,
              backgroundColor: [
                '#42A5F5',
                '#66BB6A',
                '#FFA726',
                '#26C6DA',
                '#7E57C2',
              ],
            },
          ],
        };
      },
      error: (error: Error) => console.error(error),
      complete: () => console.log('Observer got a complete notification'),
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }

  selectData(event: any) {
    this.router.navigateByUrl(`/${event.element.index + 1}`);
  }
}
