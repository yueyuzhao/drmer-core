import { parseJson } from './utils';

class JsRequest
{
    public readonly id: string | undefined;
    public readonly clsName: any;
    public readonly clsMethod: any;
    public readonly params: any;

    constructor(body: string)
    {
        const json = parseJson(body);

        if (!json)
        {
            return;
        }
        this.id = json.id;
        const method = json.method.split('@');

        this.clsName = method[0];
        this.clsMethod = method[1];
        this.params = json.params;
    }

    public strParam(key: string): string
    {
        return this.params[key];
    }

    public numParam(key: string): number
    {
        return this.params[key];
    }

    public intParam(key: string): number
    {
        return this.numParam(key);
    }

    public jsonParam(key: string): object
    {
        if (typeof this.params[key] === 'string')
        {
            return parseJson(this.params[key]);
        }

        return this.params[key];
    }
}

export { JsRequest };
