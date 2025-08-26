import { useEffect, useRef, useState } from "react";
import { useStreamsStore } from "../../store/useStreamsStore";
import styles from "./MicVisualizer.module.scss";

export default function MicVisualizer() {
    const { localStream } = useStreamsStore();
    const [lines, setLines] = useState<number[]>([]);
    const rafRef = useRef<number | null>(null);

    useEffect(() => {
        if (!localStream) return;

        const audioCtx = new AudioContext();
        const analyser = audioCtx.createAnalyser();
        const source = audioCtx.createMediaStreamSource(localStream);

        source.connect(analyser);
        analyser.fftSize = 64 / 2; // fewer bars → smoother
        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        const tick = () => {
            analyser.getByteFrequencyData(dataArray);
            setLines([...dataArray]); // copy so React can track changes
            rafRef.current = requestAnimationFrame(tick);
        };

        tick();

        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            audioCtx.close();
        };
    }, [localStream]);

    return (
        <div className={styles.micVisualizer}>
            {lines.map((value, i) => (
                <div
                    key={i}
                    className={styles.line}
                    style={{
                        height: `${value / 2}px`, // scale bar height
                    }}
                />
            ))}
        </div>
    );
}