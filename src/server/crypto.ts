namespace crypto {
    const chars = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 
        'v', 'w', 'x', 'y', 'z'
    ];
    const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    const special = ['!', '@', '#', '$', '%', '^', '&', '*'];
    const utility = ['(', ')', '{', '}', '[', ']', '<', '>', '\\', '/', '|'];
    const punctuation = ['!', ';', ',', '/', '\\', '?', '.', '"', "\'", ''];

    const tokenCharacters = [...chars, ...numbers, ...special];

    export function token(tokenLength: number): string {
        let str = '';
        for (let i = 0; i < tokenLength / 2; i++) {
            let dice = math.random(0, tokenCharacters.size());
            let index = tokenCharacters[dice];
            str = `${str}${index}`;
        }
        for (let i = 0; i < tokenLength / 2; i++) {
            let t = math.abs((math.sin(tick() * os.clock()) * tokenCharacters.size())) - 1;
            let index = tokenCharacters[t];
            str = `${str}${index}`;
        }
        return str;
    }
}

export = crypto;