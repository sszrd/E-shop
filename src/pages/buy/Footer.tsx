import { FC, ReactElement, useState } from "react";
import { useNavigate } from "react-router";
import { IGood } from "../../utils/types";
import Confirm from "./Confirm";

interface IProps {
    dataSource: IGood,
    color: string,
    quantity: number
}

const Footer: FC<IProps> = (props: IProps): ReactElement => {
    const [confirmvisible, setConfirmvisible] = useState<boolean>(false);
    const [type, setType] = useState<string>("");
    const navigate = useNavigate();

    const handleAddForCart = () => {
        setConfirmvisible(true);
        setType("cart");
    }

    const handleAddForBuy = () => {
        setConfirmvisible(true);
        setType("buy");
    }

    return (
        <>
            <div className="buy-footer">
                <div>
                    <span className="iconfont">&#xe603;</span>
                    <span>客服</span>
                </div>
                <div>
                    <span className="iconfont">&#xe61d;</span>
                    <span onClick={() => navigate("/cart")}>购物车</span>
                </div>
                <button onClick={handleAddForCart}>加入购物车</button>
                <button onClick={handleAddForBuy}>立即购买</button>
            </div>
            {
                confirmvisible ?
                    <Confirm
                        dataSource={props.dataSource}
                        type={type}
                        setConfirmvisible={setConfirmvisible}
                        color={props.color}
                        quantity={props.quantity}
                    /> : ""
            }
        </>
    );
}

export default Footer;