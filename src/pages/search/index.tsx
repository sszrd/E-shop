import { FC, ReactElement, useMemo } from "react";
import { useLocation } from "react-router";
import base from "../../utils/baseUrl";
import useFetch from "../../utils/useFetch";
import ComponentSearch from "../../components/search";
import { Link } from "react-router-dom";
import { IColor, IGood, IGoodResponse, IImage } from "../../utils/types";
import "./index.css";
import useTitle from "../../utils/useTitle";

interface IState {
    id?: number,
    content?: string
}

const Search: FC = (): ReactElement => {
    const state = useLocation().state as IState;

    const { data, loading, error } = useFetch<IGoodResponse[]>(
        state.id ?
            `${base}/goods?subTypeId=${state.id}` :
            `${base}/goods?name=${state.content}`
    );

    useTitle("商品");

    const dataSource: IGood[] = useMemo(() => {
        if (!data) {
            return [];
        }
        return data.map(item => {
            const colors: IColor[] = JSON.parse(item.colors);
            const images: IImage[] = JSON.parse(item.images);
            return { ...item, colors, images };
        })
    }, [data])

    return (
        <div className="search-page">
            <div className="search"><ComponentSearch /></div>
            {
                loading ? <p>loading...</p> : error ? <p>error!</p> :
                    dataSource.map(item => (
                        <Link to={`/buy/${item.id}`} key={item.id} className="search-item">
                            <img src={base + item.icon} alt={item.name} />
                            <div>{item.name}</div>
                            <div>￥{item.price}</div>
                        </Link>
                    ))
            }
            <div className="search-tips">没有更多了</div>
        </div>
    );
}

export default Search;