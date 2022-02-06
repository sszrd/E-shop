import { FC, ReactElement, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
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

const Comment: FC = (): ReactElement => {
    const [dataSource, setDataSource] = useState<IData[]>([]);
    const [curIndex, setCurIndex] = useState<number>(-1);
    const [score, setScore] = useState<number>(0);
    const [comment, setComment] = useState<string>("");
    const navigate = useNavigate();

    useTitle("待评价");

    useEffect(() => {
        let unMout = false
        fetch(`${base}/pays?expand=goods`, {
            headers: { 'Authorization': localStorage.getItem("token")! }
        })
            .then(res => {
                if (res.status === 401) {
                    localStorage.removeItem("token");
                    navigate("/login");
                }
                return Promise.resolve<IData[]>(res.json());
            })
            .then(json => {
                json.forEach(item => {
                    item.goods[0].colors = JSON.parse(item.goods[0].colors as string);
                    item.goods[0].images = JSON.parse(item.goods[0].images as string);
                })
                if (!unMout) {
                    setDataSource(json);
                }
            })
            .catch(res => alert("请求超时，刷新一下页面吧~"))
        return () => {
            unMout = true
        }
    }, [navigate])

    const handleSubmit = () => {
        const data = dataSource.filter((item, index) => index === curIndex)[0]
        const post = {
            "goodId": data.goodId,
            comment,
            score
        }
        Promise.all([
            fetch(`${base}/comments`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem("token")!
                },
                body: JSON.stringify(post)
            }),
            fetch(`${base}/pays/${data.id}`, {
                method: "DELETE",
                headers: {
                    'Authorization': localStorage.getItem("token")!
                }
            })
        ])
            .then(val => {
                setCurIndex(-1);
                setScore(0);
                setComment("");
                setDataSource(dataSource.filter((item, index) => index !== curIndex));
                alert("评价成功");
            })
            .catch(res => alert("评价失败，检查网络后重试"))
    }

    return (
        <div className="commentlist">
            {
                dataSource.length ? dataSource.map((item, index) => (
                    <div key={item.id} className="commentlist-item">
                        <div className="commentlist-wrap">
                            <Link to={`/buy/${item.goodId}`}>
                                <img src={base + item.goods[0].icon} alt={item.goods[0].name} />
                            </Link>
                            <div><Link to={`/buy/${item.goodId}`}>{item.goods[0].name}&nbsp;&nbsp;{item.color}</Link></div>
                            <button
                                style={{ backgroundColor: curIndex !== index ? "#0096d6" : "#fff", color: curIndex !== index ? "#fff" : "#0096d6" }}
                                onClick={() => {
                                    setScore(0)
                                    setComment("")
                                    setCurIndex(index)
                                }}
                            >评价</button>
                        </div>
                        <div className="commentlist-comment" style={{ display: curIndex === index ? "block" : "none" }}>
                            <div>
                                <span>评分</span>
                                <span>
                                    {
                                        [1, 2, 3, 4, 5].map((item, index) => {
                                            return <span className="iconfont"
                                                key={index}
                                                style={{ color: index < score ? "rgba(214, 214, 8, 0.473)" : "#f1f1f1" }}
                                                onClick={() => setScore(index + 1)}
                                            >&#xe709;</span>
                                        })
                                    }
                                </span>
                            </div>
                            <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="写下你的评价~" />
                            <button onClick={handleSubmit}>提交</button>
                        </div>
                    </div >
                )) : ""
            }
            <div className="comment-tips">没有更多了</div>
        </div >
    );
}
export default Comment;