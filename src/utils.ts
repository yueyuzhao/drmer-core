export const parseJson = (json: string | object): any =>
{
    if (typeof json === 'object')
    {
        return json;
    }
    try
    {
        return JSON.parse(json);
    }
    catch (e)
    {
        console.error(e);

        return undefined;
    }
};
