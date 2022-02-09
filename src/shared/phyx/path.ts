//syntax: service//nested1//nested2//nested3

export default abstract class path {
    static pathToInstance(path: string) {
        let split = path.split('//');
        
        let currentInstance: Instance = game;
        for (const [i, v] of pairs(split)) {
            let c = currentInstance.FindFirstChild(v);
            if (c) {
                currentInstance = c;
            }
            else {
                throw `path does not exist, ${v} is not a valid member of ${currentInstance.GetFullName()}`;
            }
        }
        if (currentInstance === game) throw `[game] is not allowed as a sufficient path`
        return currentInstance;
    }
}