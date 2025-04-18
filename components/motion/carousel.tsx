"use client";
import React, {
    ReactNode,
    createContext,
    useCallback,
    useContext,
    useEffect,
    useId,
    useRef,
    useState,
} from "react";
import { motion, AnimatePresence} from "motion/react";
import Autoplay from "embla-carousel-autoplay";
import {
    EmblaCarouselType,
    EmblaEventType,
    EmblaOptionsType,
} from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import ClassNames from "embla-carousel-class-names";
import { cn } from "@/lib/utils";
type UseDotButtonType = {
    selectedIndex: number;
    scrollSnaps: number[];
    onDotButtonClick: (index: number) => void;
};

/*eslint-disable @typescript-eslint/no-explicit-any*/
interface CarouselProps {
    children: React.ReactNode;
    options: EmblaOptionsType;
    className?: string;
    activeSlider?: boolean;
    isAutoPlay?: boolean;
    isScale?: boolean;
}
interface ThumbnailSlide {
    src: string;
    alt: string;
}
interface CarouselContextType {
    prevBtnDisabled: boolean;
    nextBtnDisabled: boolean;
    onPrevButtonClick: () => void;
    onNextButtonClick: () => void;
    selectedIndex: any;
    scrollSnaps: any;
    onDotButtonClick: any;
    scrollProgress: any;
    selectedSnap: any;
    snapCount: any;
    isScale: boolean;
    slidesrArr: ThumbnailSlide[];
    setSlidesArr: any;
    emblaThumbsRef: any;
    onThumbClick: any;
    carouselId: string;
}

const CarouselContext = createContext<CarouselContextType | undefined>(
    undefined,
);
const TWEEN_FACTOR_BASE = 0.52;

const numberWithinRange = (number: number, min: number, max: number): number =>
    Math.min(Math.max(number, min), max);
export const useCarouselContext = () => {
    const context = useContext(CarouselContext);
    if (!context) {
        throw new Error(
            "useCarouselContext must be used within a CarouselProvider",
        );
    }
    return context;
};

