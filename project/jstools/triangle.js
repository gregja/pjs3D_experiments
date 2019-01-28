class Triangle {
  //    constructor( PVector a, PVector b, PVector c, PVector n ) {
  constructor( a, b, c, n ) {
    this.a = a;
    this.b = b;
    this.c = c;
    this.n = n;
  }
}


class TriangleSoup {

    constructor() {
        this.triangles = new ArrayList();
        this.scale = 1;
    }

    setScale( scale ) {
        this.scale = scale;
    }

    // add( PVector a, PVector b, PVector c, PVector n ) {
    add( a, b, c, n ) {
        this.triangles.add( new Triangle( a, b, c, n ));
    }

    save( filename ) {

            let header = new byte[80];
            let count = new byte[4];
            let tri = new byte[50];

        //    let out = new FileOutputStream( filename );
            let buffer = ByteBuffer.allocate( 80 );
            buffer.order( ByteOrder.LITTLE_ENDIAN );

            Arrays.fill(header,0, 80, (byte)0);
        //    out.write( header, 0, 80 );
            buffer.putInt( triangles.size());
            buffer.rewind();
            buffer.get( count, 0, 4 );
        //    out.write( count, 0, 4 );


            for( let i=0, imax=triangles.size(); i < imax; i++) {
                buffer.rewind();
                buffer.putFloat( this.triangles.get(i).n.x * this.scale);
                buffer.putFloat( this.triangles.get(i).n.z * this.scale);
                buffer.putFloat( this.triangles.get(i).n.y * this.scale);

                buffer.putFloat( this.triangles.get(i).a.x * this.scale);
                buffer.putFloat( this.triangles.get(i).a.z * this.scale);
                buffer.putFloat( this.triangles.get(i).a.y * this.scale);

                buffer.putFloat( this.triangles.get(i).b.x * this.scale);
                buffer.putFloat( this.triangles.get(i).b.z * this.scale);
                buffer.putFloat( this.triangles.get(i).b.y * this.scale);

                buffer.putFloat( this.triangles.get(i).c.x * this.scale);
                buffer.putFloat( this.triangles.get(i).c.z * this.scale);
                buffer.putFloat( this.triangles.get(i).c.y * this.scale);

                buffer.putShort( (short)0 );
                buffer.rewind();
                buffer.get( tri, 0, 50 );
            //    out.write( tri, 0, 50 );
            }

        //    out.flush();
        //    out.close();


  }
}
