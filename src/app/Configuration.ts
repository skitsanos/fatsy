import ApplicationConfiguration from '@skitsanos/app-config';

class Configuration
{
    private static instance: ApplicationConfiguration;

    static getInstance(): ApplicationConfiguration
    {
        if (!this.instance)
        {
            this.instance = new ApplicationConfiguration();
            this.instance.load('config');
        }

        return this.instance;
    }
}

export default Configuration;