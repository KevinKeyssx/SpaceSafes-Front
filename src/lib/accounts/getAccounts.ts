import { get } from 'svelte/store';

import {
    accounts,
    setAccounts,
    clearAccounts,
    setIsLoadingAccounts,
    setErrorAccounts
} from '@/stores/accountsStore';


export async function loadAccountsStore() {
    const currentAccounts = get( accounts );

    if ( currentAccounts.length > 0 ) return;

    setIsLoadingAccounts( true );
    setErrorAccounts( null );

    try {
        const response = await fetch( '/api/accounts/getAccounts' );

        if ( !response.ok ) {
            throw new Error( 'Network response was not ok' );
        }

        const data = await response.json();

        console.log(`Cargadas ${data.length} cuentas con éxito`);

        setAccounts(data);
    } catch (err) {
        console.error('Error al cargar cuentas:', err);
        const error = err instanceof Error ? err : new Error('Error desconocido');
        setErrorAccounts( error );
    } finally {
        setIsLoadingAccounts( false );
    }
}
