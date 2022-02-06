import { FC, ReactElement, useMemo } from "react";
import { useNavigate } from "react-router";
import base from "../../utils/baseUrl";
import { IGood } from "../../utils/types";

interface IProps {
    dataSource: IGood,
    type: string,
    setConfirmvisible: Function,
    color: string,
    quantity: number
}

const Confirm: FC<IProps> = (props: IProps): ReactElement => {
    const colorName = useMemo(() => {
        const colors = props.dataSource.colors;
        return colors.filter(item => item.value === props.color)[0]?.name;
    }, [props.dataSource, props.color]);
    const navigate = useNavigate();

    const handleSubmit = () => {
        props.setConfirmvisible(false);
        if (props.type === "cart") {
            fetch(`${base}/carts`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": localStorage.getItem("token")!
                },
                body: JSON.stringify({
                    "goodId": props.dataSource.id,
                    "quantity": props.quantity,
                    "color": colorName
                })
            })
                .then(val => {
                    if (val.status === 401) {
                        localStorage.removeItem("token");
                        navigate('/login');
                    }
                    else alert("已添加至购物车");
                })
                .catch(res => alert("添加购物车失败，检查网络后重试"));
        } else if (props.type === "buy") {
            fetch(`${base}/pays`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": localStorage.getItem("token")!
                },
                body: JSON.stringify({
                    "goodId": props.dataSource.id,
                })
            }).then(val => {
                if (val.status === 401) {
                    localStorage.removeItem("token");
                    navigate('/login');
                }
                else {
                    alert("购买成功，可以在待评价留下你的评价~");
                }
            })
                .catch(res => alert("购买失败，检查网络后重试"))
        }
    }

    return (
        <div className="confirm">
            <span className="confirm-cancel" onClick={() => props.setConfirmvisible(false)}>×</span>
            <div className="confirm-main">
                <img src={base + props.dataSource.icon} alt={props.dataSource.name} />
                <div>
                    <div>￥{props.dataSource.price}</div>
                    <div>{props.dataSource.name}</div>
                </div>
            </div>
            <div className="confirm-colors">
                <span>颜色</span>
                <span>{colorName}</span>
            </div>
            <div className="quantity">
                <span>数量</span>
                <span>{props.quantity}</span>
            </div>
            <button onClick={handleSubmit} className="confirm-submit">
                {props.type === "buy" ? "立即购买" : "确定"}
            </button>
        </div>
    );
}

export default Confirm;