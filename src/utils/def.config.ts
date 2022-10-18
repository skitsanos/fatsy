export interface IConfServer
{
    host: string;
    port: number;
    logger?: boolean | object;
}

export interface IConfApp
{
    title: string;
}

export interface IDefConfig
{
    app?: IConfApp;
    server: IConfServer;
}