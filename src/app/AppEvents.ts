import EventEmitter from 'events';

export enum EventTypes
{
    DEBUG,
    INFO,
    ERROR,
    DATA
}

export const ApplicationEvent = {
    LOG: 'app.log',
    OPENAI_CHAT: 'openai.chat'
};

class AppEvents extends EventEmitter
{
    private static instance: EventEmitter;

    static getInstance(): EventEmitter
    {
        if (!this.instance)
        {
            this.instance = new EventEmitter();
        }
        return this.instance;
    }
}

export default AppEvents;