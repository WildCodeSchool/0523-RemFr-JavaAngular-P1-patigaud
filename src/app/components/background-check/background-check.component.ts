import { Component, OnInit, OnDestroy } from "@angular/core";
import { ApiGardenService } from "src/app/services/api-garden/api-gardens.service";
import { GeolocService } from "src/app/services/geoloc.service";
import { Location } from "../../location";
import { interval, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { map } from 'rxjs';
import { Garden } from 'src/app/models/garden';
import { GardenService } from "src/app/services/garden/garden.service";

@Component({
  selector: 'app-background-check',
  templateUrl: './background-check.component.html',
  styleUrls: ['./background-check.component.scss']
})


export class BackgroundCheckComponent implements OnInit, OnDestroy {
  locations!: Location[];
  status = "loading";
  private unsubscribe$: Subject<void> = new Subject<void>();
  private myLong = 0;
  private myLat = 0;
  private gardens: Garden[] = [];


  constructor(
    private apiGardenService: ApiGardenService, 
    private GeolocService: GeolocService, 
    private GardenService: GardenService
    ) {}

  ngOnInit() {
    this.getLocations(); //API
    this.updateMyPosEvery5Sec(); //Geoloc
    this.getAllGardens();  //Firebase Garden
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  getAllGardens() {
    this.GardenService.getAll().snapshotChanges()
      .pipe(
        map(changes =>
          changes.map(c =>
            ({ key: c.payload.key, ...c.payload.val() })
          )
        )
      ).subscribe((data: any) => {
        this.gardens = data;
      })    
  }

  updateMyPosEvery5Sec() {
    interval(3000)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.UpdateMyPos();
        if (this.locations && this.myLong && this.myLat) {
          const polyid = this.GeolocService.checkMyLoc(
            this.locations,
            this.myLat,
            this.myLong
          );
          if (polyid) {
            if (this.gardens.length > 0) {
              const currentUser = localStorage.getItem('pseudo')
              let found = false                
              for(let i = 0; i < this.gardens.length; i++) {
                if ((this.gardens[i].userKey === currentUser) && (this.gardens[i].gardenId === polyid) ) {
                  found = true 
                }
              }
              if (!found) {
                const today = new Date()
                const newgarden = new Garden();
                newgarden.gardenId = polyid
                newgarden.obtention_date = today
                newgarden.userKey = currentUser                  
                this.GardenService.create(newgarden)
              }
            }
          }
        }
      });
  }

  /*
  UpdateMyPos() {
    this.GeolocService.getCurrentPosition().subscribe({
      next: (coords: any) => {
          this.myLong = coords.lon;
          this.myLat = coords.lat;
      },
      error: (error: string) => {
        console.error(error);
      },
    });
  }
  */
 
  UpdateMyPos() {
    this.GeolocService.getCurrentPosition().subscribe({
      next: (coords: any) => {
        if ((this.myLong == 0) && (this.myLat ==0)) {
          this.myLong = coords.lon;
          this.myLat = coords.lat;          
        } else {
          this.myLong = this.myLong - 4 / 10000; // testing purposes (increment longitude every few seconds)
        }
      },
      error: (error: string) => {
        console.error(error);
      },
    });
  }  
  

  getLocations() {
    this.apiGardenService.getGardenList().subscribe((response) => {
      this.locations = response;
      this.status = "ready";
    });
  }

}
