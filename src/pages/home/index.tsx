import React, { FC, ReactElement, useMemo } from "react";
import Nav from "../../components/nav";
import base from "../../utils/baseUrl";
import { IGood, IColor, IImage, IGoodResponse } from "../../utils/types";
import useFetch from "../../utils/useFetch";
import Menu from "./Menu";
import TopList from "./TopList";
import "./index.css";
import Search from "../../components/search";
import Swiper from "../../components/swiper";
import useTitle from "../../utils/useTitle";

const Home: FC = (): ReactElement => {
    let { data, error, loading } = useFetch<IGoodResponse[]>(`${base}/goods`);

    const dataSource: IGood[] = useMemo(() => {
        if (!data) return [];
        return data.map((item) => {
            const colors: IColor[] = JSON.parse(item.colors);
            const images: IImage[] = JSON.parse(item.images);
            const icon = base + item.icon;
            images.forEach(data => {
                data.src = base + data.src;
            })
            return { ...item, images, colors, icon }
        }).filter(item => item.tabShow === 1)
    }, [data])

    useTitle("电子商城");

    return (
        loading ? <p>loading...</p> : error ? <p>error!</p> :
            <div className="home-container">
                <div className="home-search">
                    <Search />
                </div>
                <Swiper dataSource={dataSource} />
                <Menu />
                <TopList />
                <div className="fill"></div>
                <Nav curIndex={0} />
            </div>
    );
}

export default Home;