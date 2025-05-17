type Data = {
    data?   : object[] | object,
    url     : string,
    method? : 'GET' | 'POST' | 'PATCH' | 'DELETE',
};

export async function loadSpaceSafes<T>(
    { data, url, method = 'GET' }: Data,
): Promise<T | null> {
    try {
        const response = await fetch(
            url, {
                method,
                body    : data ? JSON.stringify(data) : undefined,
                headers : {
                    'Content-Type': 'application/json',
                },
            }
        );

        if ( !response.ok ) {
            return null;
        }

        const responseJson = await response.json();

        return responseJson as T;
    } catch ( err ) {
        return null;
    }
}
