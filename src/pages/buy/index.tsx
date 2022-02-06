import React, { FC, ReactElement, useMemo, useRef, useState } from "react";
import { useParams } from "react-router";
import base from "../../utils/baseUrl";
import { IColor, IGood, IGoodResponse, IImage } from "../../utils/types";
import useFetch from "../../utils/useFetch";
import useTitle from "../../utils/useTitle";
import Comment from "./Comment";
import Footer from "./Footer";
import "./index.css";

const Buy: FC = (): ReactElement => {
    const [index, setIndex] = useState<number>(0);
    const [shiftX, setShiftX] = useState<number>(0);
    const [preX, setPreX] = useState<number>(0);
    const [startX, setStartX] = useState<number>(0);
    const [selectedColor, setSelectedColor] = useState<string>("");
    const [quantity, setQuantity] = useState<number>(1);
    const picList = useRef<HTMLDivElement>(null);
    const params = useParams();
    const { data, error, loading } = useFetch<IGoodResponse[]>(`${base}/goods/${params.id}`);

    const dataSource: IGood | undefined = useMemo(() => {
        if (data) {
            const colors: IColor[] = JSON.parse(data[0].colors);
            const images: IImage[] = JSON.parse(data[0].images);
            setSelectedColor(colors[0].value);
            return { ...data[0], colors, images };
        }
        return undefined;
    }, [data])

    useTitle(dataSource ? dataSource.name : "购买商品");

    const changeValue = (color: string) => {
        setSelectedColor(color);
    }

    const handleReduce = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    }

    const handleAdd = () => {
        setQuantity(quantity + 1);
    }

    const hanldeTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
        if (picList.current) {
            picList.current.style.transition = "none";
            setPreX(e.changedTouches[0].pageX);
            setStartX(shiftX);
        }
    }

    const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        if (picList.current && dataSource) {
            picList.current.style.transition = "none";
            const tmp = startX + e.changedTouches[0].pageX - preX;
            //边界判断
            if (tmp > 0) {
                setShiftX(0);
            }
            else if (tmp < -(dataSource.images.length - 1) * document.body.offsetWidth) {
                setShiftX(-(dataSource.images.length - 1) * document.body.offsetWidth);
            }
            else {
                setShiftX(tmp);
            }
        }
    }

    const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
        if (!dataSource || !picList.current) {
            return;
        }
        const differ = e.changedTouches[0].pageX - preX;
        if (Math.abs(differ) > document.body.offsetWidth * 0.2) {
            const tmp = -(index - Math.abs(differ) / differ) * document.body.offsetWidth;
            if (tmp > 0) {
                setShiftX(0);
                setIndex(0);
            } else if (tmp < -(dataSource.images.length - 1) * document.body.offsetWidth) {
                setShiftX(-(dataSource.images.length - 1) * document.body.offsetWidth);
                setIndex((dataSource.images.length - 1));
            } else {
                picList.current.style.transition = ".5s";
                setShiftX(tmp);
                setIndex(index - Math.abs(differ) / differ);
            }
        } else {
            picList.current.style.transition = ".5s";
            setShiftX(-index * document.body.offsetWidth);
        }
    }

    return (
        <div className="buy">
            <div className="buy-pic">
                <div className="picList"
                    ref={picList}
                    onTouchStart={hanldeTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    style={{ width: `${dataSource?.images?.length}00%`, transform: `translate3D(${shiftX}px,0,0)` }}
                >
                    {
                        loading ? <p>loading...</p> : error ? <p>error!</p> :
                            dataSource?.images?.map(item => {
                                return (
                                    <img src={base + item.src} alt={dataSource.name} key={item.index} />
                                )
                            })
                    }

                </div>
                <span>{index + 1}/{dataSource?.images?.length}</span>
            </div>
            <div className="buy-main">
                <div className="buy-description">
                    <span>￥{dataSource?.price}</span>
                    <span>{dataSource?.name}</span>
                </div>
                <div className="buy-option">
                    <div className="colors">
                        <span className="title">颜色</span>
                        {
                            dataSource?.colors?.map(item => {
                                return (
                                    <div key={item.value}
                                        style={{ border: selectedColor === item.value ? "1px solid #0096d6" : "none" }}
                                        onClick={() => changeValue(item.value)}
                                    >
                                        <span style={{ backgroundColor: item.value }}></span>
                                        <span>{item.name}</span>
                                    </div>
                                )
                            })}
                    </div>
                    <div className="quantity">
                        <span className="title">数量</span>
                        <div>
                            <span style={{ color: quantity === 1 ? "#c8c9cc" : "black" }} onClick={handleReduce}>-</span>
                            <span>{quantity}</span>
                            <span onClick={handleAdd}>+</span>
                        </div>
                    </div>
                </div>
            </div>
            <Comment goodsId={Number(params.id)} />
            <Footer dataSource={dataSource!} color={selectedColor} quantity={quantity} />
            <div className="buy-fill"></div>
        </div>
    );
}

export default Buy;