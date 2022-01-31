import worldData from 'shared/worlddata'
export default function check(check: keyof typeof worldData, instance: Instance) {
    let vs = worldData[check];
    for (const [i, v] of pairs(vs)) {
        if (instance.Name.find(i)[0]) {
            return true;
        }
    }
    return false;
}