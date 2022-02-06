import React, { FC, ReactElement, useMemo, useRef, useState } from "react";
import Nav from "../../components/nav";
import base from "../../utils/baseUrl";
import useFetch from "../../utils/useFetch";
import "./index.css";
import { IType, IGood, IGoodResponse } from "../../utils/types";
import { Link } from "react-router-dom";
import Search from "../../components/search";
import useTitle from "../../utils/useTitle";

const Category: FC = (): ReactElement => {
    const [curMenu, setCurMenu] = useState<number>(0);
    const [preY, setPreY] = useState<number>(0);
    const [startY, setStartY] = useState<number>(0);
    const [shiftY, setShiftY] = useState<number>(0);
    const content = useRef<HTMLDivElement>(null);
    const prevRef = useRef<number>(0);

    useTitle("全部商品");
    
    //[0,前一个元素高度,前两个元素高度和,前三个元素高度和...]
    const allHeight = (() => {
        const arr = [0];
        if (content.current) {
            Array.from(content.current.children).forEach(item => {
                if (item instanceof HTMLElement) {
                    arr.push(item.offsetHeight + arr[arr.length - 1]);
                }
            })
        }
        arr.pop();
        return arr;
    })()

    const { data: typeData, loading: typeLoading, error: typeError } = useFetch<IType[]>(`${base}/types`);
    const { data: goodData, loading: goodLoading, error: goodError } = useFetch<IGoodResponse[]>(`${base}/goods`);
    const goods: [number, IGood[]][] = useMemo(() => {
        if (!goodData) {
            return [];
        }
        goodData.forEach(item => {
            item.colors = JSON.parse(item.colors);
            item.images = JSON.parse(item.images);
        })
        const map = new Map();
        goodData.forEach(item => {
            map.set(0, map.get(0) ? [...map.get(0), item] : [item])
            //按类型分类
            map.set(item.typeId, map.get(item.typeId) ? [...map.get(item.typeId), item] : [item])
        })
        return Array.from(map);
    }, [goodData]);

    const handleClick = (index: number) => {
        setCurMenu(index)
        setShiftY(-allHeight[index])
    }

    const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
        setPreY(e.changedTouches[0].pageY)
        setStartY(shiftY)
    }

    const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        const cur = new Date().valueOf();
        if (cur - prevRef.current > 30) {
            const tmp = startY + e.changedTouches[0].pageY - preY
            if (tmp > 0) setShiftY(0)
            else if (tmp < -allHeight[allHeight.length - 1]) setShiftY(-allHeight[allHeight.length - 1])
            else setShiftY(tmp)
            let index = curMenu
            if (Math.abs(shiftY) >= allHeight[index + 1]) {
                setCurMenu(index + 1)
            }
            if (Math.abs(shiftY) < allHeight[index]) {
                setCurMenu(index - 1)
            }
            prevRef.current = cur
        }
    }
    return (
        <div className="category-container">
            <div className="home-search">
                <Search />
            </div>
            <div className="category">
                <div className="sidemenu">
                    {
                        typeLoading ? <p>Loading...</p> : typeError ? <p>error!</p> :
                            typeData?.map((item, index) => {
                                return (
                                    <div key={item.id}
                                        style={index === curMenu ? { backgroundColor: "#fff", color: "#0096d6" }
                                            : { backgroundColor: "#f6f6f6", color: "black" }}
                                        onClick={() => handleClick(index)}
                                    >{item.typeName}</div>
                                )
                            })
                    }
                </div>
                <div className="content-container">
                    <div
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        style={{ transform: `translate3D(0,${shiftY}px,0)` }}
                        ref={content}
                    >
                        {
                            goodLoading ? <p>loading...</p> : goodError ? <p>error!</p> :
                                typeData?.map(item => (
                                    <div className="content" key={item.id}>
                                        <div className="content-title">
                                            ——&nbsp;&nbsp;{
                                                item.typeName
                                            }&nbsp;&nbsp;——
                                        </div>
                                        <div className="content-main">
                                            {
                                                goods.filter((data) => data[0] === item.id)[0]?.[1].map((data) => (
                                                    <Link to={`/buy/${data.id}`} key={data.id}>
                                                        <img src={base + data.icon} alt={data.name} />
                                                        <div>{data.name}</div>
                                                    </Link>
                                                ))
                                            }
                                        </div>
                                    </div>
                                ))
                        }
                    </div>
                </div>
            </div>
            <Nav curIndex={1} />
        </div>
    )
}

export default Category;
