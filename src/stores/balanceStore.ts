import { writable } from 'svelte/store';

import type { Balance } from '@/models/balance/balance.mode';


const balanceStore = writable<Balance[]>([]);
const isLoadingBalanceStore = writable<boolean>(false);
const errorBalanceStore = writable<Error | null>(null);


function addBalance(balance: Balance) {
    balanceStore.update(items => ([
        ...items,
        balance
    ]));
}

function setBalances(balancesList: Balance[]) {
    balanceStore.set(balancesList);
}

function updateBalance(updatedBalance: Balance): void {
    balanceStore.update(items => {
        const index = items.findIndex(balance => balance.id === updatedBalance.id);
        
        if (index !== -1) {
            const updatedBalances = [...items];
            updatedBalances[index] = updatedBalance;
            return updatedBalances;
        }
        
        return items;
    });
}

function deleteBalance(id: string): void {
    balanceStore.update(items => 
        items.filter(balance => balance.id !== id)
    );
}


function clearBalances(): void {
    balanceStore.set([]);
}



function setIsLoadingBalanceStore(isLoading: boolean): void {
    isLoadingBalanceStore.set(isLoading);
}

function setErrorBalanceStore(error: Error | null): void {
    errorBalanceStore.set(error);
}

export {
    balanceStore,
    isLoadingBalanceStore,
    errorBalanceStore,
    addBalance,
    setBalances,
    updateBalance,
    deleteBalance,
    clearBalances,
    setIsLoadingBalanceStore,
    setErrorBalanceStore
};