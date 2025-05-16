import { writable } from 'svelte/store';

import type { Link } from '@/models/links/link.model';


const linksStore = writable<Link[]>([]);
const isLoadingLinksStore = writable<boolean>(false);
const errorLinksStore = writable<Error | null>(null);


function addLink(link: Link) {
    linksStore.update(items => ([
        ...items,
        link
    ]));
}

function setLinks(linksList: Link[]) {
    linksStore.set(linksList);
}

function updateLink(updatedLink: Link): void {
    linksStore.update(items => {
        const index = items.findIndex(link => link.id === updatedLink.id);
        
        if (index !== -1) {
            const updatedLinks = [...items];
            updatedLinks[index] = updatedLink;
            return updatedLinks;
        }
        
        return items;
    });
}

function deleteLink(id: string): void {
    linksStore.update(items => 
        items.filter(link => link.id !== id)
    );
}


function clearLinks(): void {
    linksStore.set([]);
}



function setIsLoadingLinksStore(isLoading: boolean): void {
    isLoadingLinksStore.set(isLoading);
}

function setErrorLinksStore(error: Error | null): void {
    errorLinksStore.set(error);
}

export {
    linksStore,
    isLoadingLinksStore,
    errorLinksStore,
    addLink,
    setLinks,
    updateLink,
    deleteLink,
    clearLinks,
    setIsLoadingLinksStore,
    setErrorLinksStore
};