const Carousel: React.FC<CarouselProps> = ({
    children,
    options,
    className,
    activeSlider,
    isScale = false,
    isAutoPlay = false,
}) => {
    const carouselId = useId();
    const [slidesrArr, setSlidesArr] = useState<ThumbnailSlide[]>([]);
    const plugins = [];

    if (activeSlider) {
        plugins.push(ClassNames());
    }

    if (isAutoPlay) {
        plugins.push(
            Autoplay({
                playOnInit: true,
                delay: 3000,
                stopOnMouseEnter: true,
                jump: false,
                stopOnInteraction: false,
            }),
        );
    }
    const [emblaRef, emblaApi] = useEmblaCarousel(options, plugins);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [selectedThumbIndex, setSelectedThumbIndex] = useState(0);
    const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel({
        containScroll: "keepSnaps",
        dragFree: true,
    });

    const onThumbClick = useCallback(
        (index: number) => {
            if (!emblaApi || !emblaThumbsApi) return;
            emblaApi.scrollTo(index);
        },
        [emblaApi, emblaThumbsApi],
    );

    const onSelect = useCallback(() => {
        if (!emblaApi || !emblaThumbsApi) return;
        setSelectedThumbIndex(emblaApi.selectedScrollSnap()); // Use setSelectedThumbIndex here
        emblaThumbsApi.scrollTo(emblaApi.selectedScrollSnap());
    }, [emblaApi, emblaThumbsApi, setSelectedThumbIndex]);

    useEffect(() => {
        if (!emblaApi) return;
        onSelect();
        emblaApi.on("select", onSelect);
        emblaApi.on("reInit", onSelect);
    }, [emblaApi, onSelect]);

    const { selectedIndex, scrollSnaps, onDotButtonClick } =
        useDotButton(emblaApi);
    const [scrollProgress, setScrollProgress] = useState(0);
    const {
        prevBtnDisabled,
        nextBtnDisabled,
        onPrevButtonClick,
        onNextButtonClick,
    } = usePrevNextButtons(emblaApi);

    const onScroll = useCallback((emblaApi: EmblaCarouselType) => {
        const progress = Math.max(0, Math.min(1, emblaApi.scrollProgress()));
        setScrollProgress(progress * 100);
    }, []);
    useEffect(() => {
        if (!emblaApi) return;

        onScroll(emblaApi);
        emblaApi.on("reInit", onScroll);
        emblaApi.on("scroll", onScroll);
    }, [emblaApi, onScroll]);
    const { selectedSnap, snapCount } = useSelectedSnapDisplay(emblaApi);

    // for scale animation

    const tweenFactor = useRef(0);
    const tweenNodes = useRef<HTMLElement[]>([]);
    const setTweenNodes = useCallback(
        (emblaApi: EmblaCarouselType): void => {
            if (!isScale) return;
            tweenNodes.current = emblaApi
                .slideNodes()
                .map((slideNode, index) => {
                    const node = slideNode.querySelector(
                        ".slider_content",
                    ) as HTMLElement;
                    if (!node) {
                        console.warn(
                            `No .slider_content found for slide ${index}`,
                        );
                    }
                    return node;
                });
        },
        [isScale],
    );

    const setTweenFactor = useCallback(
        (emblaApi: EmblaCarouselType) => {
            if (!isScale) return;
            tweenFactor.current =
                TWEEN_FACTOR_BASE * emblaApi.scrollSnapList().length;
        },
        [isScale],
    );

    const tweenScale = useCallback(
        (emblaApi: EmblaCarouselType, eventName?: EmblaEventType) => {
            if (!isScale) return;
            const engine = emblaApi.internalEngine();
            const scrollProgress = emblaApi.scrollProgress();
            const slidesInView = emblaApi.slidesInView();
            const isScrollEvent = eventName === "scroll";

            emblaApi.scrollSnapList().forEach((scrollSnap, snapIndex) => {
                let diffToTarget = scrollSnap - scrollProgress;
                const slidesInSnap = engine.slideRegistry[snapIndex];

                slidesInSnap.forEach((slideIndex) => {
                    if (isScrollEvent && !slidesInView.includes(slideIndex))
                        return;

                    if (engine.options.loop) {
                        engine.slideLooper.loopPoints.forEach((loopItem) => {
                            const target = loopItem.target();

                            if (slideIndex === loopItem.index && target !== 0) {
                                const sign = Math.sign(target);

                                if (sign === -1) {
                                    diffToTarget =
                                        scrollSnap - (1 + scrollProgress);
                                }
                                if (sign === 1) {
                                    diffToTarget =
                                        scrollSnap + (1 - scrollProgress);
                                }
                            }
                        });
                    }

                    const tweenValue =
                        1 - Math.abs(diffToTarget * tweenFactor.current);
                    const scale = numberWithinRange(
                        tweenValue,
                        0,
                        1,
                    ).toString();
                    const tweenNode = tweenNodes.current[slideIndex];
                    // Add null check here
                    if (tweenNode) {
                        tweenNode.style.transform = `scale(${scale})`;
                    }
                });
            });
        },
        [isScale],
    );

    useEffect(() => {
        if (!emblaApi) return;
        if (isScale) {
            setTweenNodes(emblaApi);
            setTweenFactor(emblaApi);
            tweenScale(emblaApi);

            emblaApi
                .on("reInit", setTweenNodes)
                .on("reInit", setTweenFactor)
                .on("reInit", tweenScale)
                .on("scroll", tweenScale);
        }
    }, [emblaApi, tweenScale, isScale, setTweenNodes, setTweenFactor]);
    return (
        <CarouselContext.Provider
            value={{
                prevBtnDisabled,
                nextBtnDisabled,
                onPrevButtonClick,
                onNextButtonClick,
                selectedIndex,
                scrollSnaps,
                setSlidesArr,
                onDotButtonClick,
                scrollProgress,
                selectedSnap,
                snapCount,
                carouselId,
                isScale,
                emblaThumbsRef,
                onThumbClick,
                slidesrArr,
            }}
        >
            <div
                className={cn(className, "overflow-hidden rounded-md")}
                ref={emblaRef}
            >
                {children}
            </div>
        </CarouselContext.Provider>
    );
};

interface SliderProps {
    children: React.ReactNode;
    thumnailSrc?: string;
    className?: string;
}

