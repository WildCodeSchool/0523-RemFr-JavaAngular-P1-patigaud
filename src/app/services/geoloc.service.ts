import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiGardenService } from 'src/app/services/api-gardens.service';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export class Pois {
  public poiname: any;
  public dist: any;
  public distTwo: any;
  public shape: any;
  constructor(poiname: any, dist: any, distTwo: any, shape: any) {
    this.poiname = poiname
    this.dist =  dist
    this.distTwo = distTwo
    this.shape = shape
  }
}

// export class SpoofedCoordinates {
//   public latitude: number;
//   public longitude: number;
//   constructor(latitude: number, longitude: number) {
//     this.latitude = latitude;
//     this.longitude = longitude;
//   }
// }

@Injectable({
  providedIn: 'root'
})

export class GeolocService {

  locations: any
  private spooflat: number = 47.3806797848 ;
  private spooflng: number = 0.70160855649;
  private spoofcoords = ({lat: this.spooflat, lon: this.spooflng})
  //private unsubscribe$: Subject<void> = new Subject<void>();

  // private spoofcoords = (): Coordinates => ({
  //     latitude: this.spooflat,
  //     longitude: this.spooflng
  // })
  //private spoofcoords: any = new Object (latitude = this.spooflat, longitude: this.spooflng)

  constructor(private apiGardenService: ApiGardenService) { }


  // updateMyPosEvery5Sec() {
  //   interval(5000).pipe(
  //     takeUntil(this.unsubscribe$)
  //   ).subscribe(() => {
  //     console.log("service called: getCurrentPosition")
  //     this.getCurrentPosition()    
  //   });
  // }

  getLocations(mylat: any, mylong: any) {
    this.apiGardenService.getGardenList()
    .subscribe((response) => {
      this.locations = response
      this.checkMyLoc(response, mylat, mylong)
    })
  } 
  
  haversineLaw(lat1: any, lon1: any, lat2: any, lon2: any){  // generally used geo measurement function
    var R = 6378.137; // Radius of earth in KM
    var dLat = lat2 * Math.PI / 180 - lat1 * Math.PI / 180;
    var dLon = lon2 * Math.PI / 180 - lon1 * Math.PI / 180;
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c;
    return d * 1000; // meters
  } 
  
  distanceTwoDim(x: number,y: number,u: number,w: number) {
    let a = x - u
    let b = y - w
    return Math.sqrt(a*a + b*b)
  }
  
  dynamicSort(property: any) {
    var sortOrder = 1;
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a: any,b: any) {
        /* next line works with strings and numbers, 
         * and you may want to customize it to your needs
         */
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
  } 
  
  getIsPointInsidePolygon(point: number[], vertices: number[][]) {
    const x = point[0] //long, x, 0.7
    const y = point[1] //lat, y, 47
    //vertices [long,lat]
  
    
    let inside = false
    for (let i = 0, j = vertices.length - 1; i < vertices.length; j = i++) {
      const xi = vertices[i][0],
        yi = vertices[i][1]
      const xj = vertices[j][0],
        yj = vertices[j][1]
    
      const intersect = yi > y != yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi
      if (intersect) inside = !inside
    }
    
    return inside
  }  

  checkMyLoc(locationsArray: any, mylat: any, mylong: any) {
    for(let poi of locationsArray) {
      //console.log(poi.address)
      //let myPos = [mylong,mylat]
      let myPos = [mylat,mylong]
      // if (poi.shape) {
      //   console.log(poi.shape[0])
      // }  
      if (poi.shape && (this.getIsPointInsidePolygon(myPos, poi.shape[0]))) {
        console.log(`is currently inside ${poi.address}`)
      }
    }
  }


  getCurrentPosition(): Observable<Coordinates> {
    // return new Observable<Coordinates> (
    //   (observer) => {
    //     if (navigator.geolocation) {
    //       const options = {
    //         enableHighAccuracy: true,
    //         timeout: 5000,
    //         maximumAge: 0
    //       };

    //       const watchId = navigator.geolocation.watchPosition(
    //         (position) => observer.next(position.coords),
    //         (error) => observer.error(error),
    //         options
    //       );
    //       return () => {
    //         navigator.geolocation.clearWatch(watchId);
    //       };
    //     } else {
    //       observer.error('we had an issue with geolocation');
    //       return
    //     }
    //   }  
    // )

    return new Observable<any> (
      (observer) => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            //(position) => observer.next(this.coords),
            (position) => observer.next(this.spoofcoords),
            (error) => observer.error(error)
          );
        } else {
          observer.error('Geolocation is not supported by this browser.');
        }
      }  
    )    
  }


  // ngOnInit() {
  //   this.updateMyPosEvery5Sec()
  // }

  // ngOnDestroy() {
  //   this.unsubscribe$.next();
  //   this.unsubscribe$.complete();
  //   console.log("geoloc observable destroyed")
  // }

}