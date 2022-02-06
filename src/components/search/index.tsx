import React, { FC, KeyboardEvent, ReactElement, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Search: FC = (): ReactElement => {
    const [content, setContent] = useState<string>("");
    const navigate = useNavigate();
    const handleSubmit = (e: KeyboardEvent) => {
        if (e.key === "Enter") {
            navigate("/search", { state: { content } });
        }
    }

    return (
        <input className="iconfont"
            placeholder="&#xe67a; 搜索"
            onKeyUp={handleSubmit}
            value={content}
            onChange={(e) => setContent(e.target.value)}
        />
    );
}

export default Search;