export const SliderContainer = ({
    className,
    children,
}: {
    className?: string;
    children: ReactNode;
}) => {
    return (
        <div
            className={cn("flex", className)}
            style={{ touchAction: "pan-y pinch-zoom" }}
        >
            {children}
        </div>
    );
};
export const Slider: React.FC<SliderProps> = ({
    children,
    className,
    thumnailSrc,
}) => {
    const { isScale, setSlidesArr } = useCarouselContext();

    const addImgToSlider = useCallback(() => {
        if (!thumnailSrc) return;
        setSlidesArr((prev: ThumbnailSlide[]) => [...prev, { src: thumnailSrc, alt: `Slide ${prev.length + 1}` }]);
    }, [setSlidesArr, thumnailSrc]);

    useEffect(() => {
        addImgToSlider();
    }, [addImgToSlider]);

    return (
        <div className={cn("min-w-0 flex-shrink-0 flex-grow-0", className)}>
            {isScale ? (
                <>
                    <div className="slider_content">{children}</div>
                </>
            ) : (
                <>{children}</>
            )}
        </div>
    );
};

export const SliderPrevButton = ({
    children,
    className,
}: {
    children?: ReactNode;
    className?: string;
}) => {
    const { onPrevButtonClick, prevBtnDisabled }: any = useCarouselContext();
    return (
        <button
            className={cn("", className)}
            type="button"
            onClick={onPrevButtonClick}
            disabled={prevBtnDisabled}
        >
            {children}
        </button>
    );
};
export const SliderNextButton = ({
    children,
    className,
}: {
    children?: ReactNode;
    className?: string;
}) => {
    const { onNextButtonClick, nextBtnDisabled }: any = useCarouselContext();
    return (
        <>
            <button
                className={cn("", className)}
                type="button"
                onClick={onNextButtonClick}
                disabled={nextBtnDisabled}
            >
                {children}
            </button>
        </>
    );
};
export const SliderProgress = ({ className }: { className?: string }) => {
    const { scrollProgress }: any = useCarouselContext();
    return (
        <div
            className={cn(
                "relative h-2 w-96 max-w-[90%] items-center justify-end overflow-hidden rounded-md bg-gray-500",
                className,
            )}
        >
            <div
                className="absolute top-0 bottom-0 -left-[100%] w-full bg-black dark:bg-white"
                style={{ transform: `translate3d(${scrollProgress}%,0px,0px)` }}
            />
        </div>
    );
};

export const SliderSnapDisplay = ({ className }: { className?: string }) => {
    const { selectedSnap, snapCount } = useCarouselContext();
    const prevSnapRef = useRef(selectedSnap);
    const [direction, setDirection] = useState<number>(0);

    useEffect(() => {
        setDirection(selectedSnap > prevSnapRef.current ? 1 : -1);
        prevSnapRef.current = selectedSnap;
    }, [selectedSnap]);

    return (
        <div
            className={cn(
                "flex items-center gap-1 overflow-hidden mix-blend-difference",
                className,
            )}
        >
            <motion.div
                key={selectedSnap}
                custom={direction}
                initial={{ y: direction * 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -direction * 20, opacity: 0 }}
            >
                {selectedSnap + 1}
            </motion.div>
            <span>/ {snapCount}</span>
        </div>
    );
};
export const SliderDotButton = ({
    className,
    activeclass,
}: {
    className?: string;
    activeclass?: string;
}) => {
    const { selectedIndex, scrollSnaps, onDotButtonClick, carouselId }: any =
        useCarouselContext();
    return (
        <div className={cn("flex", className)}>
            <div className="flex gap-2">
                {scrollSnaps.map(
                    (_: any, index: React.Key | null | undefined) => (
                        <button
                            type="button"
                            key={index}
                            onClick={() => onDotButtonClick(index)}
                            className={`relative m-0 inline-flex h-2 w-10 p-0`}
                        >
                            <div className="h-2 w-10 rounded-full bg-gray-500/40"></div>
                            {index === selectedIndex && (
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        transition={{
                                            layout: {
                                                duration: 0.4,
                                                ease: "easeInOut",
                                                delay: 0.04,
                                            },
                                        }}
                                        layoutId={`hover-${carouselId}`}
                                        className={cn(
                                            "absolute top-0 left-0 z-[3] h-full w-full rounded-full bg-black dark:bg-white",
                                            activeclass,
                                        )}
                                    />
                                </AnimatePresence>
                            )}
                        </button>
                    ),
                )}
            </div>
        </div>
    );
};

