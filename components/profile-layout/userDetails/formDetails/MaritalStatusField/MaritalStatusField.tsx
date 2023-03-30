import React, { Dispatch, SetStateAction } from "react";
import { Select } from "antd";
import { RightOutlined } from "@ant-design/icons";

interface MaritalStatusFieldProps {
    value: boolean;
    onChange: Dispatch<SetStateAction<boolean>>;
}

const MaritalStatusField: React.FC<MaritalStatusFieldProps> = ({ value, onChange }) => {
    return (
        <Select
            style={{ width: 110, textAlign: "right" }}
            defaultValue={value}
            onChange={onChange}
            bordered={false}
            suffixIcon={<RightOutlined />}
            options={[
                { value: true, label: "Đã kết hôn" },
                { value: false, label: "Độc thân" },
            ]}
        />
    );
};

export default MaritalStatusField;
