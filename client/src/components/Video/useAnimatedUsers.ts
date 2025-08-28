import { useEffect, useState } from "react";
import type { OnlineUser } from "@server/shared/types";
import { useAppContext } from "@/providers/AppProvider";
import { useSocket } from "@/socket/useSocket";
import { useUsersStore } from "@/store/useUsersStore";

interface AnimatedUser extends OnlineUser {
    x: number;
    y: number;
    dx: number;
    dy: number;
}

export function useAnimatedUsers(
    contentRef: React.RefObject<HTMLDivElement | null>
) {
    const onlineUsers = useUsersStore((state) => state.users);
    const [animatedUsers, setAnimatedUsers] = useState<AnimatedUser[]>([]);
    const { user } = useAppContext();
    const { socket } = useSocket();


    useEffect(() => {
        let animationFrameId: number;

        const animate = () => {
            if (!contentRef.current) return;

            const { width, height } = contentRef.current.getBoundingClientRect();

            setAnimatedUsers(prev =>
                prev.map(u => {
                    let newX = u.x + u.dx;
                    let newY = u.y + u.dy;

                    const maxX = width - 50; // 50 — розмір іконки або відступ
                    const maxY = height - 50;

                    if (newX <= 0 || newX >= maxX) u.dx = -u.dx;
                    if (newY <= 0 || newY >= maxY) u.dy = -u.dy;

                    newX = Math.max(0, Math.min(maxX, newX));
                    newY = Math.max(0, Math.min(maxY, newY));

                    return { ...u, x: newX, y: newY, dx: u.dx, dy: u.dy };
                })
            );

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();
        return () => cancelAnimationFrame(animationFrameId);
    }, []);

    useEffect(() => {
        if (onlineUsers.length && socket && contentRef.current) {
            const { width, height } = contentRef.current.getBoundingClientRect();
            const centerX = width / 2;
            const centerY = height / 2;

            const users = onlineUsers
                .filter(u => u.personalCode !== user.personalCode)
                .map(u => ({
                    ...u,
                    // початкова позиція близько до центру з невеликим рандомним зміщенням
                    x: centerX + (Math.random() - 0.5) * 50, // ±25px від центру
                    y: centerY + (Math.random() - 0.5) * 50, // ±25px від центру
                    dx: (Math.random() - 0.5) * 2, // швидкість X
                    dy: (Math.random() - 0.5) * 2, // швидкість Y
                }));

            setAnimatedUsers(users);
        }
    }, [onlineUsers, socket]);

    return animatedUsers;
}