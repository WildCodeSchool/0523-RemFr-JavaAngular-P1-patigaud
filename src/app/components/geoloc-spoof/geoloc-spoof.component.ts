import { Component, OnInit } from '@angular/core';
import { ApiGardenService } from 'src/app/services/api-gardens.service';
import { Observable } from 'rxjs';

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

@Component({
  selector: 'app-geoloc-spoof',
  templateUrl: './geoloc-spoof.component.html',
  styleUrls: ['./geoloc-spoof.component.scss']
})

export class GeolocSpoofComponent implements OnInit {

  constructor(private apiGardenService: ApiGardenService) { }
  // mylat: any = 47.3898761399 // y
  // mylong: any = 0.734590886881 // x
  mylat: any = 47.3806797848 // y
  mylong: any = 0.70160855649 // x
  locations: any

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

  checkMyLoc(locationsArray: any) {
    let poiarray = []
    for(let poi of locationsArray) {
      //console.log(poi.shape[0])
      if ( (Math.abs(this.mylat - poi.geoPoint[1]) < 0.0001) && (Math.abs(this.mylong - poi.geoPoint[0]) < 0.0001) ) {
        console.log(`Yipee we are close to ${poi.address}`)
      }
      let dist = this.haversineLaw(this.mylat,this.mylong,poi.geoPoint[1],poi.geoPoint[0])  
      let distTwo = this.distanceTwoDim(this.mylat,this.mylong,poi.geoPoint[1],poi.geoPoint[0]) * 80000
      if (dist < 1000) {
        let currentPoi = new Pois(poi.address, Math.round(dist), distTwo, poi.shape )
        poiarray.push(currentPoi)
        //console.log(`${poi.address} est situé à ${dist} m`)
      }
    }
    poiarray.sort(this.dynamicSort("dist"))
    //console.log(poiarray)
    for(let poi of poiarray) {
      console.log(`${poi.poiname} est situé à haversinelaw: ${poi.dist} m / distance2d: ${poi.distTwo} `)  
      let newarray = [this.mylong,this.mylat]    
      if (poi.shape && (this.getIsPointInsidePolygon(newarray, poi.shape[0]))) {
        console.log(`we are inside ${poi.poiname}`) // ${poi.address}
      } 
      for(let i = 1;i < 50; i++) {
        //let modifier = (i*3) / 10000
        let modifier = i / 10000
        let newarrayPlusXOne = [this.mylong + modifier,this.mylat]
        let newarrayMinusXOne = [this.mylong - modifier,this.mylat]
        let newarrayPlusYOne = [this.mylong,this.mylat + modifier]
        let newarrayMinusYOne = [this.mylong,this.mylat - modifier]
        let newarrayMinusXMinusY = [this.mylong - modifier,this.mylat - modifier]
        let newarrayMinusXPlusY = [this.mylong - modifier,this.mylat + modifier]
        let newarrayPlusXMinusY = [this.mylong + modifier,this.mylat - modifier]
        let newarrayPlusXPlusY = [this.mylong + modifier,this.mylat + modifier]         
        if (poi.shape && (this.getIsPointInsidePolygon(newarrayPlusXOne, poi.shape[0]))) {
          console.log(`we are inside x+${+i} ${poi.poiname} with lat ${newarrayPlusXOne[0]} and long ${newarrayPlusXOne[1]}`) 
        }
        if (poi.shape && (this.getIsPointInsidePolygon(newarrayMinusXOne, poi.shape[0]))) {
          console.log(`we are inside x${-i} ${poi.poiname} with lat ${newarrayMinusXOne[0]} and long ${newarrayMinusXOne[1]}`) 
        }
        if (poi.shape && (this.getIsPointInsidePolygon(newarrayPlusYOne, poi.shape[0]))) {
          console.log(`we are inside y${+i} ${poi.poiname} with lat ${newarrayPlusYOne[0]} and long ${newarrayPlusYOne[1]}`) 
        }
        if (poi.shape && (this.getIsPointInsidePolygon(newarrayMinusYOne, poi.shape[0]))) {
          console.log(`we are inside y${-i} ${poi.poiname} with lat ${newarrayMinusYOne[0]} and long ${newarrayMinusYOne[1]}`) 
        }
        if (poi.shape && (this.getIsPointInsidePolygon(newarrayMinusXMinusY, poi.shape[0]))) {
          console.log(`we are inside x-${i} y-${i} ${poi.poiname} with lat ${newarrayMinusXMinusY[0]} and long ${newarrayMinusXMinusY[1]}`) 
        }
        if (poi.shape && (this.getIsPointInsidePolygon(newarrayMinusXPlusY, poi.shape[0]))) {
          console.log(`we are inside x-${i} y+${i} ${poi.poiname} with lat ${newarrayMinusXPlusY[0]} and long ${newarrayMinusXPlusY[1]}`) 
        }
        if (poi.shape && (this.getIsPointInsidePolygon(newarrayPlusXMinusY, poi.shape[0]))) {
          console.log(`we are inside x+${i} y-${i} ${poi.poiname} with lat ${newarrayPlusXMinusY[0]} and long ${newarrayPlusXMinusY[1]}`) 
        }
        if (poi.shape && (this.getIsPointInsidePolygon(newarrayPlusXPlusY, poi.shape[0]))) {
          console.log(`we are inside x+${i} y+${i} ${poi.poiname} with lat ${newarrayPlusXPlusY[0]} and long ${newarrayPlusXPlusY[1]}`) 
        }


      }
    }

  }

  getLocations() {
    this.apiGardenService.getGardenList()
    .subscribe((response) => {
      this.locations = response
      console.log(response)
      this.checkMyLoc(response)
    })
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

  ngOnInit(): void {
    this.getLocations();
  }
}