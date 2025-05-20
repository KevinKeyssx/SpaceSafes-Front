import { compressToUTF16, decompressFromUTF16 } from "lz-string";


export function getLocalStorageData<T>( name: string ): T {
    if ( typeof window === 'undefined' ) return [];

    const data = localStorage.getItem( name )!;

    return data ? JSON.parse(decompressFromUTF16( data )) : [];
}


export function saveLocalStorageData<T>( name: string, data: T ): void {
    if ( typeof window !== 'undefined' ) {
        localStorage.setItem(
            name,
            compressToUTF16( JSON.stringify( data ))
        );
    }
};
