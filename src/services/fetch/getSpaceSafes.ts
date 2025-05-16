export async function loadSpaceSafes<T>( data: any[], url: string ): Promise<T | null> {
    if ( data.length > 0 ) return;

    try {
        const response = await fetch( url );

        if ( !response.ok ) {
            return null;
        }

        const data = await response.json();

        console.log(`Cargados ${data.length} enlaces con éxito`);

        return data as T;
    } catch ( err ) {
        return null;
    }
}
