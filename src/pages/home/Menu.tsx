import { FC, ReactElement, useState } from "react";
import { Link } from 'react-router-dom';
import base from "../../utils/baseUrl";
import { ISubtype, IType } from "../../utils/types";
import useFetch from "../../utils/useFetch";

interface IData extends IType {
    subTypes: ISubtype[]
}

const Menu: FC = (): ReactElement => {
    const [curMenu, setCurMenu] = useState<number>(1)
    const { data, error, loading } = useFetch<IData[]>(`${base}/types?embed=subTypes`);
    if (error) return <p>Error!</p>;
    if (loading) return <p>Loading...</p>;
    return (
        <>
            <nav className="midMenu">
                {
                    data?.map((item) => {
                        return (
                            <span key={item.id}
                                onClick={() => setCurMenu(item.id)}
                                className={curMenu === item.id ? "menu_active" : ""}
                            >
                                {item.typeName}
                            </span>
                        )
                    })
                }
            </nav>
            <nav className="subMenu">
                {
                    data?.filter((item) => item.id === curMenu)[0]?.subTypes.map((data) => {
                        return (
                            <Link to={{ pathname: "/search" }} key={data.id} state={{ id: data.id }}>
                                <img src={base + data.img} alt={data.typeName} />
                                <span>{data.typeName}</span>
                            </Link>
                        )
                    })
                }
            </nav>
        </>
    );
}

export default Menu;