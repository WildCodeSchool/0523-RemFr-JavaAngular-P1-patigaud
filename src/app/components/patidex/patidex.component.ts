import { Component, OnInit } from '@angular/core';
import { ApiGardenService } from 'src/app/services/api-garden/api-gardens.service';
import { Garden } from 'src/app/models/garden';
import { GardenService } from "src/app/services/garden/garden.service";
import { map } from 'rxjs';

@Component({
  selector: 'app-patidex',
  templateUrl: './patidex.component.html',
  styleUrls: ['./patidex.component.scss']
})
export class PatidexComponent implements OnInit {
  openedIndex = -1;
  constructor(private apiGardenService: ApiGardenService, private GardenService: GardenService,) { }

  locations: any
  status = "ready"
  public myGardenIds: any = [];
  private gardens: Garden[] = []; 

  getLocations() {
    this.apiGardenService.getGardenList()
    .subscribe((response) => this.locations = response)
  }

  openDetails(index: number) {
    this.openedIndex = index === this.openedIndex ? -1 : index;
  }

  close(index: number) {
    this.openedIndex = -1;
  }

  ngOnInit(): void {
    this.getLocations();
    this.getAllGardens();
  }

  isInsideMyGardenIds(id: any): boolean {
    if(this.myGardenIds.includes(id)) {
      return true
    }
    return false
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
        const currentUser = localStorage.getItem('pseudo')
        for (let i = 0; i < this.gardens.length; i++) {
          if (this.gardens[i].userKey == currentUser) {
            this.myGardenIds.push(this.gardens[i].gardenId)
          }
        }
        console.log(this.myGardenIds)
      })    
  }  
}
