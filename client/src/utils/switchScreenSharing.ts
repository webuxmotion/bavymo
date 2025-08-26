// utils/switchScreenSharing.ts
import { useStreamsStore } from "../store/useStreamsStore";
import { usePeerConnectionStore } from "../store/usePeerConnectionStore";

export const switchScreenSharing = async (active: boolean) => {
    const { setScreenSharingStream, setScreenSharingActive, screenSharingStream } =
        useStreamsStore.getState();
    const { peerConnection } = usePeerConnectionStore.getState();

    if (!peerConnection) {
        console.warn("⚠️ No peerConnection in store");
        return;
    }

    if (active) {
        // Stop screen sharing
        if (screenSharingStream) {
            screenSharingStream.getTracks().forEach((track) => track.stop());
            setScreenSharingStream(null);
        }

        // Revert back to camera
        const cameraStream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
        });

        const videoTrack = cameraStream.getVideoTracks()[0];
        const sender = peerConnection.getSenders().find((s) => s.track?.kind === "video");

        if (sender && videoTrack) {
            await sender.replaceTrack(videoTrack);
        }

        setScreenSharingActive(false);
    } else {
        try {
            const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
            setScreenSharingStream(stream);

            const screenTrack = stream.getVideoTracks()[0];
            const sender = peerConnection.getSenders().find((s) => s.track?.kind === "video");

            if (sender && screenTrack) {
                await sender.replaceTrack(screenTrack);
            }

            setScreenSharingActive(true);

            // If user manually stops from browser UI
            screenTrack.onended = () => switchScreenSharing(true);
        } catch (err) {
            console.error("❌ Error starting screen share:", err);
        }
    }
};