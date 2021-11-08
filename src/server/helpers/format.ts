namespace format {
    export function level_and_rank_and_username(username: string, level: number, rank: string) {
        return `${username}<${level} : ${rank}>`;
    }
    
}

export = format;