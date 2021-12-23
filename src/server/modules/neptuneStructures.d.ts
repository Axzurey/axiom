export interface neptuneInventoryStructure {
    content: neptuneInventoryItemStructure[],
}

export interface neptuneInventoryItemStructure {
    name: string,
    unixAcquired: number,
    amount: number,
    id: string,
}

export interface neptunePurchaseHistoryStructure {
    purchases: neptunePurchaseStructure[],
}

export interface neptunePurchaseStructure {
    unixPurchased: number,
    purchaseId: string,
}

export interface neptuneMailStructure {
    deletesOn: number,
    deletesAutomatically: boolean,
    pendingDeletion: boolean, //this is for when the mail is deleted while the user is offline. It will be deleted when they log in
}

export interface neptuneMailboxStructure {
    mail: neptuneMailStructure[],
    maxSize?: number
}