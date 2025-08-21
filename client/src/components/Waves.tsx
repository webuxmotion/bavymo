import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";

gsap.registerPlugin(MorphSVGPlugin);

export default function Waves() {
    const pathRef = useRef<SVGPathElement>(null);

    useEffect(() => {
        if (!pathRef.current) return;

        const wavePaths = [
            "M303.5 22.925C145.5 -11.475 35.3333 41.5916 0 72.425V224.925H1145V36.425C1134.5 48.425 1099.6 73.825 1044 79.425C974.5 86.4251 965 10.925 880 1.42502C795 -8.07498 743.5 32.425 665 48.925C586.5 65.425 501 65.925 303.5 22.925Z",
            "M275.5 62.5C148 81.5 37 98.5 0 73.425V225.925H1145V93.0001C1130.5 81 1092.6 56.8999 1037 62.5C967.5 69.5001 940.5 72 855.5 62.5C770.5 53 669 0 588 0C507.785 0 475.419 32.7081 275.5 62.5Z",
            "M303.5 22.925C145.5 -11.475 35.3333 41.5916 0 72.425V224.925H1145V36.425C1134.5 48.425 1099.6 73.825 1044 79.425C974.5 86.4251 965 10.925 880 1.42502C795 -8.07498 743.5 32.425 665 48.925C586.5 65.425 501 65.925 303.5 22.925Z",
            "M275.5 62.5C148 81.5 37 98.5 0 73.425V225.925H1145V93.0001C1130.5 81 1092.6 56.8999 1037 62.5C967.5 69.5001 940.5 72 855.5 62.5C770.5 53 669 0 588 0C507.785 0 475.419 32.7081 275.5 62.5Z",
            "M303.5 22.925C145.5 -11.475 35.3333 41.5916 0 72.425V224.925H1145V36.425C1134.5 48.425 1099.6 73.825 1044 79.425C974.5 86.4251 965 10.925 880 1.42502C795 -8.07498 743.5 32.425 665 48.925C586.5 65.425 501 65.925 303.5 22.925Z",
        ];

        let index = 0;

        function morphNext() {
            if (!pathRef.current) return;

            const nextIndex = (index + 1) % wavePaths.length;

            gsap.to(pathRef.current, {
                duration: 2,
                ease: "sine.inOut",
                morphSVG: wavePaths[nextIndex],
                onComplete: () => {
                    index = nextIndex;
                    morphNext(); // immediately morph to next shape
                },
            });
        }

        morphNext(); // start the animation
    }, []);

    return (
        <svg
            width="1145"
            height="226"
            viewBox="0 0 1145 226"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                ref={pathRef}
                d="M303.5 22.925C145.5 -11.475 35.3333 41.5916 0 72.425V224.925H1145V36.425C1134.5 48.425 1099.6 73.825 1044 79.425C974.5 86.4251 965 10.925 880 1.42502C795 -8.07498 743.5 32.425 665 48.925C586.5 65.425 501 65.925 303.5 22.925Z"
                fill="#A2B9EB"
            />
        </svg>
    );
}