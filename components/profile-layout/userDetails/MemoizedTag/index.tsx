import { Tag } from "antd";
import { memo } from "react";

type CustomTagProps = {
    tagKey: number;
    children: string;
    color: string;
    checked: boolean;
    onClose?: () => void;
};

const MemoizedTag: React.FC<CustomTagProps> = memo(({ tagKey, children, color, checked, onClose }) => {
    return (
        <Tag
            key={tagKey}
            closable
            onClose={onClose}
            style={{
                padding: "0.3rem",
                margin: "0.3rem",
                borderRadius: "0.75rem",
                fontWeight: "700",
            }}
            color={color}
        >
            #{children}
        </Tag>
    );
});

MemoizedTag.displayName = "Memoized";

export default MemoizedTag;
