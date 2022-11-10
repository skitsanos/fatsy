export interface IConfApp
{
    title: string;
}

export interface IConfAuth
{
    secret: string;
}

export interface IConfServer
{
    host: string;
    port: number;
    logger?: boolean | object;
    auth: IConfAuth;
}

export interface IDefConfig
{
    app?: IConfApp;
    server: IConfServer;
}