declare class Router{
    new ( ):Router;
    new ( options?:any ):Router;
    on( event:string , callback:any );
    get( event:string , callback:any );
    get( callback:any );
    post( event:string , callback:any );
    post( callback:any );
    configure( config:any );
    init();
}