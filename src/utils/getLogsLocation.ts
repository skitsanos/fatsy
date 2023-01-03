import {dirname} from 'path';
import Configuration from '@/app/Configuration';

const getLogsLocation = (): string | null =>
{
    const {transport} = Configuration.getInstance().config['server'].logger;

    if (transport && transport.targets)
    {
        //
        // Ensure the existence of the logs folder
        //
        const fileTarget = transport.targets.find((el: Record<string, any>) => el['target'] === 'pino/file');

        if (fileTarget)
        {
            const {options} = fileTarget || {destination: 'logs/server.log'};
            return dirname(options.destination);
        }
    }

    return null;
};

export default getLogsLocation;