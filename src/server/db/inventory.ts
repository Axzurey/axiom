namespace inventory {
    export interface weapon {
        name: string,
        skin: string,
        sight: string,
        barrel: string,
        grip: string,
        laser: string,
        laserAllowed: boolean,
        sightAllowed: boolean,
        barrelAllowed: boolean,
        gripAllowed: boolean,
        selected: boolean,
    }
    export interface crate {
        name: string,
        guaranteed: string,
    }
    export interface operator {
        primaries: weapon[],
        secondaries: weapon[],
        crates: [],
    }
    export interface clientdata {
        credits: number,
        lastLogin: number,
    }
    export interface purchase {
        purchaseDate: number,
        purchaseDetails: string,
        purchaseCost: number,
        purchaseType: 'robux' | 'item',
    }
}

export = inventory;