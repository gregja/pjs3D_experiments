class Sphere {
  constructor(r, step, engine) {
    this.r = r;
    this.step = step;
    this.coords = [];
    this.eng = engine; // pjs or p5
  }

  calculus() {
    for( let i = 0; i < 180; i+=this.step ) {
      let sini = this.eng.sin( this.eng.radians( i ));
      let cosi = this.eng.cos( this.eng.radians( i ));
      let cosip = this.eng.cos( this.eng.radians( i + this.step ));
      let sinip = this.eng.sin( this.eng.radians( i + this.step ));

      for( let j = 0; j <= 360; j+=this.step ) {
        let sinj = this.eng.sin( this.eng.radians( j ));
        let cosj = this.eng.cos( this.eng.radians( j ));

        let normal1 = {x: cosj * sini, y: -cosi, z: sinj * sini};
        let vertex1 = {x: this.r * cosj * sini, y: this.r * -cosi, z: this.r * sinj * sini};

        let normal2 = {x: cosj * sinip, y: -cosip, z: sinj * sinip};
        let vertex2 = {x: this.r * cosj * sinip, y: this.r * -cosip, z: this.r * sinj * sinip};

        this.coords.push({normal1:normal1, vertex1:vertex1, normal2: normal2, vertex2: vertex2});
      }
    }
  }

  render() {
    for( let i = 0, imax = this.coords.length; i < imax; i += 1 ) {
      let item = this.coords[i];
      this.eng.normal( item.normal1.x, item.normal1.y, item.normal1.z);
      this.eng.vertex( item.vertex1.x, item.vertex1.y, item.vertex1.z);
      this.eng.normal( item.normal2.x, item.normal2.y, item.normal2.z);
      this.eng.vertex( item.vertex2.x, item.vertex2.y, item.vertex2.z);
    }
  }

}
