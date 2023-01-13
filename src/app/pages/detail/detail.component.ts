import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Olympic } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit {
  public olympics$: Observable<Olympic[]> = of([]);

  countryId!: number;
  country!: Olympic | undefined;

  basicData: any;

  constructor(
    private route: ActivatedRoute,
    private olympicServe: OlympicService
  ) {}

  ngOnInit() {
    this.countryId = +this.route.snapshot.params['id'];
    this.olympics$ = this.olympicServe.getOlympics();

    this.olympics$.subscribe({
      next: (object: Olympic[]) => {
        this.country = object.find((country) => country.id === this.countryId);
        console.log(this.country);
        if (this.country) this.initChart(this.country);
      },
      error: (msg) => {
        console.log(msg);
      },
      complete: () => {
        console.log('Observer got a complete notification');
      },
    });
  }

  initChart(country: Olympic) {
    this.basicData = {
      labels: country?.participations.map((value) => value.year),
      datasets: [
        {
          backgroundColor: '#42A5F5',
          label: country?.country,
          data: country?.participations.map((value) => value.medalsCount),
          fill: false,
          borderColor: '#42A5F5',
          tension: 0.4,
        },
      ],
    };
  }

  nbOfEntries() {
    return this.country?.participations.length;
  }

  nbOfMedals() {
    return this.country?.participations.reduce(
      (prev, current) => current.medalsCount + prev,
      0
    );
  }

  nbOfAthletes() {
    return this.country?.participations.reduce(
      (prev, current) => current.athleteCount + prev,
      0
    );
  }
}
