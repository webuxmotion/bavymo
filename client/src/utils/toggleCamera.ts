import { useStreamsStore } from "../store/useStreamsStore";

export const toggleCamera = () => {
    const { localStream, setLocalStream, setLocalVideoActive } =
        useStreamsStore.getState();

    const cameraEnabled = localStream?.getVideoTracks()[0].enabled;

    if (localStream?.getVideoTracks()[0]) {
        localStream.getVideoTracks()[0].enabled = !cameraEnabled;
    }

    setLocalStream(localStream);
    setLocalVideoActive(!cameraEnabled);
}