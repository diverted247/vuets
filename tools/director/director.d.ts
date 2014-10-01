declare class Router{
    constructor ( );
    constructor ( options?:any );
    on( event:string , callback:any );
    get( event:string , callback:any );
    get( callback:any );
    post( event:string , callback:any );
    post( callback:any );
    configure( config:any );
    init();
}
