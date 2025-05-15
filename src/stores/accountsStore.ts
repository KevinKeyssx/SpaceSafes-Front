import { writable } from 'svelte/store';

import type { Account } from '@/models/account/account.model';


const accounts = writable<Account[]>([]);
const isLoadingAccounts = writable<boolean>(false);
const errorAccounts = writable<Error | null>(null);


function addAccount(account: Account) {
    accounts.update(items => ([
        ...items,
        account
    ]));
}

function setAccounts(accountsList: Account[]) {
    accounts.set(accountsList);
}

function updateAccount(updatedAccount: Account): void {
    accounts.update(items => {
        const index = items.findIndex(account => account.id === updatedAccount.id);
        
        if (index !== -1) {
            const updatedAccounts = [...items];
            updatedAccounts[index] = updatedAccount;
            return updatedAccounts;
        }
        
        return items;
    });
}

function deleteAccount(id: string): void {
    accounts.update(items => 
        items.filter(account => account.id !== id)
    );
}


function clearAccounts(): void {
    accounts.set([]);
}



function setIsLoadingAccounts(isLoading: boolean): void {
    isLoadingAccounts.set(isLoading);
}

function setErrorAccounts(error: Error | null): void {
    errorAccounts.set(error);
}

export {
    accounts,
    isLoadingAccounts,
    errorAccounts,
    addAccount,
    setAccounts,
    updateAccount,
    deleteAccount,
    clearAccounts,
    setIsLoadingAccounts,
    setErrorAccounts
};
