import { FC, ReactElement, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import Nav from "../../components/nav";
import base from "../../utils/baseUrl";
import { IGood, IGoodResponse } from "../../utils/types";
import useTitle from "../../utils/useTitle";
import "./index.css";

interface IData {
    id: number,
    username: string,
    goodId: number,
    quantity: number,
    color: string,
    goods: IGoodResponse[] | IGood[]
}

const Cart: FC = (): ReactElement => {
    const [selected, setSelected] = useState<boolean[]>([]);
    const [dataSource, setDataSource] = useState<IData[]>([]);
    const navigate = useNavigate();

    useTitle("购物车");

    const totalprice = useMemo(() => {
        const totalarr = dataSource.filter((item, index) => selected[index] === true);
        return totalarr.reduce((pre, cur) => pre + cur.quantity * cur.goods[0].price, 0);
    }, [dataSource, selected])

    useEffect(() => {
        let unMount = false;
        fetch(`${base}/carts?expand=goods`, { headers: { "Authorization": localStorage.getItem("token")! } })
            .then(res => {
                if (res.status === 401) {
                    localStorage.removeItem("token");
                    navigate("/login");
                }
                else {
                    return Promise.resolve<IData[]>(res.json());
                }
            })
            .then(json => {
                json?.forEach(item => {
                    item.goods[0].colors = JSON.parse(item.goods[0].colors as string);
                    item.goods[0].images = JSON.parse(item.goods[0].images as string);
                })
                if (!unMount) {
                    setDataSource(json!);
                    setSelected(Array(json?.length).fill(false));
                }
            })
        return () => {
            unMount = true;
        }
    }, [navigate])

    const handleReduce = (item: IData) => {
        if (item.quantity > 1) {
            item.quantity--;
            fetch(`${base}/carts/${item.id}`, {
                method: "PATCH",
                body: JSON.stringify({
                    "quantity": item.quantity
                }),
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": localStorage.getItem("token")!
                }
            }).then(res => setDataSource([...dataSource]))
        }
    }

    const handleSubmit = () => {
        setDataSource(dataSource.filter((item, index) => selected[index] === false));
        const requestArr = dataSource.filter((item, index) => selected[index] === true);
        Promise.all([...requestArr.map((item) => {
            return fetch(`${base}/carts/${item.id}`, {
                method: "DELETE",
                headers: { "Authorization": localStorage.getItem("token")! }
            })
        }), ...requestArr.map((item) => {
            return fetch(`${base}/pays`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": localStorage.getItem("token")!
                },
                body: JSON.stringify({
                    "goodId": item.goodId,
                })
            })
        }), ...requestArr.map((item) => {
            return fetch(`${base}/goods/${item.goodId}`, {
                method: "PATCH",
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": localStorage.getItem("token")!
                },
                body: JSON.stringify({
                    "count": item.goods[0].count + 1
                })
            })
        })]).then(val => alert("购买成功，可以在待评价留下你的评价~"))
    }


    const handleAdd = (item: IData) => {
        item.quantity++;
        fetch(`${base}/carts/${item.id}`, {
            method: "PATCH",
            body: JSON.stringify({
                "quantity": item.quantity
            }),
            headers: {
                'Content-Type': 'application/json',
                "Authorization": localStorage.getItem("token")!
            }
        }).then(res => setDataSource([...dataSource]))
    }

    return (
        <div className="cart-container">
            {
                dataSource.length ? dataSource.map((item, index) => (
                    <div key={item.id} className="cart-item">
                        <div className="cart-wrap">
                            <span className="cart-selected"
                                onClick={() => {
                                    selected[index] = !selected[index]
                                    setSelected([...selected])
                                }}
                                style={{ backgroundColor: selected[index] ? "#0096d6" : "#fff" }}
                            />
                            <Link to={`/buy/${item.goodId}`}>
                                <img src={base + item.goods[0].icon} alt={item.goods[0].name} />
                            </Link>
                            <div>
                                <div><Link to={`/buy/${item.goodId}`}>{item.goods[0].name}&nbsp;&nbsp;{item.color}</Link></div>
                                <div>
                                    <div className="cart-price">￥{item.goods[0].price}</div>
                                    <div className="quantity">
                                        <span
                                            style={{ color: item.quantity > 1 ? "black" : "#c8c9cc" }}
                                            onClick={() => handleReduce(item)}
                                        >-</span>
                                        <span>{item.quantity}</span>
                                        <span onClick={() => handleAdd(item)}>+</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )) : ""
            }
            <div className="pay-nav">
                <div className="total">
                    <span
                        style={{ backgroundColor: selected.every(data => data) ? "#0096d6" : "#fff" }}
                        onClick={
                            () => selected.every(data => data) ?
                                setSelected([...selected.fill(false)])
                                : setSelected([...selected.fill(true)])
                        }
                    />
                    <span>全部</span>
                    <span className="totalprice">￥{totalprice}</span>
                </div>
                <button className="pay" onClick={handleSubmit}>结算</button>
            </div>
            <Nav curIndex={2} />
        </div>
    );
}

export default Cart;