import { FC, ReactElement, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Nav from "../../components/nav";
import base from "../../utils/baseUrl";
import useTitle from "../../utils/useTitle";
import "./index.css";

const User: FC = (): ReactElement => {
    const [username, setUsername] = useState<string>("");
    const navigate = useNavigate();

    useTitle("用户中心");
    
    useEffect(() => {
        let unMount = false;
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }
        fetch(`${base}/users`, { headers: { "Authorization": token } })
            .then(res => {
                if (res.status === 401) {
                    localStorage.removeItem("token");
                    navigate("/login");
                } else {
                    return res.json();
                }
            })
            .then(json => {
                if (!unMount) {
                    setUsername(json.username);
                }
            })
        return () => {
            unMount = true;
        }
    })

    return (
        <div className="user">
            <div>个人中心</div>
            <div>
                <span className="iconfont">&#xe841;</span>
                <span>{username}</span>
                <div>
                    <Link to="/cart">
                        <span className="iconfont">&#xe61d;</span>
                        <span>购物车</span>
                    </Link>
                    <Link to="/comment">
                        <span className="iconfont">&#xe603;</span>
                        <span>待评价</span>
                    </Link>

                </div>
            </div>
            <button onClick={() => {
                localStorage.removeItem("token");
                navigate("/login");
            }}>退出登录</button>
            <Nav curIndex={3} />
        </div>
    );
}
export default User;