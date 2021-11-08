namespace missions {
    const missions = [
        {
            'name': 'Sharp Shooter',
            'goal': 'get 10 headshot kills',
            'startValue': 0,
            'goalValue': 10,
            'rewardAmount': 1000,
            'rewardType': missionRewards.experience,
            'actionType': missionAction.hit,
            'actionFunction': (hit: BasePart) => {
                if (hit.Name === 'Head') {
                    return true;
                }
                return false;
            },
        }
    ];
}

export = missions;