import { useEffect, type RefObject } from "react";

export function useHorizontalScroll<T extends HTMLElement>(ref: RefObject<T>) {

    useEffect(() => {
        const el = ref.current;
        if (el) {
            const onWheel = (e: WheelEvent) => {
                if (e.deltaY === 0) return;

                e.preventDefault();

                el.scrollTo({
                    left: el.scrollLeft + e.deltaY,
                    behavior: 'smooth',
                });
            };

            el.addEventListener('wheel', onWheel);

            return () => el.removeEventListener('wheel', onWheel);
        }
    }, [ref]);
}
