import YAML from 'yaml';
import {readFileSync, existsSync} from 'fs';
import {IDefConfig} from '@/utils/def.config';

const loadConfig = (path: string): IDefConfig =>
{
    if (!existsSync(path))
    {
        throw new Error(`${path} not found`);
    }

    const fileContent = readFileSync(path, 'utf8');
    return YAML.parse(fileContent);
};

export default loadConfig;