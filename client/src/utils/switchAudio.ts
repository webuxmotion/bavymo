import { useStreamsStore } from "../store/useStreamsStore";

export const switchAudio = () => {
    const { localStream, setLocalStream, setLocalAudioActive } =
        useStreamsStore.getState();

    const micEnabled = localStream?.getAudioTracks()[0].enabled;

    if (localStream?.getAudioTracks()[0]) {
        localStream.getAudioTracks()[0].enabled = !micEnabled;
    }

    setLocalStream(localStream);
    setLocalAudioActive(!micEnabled);
}