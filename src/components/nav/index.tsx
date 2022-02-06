import { FC, ReactElement } from "react";
import { Link } from "react-router-dom";
import "./index.css";
interface IProps {
    curIndex: number
}
const Nav: FC<IProps> = (props: IProps): ReactElement => {
    return (
        <footer className="footer-nav">
            <Link to="/" className={props.curIndex === 0 ? "active" : ""}>
                <i className="iconfont">&#xe759;</i>
                <p>首页</p>
            </Link>
            <Link to="/category" className={props.curIndex === 1 ? "active" : ""}>
                <i className="iconfont">&#xe622;</i>
                <p>分类</p>
            </Link>
            <Link to="/cart" className={props.curIndex === 2 ? "active" : ""}>
                <i className="iconfont">&#xe61d;</i>
                <p>购物车</p>
            </Link>
            <Link to="/user" className={props.curIndex === 3 ? "active" : ""}>
                <i className="iconfont">&#xe841;</i>
                <p>我的</p>
            </Link>
        </footer>
    );
}
export default Nav;