export const useDotButton = (
    emblaApi: EmblaCarouselType | undefined,
): UseDotButtonType => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

    const onDotButtonClick = useCallback(
        (index: number) => {
            if (!emblaApi) return;
            emblaApi.scrollTo(index);
        },
        [emblaApi],
    );

    const onInit = useCallback((emblaApi: EmblaCarouselType) => {
        setScrollSnaps(emblaApi.scrollSnapList());
    }, []);

    const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
        setSelectedIndex(emblaApi.selectedScrollSnap());
    }, []);

    useEffect(() => {
        if (!emblaApi) return;

        onInit(emblaApi);
        onSelect(emblaApi);
        emblaApi.on("reInit", onInit);
        emblaApi.on("reInit", onSelect);
        emblaApi.on("select", onSelect);
    }, [emblaApi, onInit, onSelect]);

    return {
        selectedIndex,
        scrollSnaps,
        onDotButtonClick,
    };
};
type UsePrevNextButtonsType = {
    prevBtnDisabled: boolean;
    nextBtnDisabled: boolean;
    onPrevButtonClick: () => void;
    onNextButtonClick: () => void;
};

export const usePrevNextButtons = (
    emblaApi: EmblaCarouselType | undefined,
): UsePrevNextButtonsType => {
    const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
    const [nextBtnDisabled, setNextBtnDisabled] = useState(true);

    const onPrevButtonClick = useCallback(() => {
        if (!emblaApi) return;
        emblaApi.scrollPrev();
    }, [emblaApi]);

    const onNextButtonClick = useCallback(() => {
        if (!emblaApi) return;
        emblaApi.scrollNext();
    }, [emblaApi]);

    const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
        setPrevBtnDisabled(!emblaApi.canScrollPrev());
        setNextBtnDisabled(!emblaApi.canScrollNext());
    }, []);

    useEffect(() => {
        if (!emblaApi) return;

        onSelect(emblaApi);
        emblaApi.on("reInit", onSelect);
        emblaApi.on("select", onSelect);
    }, [emblaApi, onSelect]);

    return {
        prevBtnDisabled,
        nextBtnDisabled,
        onPrevButtonClick,
        onNextButtonClick,
    };
};

type UseSelectedSnapDisplayType = {
    selectedSnap: number;
    snapCount: number;
};

export const useSelectedSnapDisplay = (
    emblaApi: EmblaCarouselType | undefined,
): UseSelectedSnapDisplayType => {
    const [selectedSnap, setSelectedSnap] = useState(0);
    const [snapCount, setSnapCount] = useState(0);

    const updateScrollSnapState = useCallback((emblaApi: EmblaCarouselType) => {
        setSnapCount(emblaApi.scrollSnapList().length);
        setSelectedSnap(emblaApi.selectedScrollSnap());
    }, []);

    useEffect(() => {
        if (!emblaApi) return;

        updateScrollSnapState(emblaApi);
        emblaApi.on("select", updateScrollSnapState);
        emblaApi.on("reInit", updateScrollSnapState);
    }, [emblaApi, updateScrollSnapState]);

    return {
        selectedSnap,
        snapCount,
    };
};

export const ThumsSlider: React.FC = () => {
    const { emblaThumbsRef, slidesrArr, selectedIndex, onThumbClick } =
        useCarouselContext();
    // console.log(slidesrArr);

    return (
        <div className="mt-2 overflow-hidden" ref={emblaThumbsRef}>
            <div className="flex flex-row gap-2">
                {slidesrArr.map((slide, index) => (
                    <div
                        key={`thumb-${index}`}
                        className={`aspect-auto w-full min-w-0 rounded-md border-2 xl:h-24 ${
                            index === selectedIndex
                                ? "opacity-100"
                                : "border-transparent opacity-30"
                        }`}
                        style={{ flex: "0 0 15%" }}
                        onClick={() => onThumbClick(index)}
                    >
                        <motion.img
                            src={slide.src}
                            className="h-full w-full rounded-sm object-cover"
                            width={400}
                            height={400}
                            alt={slide.alt || `Thumbnail ${index + 1}`}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};
export default Carousel;

/*eslint-enable @typescript-eslint/no-explicit-any*/
