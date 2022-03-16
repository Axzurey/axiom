import { finisherParams } from "shared/content/finishers/finisherInfo";
import { finishers } from "shared/content/mapping/finishers";
import phyxRemoteProtocol from "shared/phyx/phyxRemoteProtocol";

const finisher_receive_protocol = new phyxRemoteProtocol<
    () => void, (finisher: keyof typeof finishers, params: finisherParams) => void>('finisher_receive_protocol', 'Event');

export = finisher_receive_protocol;