import React, { FC, ReactElement, useEffect, useRef, useState } from "react";
import "./index.css";
import { IGood } from "../../utils/types";
import { Link } from "react-router-dom";
import { useCallback } from "react";

interface IProps {
    dataSource: IGood[]
}

const Swiper: FC<IProps> = (props: IProps): ReactElement => {
    const picList = useRef<HTMLUListElement>(null);
    const picNav = useRef<HTMLElement>(null);
    const timer = useRef<NodeJS.Timeout | undefined>(undefined);
    const [curIndex, setCurIndex] = useState<number>(0);  //当前展示第几张幻灯片
    const [shiftX, setShiftX] = useState<number>(0);  //总偏移量
    const [prevX, setPrevX] = useState<number>(0);  //上一次总偏移量
    const [startX, setStartX] = useState<number>(0);  //开始触摸时手指x坐标

    const autoPlay = useCallback(() => {
        timer.current = setInterval(() => {
            setCurIndex(curIndex => {
                if (!picList.current || !picNav.current) {
                    return curIndex;
                }
                if (curIndex === picList.current.children.length - 1) {
                    picList.current.style.transition = "none";
                    picList.current.style.transform = `translate3d(${-(picNav.current.children.length - 1) * picList.current.parentElement!.getBoundingClientRect().width}px, 0px, 0px)`;
                    return picNav.current.children.length;
                }
                return curIndex + 1;
            })
        }, 3000)
    }, [])

    //将图片节点再复制一组方便无缝切换
    useEffect(() => {
        if (!picList.current) {
            return;
        }
        picList.current.innerHTML += picList.current.innerHTML;
        picList.current.style.width = picList.current.children.length + "00%";
    }, [])

    //开始轮播
    useEffect(() => {
        autoPlay();
        return () => {
            if (timer.current) {
                clearInterval(timer.current);
            }
        }
    }, [autoPlay])

    //根据索引计算总偏移量
    useEffect(() => {
        setShiftX(shiftX => {
            if (!picList.current) {
                return shiftX;
            }
            picList.current.style.transition = "1.5s";
            return -curIndex * picList.current.parentElement!.getBoundingClientRect().width;
        })
    }, [curIndex])

    const handleStart = (e: React.TouchEvent<HTMLUListElement>): any => {
        if (!picList.current || !picNav.current) {
            return;
        }
        if (timer.current) {
            clearInterval(timer.current);
        }
        //滑动时禁止过渡
        picList.current.style.transition = "none";
        setStartX(e.changedTouches[0].pageX);
        //当幻灯片到了第一组第一张将其移动到第二组第一张，当幻灯片到了第二组最后一张将其移动到第一组最后一张
        if (curIndex === 0) {
            picList.current.style.transform = `translate3d(${-picNav.current.children.length * picList.current.parentElement!.getBoundingClientRect().width}px, 0px, 0px)`;
            setCurIndex(picNav.current.children.length);
        } else if (curIndex === picList.current.children.length - 1) {
            picList.current.style.transform = `translate3d(${-(picNav.current.children.length - 1) * picList.current.parentElement!.getBoundingClientRect().width}px, 0px, 0px)`;
            setCurIndex(picNav.current.children.length - 1);
        }
        setPrevX(shiftX);
    }

    let handleMove = (e: React.TouchEvent) => {
        const curX = e.changedTouches[0].pageX;
        const differ = curX - startX;  //当前x坐标-触摸开始时刻x坐标等于这一次滑动导致x的偏移量
        setShiftX(prevX + differ);
    }

    const handleEnd = (e: React.TouchEvent<HTMLUListElement>) => {
        if (!picList.current) {
            return;
        }
        const curX = e.changedTouches[0].pageX;
        const differ = curX - startX;
        //当滑动距离超过0.3屏幕宽度时切换上/下一张
        picList.current.style.transition = "1.5s";
        if (Math.abs(differ) > 0.3 * picList.current.parentElement!.getBoundingClientRect().width) {
            setCurIndex(curIndex => curIndex - differ / Math.abs(differ));
        } else {
            setShiftX(-curIndex * picList.current.parentElement!.getBoundingClientRect().width);
        }
        autoPlay();
    }

    return (
        <div className="tab ">
            <ul className="picList"
                ref={picList}
                style={{
                    transform: `translate3d(${shiftX}px,0,0)`,
                }}
                onTouchStart={handleStart}
                onTouchMove={handleMove}
                onTouchEnd={handleEnd}
            >
                {
                    props.dataSource.map((item) => {
                        return (
                            <li key={item.id}>
                                <Link to={`/buy/${item.id}`}>
                                    <img src={item.icon} alt="tab_picture" />
                                </Link>
                            </li>
                        )
                    })
                }
            </ul>
            <nav className="picNav" ref={picNav}>
                {
                    props.dataSource.map((item, index) => {
                        return <span key={index} className={picNav.current ?
                            index === curIndex % Array.from(picNav.current.children).length ? "active" : ""
                            : ""
                        }></span>
                    })
                }
            </nav>
        </div >
    );
}

export default Swiper;