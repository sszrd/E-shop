import React, { FC, ReactElement, useState } from "react";
import base from "../../utils/baseUrl";
import { IComment } from "../../utils/types";
import useFetch from "../../utils/useFetch";

const Comment: FC<{ goodsId: number }> = (props: { goodsId: number }): ReactElement => {
    const [shiftX, setShiftX] = useState<number>(0);
    const [preX, setPreX] = useState<number>(0);
    const [startX, setStartX] = useState<number>(0);
    const { data: comments, error, loading } = useFetch<IComment[]>(`${base}/comments?goodId=${props.goodsId}`);

    const hanldeTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
        setPreX(e.changedTouches[0].pageX);
        setStartX(shiftX);
    }

    const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        if (!comments) {
            return;
        }
        const tmp = startX + e.changedTouches[0].pageX - preX;
        //边界判断
        if (tmp > 0)
            setShiftX(0);
        else if (tmp < -0.8017 * (comments.length - 1) * document.body.offsetWidth) {
            setShiftX(-0.8017 * (comments.length - 1) * document.body.offsetWidth);
        }
        else {
            setShiftX(tmp);
        }
    }

    return (
        <div className="comment-container">
            <div className="comment-title">
                <span>商品评价</span>
            </div>
            <div className="comment">
                <div className="comment-cards"
                    onTouchStart={hanldeTouchStart}
                    onTouchMove={handleTouchMove}
                    style={{ transform: `translate3D(${shiftX}px,0,0)` }} >
                    {
                        loading ? <p>loading...</p> : error ? <p>error!</p> :
                            comments?.map(item => {
                                return (
                                    <div className="comment-card" key={item.id}>
                                        <div>
                                            <span className="iconfont">&#xe841;</span>
                                            <span>{item.username}</span>
                                        </div>
                                        <div>
                                            {
                                                [1, 2, 3, 4, 5].map((data, index) => {
                                                    return <span
                                                        key={index}
                                                        className="iconfont"
                                                        style={{
                                                            color: index < item.score ?
                                                                "rgba(214, 214, 8, 0.475)" : "rgb(241, 241, 241)"
                                                        }}
                                                    >&#xe709;</span>
                                                })
                                            }
                                        </div>
                                        <div>{item.comment}</div>
                                    </div>
                                )
                            })
                    }
                </div>
                {
                    comments?.length === 0 ? <div className="comment-tips">暂无评论</div> : ""
                }
            </div>
        </div>
    );
}

export default Comment;